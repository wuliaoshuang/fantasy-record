// 文件上传相关hooks
import { useState, useCallback } from 'react'
import { attachmentsApi, handleApiError } from '@/lib/api'
import { validateFile } from '@/lib/data-utils'
import { FILE_UPLOAD } from '@/lib/constants'
import { toast } from 'sonner'
import type { Attachment, FileUploadResponse } from '@/types'

// 兼容性类型别名
export type UploadedFile = Pick<Attachment, 'id' | 'fileName' | 'url'> & {
  filename: string // 保持向后兼容
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const validateFiles = useCallback((files: File[]): { valid: File[], invalid: { file: File, error: string }[] } => {
    const valid: File[] = []
    const invalid: { file: File, error: string }[] = []

    files.forEach(file => {
      const error = validateFile(file, FILE_UPLOAD.ALLOWED_TYPES, FILE_UPLOAD.MAX_FILE_SIZE)
      if (error) {
        invalid.push({ file, error })
      } else {
        valid.push(file)
      }
    })

    return { valid, invalid }
  }, [])

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile> => {
    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
      
      const result = await attachmentsApi.uploadFile(file)
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
      
      if (!result.success || !result.attachment) {
        throw new Error(result.message || '文件上传失败')
      }
      
      return {
        id: result.attachment.id,
        fileName: result.attachment.fileName,
        filename: result.attachment.fileName, // 保持向后兼容
        url: result.attachment.url
      }
    } catch (err) {
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[file.name]
        return newProgress
      })
      throw err
    }
  }, [])

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    if (files.length === 0) return []

    try {
      setUploading(true)
      
      // 验证文件
      const { valid, invalid } = validateFiles(files)
      
      // 显示无效文件的错误信息
      invalid.forEach(({ file, error }) => {
        toast.error(`${file.name}: ${error}`)
      })
      
      if (valid.length === 0) {
        return []
      }
      
      // 上传有效文件
      const uploadPromises = valid.map(file => uploadFile(file))
      const results = await Promise.allSettled(uploadPromises)
      
      const successful: UploadedFile[] = []
      const failed: string[] = []
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value)
        } else {
          failed.push(valid[index].name)
          handleApiError(result.reason, `上传文件 ${valid[index].name} 失败`)
        }
      })
      
      if (successful.length > 0) {
        toast.success(`成功上传 ${successful.length} 个文件`)
      }
      
      return successful
    } catch (err) {
      handleApiError(err, '文件上传失败')
      return []
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }, [validateFiles, uploadFile])

  const removeUploadedFile = useCallback((filename: string) => {
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[filename]
      return newProgress
    })
  }, [])

  return {
    uploading,
    uploadProgress,
    validateFiles,
    uploadFile,
    uploadFiles,
    removeUploadedFile,
  }
}

// 拖拽上传hook
export const useDragAndDrop = (onFilesDropped: (files: File[]) => void) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) {
        setIsDragging(false)
      }
      return newCounter
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      onFilesDropped(files)
    }
  }, [onFilesDropped])

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  }
}