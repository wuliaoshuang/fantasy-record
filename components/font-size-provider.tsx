"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface FontSizeContextType {
  fontSize: number
  setFontSize: (size: number) => void
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

// 获取保存的字体大小，但不立即应用到DOM
const getInitialFontSize = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedSettings = localStorage.getItem('fantasy-record-settings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        return settings.fontSize || 16
      }
    } catch (error) {
      console.error('Failed to load font size setting:', error)
    }
  }
  return 16
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState(getInitialFontSize)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 只在客户端挂载后应用字体大小
    const currentFontSize = getInitialFontSize()
    document.documentElement.style.fontSize = `${currentFontSize}px`
    document.body.style.fontSize = `${currentFontSize}px`
  }, [])

  const setFontSize = (size: number) => {
    // 立即应用字体大小
    if (typeof window !== 'undefined') {
      document.documentElement.style.fontSize = `${size}px`
      document.body.style.fontSize = `${size}px`
    }
    
    setFontSizeState(size)
    
    // 同时更新localStorage中的设置
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('fantasy-record-settings')
      try {
        const settings = savedSettings ? JSON.parse(savedSettings) : {}
        settings.fontSize = size
        localStorage.setItem('fantasy-record-settings', JSON.stringify(settings))
      } catch (error) {
        console.error('Failed to save font size setting:', error)
      }
    }
  }



  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (context === undefined) {
    // 在服务端渲染时提供默认值，避免抛出错误
    if (typeof window === 'undefined') {
      return { fontSize: 16, setFontSize: () => {} }
    }
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}