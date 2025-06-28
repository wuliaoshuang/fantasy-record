"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Record {
  id: string
  title: string
  content: string
  snippet: string
  tags: string[]
  mood: string
  category: string | null
  createdAt: string
  updatedAt: string
}

const moodOptions = [
  { emoji: "😃", value: "兴奋", color: "bg-yellow-500" },
  { emoji: "🤔", value: "沉思", color: "bg-blue-500" },
  { emoji: "😢", value: "悲伤", color: "bg-gray-500" },
  { emoji: "🚀", value: "充满希望", color: "bg-green-500" },
  { emoji: "❓", value: "困惑", color: "bg-purple-500" },
]

export default function RecordDetail() {
  const params = useParams()
  const router = useRouter()
  const [record, setRecord] = useState<Record | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];

        const response = await fetch(`http://localhost:3000/records/${params.id}`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log(data);
          
          // 检查数据结构是否完整
          if (data.data) {
            // 处理 tags 字段
            const processedRecord = {
              ...data.data,
              tags: data.data.tags 
                ? (typeof data.data.tags === 'string' 
                    ? JSON.parse(data.data.tags) 
                    : data.data.tags)
                : []
            }
            setRecord(processedRecord)
          } else {
            toast.error("记录数据格式错误")
          }
        } else {
          toast.error("记录不存在或已被删除")
        }
      } catch (error) {
        console.error('获取记录失败:', error)
        toast.error("获取记录失败")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchRecord()
    }
  }, [params.id, router])

  const handleDelete = async () => {
    if (!confirm("确定要删除这条记录吗？此操作无法撤销。")) {
      return
    }

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`http://localhost:3000/records/${params.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        },
      })

      if (response.ok) {
        toast.success("记录已删除")
        router.push("/records")
      } else {
        toast.error("删除失败")
      }
    } catch (error) {
      console.error('删除记录失败:', error)
      toast.error("删除失败")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            <Link href="/records">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回列表
              </Button>
            </Link>
            <div className="flex gap-2 ml-auto">
              <Link href={`/records/${record.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
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
              <div className="text-4xl">{moodOptions.find(option => option.value === record.mood)?.emoji}</div>
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
                  <Badge variant="outline">{record.category}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}