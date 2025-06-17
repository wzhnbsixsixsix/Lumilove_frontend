"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PremiumPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the payment page
    router.replace("/payment")
  }, [router])

  // 显示加载状态
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a24] to-[#2a1a34] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-white">正在跳转到支付页面...</p>
      </div>
    </div>
  )
}
