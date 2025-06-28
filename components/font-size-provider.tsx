"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface FontSizeContextType {
  fontSize: number
  setFontSize: (size: number) => void
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState(16)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 从localStorage加载字体大小设置
    const savedSettings = localStorage.getItem('fantasy-record-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.fontSize && settings.fontSize !== fontSize) {
          setFontSizeState(settings.fontSize)
        }
      } catch (error) {
        console.error('Failed to load font size setting:', error)
      }
    }
  }, [])

  const setFontSize = (size: number) => {
    setFontSizeState(size)
    // 同时更新localStorage中的设置
    const savedSettings = localStorage.getItem('fantasy-record-settings')
    try {
      const settings = savedSettings ? JSON.parse(savedSettings) : {}
      settings.fontSize = size
      localStorage.setItem('fantasy-record-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save font size setting:', error)
    }
  }

  // 应用字体大小到document根元素
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // 设置根元素字体大小
      document.documentElement.style.fontSize = `${fontSize}px`
      // 同时设置body的字体大小以确保全局生效
      document.body.style.fontSize = `${fontSize}px`
    }
  }, [fontSize, mounted])

  if (!mounted) {
    return <>{children}</>
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
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}