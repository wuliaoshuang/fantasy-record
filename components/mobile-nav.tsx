"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, BrainCircuit, Archive, Settings, Menu, X, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "主页",
    url: "/",
    icon: Home,
  },
  {
    title: "AI 分析",
    url: "/analysis",
    icon: BrainCircuit,
  },
  {
    title: "所有记录",
    url: "/records",
    icon: Archive,
  },
  {
    title: "设置",
    url: "/settings",
    icon: Settings,
  },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 路由变化时关闭菜单
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  if (!isMobile) return null

  return (
    <>
      {/* 悬浮导航按钮 */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {/* 创建新记录按钮 */}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => router.push('/create')}
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        {/* 主菜单按钮 */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-background/80 backdrop-blur-sm border"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto p-0 border-t">
            <div className="p-6 pb-8">
              {/* 拖拽指示器 */}
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">✨</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">幻想记录</h2>
                  <p className="text-sm text-muted-foreground">Fantasy Record</p>
                </div>
              </div>
              
              {/* 导航菜单 */}
              <div className="grid grid-cols-2 gap-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={cn(
                        "flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "bg-card hover:bg-accent border-border hover:border-primary/20 hover:shadow-md"
                      )}
                    >
                      <item.icon className="h-7 w-7" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* 底部安全区域 */}
              <div className="h-4" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}