"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Tag } from "lucide-react"
import Link from "next/link"

const moodOptions = [
  { emoji: "😃", value: "兴奋", color: "bg-yellow-500" },
  { emoji: "🤔", value: "沉思", color: "bg-blue-500" },
  { emoji: "😢", value: "悲伤", color: "bg-gray-500" },
  { emoji: "🚀", value: "充满希望", color: "bg-green-500" },
  { emoji: "❓", value: "困惑", color: "bg-purple-500" },
]

export default function AllRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterTag, setFilterTag] = useState("all")
  const [allRecords, setAllRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        
        const response = await fetch("http://localhost:3000/records", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          // 检查数据结构并处理数据格式
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
            setAllRecords(processedRecords)
          } else {
            console.error('API响应数据格式错误:', data)
            setAllRecords([])
          }
        }
      } catch (error) {
        console.error('获取记录失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecords()
  }, [])

  // Get all unique tags
  const allTags = Array.from(new Set(allRecords.flatMap((record: any) => record.tags || [])))

  // Filter and sort records
  const filteredRecords = allRecords
    .filter((record: any) => {
      const matchesSearch =
        record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.content?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = filterTag === "all" || record.tags?.includes(filterTag)
      return matchesSearch && matchesTag
    })
    .sort((a: any, b: any) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-200">所有记录</h1>
          <p className="text-gray-600">浏览和搜索你的所有幻想记录</p>
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
                {allTags.map((tag: string) => (
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
          {filteredRecords.map((record: any) => (
            <Link key={record.id} href={`/records/${record.id}`}>
              <Card className="glassmorphism border-0 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-medium text-foreground">{record.title}</CardTitle>
                    <span className="text-2xl">{moodOptions.find(option => option.value === record.mood)?.emoji}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{record.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {record.tags?.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFilterTag(tag)
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{record.date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
