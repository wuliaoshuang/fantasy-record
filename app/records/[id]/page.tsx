"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Heart, Paperclip, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useRecord, useRecordActions } from "@/hooks/use-records"
import { formatDate, getMoodEmoji, downloadFile } from "@/lib/data-utils"
import { MOOD_OPTIONS } from "@/lib/constants"

export default function RecordDetail() {
  const params = useParams()
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // 使用自定义hooks
  const { record, loading, error } = useRecord(params.id as string)
  const { deleteRecord, loading: deleting } = useRecordActions()

  const handleDelete = async () => {
    if (!record) return
    
    try {
      await deleteRecord(record.id)
      setDeleteDialogOpen(false)
      router.push("/records")
    } catch (error) {
      // 错误已在hook中处理
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">记录不存在</p>
          <Link href="/records">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回记录列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回上一页
            </Button>
            <div className="flex gap-2 ml-auto">
              <Link href={`/records/${record.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑记录
                </Button>
              </Link>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除记录
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>确认删除记录</DialogTitle>
                    <DialogDescription>
                      您确定要删除记录「{record?.title}」吗？此操作无法撤销，记录及其所有附件都将被永久删除。
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setDeleteDialogOpen(false)}
                      disabled={deleting}
                    >
                      取消
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "删除中..." : "确认删除"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="glassmorphism border-0">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-semibold mb-2">
                  {record.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>创建于 {formatDate(record.createdAt)}</span>
                  </div>
                  {record.updatedAt !== record.createdAt && (
                    <div className="flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      <span>更新于 {formatDate(record.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-4xl">{getMoodEmoji(record.mood)}</div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Tags */}
            {record.tags && record.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">标签</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {record.attachmentFiles && record.attachmentFiles.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">附件</span>
                  </div>
                  <div className="space-y-2">
                    {record.attachmentFiles?.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                            <Paperclip className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{attachment.fileName}</p>
                            <p className="text-xs text-muted-foreground">附件 ID: {attachment.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(attachment.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            查看
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(attachment.url, attachment.fileName)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            下载
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">内容</span>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  disallowedElements={['script', 'iframe', 'object', 'embed', 'form', 'input', 'button']}
                  unwrapDisallowed={true}
                  skipHtml={true}
                  components={{
                    h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-medium mb-2 text-foreground">{children}</h3>,
                    p: ({children}) => <p className="mb-3 leading-relaxed text-foreground">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1 text-foreground">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-foreground">{children}</ol>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-3 text-muted-foreground">{children}</blockquote>,
                    code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-sm text-foreground">{children}</code>,
                    pre: ({children}) => <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-3 text-foreground">{children}</pre>,
                    strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                    em: ({children}) => <em className="italic text-foreground">{children}</em>,
                    a: ({href, children}) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                    img: ({src, alt}) => <img src={src} alt={alt} className="max-w-full h-auto rounded-md mb-3" />
                  }}
                >
                  {record.content || record.snippet}
                </ReactMarkdown>
              </div>
            </div>

            {/* Category */}
            {record.category && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-muted-foreground">分类</span>
                  </div>
                  <Badge variant="outline">{record.category?.name || '未分类'}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}