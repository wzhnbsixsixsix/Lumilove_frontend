"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default function ChatIndexPage() {
  const router = useRouter()

  // Mock data for recent chats
  const recentChats = [
    {
      id: 1,
      name: "Ethan",
      occupation: "Swimmer",
      lastMessage: "He chuckles softly...",
      imageSrc: "/placeholder.svg?height=50&width=50&text=E",
      timestamp: "15:30",
      unread: true,
    },
    {
      id: 2,
      name: "Alexander",
      occupation: "Businessman",
      lastMessage: "I've been thinking about you...",
      imageSrc: "alexander_avatar.png",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: "Jake",
      occupation: "Plumber",
      lastMessage: "Want to meet tonight?",
      imageSrc: "/placeholder.svg?height=50&width=50&text=J",
      timestamp: "Monday",
      unread: false,
    },
  ]

  // Redirect to the first chat if available
  useEffect(() => {
    if (recentChats.length > 0) {
      router.push(`/chat/${recentChats[0].id}`)
    }
  }, [router])

  // This page will automatically redirect to the first chat
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center h-screen bg-[#0e0314]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your conversations...</p>
        </div>
      </div>
    </div>
  )
}
