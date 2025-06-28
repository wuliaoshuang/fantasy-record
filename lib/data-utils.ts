// 数据处理工具函数
import { DATE_FORMAT_OPTIONS, SHORT_DATE_FORMAT_OPTIONS, MOOD_OPTIONS } from './constants'
import type { FantasyRecord, PaginatedResponse } from '@/types'

// 兼容性类型别名
export type Record = FantasyRecord
export interface PaginationInfo {
  totalRecords: number
  currentPage: number
  totalPages: number
}

export interface RecordsResponse {
  records: FantasyRecord[]
  pagination: PaginationInfo
}

// 处理标签数据
export const processTags = (tags: any): string[] => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags)
    } catch {
      return []
    }
  }
  return []
}

// 处理单个记录数据
export const processRecord = (rawRecord: any): FantasyRecord => {
  return {
    ...rawRecord,
    tags: processTags(rawRecord.tags),
    content: rawRecord.content || rawRecord.snippet || '',
    snippet: rawRecord.snippet || rawRecord.content || '',
    category: rawRecord.category || null,
    attachments: rawRecord.attachments || [],
  }
}

// 处理记录列表数据
export const processRecords = (rawRecords: any[]): FantasyRecord[] => {
  return rawRecords.map(processRecord)
}

// 处理API响应数据
export const processRecordsResponse = (data: any): RecordsResponse => {
  const records = data?.data?.records || data?.records || []
  const pagination = data?.data?.pagination || data?.pagination || {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  }

  return {
    records: processRecords(records),
    pagination,
  }
}

// 格式化日期
export const formatDate = (date: string | Date, short: boolean = false): string => {
  const options = short ? SHORT_DATE_FORMAT_OPTIONS : DATE_FORMAT_OPTIONS
  return new Date(date).toLocaleString('zh-CN', options)
}

// 获取心情emoji
export const getMoodEmoji = (mood: string): string => {
  return MOOD_OPTIONS.find(option => option.value === mood)?.emoji || '😐'
}

// 获取心情颜色
export const getMoodColor = (mood: string): string => {
  return MOOD_OPTIONS.find(option => option.value === mood)?.color || 'bg-gray-500'
}

// 获取所有唯一标签
export const getAllTags = (records: FantasyRecord[]): string[] => {
  const allTags = records.flatMap(record => record.tags || [])
  return Array.from(new Set(allTags)).sort()
}

// 过滤记录
export const filterRecords = (
  records: FantasyRecord[],
  searchQuery: string = '',
  filterTag: string = 'all'
): FantasyRecord[] => {
  return records.filter(record => {
    const matchesSearch = !searchQuery || 
      record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = filterTag === 'all' || record.tags?.includes(filterTag)
    
    return matchesSearch && matchesTag
  })
}

// 排序记录
export const sortRecords = (records: FantasyRecord[], sortBy: string): FantasyRecord[] => {
  return [...records].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'mood':
        return a.mood.localeCompare(b.mood)
      default:
        return 0
    }
  })
}

// 验证记录数据
export const validateRecord = (record: Partial<FantasyRecord>): string[] => {
  const errors: string[] = []
  
  if (!record.title?.trim()) {
    errors.push('标题不能为空')
  }
  
  if (!record.content?.trim()) {
    errors.push('内容不能为空')
  }
  
  if (!record.mood) {
    errors.push('请选择心情')
  }
  
  return errors
}

// 生成记录摘要
export const generateSnippet = (content: string, maxLength: number = 150): string => {
  if (!content) return ''
  
  // 移除markdown语法
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/\n+/g, ' ') // 换行
    .trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  return plainText.substring(0, maxLength).trim() + '...'
}

// 下载文件
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 验证文件类型和大小
export const validateFile = (file: File, allowedTypes: readonly string[], maxSize: number): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `不支持的文件类型: ${file.type}`
  }
  
  if (file.size > maxSize) {
    return `文件大小超过限制: ${(file.size / 1024 / 1024).toFixed(2)}MB`
  }
  
  return null
}