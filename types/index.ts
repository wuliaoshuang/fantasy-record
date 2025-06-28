// 基于Prisma schema的TypeScript接口定义

export interface User {
  id: string
  username: string
  email: string
  password: string
  settings?: Record<string, any>
  createdAt: Date
  
  // Relations (可选，用于包含关联数据时)
  records?: FantasyRecord[]
  tags?: Tag[]
  attachments?: Attachment[]
  categories?: Category[]
  moodAnalyses?: MoodAnalysis[]
}

export interface FantasyRecord {
  id: string
  title: string
  content: string
  snippet: string
  tags: string[] // JSON数组
  mood: string
  attachments: string[] // JSON数组，存储附件ID
  userId: string
  categoryId?: string
  createdAt: Date
  updatedAt: Date
  
  // Relations (可选)
  user?: User
  category?: Category
  attachmentFiles?: Attachment[]
}

export interface Tag {
  id: string
  name: string
  color?: string
  userId: string
  createdAt: Date
  
  // Relations (可选)
  user?: User
}

export interface Attachment {
  id: string
  url: string
  fileName: string
  fileType: string
  fileSize?: number
  userId: string
  recordId?: string
  createdAt: Date
  
  // Relations (可选)
  user?: User
  record?: FantasyRecord
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  
  // Relations (可选)
  user?: User
  records?: FantasyRecord[]
}

export interface MoodAnalysis {
  id: string
  userId: string
  analysisText: string
  emotionScore: number // 1-10
  creativityScore: number // 0-100
  recordCount: number
  analysisDate: Date
  createdAt: Date
  updatedAt: Date
  
  // Relations (可选)
  user?: User
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// 创建记录的请求类型
export interface CreateRecordRequest {
  title: string
  content: string
  tags: string[]
  mood: string
  attachments?: string[]
  categoryId?: string
}

// 更新记录的请求类型
export interface UpdateRecordRequest extends Partial<CreateRecordRequest> {
  id: string
}

// 用户注册请求类型
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// 用户登录请求类型
export interface LoginRequest {
  email: string
  password: string
}

// 认证响应类型
export interface AuthResponse {
  success: boolean
  token?: string
  user?: Omit<User, 'password'>
  message?: string
}

// 文件上传响应类型
export interface FileUploadResponse {
  success: boolean
  attachment?: Attachment
  message?: string
}

// 心情选项类型
export interface MoodOption {
  value: string
  emoji: string
  label?: string
  color?: string
}

// 搜索过滤器类型
export interface RecordFilters {
  search?: string
  tags?: string[]
  mood?: string
  categoryId?: string
  dateFrom?: Date
  dateTo?: Date
}

// 统计数据类型
export interface RecordStats {
  totalRecords: number
  totalWords: number
  moodDistribution: Record<string, number>
  tagDistribution: Record<string, number>
  monthlyStats: {
    month: string
    count: number
    words: number
  }[]
}