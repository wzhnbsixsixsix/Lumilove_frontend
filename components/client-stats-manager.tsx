"use client"

import { useEffect } from 'react'
import characterStatsManager from '@/lib/character-stats'

export default function ClientStatsManager() {
  useEffect(() => {
    // 初始化角色统计管理器
    characterStatsManager.init()
    
    // 清理函数
    return () => {
      characterStatsManager.cleanup()
    }
  }, [])

  // 这个组件不渲染任何内容
  return null
} 