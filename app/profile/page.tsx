"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default function ProfilePage() {
  const router = useRouter()
  // 假设用户信息从localStorage获取
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || '{}') : { username: "未登录" }

  return (
    <div className="flex min-h-screen bg-[#1a0a24]">
      {/* 左侧导航栏 */}
      <Sidebar />

      {/* 右侧主要内容 */}
      <main className="flex-1 p-4 md:p-6">
        <div className="w-full max-w-xl mx-auto">
          {/* 返回主页按钮 */}
          <button
            className="mb-6 text-white flex items-center gap-2"
            onClick={() => router.push("/")}
          >
            <span className="text-2xl">←</span>
            <span className="text-xl font-bold">Back to home</span>
          </button>

          {/* 头像和用户名 */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 mb-4">
              <Image
                src={user.avatar || "/placeholder.svg?height=128&width=128&text=U"}
                alt="avatar"
                width={128}
                height={128}
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{user.username || "未登录"}</div>
            <div className="text-gray-400 text-base mb-2">0 Following</div>
            <div className="flex gap-3 mb-4">
              <Link href="/profile/edit">
                <Button variant="outline" className="border-[#3a1a44] text-white">Edit Profile</Button>
              </Link>
            </div>
          </div>

          {/* Free Plan 卡片 */}
          <div className="w-full bg-[#23202a] rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between">
            <Link href="/premium">
              <div className="bg-[#1a0a24] px-4 py-2 rounded-full text-white font-semibold mb-4 md:mb-0 cursor-pointer hover:bg-[#2a1a34] transition">
                Free Plan &gt;
              </div>
            </Link>
            <div className="flex-1 flex flex-wrap justify-between gap-6 text-white text-center">
              <div>
                <div className="text-lg font-semibold mb-1">Text reply</div>
                <div className="text-pink-400">50/50</div>
              </div>
              <div>
                <div className="text-lg font-semibold mb-1">Picture reply</div>
                <div className="text-pink-400">1/1</div>
              </div>
              <div>
                <div className="text-lg font-semibold mb-1">Voice reply</div>
                <div className="text-pink-400">3/3</div>
              </div>
              <div>
                <div className="text-lg font-semibold mb-1">Create Character</div>
                <div className="text-pink-400">1/1</div>
              </div>
              <div>
                <div className="text-lg font-semibold mb-1">Voice Call</div>
                <div className="text-pink-400">2min 0s</div>
              </div>
            </div>
          </div>

          {/* Tabs 区域 */}
          <div className="w-full">
            <div className="flex bg-[#23202a] rounded-xl overflow-hidden mb-6">
              <button className="flex-1 py-3 text-white bg-[#35313e]">All(0)</button>
              <button className="flex-1 py-3 text-gray-400">Private(0)</button>
              <button className="flex-1 py-3 text-gray-400">Public(0)</button>
            </div>
            <div className="flex flex-col items-center py-16">
              <Image src="/placeholder.svg?height=120&width=120&text=No+characters" alt="no characters" width={120} height={120} />
              <div className="text-gray-400 mt-4 text-lg">No characters here.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 