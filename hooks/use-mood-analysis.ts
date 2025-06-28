// 情绪分析相关hooks
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { MoodAnalysis, ApiResponse, PaginatedResponse, MoodOption } from '@/types'

// 模拟API调用 - 实际项目中应该替换为真实的API
const moodAnalysisApi = {
  getMoodAnalyses: async (params?: {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<MoodAnalysis>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: 0,
            totalPages: 1
          }
        })
      }, 500)
    })
  },
  
  createMoodAnalysis: async (data: {
    recordIds: string[]
    analysisDate?: Date
  }): Promise<ApiResponse<MoodAnalysis>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAnalysis: MoodAnalysis = {
          id: Date.now().toString(),
          userId: 'current-user-id',
          analysisText: '基于您最近的记录，您的情绪状态整体较为积极，创意表达丰富。建议继续保持这种状态。',
          emotionScore: 7.5,
          creativityScore: 85,
          recordCount: data.recordIds.length,
          analysisDate: data.analysisDate || new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        resolve({
          success: true,
          data: newAnalysis
        })
      }, 2000) // 模拟AI分析需要时间
    })
  },
  
  getMoodAnalysis: async (id: string): Promise<ApiResponse<MoodAnalysis>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const analysis: MoodAnalysis = {
          id,
          userId: 'current-user-id',
          analysisText: '详细的情绪分析报告...',
          emotionScore: 7.5,
          creativityScore: 85,
          recordCount: 10,
          analysisDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        resolve({
          success: true,
          data: analysis
        })
      }, 500)
    })
  },
  
  deleteMoodAnalysis: async (id: string): Promise<ApiResponse<void>> => {
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

export const useMoodAnalyses = (params?: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}) => {
  const [analyses, setAnalyses] = useState<MoodAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await moodAnalysisApi.getMoodAnalyses(params)
      
      if (response.success && response.data) {
        setAnalyses(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        throw new Error(response.message || '获取情绪分析失败')
      }
    } catch (err) {
      const errorMessage = '获取情绪分析失败'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('获取情绪分析错误:', err)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  return {
    analyses,
    loading,
    error,
    pagination,
    refetch: fetchAnalyses,
  }
}

export const useMoodAnalysisActions = () => {
  const [loading, setLoading] = useState(false)

  const createAnalysis = useCallback(async (data: {
    recordIds: string[]
    analysisDate?: Date
  }) => {
    try {
      setLoading(true)
      const response = await moodAnalysisApi.createMoodAnalysis(data)
      
      if (response.success && response.data) {
        toast.success('情绪分析创建成功')
        return response.data
      } else {
        throw new Error(response.message || '创建情绪分析失败')
      }
    } catch (error) {
      toast.error('创建情绪分析失败')
      console.error('创建情绪分析错误:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAnalysis = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const response = await moodAnalysisApi.deleteMoodAnalysis(id)
      
      if (response.success) {
        toast.success('情绪分析删除成功')
        return true
      } else {
        throw new Error(response.message || '删除情绪分析失败')
      }
    } catch (error) {
      toast.error('删除情绪分析失败')
      console.error('删除情绪分析错误:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    createAnalysis,
    deleteAnalysis,
  }
}

// 获取单个情绪分析的hook
export const useMoodAnalysis = (id: string | null) => {
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = useCallback(async (analysisId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await moodAnalysisApi.getMoodAnalysis(analysisId)
      
      if (response.success && response.data) {
        setAnalysis(response.data)
      } else {
        throw new Error(response.message || '获取情绪分析详情失败')
      }
    } catch (err) {
      const errorMessage = '获取情绪分析详情失败'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('获取情绪分析详情错误:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchAnalysis(id)
    } else {
      setAnalysis(null)
      setError(null)
    }
  }, [id, fetchAnalysis])

  return {
    analysis,
    loading,
    error,
    refetch: id ? () => fetchAnalysis(id) : undefined,
  }
}

// 情绪统计hook
export const useMoodStats = () => {
  const [stats, setStats] = useState({
    averageEmotionScore: 0,
    averageCreativityScore: 0,
    totalAnalyses: 0,
    recentTrend: 'stable' as 'up' | 'down' | 'stable',
    monthlyScores: [] as { month: string; emotion: number; creativity: number }[]
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      
      // 模拟统计数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setStats({
        averageEmotionScore: 7.2,
        averageCreativityScore: 78,
        totalAnalyses: 15,
        recentTrend: 'up',
        monthlyScores: [
          { month: '1月', emotion: 6.5, creativity: 70 },
          { month: '2月', emotion: 7.0, creativity: 75 },
          { month: '3月', emotion: 7.5, creativity: 80 },
          { month: '4月', emotion: 7.2, creativity: 78 },
        ]
      })
    } catch (error) {
      console.error('获取情绪统计错误:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    refetch: fetchStats,
  }
}

// 情绪选项hook
export const useMoodOptions = (): MoodOption[] => {
  return [
    { value: 'excited', label: '兴奋', emoji: '🤩', color: '#ff6b6b' },
    { value: 'happy', label: '开心', emoji: '😊', color: '#4ecdc4' },
    { value: 'calm', label: '平静', emoji: '😌', color: '#45b7d1' },
    { value: 'thoughtful', label: '深思', emoji: '🤔', color: '#96ceb4' },
    { value: 'melancholy', label: '忧郁', emoji: '😔', color: '#feca57' },
    { value: 'anxious', label: '焦虑', emoji: '😰', color: '#ff9ff3' },
    { value: 'angry', label: '愤怒', emoji: '😠', color: '#ff6b6b' },
    { value: 'confused', label: '困惑', emoji: '😕', color: '#a8a8a8' },
    { value: 'inspired', label: '灵感', emoji: '💡', color: '#ffd93d' },
    { value: 'peaceful', label: '宁静', emoji: '🕊️', color: '#6c5ce7' },
  ]
}