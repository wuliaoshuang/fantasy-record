// 记录管理相关hooks
import { useState, useEffect, useCallback } from 'react'
import { recordsApi, handleApiError } from '@/lib/api'
import { processRecord, processRecordsResponse, type Record, type RecordsResponse } from '@/lib/data-utils'
import { PAGINATION } from '@/lib/constants'
import { toast } from 'sonner'
import type { FantasyRecord, CreateRecordRequest, UpdateRecordRequest, ApiResponse, PaginatedResponse } from '@/types'

// 获取记录列表的hook
export const useRecords = (initialPage: number = 1) => {
  const [records, setRecords] = useState<FantasyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: initialPage,
    totalPages: 1,
  })

  const fetchRecords = useCallback(async (page: number = 1, limit: number = PAGINATION.DEFAULT_PAGE_SIZE) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await recordsApi.getRecords(page, limit)
      const processedData = processRecordsResponse(response)
      
      setRecords(processedData.records)
      setPagination(processedData.pagination)
    } catch (err) {
      const errorMessage = '获取记录列表失败'
      setError(errorMessage)
      handleApiError(err, errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshRecords = useCallback(() => {
    fetchRecords(pagination.currentPage)
  }, [fetchRecords, pagination.currentPage])

  useEffect(() => {
    fetchRecords(initialPage)
  }, [fetchRecords, initialPage])

  return {
    records,
    loading,
    error,
    pagination,
    fetchRecords,
    refreshRecords,
  }
}

// 获取单个记录的hook
export const useRecord = (id: string | null) => {
  const [record, setRecord] = useState<FantasyRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecord = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await recordsApi.getRecord(id)
      
      if (response.data) {
        const processedRecord = processRecord(response.data)
        setRecord(processedRecord)
      } else {
        throw new Error('记录数据格式错误')
      }
    } catch (err) {
      const errorMessage = '获取记录失败'
      setError(errorMessage)
      handleApiError(err, errorMessage)
      setRecord(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  const refreshRecord = useCallback(() => {
    fetchRecord()
  }, [fetchRecord])

  useEffect(() => {
    fetchRecord()
  }, [fetchRecord])

  return {
    record,
    loading,
    error,
    refreshRecord,
  }
}

// 记录操作的hook
export const useRecordActions = () => {
  const [loading, setLoading] = useState(false)

  const createRecord = useCallback(async (data: CreateRecordRequest) => {
    try {
      setLoading(true)
      const response = await recordsApi.createRecord(data)
      toast.success('记录创建成功')
      return response
    } catch (err) {
      handleApiError(err, '创建记录失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRecord = useCallback(async (id: string, data: Partial<CreateRecordRequest>) => {
    try {
      setLoading(true)
      const response = await recordsApi.updateRecord(id, data)
      toast.success('记录更新成功')
      return response
    } catch (err) {
      handleApiError(err, '更新记录失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRecord = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await recordsApi.deleteRecord(id)
      toast.success('记录删除成功')
    } catch (err) {
      handleApiError(err, '删除记录失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}

// 记录搜索和过滤的hook
export const useRecordFilters = (records: FantasyRecord[]) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [filterTag, setFilterTag] = useState('all')

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchQuery || 
      record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = filterTag === 'all' || record.tags?.includes(filterTag)
    
    return matchesSearch && matchesTag
  })

  const sortedRecords = [...filteredRecords].sort((a, b) => {
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

  const allTags = Array.from(new Set(records.flatMap(record => record.tags || []))).sort()

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterTag,
    setFilterTag,
    filteredRecords: sortedRecords,
    allTags,
  }
}