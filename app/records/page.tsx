"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Tag } from "lucide-react"

// Mock data - expanded
const allRecords = [
  {
    id: 1,
    title: "未来城市的智能交通系统",
    content:
      "想象一个完全由AI控制的交通网络，每辆车都能与城市基础设施实时通信，实现零拥堵的理想状态。这个系统能够预测交通流量，动态调整信号灯时间，甚至重新规划路线...",
    tags: ["软件灵感", "科幻", "AI"],
    date: "2024-01-15 14:30",
    mood: "🚀",
  },
  {
    id: 2,
    title: "梦中的图书馆",
    content:
      "一个无限延伸的图书馆，每本书都记录着不同世界的故事，读者可以通过阅读进入那些世界。图书管理员是一位神秘的老者，他知道每个人最需要的故事...",
    tags: ["故事片段", "奇幻"],
    date: "2024-01-14 22:15",
    mood: "🤔",
  },
  {
    id: 3,
    title: "个人时间管理助手",
    content:
      "一个能够学习用户习惯的智能助手，不仅提醒任务，还能预测用户的情绪状态并调整工作节奏。它会在用户疲惫时建议休息，在精力充沛时推荐挑战性任务...",
    tags: ["软件灵感", "生产力"],
    date: "2024-01-13 09:45",
    mood: "😃",
  },
  {
    id: 4,
    title: "星际旅行日记",
    content:
      "2157年，人类终于掌握了超光速旅行技术。作为第一批星际探险家，我记录下了在遥远星球上的奇遇。那里的生物会发光，植物能够感知情绪...",
    tags: ["故事片段", "科幻", "未来设想"],
    date: "2024-01-12 16:20",
    mood: "🚀",
  },
  {
    id: 5,
    title: "情绪可视化应用",
    content:
      "一个能够将用户的情绪转化为美丽艺术作品的应用。通过分析用户的文字、语音和行为模式，生成独特的情绪画作，帮助用户更好地理解自己的内心世界...",
    tags: ["软件灵感", "艺术", "心理"],
    date: "2024-01-11 11:30",
    mood: "😃",
  },
  {
    id: 6,
    title: "雨夜的思考",
    content:
      "今晚下雨了，坐在窗边听着雨声，突然想到生活就像这场雨，有时急促，有时缓慢，但总是在不断地洗涤着世界。每一滴雨都有自己的故事...",
    tags: ["情绪宣泄", "哲思"],
    date: "2024-01-10 23:45",
    mood: "🤔",
  },
]

export default function AllRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterTag, setFilterTag] = useState("all")

  // Get all unique tags
  const allTags = Array.from(new Set(allRecords.flatMap((record) => record.tags)))

  // Filter and sort records
  const filteredRecords = allRecords
    .filter((record) => {
      const matchesSearch =
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = filterTag === "all" || record.tags.includes(filterTag)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">所有记录</h1>
          <p className="text-muted-foreground">浏览和管理你的所有幻想记录</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glassmorphism border-0"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 glassmorphism border-0">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">按日期排序</SelectItem>
                <SelectItem value="title">按标题排序</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by Tag */}
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full sm:w-48 glassmorphism border-0">
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有标签</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>共 {filteredRecords.length} 条记录</span>
            {filterTag !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {filterTag}
              </Badge>
            )}
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid gap-6">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="glassmorphism border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-medium text-foreground">{record.title}</CardTitle>
                  <span className="text-2xl">{record.mood}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{record.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setFilterTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{record.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的记录</p>
              <p className="text-sm">尝试调整搜索条件或筛选器</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterTag("all")
              }}
            >
              清除筛选条件
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
