interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export function Loading({ 
  text = "加载中...", 
  size = 'md', 
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  const containerClasses = fullScreen 
    ? "min-h-screen bg-background flex items-center justify-center"
    : "flex items-center justify-center p-8"

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

// 全屏加载组件
export function FullScreenLoading({ text }: { text?: string }) {
  return <Loading text={text} fullScreen />
}

// 小型加载组件
export function SmallLoading({ text }: { text?: string }) {
  return <Loading text={text} size="sm" />
}

// 骨架屏组件
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  )
}

// 记录列表骨架屏
export function RecordListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glassmorphism border-0 rounded-lg p-6 space-y-4">
          {/* 标题和心情图标区域 */}
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          
          {/* 内容区域 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          {/* 标签和日期区域 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// 主页面骨架屏
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* 标题 */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主内容区域 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 欢迎横幅 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* 快速统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-4 border">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              ))}
            </div>

            {/* 搜索和过滤器 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* 记录列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-12 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 每日灵感 */}
            <div className="bg-card rounded-lg p-4 border">
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* 情绪趋势 */}
            <div className="bg-card rounded-lg p-4 border">
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* 热门标签 */}
            <div className="bg-card rounded-lg p-4 border">
              <Skeleton className="h-5 w-20 mb-3" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>

            {/* 统计概览 */}
            <div className="bg-card rounded-lg p-4 border">
              <Skeleton className="h-5 w-20 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 记录详情页面骨架屏
export function RecordDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-9 w-24" />
            <div className="flex gap-2 ml-auto">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card rounded-lg border p-6">
          {/* Title and Mood */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-12 w-12 rounded" />
          </div>

          <div className="space-y-6">
            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            {/* Attachments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            {/* Category */}
            <div>
              <Skeleton className="h-4 w-8 mb-3" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 记录编辑页面骨架屏
export function RecordEditSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-9 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-8">
          {/* Title */}
          <Skeleton className="h-10 w-full" />

          {/* Mood Selection */}
          <div>
            <Skeleton className="h-5 w-16 mb-3" />
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Skeleton className="h-5 w-8 mb-3" />
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Skeleton className="h-5 w-12 mb-3" />
            <Skeleton className="h-32 w-full rounded-lg border-dashed" />
          </div>

          {/* Content Tabs */}
          <div>
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// 设置页面骨架屏
export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="space-y-6">
          {/* Settings Cards */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border p-6">
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-20" />
              </div>

              {/* Card Content */}
              <div className="space-y-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}

                {/* Slider */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-3 w-8" />
                </div>

                {/* Select */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}