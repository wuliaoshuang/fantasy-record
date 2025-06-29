"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Edit, Paperclip, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useRecord, useRecordActions } from "@/hooks/use-records"
import { useFileUpload } from "@/hooks/use-file-upload"
import { validateRecord, downloadFile } from "@/lib/data-utils"
import { MOOD_OPTIONS } from "@/lib/constants"
import type { FantasyRecord } from "@/types"
import { RecordEditSkeleton } from "@/components/ui/loading"

export default function EditRecord() {
  const params = useParams()
  const router = useRouter()
  const recordId = params.id as string
  
  // 使用自定义hooks
  const { record, loading, error } = useRecord(recordId)
  const { updateRecord, loading: saving } = useRecordActions()
  const { uploadFiles, uploading } = useFileUpload()
  
  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  
  // Original data for comparison
  const [originalData, setOriginalData] = useState<FantasyRecord | null>(null)

  // 初始化表单数据
  useEffect(() => {
    if (record) {
      setTitle(record.title)
      setContent(record.content || record.snippet)
      setTags(record.tags)
      setSelectedMood(record.mood)
      setOriginalData(record)
    }
  }, [record])

  // 检查是否有变更
  useEffect(() => {
    if (originalData) {
      const currentContent = content || ""
      const originalContent = originalData.content || originalData.snippet || ""
      
      const hasChanged = 
        title !== originalData.title ||
        currentContent !== originalContent ||
        JSON.stringify(tags.sort()) !== JSON.stringify(originalData.tags.sort()) ||
        selectedMood !== originalData.mood
      
      setHasChanges(hasChanged)
    }
  }, [title, content, tags, selectedMood, originalData])

  // 处理错误和重定向
  useEffect(() => {
    if (error) {
      router.push("/records")
    }
  }, [error, router])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()])
      }
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = async () => {
    // 验证数据
    const errors = validateRecord({
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
    })
    
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    try {
      // 先上传附件
      let attachmentIds: string[] = []
      if (uploadedFiles.length > 0) {
        const uploadedAttachments = await uploadFiles(uploadedFiles)
        attachmentIds = uploadedAttachments.map(attachment => attachment.id)
      }

      const recordData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        mood: selectedMood,
        attachments: attachmentIds
      }

      await updateRecord(recordId, recordData)
      router.push(`/records/${recordId}`)
    } catch (error) {
      // 错误已在hook中处理
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [title, content, tags, selectedMood])

  if (loading) {
    return <RecordEditSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/records/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回详情
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${
              hasChanges ? "text-amber-500" : "text-muted-foreground"
            }`}>
              {hasChanges ? "有未保存的更改" : "无更改"}
            </span>
            <Button 
              onClick={handleSave}
              className={hasChanges ? "glow-effect" : ""}
              disabled={saving || !hasChanges || !title.trim() || !content.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "保存中..." : "保存更改"}
            </Button>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-8">
          {/* Title */}
          <div>
            <Input
              placeholder="给这个幻想起一个标题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Content with Markdown Support */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="w-5 h-5" />
                内容编辑
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    编辑
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    预览
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="space-y-2">
                  <Textarea
                    placeholder="在这里尽情描绘你的幻想世界...\n\n支持Markdown语法：\n# 标题\n**粗体** *斜体*\n- 列表项\n> 引用\n\`代码\`\n[链接](url)\n![图片](url)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] text-base leading-relaxed resize-none"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>字数: {content.length}</span>
                    <span>{content.length < 50 ? "建议至少写50个字" : "内容充实"}</span>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="space-y-2">
                  <div className="min-h-[400px] p-4 border rounded-md bg-background">
                    {content ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          disallowedElements={['script', 'iframe', 'object', 'embed', 'form', 'input', 'button']}
                          unwrapDisallowed={true}
                          skipHtml={true}
                          components={{
                            h1: ({children}) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
                            p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-3">{children}</blockquote>,
                            code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>,
                            pre: ({children}) => <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-3">{children}</pre>,
                            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>,
                            a: ({href, children}) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                            img: ({src, alt}) => <img src={src} alt={alt} className="max-w-full h-auto rounded-md mb-3" />
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">在编辑模式下输入内容，这里将显示Markdown预览效果</p>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>字数: {content.length}</span>
                    <span>{content.length < 50 ? "建议至少写50个字" : "内容充实"}</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="text-lg">标签</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="添加标签（如：软件灵感, 科幻, 剧情）然后按回车"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                className="glassmorphism border-0"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {originalData && originalData.attachmentFiles && originalData.attachmentFiles.length > 0 && (
            <Card className="glassmorphism border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  附件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                   {originalData.attachmentFiles?.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
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
                  <p className="text-xs text-muted-foreground mt-2">
                    注意：编辑页面暂不支持添加或删除附件，如需修改附件请重新创建记录。
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mood Selector */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="text-lg">记录此刻的心情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {MOOD_OPTIONS.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className="h-20 flex-col gap-2"
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.value}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}