"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

  const handleSave = () => {
    setSaveStatus("保存中...")
    // Simulate save
    setTimeout(() => {
      setSaveStatus("已保存")
      router.push("/")
    }, 1000)
  }

  // Auto-save simulation
  useState(() => {
    const interval = setInterval(() => {
      if (title || content) {
        setSaveStatus("自动保存中...")
        setTimeout(() => setSaveStatus("已保存"), 500)
      }
    }, 5000)
    return () => clearInterval(interval)
  })

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
            <span className="text-sm text-muted-foreground">{saveStatus}</span>
            <Button onClick={handleSave} className="glow-effect">
              <Save className="w-4 h-4 mr-2" />
              完成记录
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

          {/* Content */}
          <div>
            <Textarea
              placeholder="在这里尽情描绘你的幻想世界..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] text-base leading-relaxed border-0 bg-transparent px-0 focus-visible:ring-0 resize-none placeholder:text-muted-foreground/50"
            />
          </div>

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
                <Button variant="outline" size="sm">
                  选择文件
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
