"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, TrendingUp, Lightbulb, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { SmallLoading, HomePageSkeleton } from "@/components/ui/loading"
// import { useGetCookies } from "cookies-next"

// 默认心情数据（作为fallback）
const defaultMoodData = [
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

const dailyInspirations = [
  "如果时间可以倒流，你会改变什么？",
  "想象一个没有重力的世界，人们如何生活？",
  "如果你能和任何历史人物对话，你会选择谁？",
  "设计一个能解决世界饥饿问题的发明",
  "如果颜色有味道，你最喜欢的颜色会是什么味道？",
  "创造一个新的节日，它庆祝什么？",
  "如果动物能说话，哪种动物会最有趣？",
  "想象一个完美的城市，它有什么特点？",
  "如果你能拥有任何超能力，但只能用来帮助别人，你会选择什么？",
  "设计一个连接梦境和现实的装置"
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("全部")
  const [recentRecords, setRecentRecords] = useState<any[]>([])
  const [dailyInspiration, setDailyInspiration] = useState("")
  const [moodData, setMoodData] = useState(defaultMoodData)
  const [moodDataLoading, setMoodDataLoading] = useState(false)
  const [summaryData, setSummaryData] = useState({
    totalRecords: 0,
    softwareIdeasCount: 0,
    storyFragmentsCount: 0,
    averageMoodScore: 0,
    activeDays: 0,
    topTags: []
  })
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // 获取心情趋势数据
  const fetchMoodTrend = async () => {
    try {
      setMoodDataLoading(true)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/mood-trend`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data && data.data.labels && data.data.dataPoints) {
          // 转换API数据格式为图表所需格式
          const chartData = data.data.labels.map((label: string, index: number) => ({
            day: label,
            mood: data.data.dataPoints[index] || 5
          }))
          setMoodData(chartData)
        }
      }
    } catch (error) {
      console.error('获取心情趋势失败:', error)
      // 保持使用默认数据
    } finally {
      setMoodDataLoading(false)
    }
  }

  // 获取记录摘要数据
  const fetchRecordsSummary = async () => {
    try {
      setSummaryLoading(true)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/records-summary`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setSummaryData(data.data)
        }
      }
    } catch (error) {
      console.error('获取记录摘要失败:', error)
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    // 设置每日灵感（基于日期确保每天显示不同内容）
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const inspirationIndex = dayOfYear % dailyInspirations.length
    setDailyInspiration(dailyInspirations[inspirationIndex])

    const fetchRecords = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/records`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data && data.data && data.data.records && Array.isArray(data.data.records)) {
            const processedRecords = data.data.records.map((record: any) => ({
              ...record,
              tags: record.tags 
                ? (typeof record.tags === 'string' ? JSON.parse(record.tags) : record.tags)
                : [],
              content: record.snippet || record.content || '',
              date: new Date(record.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
            }))
            setRecentRecords(processedRecords)
          }
        }
      } catch (error) {
        console.error('获取记录失败:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    
    fetchRecords()
     fetchMoodTrend()
     fetchRecordsSummary()
   }, [])

  const filteredRecords = recentRecords.filter((record: any) => {
    const matchesSearch =
      record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "全部" || record.tags?.includes(activeFilter)
    return matchesSearch && matchesFilter
  })

  // 如果正在初始加载，显示骨架屏
  if (initialLoading) {
    return <HomePageSkeleton />
  }

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

            {/* Welcome Banner */}
            <Card className="glassmorphism border-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-medium text-foreground">🌟 开启今日的创意之旅</h2>
                    <p className="text-muted-foreground text-sm">
                      记录你的奇思妙想，让每一个灵感都闪闪发光
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-6xl opacity-20">💭</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glassmorphism border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{recentRecords.length}</div>
                  <div className="text-xs text-muted-foreground">总记录数</div>
                </CardContent>
              </Card>
              <Card className="glassmorphism border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {recentRecords.filter(r => r.tags?.includes('软件灵感')).length}
                  </div>
                  <div className="text-xs text-muted-foreground">软件灵感</div>
                </CardContent>
              </Card>
              <Card className="glassmorphism border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {recentRecords.filter(r => r.tags?.includes('故事片段')).length}
                  </div>
                  <div className="text-xs text-muted-foreground">故事片段</div>
                </CardContent>
              </Card>
              <Card className="glassmorphism border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {recentRecords.filter(r => r.tags?.includes('未来设想')).length}
                  </div>
                  <div className="text-xs text-muted-foreground">未来设想</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
                <Input
                  placeholder="通过关键词、标签搜索幻想..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glassmorphism border-0 !backdrop-blur-none"
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

            {/* Recent Activity */}
            {recentRecords.length > 0 && (
              <Card className="glassmorphism border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    最近的创意火花
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentRecords.slice(0, 3).map((record: any) => (
                      <div key={record.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-xl">
                          {moodOptions.find(option => option.value === record.mood)?.emoji || '💭'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{record.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{record.content}</p>
                        </div>
                        <Link href={`/records/${record.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            查看
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
            {/* Daily Inspiration */}
            <Card className="glassmorphism border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  今日思考
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed italic">
                  "{dailyInspiration}"
                </p>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    💡 让这个问题激发你的创意，记录下你的想法吧！
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Mood Trend */}
            <Card className="glassmorphism border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  本周情绪趋势
                  {moodDataLoading && (
                    <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  {moodDataLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <SmallLoading text="" />
                    </div>
                  ) : (
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
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Tags & Analysis */}
            <Card className="glassmorphism border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  热门标签
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {summaryLoading ? (
                  <SmallLoading text="" />
                ) : summaryData.topTags && summaryData.topTags.length > 0 ? (
                  <div className="space-y-2">
                    {summaryData.topTags.slice(0, 5).map((tagItem: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">#{tagItem.tag}</span>
                        <span className="font-medium text-accent">{tagItem.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    暂无标签数据
                  </div>
                )}
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
                  统计概览
                  {summaryLoading && (
                    <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {summaryLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <SmallLoading text="" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">记录总数</span>
                      <span className="font-medium">{summaryData.totalRecords}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">软件灵感</span>
                      <span className="font-medium">{summaryData.softwareIdeasCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">故事片段</span>
                      <span className="font-medium">{summaryData.storyFragmentsCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">平均心情</span>
                      <span className="font-medium">{summaryData.averageMoodScore}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">活跃天数</span>
                      <span className="font-medium">{summaryData.activeDays}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
