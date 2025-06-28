"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useFontSize } from "@/components/font-size-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Settings, Moon, Bell, Database, Shield, Palette, Save, Download, Trash2 } from "lucide-react"

// 设置接口定义
interface AppSettings {
  autoSave: boolean
  autoSaveInterval: number
  notifications: boolean
  analysisFrequency: string
  dataRetention: number
  exportFormat: string
  fontSize: number
  defaultTags: string
  recordReminder: boolean
  anonymousAnalytics: boolean
}

// 默认设置
const defaultSettings: AppSettings = {
  autoSave: true,
  autoSaveInterval: 5,
  notifications: true,
  analysisFrequency: "weekly",
  dataRetention: 365,
  exportFormat: "json",
  fontSize: 16,
  defaultTags: "软件灵感, 故事片段",
  recordReminder: true,
  anonymousAnalytics: true
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { fontSize, setFontSize } = useFontSize()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  // 加载设置
  useEffect(() => {
    setMounted(true)
    const savedSettings = localStorage.getItem('fantasy-record-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        const mergedSettings = { ...defaultSettings, ...parsed }
        setSettings(mergedSettings)
        // 确保字体大小与FontSizeProvider同步
        if (mergedSettings.fontSize && mergedSettings.fontSize !== fontSize) {
          setFontSize(mergedSettings.fontSize)
        }
      } catch (error) {
        console.error('Failed to parse settings:', error)
      }
    }
  }, [])

  // 更新设置的通用函数
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  // 保存设置
  const handleSave = () => {
    try {
      localStorage.setItem('fantasy-record-settings', JSON.stringify(settings))
      setHasChanges(false)
      toast({
        title: "设置已保存",
        description: "你的设置已成功保存到本地存储。"
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存设置，请检查浏览器存储权限。",
        variant: "destructive"
      })
    }
  }

  // 导出数据
  const handleExportData = () => {
    try {
      const allData = {
        settings,
        records: JSON.parse(localStorage.getItem('fantasy-records') || '[]'),
        exportDate: new Date().toISOString()
      }
      
      const dataStr = settings.exportFormat === 'json' 
        ? JSON.stringify(allData, null, 2)
        : convertToCSV(allData)
      
      const dataBlob = new Blob([dataStr], { 
        type: settings.exportFormat === 'json' ? 'application/json' : 'text/csv' 
      })
      
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fantasy-record-export.${settings.exportFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "数据导出成功",
        description: `数据已导出为 ${settings.exportFormat.toUpperCase()} 格式。`
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: "无法导出数据，请稍后重试。",
        variant: "destructive"
      })
    }
  }

  // 删除所有数据
  const handleDeleteAllData = () => {
    if (confirm('确定要删除所有数据吗？此操作无法撤销！')) {
      try {
        localStorage.removeItem('fantasy-records')
        localStorage.removeItem('fantasy-record-settings')
        setSettings(defaultSettings)
        setHasChanges(false)
        toast({
          title: "数据已删除",
          description: "所有数据已成功删除。"
        })
      } catch (error) {
        toast({
          title: "删除失败",
          description: "无法删除数据，请稍后重试。",
          variant: "destructive"
        })
      }
    }
  }

  // CSV转换函数
  const convertToCSV = (data: any) => {
    const records = data.records || []
    if (records.length === 0) return 'No records found'
    
    const headers = Object.keys(records[0]).join(',')
    const rows = records.map((record: any) => 
      Object.values(record).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    ).join('\n')
    
    return `${headers}\n${rows}`
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">加载中...</div>
    </div>
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
                  <Label>主题模式</Label>
                  <p className="text-sm text-muted-foreground">选择你喜欢的主题外观</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32 glassmorphism border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                    <SelectItem value="system">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>字体大小</Label>
                <Slider 
                  value={[fontSize]} 
                  onValueChange={([value]) => {
                    setFontSize(value)
                    updateSetting('fontSize', value)
                  }}
                  max={24} 
                  min={12} 
                  step={1} 
                  className="w-full" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>小 (12px)</span>
                  <span className="font-medium">{fontSize}px</span>
                  <span>大 (24px)</span>
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
                  <p className="text-sm text-muted-foreground">每{settings.autoSaveInterval}秒自动保存你的内容</p>
                </div>
                <Switch 
                  checked={settings.autoSave} 
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)} 
                />
              </div>

              <div className="space-y-2">
                <Label>自动保存间隔 (秒)</Label>
                <Slider 
                  value={[settings.autoSaveInterval]} 
                  onValueChange={([value]) => updateSetting('autoSaveInterval', value)}
                  max={60} 
                  min={1} 
                  step={1} 
                  className="w-full" 
                  disabled={!settings.autoSave}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1秒</span>
                  <span className="font-medium">{settings.autoSaveInterval}秒</span>
                  <span>60秒</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>默认标签</Label>
                <Input
                  placeholder="输入默认标签，用逗号分隔"
                  value={settings.defaultTags}
                  onChange={(e) => updateSetting('defaultTags', e.target.value)}
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
                <Switch 
                  checked={settings.notifications} 
                  onCheckedChange={(checked) => updateSetting('notifications', checked)} 
                />
              </div>

              <div className="space-y-2">
                <Label>分析报告频率</Label>
                <Select 
                  value={settings.analysisFrequency} 
                  onValueChange={(value) => updateSetting('analysisFrequency', value)}
                  disabled={!settings.notifications}
                >
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
                <Switch 
                  checked={settings.recordReminder} 
                  onCheckedChange={(checked) => updateSetting('recordReminder', checked)}
                  disabled={!settings.notifications}
                />
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
                  value={[settings.dataRetention]}
                  onValueChange={([value]) => updateSetting('dataRetention', value)}
                  max={1095}
                  min={30}
                  step={30}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30天</span>
                  <span className="font-medium">{settings.dataRetention}天</span>
                  <span>3年</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>数据导出</Label>
                <div className="flex gap-4">
                  <Select 
                    value={settings.exportFormat} 
                    onValueChange={(value) => updateSetting('exportFormat', value)}
                  >
                    <SelectTrigger className="glassmorphism border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON 格式</SelectItem>
                      <SelectItem value="csv">CSV 格式</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    导出数据
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-destructive">危险操作</Label>
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <p className="text-sm text-muted-foreground mb-3">删除所有数据将无法恢复，请谨慎操作</p>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAllData}>
                    <Trash2 className="w-4 h-4 mr-2" />
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
                <Switch 
                  checked={settings.anonymousAnalytics} 
                  onCheckedChange={(checked) => updateSetting('anonymousAnalytics', checked)} 
                />
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
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {hasChanges ? (
                <span className="text-amber-500">有未保存的更改</span>
              ) : (
                <span className="text-green-500">所有更改已保存</span>
              )}
            </div>
            <Button 
              onClick={handleSave} 
              className={hasChanges ? "glow-effect" : ""}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              {hasChanges ? "保存设置" : "已保存"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
