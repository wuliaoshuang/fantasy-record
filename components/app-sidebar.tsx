"use client"

import { Home, BrainCircuit, Archive, Settings, Sparkles, User, LogOut, Sun, Moon, Monitor } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCookie, deleteCookie } from "cookies-next"
import { toast } from "sonner"
import { useTheme } from "next-themes"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const items = [
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

interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // 设置mounted状态
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const token = getCookie('token')
      if (!token) {
        setUserInfo(null)
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserInfo(data.data)
      } else if (response.status === 401) {
        // Token过期，清除并重定向
        deleteCookie('token')
        localStorage.removeItem('token')
        setUserInfo(null)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 监听token变化和路由变化
  useEffect(() => {
    fetchUserInfo()
  }, [pathname])

  // 监听localStorage变化（用于跨标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        fetchUserInfo()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // 监听token更新事件
  useEffect(() => {
    const handleTokenUpdate = () => {
      fetchUserInfo()
    }

    window.addEventListener('tokenUpdated', handleTokenUpdate)
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate)
  }, [])

  // 监听cookie变化（当token被删除时）
  useEffect(() => {
    const checkTokenExists = () => {
      const token = getCookie('token')
      if (!token && userInfo) {
        setUserInfo(null)
      }
    }

    // 检查token是否存在，如果不存在则清除用户信息
    checkTokenExists()
  }, [userInfo])

  // 退出登录
  const handleLogout = () => {
    deleteCookie('token')
    localStorage.removeItem('token')
    setUserInfo(null)
    toast.success('已退出登录')
    router.push('/auth/login')
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">幻想记录</h1>
            <p className="text-sm text-muted-foreground">Fantasy Record</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* 主题切换 */}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      {!mounted ? (
                        <Monitor className="w-4 h-4" />
                      ) : (
                        theme === 'light' ? <Sun className="w-4 h-4" /> : 
                        theme === 'dark' ? <Moon className="w-4 h-4" /> : 
                        <Monitor className="w-4 h-4" />
                      )}
                      <span>主题</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                      <Sun className="w-4 h-4 mr-2" />
                      浅色模式
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                      <Moon className="w-4 h-4 mr-2" />
                      深色模式
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                      <Monitor className="w-4 h-4 mr-2" />
                      跟随系统
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* 用户信息区域 */}
      <SidebarFooter className="p-4 border-t">
        {loading ? (
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
          </div>
        ) : userInfo ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userInfo.avatar} alt={userInfo.username} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{userInfo.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col gap-2">
            <Button asChild variant="default" size="sm">
              <Link href="/auth/login">登录</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/register">注册</Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
