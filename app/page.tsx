"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, TrendingUp, Lightbulb, Calendar } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Mock data
const recentRecords = [
  {
    id: 1,
    title: "未来城市的智能交通系统",
    content: "想象一个完全由AI控制的交通网络，每辆车都能与城市基础设施实时通信，实现零拥堵的理想状态...",
    tags: ["软件灵感", "科幻", "AI"],
    date: "2024-01-15 14:30",
    mood: "🚀",
  },
  {
    id: 2,
    title: "梦中的图书馆",
    content: "一个无限延伸的图书馆，每本书都记录着不同世界的故事，读者可以通过阅读进入那些世界...",
    tags: ["故事片段", "奇幻"],
    date: "2024-01-14 22:15",
    mood: "🤔",
  },
  {
    id: 3,
    title: "个人时间管理助手",
    content: "一个能够学习用户习惯的智能助手，不仅提醒任务，还能预测用户的情绪状态并调整工作节奏...",
    tags: ["软件灵感", "生产力"],
    date: "2024-01-13 09:45",
    mood: "😃",
  },
]

const moodData = [
  { day: "周一", mood: 7 },
  { day: "周二", mood: 6 },
  { day: "周三", mood: 8 },
  { day: "周四", mood: 5 },
  { day: "周五", mood: 9 },
  { day: "周六", mood: 8 },
  { day: "周日", mood: 7 },
]

const filterOptions = ["全部", "软件灵感", "故事片段", "未来设想", "情绪宣泄"]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("全部")

  const filteredRecords = recentRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "全部" || record.tags.includes(activeFilter)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-foreground">欢迎回来，今天幻想了些什么？</h1>

              <Link href="/create">
                <Button size="lg" className="glow-effect bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-5 h-5 mr-2" />
                  记录新的幻想 ✨
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="通过关键词、标签搜索幻想..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glassmorphism border-0"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className="rounded-full"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Records Grid */}
            <div className="grid gap-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="glassmorphism border-0 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-medium text-foreground">{record.title}</CardTitle>
                      <span className="text-2xl">{record.mood}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">{record.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {record.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{record.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Mood Trend */}
            <Card className="glassmorphism border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  本周情绪趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--accent))", strokeWidth: 0, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pending Analysis */}
            <Card className="glassmorphism border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />💡 待分析的灵感
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• 未来城市的智能交通系统</p>
                  <p>• 个人时间管理助手</p>
                  <p>• 基于情绪的音乐推荐算法</p>
                </div>
                <Link href="/analysis">
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    开始AI分析
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glassmorphism border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  本月统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">记录总数</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">软件灵感</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">故事片段</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">平均心情</span>
                  <span className="font-medium">7.2/10</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
