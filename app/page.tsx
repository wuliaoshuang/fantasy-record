"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, TrendingUp, Lightbulb, Calendar } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
// import { useGetCookies } from "cookies-next"

const moodData = [
  { day: "周一", mood: 7 },
  { day: "周二", mood: 6 },
  { day: "周三", mood: 8 },
  { day: "周四", mood: 5 },
  { day: "周五", mood: 9 },
  { day: "周六", mood: 8 },
  { day: "周日", mood: 7 },
]

const moodOptions = [
  { emoji: "😃", value: "兴奋", color: "bg-yellow-500" },
  { emoji: "🤔", value: "沉思", color: "bg-blue-500" },
  { emoji: "😢", value: "悲伤", color: "bg-gray-500" },
  { emoji: "🚀", value: "充满希望", color: "bg-green-500" },
  { emoji: "❓", value: "困惑", color: "bg-purple-500" },
]

const filterOptions = ["全部", "软件灵感", "故事片段", "未来设想", "情绪宣泄"]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("全部")
  const [recentRecords, setRecentRecords] = useState<any[]>([])

  useEffect(() => {
    const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
    fetch("http://localhost:3000/records", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        
        // 检查数据结构并处理 tags 字段
        if (data && data.data && data.data.records && Array.isArray(data.data.records)) {
          const processedRecords = data.data.records.map((record: any) => ({
            ...record,
            tags: record.tags 
              ? (typeof record.tags === 'string' ? JSON.parse(record.tags) : record.tags)
              : [],
            content: record.snippet || record.content || '' // 使用 snippet 作为 content
          }));
          
          setRecentRecords(processedRecords);
        } else {
          console.error('API响应数据格式错误:', data);
          setRecentRecords([]);
        }
      })
      .catch(error => {
        console.error('获取记录失败:', error);
      });
  }, [])

  const filteredRecords = recentRecords.filter((record: any) => {
    const matchesSearch =
      record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "全部" || record.tags?.includes(activeFilter)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="space-y-4 flex flex-col gap-2">
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
              {filteredRecords.map((record: any) => (
                <Link key={record.id} href={`/records/${record.id}`}>
                <Card className="glassmorphism border-0 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-medium text-foreground">{record.title}</CardTitle>
                      <span className="text-2xl">{moodOptions.find(option => option.value === record.mood)?.emoji}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">{record.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {record.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{record.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
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
