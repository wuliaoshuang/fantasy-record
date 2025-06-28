import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { FontSizeProvider } from "@/components/font-size-provider"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "幻想记录 - Fantasy Record",
  description: "一个用于记录日常幻想、进行自我心理分析和梳理软件创意可行性的个人Web应用",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <FontSizeProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen">
              {/* 桌面端侧边栏 */}
              <div className="hidden md:block">
                <SidebarProvider defaultOpen={true}>
                  <AppSidebar />
                </SidebarProvider>
              </div>
              
              {/* 主内容区域 */}
               <div className="flex-1 flex flex-col md:ml-0">
                 <main className="flex-1 overflow-auto">
                   <div className="pb-20 md:pb-0">
                     {children}
                   </div>
                 </main>
                 
                 {/* 移动端悬浮导航 */}
                 <MobileNav />
               </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </FontSizeProvider>
      </body>
    </html>
  )
}
