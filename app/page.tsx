"use client"

import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import Sidebar from "@/components/sidebar"
import CharacterCard from "@/components/character-card"
import TrendingList from "@/components/trending-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { buildApiUrl, API_CONFIG } from "@/lib/config"
import { 
  getCharacterById, 
  getCharacterAvatar, 
  getCharacterName,
  getCharacters,
  getTrendingCharacters,
  getRecentChatCharacters,
  getFilterTags,
  type Character
} from "@/lib/characters"

interface User {
  username: string;
  email: string;
  avatar?: string;
}

// 删除重复的标签映射和过滤标签定义，现在从 lib/characters.ts 中导入

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeGender, setActiveGender] = useState<'guys' | 'girls'>('guys')
  const [activeTag, setActiveTag] = useState("For You")

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      console.log('Auth check - Token:', token)
      
      if (token && userData) {
        try {
          const tokenValue = `Bearer ${token}`;
          console.log('Sending token:', tokenValue)
          
          const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY), {
            method: 'GET',
            headers: {
              'Authorization': tokenValue,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
              'X-Title': 'Lumilove',
            },
            credentials: 'include'
          })
          
          console.log('Verify response status:', response.status)
          const responseText = await response.text()
          console.log('Verify response body:', responseText)
          
          if (response.ok) {
            console.log('Token verification successful')
            setIsLoggedIn(true)
            setUser(JSON.parse(userData))
          } else {
            console.log('Token verification failed, clearing auth data')
            handleLogout()
          }
        } catch (error) {
          console.error('Token verification error:', error)
          handleLogout()
        }
      } else {
        console.log('No token or user data found')
        setIsLoggedIn(false)
        setUser(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    console.log('Logging out, clearing auth data')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // 使用新的数据管理系统获取角色
  const characterData = getCharacters({
    gender: activeGender === "guys" ? "male" : "female",
    activeTag: activeTag,
    pageSize: 20 // 增加页面大小以显示更多角色
  })
  
  const filteredCharacters = characterData.characters

  // 使用新的数据管理系统获取趋势角色
  const trendingCharacters = getTrendingCharacters('male', 5)
  const trendingFemaleCharacters = getTrendingCharacters('female', 5)

  // 使用新的数据管理系统获取最近聊天角色
  const recentChatCharacters = getRecentChatCharacters(3)
  const hasRecentChats = recentChatCharacters.length > 0

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="px-2 py-6">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search characters..."
                className="w-full pl-10 pr-4 py-2 bg-[#1a0a24] border border-[#3a1a44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex items-center gap-4">
              {/* Free Plan 按钮 - 根据登录状态显示不同行为 */}
              <Link href={isLoggedIn ? "/profile" : "/login"}>
                <div className="flex items-center space-x-2 bg-[#1a0a24] px-3 py-1 rounded-full text-sm hover:bg-[#2a1a34] transition-colors cursor-pointer">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    {isLoggedIn ? (
                      <Image src={user?.avatar || "/placeholder.svg?height=128&width=128&text=U"} alt="User" width={32} height={32} />
                    ) : (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-300">?</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#2a1a34] px-3 py-1 rounded-full text-sm">Free Plan ↗</div>
                </div>
              </Link>
              {isLoggedIn ? (
                <>
                  <span className="text-white">Welcome, {user?.username}</span>
                  <Button
                    onClick={handleLogout}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Recent Chats Section (only shown if user has recent chats) */}
          {hasRecentChats && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Recent chat</h2>
              <div className="flex space-x-5">
                {recentChatCharacters.map((character) => (
                  <Link href={`/chat/${character.id}`} key={character.id} className="text-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-pink-500">
                      <Image
                        src={character.avatarSrc}
                        alt={character.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-base">{character.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hero Banner */}
          <div className="relative rounded-xl overflow-hidden mb-8 gradient-bg">
            <div className="flex flex-col md:flex-row items-center p-3 md:p-5">
              <div className="md:w-1/2 mb-3 md:mb-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Welcome to the #1 Playground for Naughty AI Lovers</h2>
                <p className="text-gray-300 mb-3 max-w-lg text-sm">
                  Dive into a world of seductive characters, NSFW secrets, and intimate roleplays.
                  Explore spicy photo packs, tease them, train them, or let them take control.
                </p>
                <Link href="/create-lover">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 h-auto rounded-full text-sm">
                    <span className="mr-2">+</span> START CREATING NOW
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 relative h-28 md:h-40 overflow-hidden rounded-lg">
                <div className="grid grid-cols-3 gap-1 h-full">
                  {[
                    "/male/male_01.png",
                    "/female/female01.png", 
                    "/male/male_02.png",
                    "/female/female_02.png",
                    "/male/male_03.png", 
                    "/female/female_03.jpg"
                  ].map((imagePath, i) => (
                    <div key={i} className="overflow-hidden rounded-md">
                      <Image
                        src={imagePath}
                        alt={`AI character ${i + 1}`}
                        width={60}
                        height={80}
                        className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gender Tabs */}
          <Tabs
            defaultValue="guys"
            className="mb-6"
            onValueChange={(value) => setActiveGender(value as "guys" | "girls")}
          >
            <TabsList className="bg-[#1a0a24] p-1 rounded-full w-fit">
              <TabsTrigger value="girls" className="rounded-full px-8 py-2.5 text-base data-[state=active]:bg-pink-500">
                👩 Female
              </TabsTrigger>
              <TabsTrigger value="guys" className="rounded-full px-8 py-2.5 text-base data-[state=active]:bg-pink-500">
                🧑‍🦱 Male
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Tags */}
          <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <div className="flex space-x-3">
              {getFilterTags(activeGender === "guys" ? "male" : "female").map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant={tag === activeTag ? "default" : "outline"}
                  className={`whitespace-nowrap px-5 py-2.5 text-base rounded-full cursor-pointer ${
                    tag === activeTag ? "bg-pink-500 hover:bg-pink-600" : "bg-[#1a0a24] hover:bg-[#2a1a34]"
                  }`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag === "For You" && <span className="mr-1">⭐</span>}
                  {tag === "Popular" && <span className="mr-1">🔥</span>}
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Character Cards */}
            <div className="md:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCharacters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            </div>

            {/* Trending Sidebar */}
            <div className="md:w-1/4">
              <TrendingList characters={activeGender === "guys" ? trendingCharacters : trendingFemaleCharacters} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
