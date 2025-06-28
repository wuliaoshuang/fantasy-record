// 认证相关hooks
import { useState, useEffect, useCallback } from 'react'
import { authApi, handleApiError } from '@/lib/api'
import { toast } from 'sonner'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types'

export const useAuth = () => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 检查用户认证状态
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authApi.getCurrentUser()
      
      if (response.success && response.data) {
        setUser(response.data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      // 不显示错误提示，因为可能是未登录状态
    } finally {
      setLoading(false)
    }
  }, [])

  // 用户登录
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authApi.login(credentials)
      
      if (response.success && response.token && response.user) {
        // 保存token到cookie
        document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7天过期
        
        setUser(response.user)
        setIsAuthenticated(true)
        toast.success('登录成功')
        return true
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      handleApiError(error, '登录失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // 用户注册
  const register = useCallback(async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authApi.register(userData)
      
      if (response.success && response.token && response.user) {
        // 保存token到cookie
        document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7天过期
        
        setUser(response.user)
        setIsAuthenticated(true)
        toast.success('注册成功')
        return true
      } else {
        throw new Error(response.message || '注册失败')
      }
    } catch (error) {
      handleApiError(error, '注册失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // 用户登出
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // 即使API调用失败，也要清除本地状态
      console.error('登出API调用失败:', error)
    } finally {
      // 清除token
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      
      setUser(null)
      setIsAuthenticated(false)
      toast.success('已登出')
    }
  }, [])

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth()
  }, [])

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }
}

// 获取当前用户信息的hook
export const useCurrentUser = () => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.getCurrentUser()
      
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        throw new Error(response.message || '获取用户信息失败')
      }
    } catch (err) {
      const errorMessage = '获取用户信息失败'
      setError(errorMessage)
      handleApiError(err, errorMessage)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  }
}