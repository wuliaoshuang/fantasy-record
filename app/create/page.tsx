"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Upload, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const moodOptions = [
  { emoji: "😃", value: "兴奋", color: "bg-yellow-500" },
  { emoji: "🤔", value: "沉思", color: "bg-blue-500" },
  { emoji: "😢", value: "悲伤", color: "bg-gray-500" },
  { emoji: "🚀", value: "充满希望", color: "bg-green-500" },
  { emoji: "❓", value: "困惑", color: "bg-purple-500" },
]

export default function CreateEntry() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [saveStatus, setSaveStatus] = useState("已保存")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])


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
    if (!title.trim() || !content.trim()) {
      alert("请填写标题和内容")
      return
    }

    setSaveStatus("保存中...")
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const recordData = {
         title: title.trim(),
         content: content.trim(),
         tags: tags,
         mood: selectedMood
       }

      const response = await fetch("http://localhost:3000/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(recordData)
      })

      if (response.ok) {
        setSaveStatus("已保存")
        router.push("/")
      } else {
        const errorData = await response.json()
        console.error('保存失败:', errorData)
        setSaveStatus("保存失败")
        alert("保存失败，请重试")
      }
    } catch (error) {
      console.error('保存记录时出错:', error)
      setSaveStatus("保存失败")
      alert("保存失败，请检查网络连接")
    }
  }

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (title || content) {
        setSaveStatus("自动保存中...")
        setTimeout(() => setSaveStatus("已保存"), 500)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [title, content])

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回主页
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${
              saveStatus === "保存失败" ? "text-red-500" : 
              saveStatus === "保存中..." ? "text-yellow-500" : 
              "text-muted-foreground"
            }`}>{saveStatus}</span>
            <Button 
              onClick={handleSave}
              className="glow-effect"
              disabled={saveStatus === "保存中..." || !title.trim() || !content.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === "保存中..." ? "保存中..." : "保存记录"}
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

          {/* Mood Selector */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="text-lg">记录此刻的心情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {moodOptions.map((mood) => (
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

          {/* File Upload */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="text-lg">附件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">上传相关附件（草图、灵感图等）</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadedFiles(Array.from(e.target.files))
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                  选择文件
                </Button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">已选择的文件：</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
