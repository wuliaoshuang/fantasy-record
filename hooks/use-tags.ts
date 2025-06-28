// 标签管理相关hooks
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Tag, ApiResponse, PaginatedResponse } from '@/types'

// 模拟API调用 - 实际项目中应该替换为真实的API
const tagsApi = {
  getTags: async (): Promise<PaginatedResponse<Tag>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 1
          }
        })
      }, 500)
    })
  },
  
  createTag: async (data: Omit<Tag, 'id' | 'createdAt' | 'userId'>): Promise<ApiResponse<Tag>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTag: Tag = {
          id: Date.now().toString(),
          ...data,
          userId: 'current-user-id',
          createdAt: new Date()
        }
        resolve({
          success: true,
          data: newTag
        })
      }, 500)
    })
  },
  
  updateTag: async (id: string, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'userId'>>): Promise<ApiResponse<Tag>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id,
            name: data.name || '默认标签',
            color: data.color || undefined,
            userId: 'current-user-id',
            createdAt: new Date()
          }
        })
      }, 500)
    })
  },
  
  deleteTag: async (id: string): Promise<ApiResponse<void>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true
        })
      }, 500)
    })
  }
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await tagsApi.getTags()
      
      if (response.success && response.data) {
        setTags(response.data)
      } else {
        throw new Error(response.message || '获取标签失败')
      }
    } catch (err) {
      const errorMessage = '获取标签失败'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('获取标签错误:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTags()
  }, [])

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  }
}

export const useTagActions = () => {
  const [loading, setLoading] = useState(false)

  const createTag = useCallback(async (data: Omit<Tag, 'id' | 'createdAt' | 'userId'>) => {
    try {
      setLoading(true)
      const response = await tagsApi.createTag(data)
      
      if (response.success && response.data) {
        toast.success('标签创建成功')
        return response.data
      } else {
        throw new Error(response.message || '创建标签失败')
      }
    } catch (error) {
      toast.error('创建标签失败')
      console.error('创建标签错误:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTag = useCallback(async (id: string, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'userId'>>) => {
    try {
      setLoading(true)
      const response = await tagsApi.updateTag(id, data)
      
      if (response.success && response.data) {
        toast.success('标签更新成功')
        return response.data
      } else {
        throw new Error(response.message || '更新标签失败')
      }
    } catch (error) {
      toast.error('更新标签失败')
      console.error('更新标签错误:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTag = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const response = await tagsApi.deleteTag(id)
      
      if (response.success) {
        toast.success('标签删除成功')
        return true
      } else {
        throw new Error(response.message || '删除标签失败')
      }
    } catch (error) {
      toast.error('删除标签失败')
      console.error('删除标签错误:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    createTag,
    updateTag,
    deleteTag,
  }
}

// 获取单个标签的hook
export const useTag = (id: string | null) => {
  const [tag, setTag] = useState<Tag | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTag = useCallback(async (tagId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // 这里应该调用真实的API获取单个标签
      // 暂时使用模拟数据
      const mockTag: Tag = {
        id: tagId,
        name: '示例标签',
        color: '#ef4444',
        userId: 'current-user-id',
        createdAt: new Date()
      }
      
      setTag(mockTag)
    } catch (err) {
      const errorMessage = '获取标签详情失败'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('获取标签详情错误:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchTag(id)
    } else {
      setTag(null)
      setError(null)
    }
  }, [id, fetchTag])

  return {
    tag,
    loading,
    error,
    refetch: id ? () => fetchTag(id) : undefined,
  }
}

// 标签搜索和过滤hook
export const useTagSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const { tags } = useTags()

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTags(tags)
    } else {
      const filtered = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTags(filtered)
    }
  }, [tags, searchTerm])

  return {
    searchTerm,
    setSearchTerm,
    filteredTags,
    allTags: tags,
  }
}

// 标签统计hook
export const useTagStats = () => {
  const { tags } = useTags()
  
  const stats = {
    totalTags: tags.length,
    coloredTags: tags.filter(tag => tag.color).length,
    recentTags: tags
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  }

  return stats
}