// API工具函数
import { toast } from "sonner"
import type { 
  FantasyRecord, 
  CreateRecordRequest, 
  UpdateRecordRequest, 
  ApiResponse, 
  PaginatedResponse,
  Attachment,
  FileUploadResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@/types'

// 获取认证token
export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] || null
}

// API基础配置
const API_BASE_URL = 'http://localhost:3000'

// 通用API请求函数
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken()
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API请求失败: ${response.status} ${errorText}`)
  }
  
  return response.json()
}

// 记录相关API
export const recordsApi = {
  // 获取记录列表
  getRecords: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<FantasyRecord>> => {
    return apiRequest(`/records?page=${page}&limit=${limit}`)
  },
  
  // 获取单个记录
  getRecord: async (id: string): Promise<ApiResponse<FantasyRecord>> => {
    return apiRequest(`/records/${id}`)
  },
  
  // 创建记录
  createRecord: async (data: CreateRecordRequest): Promise<ApiResponse<FantasyRecord>> => {
    return apiRequest('/records', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  // 更新记录
  updateRecord: async (id: string, data: Partial<CreateRecordRequest>): Promise<ApiResponse<FantasyRecord>> => {
    return apiRequest(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  // 删除记录
  deleteRecord: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/records/${id}`, {
      method: 'DELETE',
    })
  },
}

// 附件相关API
export const attachmentsApi = {
  // 上传单个文件
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/attachments/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`上传文件失败: ${response.status}`)
    }
    
    return response.json()
  },
  
  // 批量上传附件
  uploadFiles: async (files: File[]): Promise<FileUploadResponse[]> => {
    const uploadPromises = files.map(file => attachmentsApi.uploadFile(file))
    return Promise.all(uploadPromises)
  },
}

// 认证相关API
export const authApi = {
  // 用户登录
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  // 用户注册
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  // 获取当前用户信息
  getCurrentUser: async (): Promise<ApiResponse<Omit<import('@/types').User, 'password'>>> => {
    return apiRequest('/auth/me')
  },
  
  // 用户登出
  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },
}

// 错误处理工具
export const handleApiError = (error: unknown, defaultMessage: string = '操作失败') => {
  console.error('API错误:', error)
  
  if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error(defaultMessage)
  }
}