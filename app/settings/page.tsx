"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, Moon, Bell, Database, Shield, Palette, Save } from "lucide-react"

export default function SettingsPage() {
  const [autoSave, setAutoSave] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [analysisFrequency, setAnalysisFrequency] = useState("weekly")
  const [dataRetention, setDataRetention] = useState([365])
  const [exportFormat, setExportFormat] = useState("json")

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            设置
          </h1>
          <p className="text-muted-foreground">个性化你的幻想记录体验</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                外观设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>深色模式</Label>
                  <p className="text-sm text-muted-foreground">使用深色主题保护眼睛</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="space-y-2">
                <Label>字体大小</Label>
                <Slider value={[16]} max={24} min={12} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>小</span>
                  <span>大</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editor Settings */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-accent" />
                编辑器设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>自动保存</Label>
                  <p className="text-sm text-muted-foreground">每5秒自动保存你的内容</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="space-y-2">
                <Label>自动保存间隔 (秒)</Label>
                <Slider value={[5]} max={60} min={1} step={1} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label>默认标签</Label>
                <Input
                  placeholder="输入默认标签，用逗号分隔"
                  defaultValue="软件灵感, 故事片段"
                  className="glassmorphism border-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                通知设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>启用通知</Label>
                  <p className="text-sm text-muted-foreground">接收分析报告和提醒通知</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="space-y-2">
                <Label>分析报告频率</Label>
                <Select value={analysisFrequency} onValueChange={setAnalysisFrequency}>
                  <SelectTrigger className="glassmorphism border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每日</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="never">从不</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>记录提醒</Label>
                  <p className="text-sm text-muted-foreground">提醒你定期记录幻想</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-accent" />
                数据管理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>数据保留期限 (天)</Label>
                <Slider
                  value={dataRetention}
                  onValueChange={setDataRetention}
                  max={1095}
                  min={30}
                  step={30}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30天</span>
                  <span className="font-medium">{dataRetention[0]}天</span>
                  <span>3年</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>数据导出</Label>
                <div className="flex gap-4">
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="glassmorphism border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON 格式</SelectItem>
                      <SelectItem value="csv">CSV 格式</SelectItem>
                      <SelectItem value="pdf">PDF 格式</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">导出数据</Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-destructive">危险操作</Label>
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <p className="text-sm text-muted-foreground mb-3">删除所有数据将无法恢复，请谨慎操作</p>
                  <Button variant="destructive" size="sm">
                    删除所有数据
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="glassmorphism border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                隐私与安全
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>本地存储</Label>
                  <p className="text-sm text-muted-foreground">所有数据仅存储在本地设备上</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>匿名分析</Label>
                  <p className="text-sm text-muted-foreground">允许收集匿名使用数据以改进产品</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>AI分析隐私</Label>
                  <p className="text-sm text-muted-foreground">AI分析在本地进行，不会上传个人数据</p>
                </div>
                <Switch checked={true} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="glow-effect">
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
