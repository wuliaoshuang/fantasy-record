"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, TrendingUp, Cloud, FileText, Lightbulb, Copy, Star, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from "recharts"

// Mock data
const emotionData = [
  { date: "1/1", mood: 7, energy: 6 },
  { date: "1/5", mood: 8, energy: 7 },
  { date: "1/10", mood: 6, energy: 5 },
  { date: "1/15", mood: 9, energy: 8 },
  { date: "1/20", mood: 7, energy: 6 },
  { date: "1/25", mood: 8, energy: 7 },
  { date: "1/30", mood: 9, energy: 9 },
]

const themeData = [
  { name: "科技", value: 35, color: "#4A90E2" },
  { name: "未来", value: 28, color: "#50E3C2" },
  { name: "创新", value: 20, color: "#F5A623" },
  { name: "AI", value: 17, color: "#7ED321" },
]

const softwareIdeas = [
  { id: 1, title: "未来城市的智能交通系统", tags: ["软件灵感", "AI", "交通"] },
  { id: 2, title: "个人时间管理助手", tags: ["软件灵感", "生产力"] },
  { id: 3, title: "基于情绪的音乐推荐算法", tags: ["软件灵感", "AI", "音乐"] },
]

export default function AnalysisCenter() {
  const [selectedIdea, setSelectedIdea] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // 心理状态分析数据
  const [mentalAnalysisData, setMentalAnalysisData] = useState<any>(null)
  const [mentalAnalysisLoading, setMentalAnalysisLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 获取心理状态分析数据
  const fetchMentalAnalysis = async () => {
    try {
      setMentalAnalysisLoading(true)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      const response = await fetch("http://localhost:3000/ai/mental-state-analysis", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setMentalAnalysisData(data.data)
        }
      }
    } catch (error) {
      console.error('获取心理状态分析失败:', error)
    } finally {
      setMentalAnalysisLoading(false)
    }
  }

  // 手动触发AI分析
  const triggerAnalysis = async () => {
    try {
      setIsRefreshing(true)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      const response = await fetch("http://localhost:3000/ai/trigger-analysis", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
      })
      
      if (response.ok) {
        // 触发成功后重新获取分析数据
        await fetchMentalAnalysis()
      }
    } catch (error) {
      console.error('触发AI分析失败:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMentalAnalysis()
  }, [])

  const handleAnalyze = () => {
    if (!selectedIdea) return

    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        coreUserPain:
          "用户在日常时间管理中缺乏个性化和智能化的解决方案，现有工具无法根据用户的情绪状态和工作习惯进行动态调整。",
        targetUsers: "忙碌的职场人士、自由职业者、学生群体，特别是那些希望提高工作效率但经常感到时间管理困难的用户。",
        coreFeatures: [
          "智能任务优先级排序",
          "情绪感知与工作节奏调整",
          "个性化提醒系统",
          "数据可视化分析",
          "跨平台同步",
        ],
        marketScore: 78,
        marketReason: "时间管理市场需求旺盛，但缺乏真正智能化的解决方案",
        techChallenges: "情绪识别算法的准确性、用户行为模式学习、实时数据处理和隐私保护是主要技术挑战。",
        nextSteps: "建议先进行用户调研验证核心痛点，然后开发包含基础时间管理和简单情绪感知功能的MVP版本。",
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">AI 分析中心</h1>
              <p className="text-muted-foreground">在这里，将你的幻想转化为深刻的洞察与可行的计划。</p>
            </div>
            <Button
              onClick={triggerAnalysis}
              disabled={isRefreshing || mentalAnalysisLoading}
              variant="outline"
              size="sm"
              className="glassmorphism border-0 hover:bg-primary hover:text-primary-foreground"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '分析中...' : '刷新分析'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mental" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 glassmorphism border-0">
            <TabsTrigger
              value="mental"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              心理状态分析
            </TabsTrigger>
            <TabsTrigger
              value="software"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              软件创意可行性分析
            </TabsTrigger>
          </TabsList>

          {/* Mental State Analysis */}
          <TabsContent value="mental" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Emotion Chart */}
              <Card className="glassmorphism border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    情绪波动图 (近30天)
                    {mentalAnalysisLoading && (
                      <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {mentalAnalysisLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-sm text-muted-foreground">加载中...</div>
                      </div>
                    ) : mentalAnalysisData?.emotionChartData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mentalAnalysisData.emotionChartData.labels.map((label: string, index: number) => ({
                          date: label,
                          mood: mentalAnalysisData.emotionChartData.datasets[0].data[index]
                        }))}>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Line 
                            type="monotone" 
                            dataKey="mood" 
                            stroke={mentalAnalysisData.emotionChartData.datasets[0].borderColor || "hsl(var(--primary))"} 
                            strokeWidth={2} 
                            name="情绪波动" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={emotionData}>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} name="心情" />
                          <Line
                            type="monotone"
                            dataKey="energy"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            name="精力"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Theme Word Cloud */}
              <Card className="glassmorphism border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-accent" />
                    幻想主题词云
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {mentalAnalysisLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-sm text-muted-foreground">加载中...</div>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full">
                        <ResponsiveContainer width="100%" height={280}>
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="20%" 
                            outerRadius="90%" 
                            data={mentalAnalysisData?.themeWordCloud && mentalAnalysisData.themeWordCloud.length > 0 
                              ? mentalAnalysisData.themeWordCloud.slice(0, 6).map((item: any, index: number) => {
                                  const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#7ED321', '#BD10E0', '#B8E986']
                                  return {
                                    name: item.text,
                                    value: item.value,
                                    fill: colors[index % colors.length]
                                  }
                                })
                              : themeData.slice(0, 6).map((item, index) => ({
                                  name: item.name,
                                  value: item.value,
                                  fill: item.color
                                }))
                            }
                          >
                            <RadialBar 
                              dataKey="value" 
                              cornerRadius={10} 
                              fill="#8884d8" 
                              label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                            />
                            <Legend 
                              iconSize={8}
                              layout="vertical"
                              verticalAlign="middle"
                              align="right"
                              wrapperStyle={{ fontSize: '12px' }}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Report */}
            <Card className="glassmorphism border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-accent" />
                  AI 综合心理报告
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentalAnalysisLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">生成报告中...</div>
                  </div>
                ) : mentalAnalysisData?.summaryReport ? (
                  <div className="prose dark:prose-invert max-w-none leading-relaxed">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                    >
                      {mentalAnalysisData.summaryReport}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      最近，您的幻想中"科技"和"未来"两个主题经常同时出现，这反映了您对技术发展的浓厚兴趣和对未来的积极展望。
                      从情绪数据来看，您在记录这类幻想时通常处于较高的兴奋状态，说明科技创新是您的重要动力源泉。
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      建议您可以将这些科技幻想转化为具体的学习目标或项目计划，这样既能保持创造力，又能将想象力转化为实际行动。
                      同时，建议适当平衡工作与休息，在追求创新的同时关注内心的平静与和谐。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Software Idea Analysis */}
          <TabsContent value="software" className="space-y-6">
            <div className="space-y-6">
              {/* Idea Selection */}
              <Card className="glassmorphism border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    1. 选择一个'软件灵感'进行分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                    <SelectTrigger className="glassmorphism border-0">
                      <SelectValue placeholder="请选择一个软件创意..." />
                    </SelectTrigger>
                    <SelectContent>
                      {softwareIdeas.map((idea) => (
                        <SelectItem key={idea.id} value={idea.id.toString()}>
                          {idea.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedIdea && (
                    <div className="flex flex-wrap gap-2">
                      {softwareIdeas
                        .find((idea) => idea.id.toString() === selectedIdea)
                        ?.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  )}

                  <Button onClick={handleAnalyze} disabled={!selectedIdea || isAnalyzing} className="glow-effect">
                    {isAnalyzing ? "分析中..." : "开始AI可行性分析"}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Result */}
              {analysisResult && (
                <Card className="glassmorphism border-0 border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      AI 可行性分析报告
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">核心用户痛点</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysisResult.coreUserPain)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{analysisResult.coreUserPain}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">目标用户画像</h4>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(analysisResult.targetUsers)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{analysisResult.targetUsers}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">核心功能模块</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysisResult.coreFeatures.join(", "))}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.coreFeatures.map((feature: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">市场可行性评分</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(`${analysisResult.marketScore}/100 - ${analysisResult.marketReason}`)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-accent">{analysisResult.marketScore}</span>
                            <span className="text-muted-foreground">/100</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(analysisResult.marketScore / 20) ? "text-yellow-500 fill-current" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{analysisResult.marketReason}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">技术挑战评估</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(analysisResult.techChallenges)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{analysisResult.techChallenges}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">建议的下一步</h4>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(analysisResult.nextSteps)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{analysisResult.nextSteps}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
