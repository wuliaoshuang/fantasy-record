// 应用常量定义

// 心情选项
export const MOOD_OPTIONS = [
  { emoji: "😃", value: "兴奋", color: "bg-yellow-500" },
  { emoji: "🤔", value: "沉思", color: "bg-blue-500" },
  { emoji: "😢", value: "悲伤", color: "bg-gray-500" },
  { emoji: "🚀", value: "充满希望", color: "bg-green-500" },
  { emoji: "❓", value: "困惑", color: "bg-purple-500" },
] as const

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const

// 文件上传配置
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const

// 日期格式化选项
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

export const SHORT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

// 排序选项
export const SORT_OPTIONS = [
  { value: 'date', label: '按日期排序' },
  { value: 'title', label: '按标题排序' },
  { value: 'mood', label: '按心情排序' },
] as const

// 记录状态
export const RECORD_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  VALIDATION_ERROR: '输入数据格式错误',
  FILE_TOO_LARGE: '文件大小超过限制',
  INVALID_FILE_TYPE: '不支持的文件类型',
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  RECORD_CREATED: '记录创建成功',
  RECORD_UPDATED: '记录更新成功',
  RECORD_DELETED: '记录删除成功',
  FILE_UPLOADED: '文件上传成功',
  SETTINGS_SAVED: '设置保存成功',
} as const