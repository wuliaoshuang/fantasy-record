// 分类管理相关hooks
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Category, ApiResponse, PaginatedResponse } from '@/types'

// 模拟API调用 - 实际项目中应该替换为真实的API
const categoriesApi = {
  getCategories: async (): Promise<PaginatedResponse<Category>> => {
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
  
  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<ApiResponse<Category>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCategory: Category = {
          id: Date.now().toString(),
          ...data,
          userId: 'current-user-id',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        resolve({
          success: true,
          data: newCategory
        })
      }, 500)
    })
  },
  
  updateCategory: async (id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>): Promise<ApiResponse<Category>> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id,
            name: data.name || '默认分类',
            description: data.description || undefined,
            color: data.color || undefined,
            icon: data.icon || undefined,
            userId: 'current-user-id',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }, 500)
    })
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
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

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await categoriesApi.getCategories()
      
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        throw new Error(response.message || '获取分类失败')
      }
    } catch (err) {
      const errorMessage = '获取分类失败'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('获取分类错误:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}

export const useCategoryActions = () => {
  const [loading, setLoading] = useState(false)

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      setLoading(true)
      const response = await categoriesApi.createCategory(data)
      
      if (response.success && response.data) {
        toast.success('分类创建成功')
        return response.data
      } else {
        throw new Error(response.message || '创建分类失败')
      }
    } catch (error) {
      toast.error('创建分类失败')
      console.error('创建分类错误:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCategory = useCallback(async (id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) => {
    try {
      setLoading(true)
      const response = await categoriesApi.updateCategory(id, data)
      
      if (response.success && response.data) {
        toast.success('分类更新成功')
        return response.data
      } else {
        throw new Error(response.message || '更新分类失败')
      }
    } catch (error) {
      toast.error('更新分类失败')
      console.error('更新分类错误:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const response = await categoriesApi.deleteCategory(id)
      
      if (response.success) {
        toast.success('分类删除成功')
        return true
      } else {
        throw new Error(response.message || '删除分类失败')
      }
    } catch (error) {
      toast.error('删除分类失败')
      console.error('删除分类错误:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

// 获取单个分类的hook
export const useCategory = (id: string | null) => {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // 这里应该调用真实的API获取单个分类
      // 暂时使用模拟数据
      const mockCategory: Category = {
        id: categoryId,
        name: '示例分类',
        description: '这是一个示例分类',
        color: '#3b82f6',
        icon: 'folder',
        userId: 'current-user-id',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setCategory(mockCategory)
    } catch (err) {
      const errorMessage = '获取分类详情失败'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('获取分类详情错误:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchCategory(id)
    } else {
      setCategory(null)
      setError(null)
    }
  }, [id, fetchCategory])

  return {
    category,
    loading,
    error,
    refetch: id ? () => fetchCategory(id) : undefined,
  }
}