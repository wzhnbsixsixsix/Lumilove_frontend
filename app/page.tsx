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

interface User {
  username: string;
  email: string;
  avatar?: string;
}

export default function Home() {
  const [activeGender, setActiveGender] = useState<"guys" | "girls">("guys")
  const [activeTag, setActiveTag] = useState("For You")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
              'Content-Type': 'application/json'
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

  // explore的图片就放这里
  const maleCharacters = [
    {
      id: 1,
      name: "Alexander",
      occupation: "Businessman",
      tags: ["Alpha", "Mature"],
      description: "The successful CEO who knows what he wants. Will you be his next conquest?",
      chatCount: "1.4M",
      imageSrc: "/alexander_pic1.png",
    },
    {
      id: 2,
      name: "Jake",
      occupation: "Plumber",
      tags: ["Playful", "Adventurous"],
      description: "The handsome plumber with a playful side. He's ready to fix more than just your pipes.",
      chatCount: "3.9K",
      imageSrc: "/male/male_02.png",
    },
    {
      id: 3,
      name: "Ethan",
      occupation: "Swimmer",
      tags: ["Athletic", "Mysterious"],
      description:
        "The talented swimmer who dominates the competition. But you're the only one who knows about your secret romance.",
      chatCount: "1.7K",
      imageSrc: "/male/male_03.png",
    },
    {
      id: 13,
      name: "Dominic",
      occupation: "Mafia Boss",
      tags: ["Alpha", "Mysterious", "Anti-Hero"],
      description: "A dangerous man with a soft spot for you. He rules the underworld, but you rule his heart.",
      chatCount: "45.2K",
      imageSrc: "/male/male_04.png",
    },
    {
      id: 14,
      name: "Marcus",
      occupation: "Doctor",
      tags: ["Gentle", "Mature", "Caring"],
      description: "A brilliant surgeon who saves lives. His gentle touch heals more than just physical wounds.",
      chatCount: "28.7K",
      imageSrc: "/male/male_05.png",
    },
    {
      id: 15,
      name: "Ryan",
      occupation: "Musician",
      tags: ["Badboy", "Witty", "Adventurous"],
      description: "A rockstar whose music speaks to your soul. Every song he writes is inspired by you.",
      chatCount: "33.1K",
      imageSrc: "/male/male_06.png",
    },
    {
      id: 16,
      name: "Gabriel",
      occupation: "Police Officer",
      tags: ["Protective", "Alpha", "Mysterious"],
      description: "A dedicated cop who breaks all his own rules for you. He'll protect you from anything, even himself.",
      chatCount: "19.8K",
      imageSrc: "/male/male_7.png.png",
    },
    {
      id: 17,
      name: "Kai",
      occupation: "Chef",
      tags: ["Playful", "Gentle", "Witty"],
      description: "A talented chef who cooks with passion. He knows the way to your heart is through your stomach.",
      chatCount: "22.4K",
      imageSrc: "/male/male_8.png.png",
    },
    {
      id: 18,
      name: "Xavier",
      occupation: "Billionaire",
      tags: ["Billionaire", "Cold Exterior", "Mature"],
      description: "A tech mogul with a cold exterior but a burning desire for you. Money can't buy what he truly wants.",
      chatCount: "41.6K",
      imageSrc: "/male/male_9.png.png",
    },
  ]

  // Mock data for female characters
  const femaleCharacters = [
    {
      id: 4,
      name: "Rhonda",
      occupation: "Entrepreneur",
      tags: ["Elegant", "Mature"],
      description:
        "A fierce and flirty entrepreneur, Rhonda sees you as her perfect partner in both business and pleasure.",
      chatCount: "22.2K",
      imageSrc: "/female/female01.png",
    },
    {
      id: 5,
      name: "Makenzie",
      occupation: "Student",
      tags: ["Girl-Next-Door", "Innocent"],
      description: "A shy and repressed girl, hiding her deep attraction to you while trying to fit in.",
      chatCount: "24.1K",
      imageSrc: "/female/female_02.png",
    },
    {
      id: 6,
      name: "Anshu",
      occupation: "Housewife",
      tags: ["Girl-Next-Door", "Playful", "Seductive"],
      description: "A reserved mother with a hidden perverted side, she will do anything to satisfy your desires.",
      chatCount: "7.0K",
      imageSrc: "/female/female_03.jpg",
    },
    {
      id: 7,
      name: "Isabella",
      occupation: "Fashion Designer",
      tags: ["Elegant", "Independent", "Smart"],
      description: "A brilliant fashion designer with an eye for perfection. She knows what she wants and isn't afraid to take it.",
      chatCount: "18.3K",
      imageSrc: "/female/female_04.png",
    },
    {
      id: 8,
      name: "Sophia",
      occupation: "Doctor",
      tags: ["Caring", "Smart", "Brave"],
      description: "A dedicated doctor who saves lives by day and has a secret wild side that only you get to discover.",
      chatCount: "31.7K",
      imageSrc: "/female/female_05.png",
    },
    {
      id: 9,
      name: "Luna",
      occupation: "Artist",
      tags: ["Mysterious", "Playful", "Smart"],
      description: "A free-spirited artist who paints with passion. Her creativity extends beyond the canvas into every aspect of her life.",
      chatCount: "12.5K",
      imageSrc: "/female/female_06.png",
    },
    {
      id: 10,
      name: "Victoria",
      occupation: "Lawyer",
      tags: ["Independent", "Smart", "Seductive"],
      description: "A powerful attorney who never loses a case. She's used to being in control, but will you be the exception?",
      chatCount: "27.9K",
      imageSrc: "/female/female_07.png",
    },
    {
      id: 11,
      name: "Emma",
      occupation: "Teacher",
      tags: ["Nurturing", "Girl-Next-Door", "Caring"],
      description: "A sweet kindergarten teacher with a hidden naughty side. She's always ready to teach you new things.",
      chatCount: "15.8K",
      imageSrc: "/female/female_08.png",
    },
    {
      id: 12,
      name: "Aria",
      occupation: "Dancer",
      tags: ["Elegant", "Seductive", "Playful"],
      description: "A professional ballet dancer whose moves are as mesmerizing off the stage as they are on. Every gesture tells a story.",
      chatCount: "20.4K",
      imageSrc: "/female/female_09.png",
    },
  ]

  // Filter characters based on active gender and tag
  const characters = activeGender === "guys" ? maleCharacters : femaleCharacters
  const filteredCharacters =
    activeTag === "For You" ? characters : characters.filter((char) => char.tags.includes(activeTag)) 

  // Mock data for trending characters
  //trending的图片就放这里
  const trendingCharacters = [
    { id: 1, name: "Alexander", occupation: "Businessman", rank: 1, imageSrc: "/avatar/alexander_avatar.png" },
    { id: 2, name: "Dominic", occupation: "Mafia", rank: 2, imageSrc: "/avatar/female_03_avatar.png" },
    { id: 3, name: "Ethan Blake", occupation: "Actor", rank: 3, imageSrc: "/avatar/female_04_avatar.png" },
    { id: 4, name: "Gray", occupation: "Businessman", rank: 4, imageSrc: "/avatar/female_01_avatar.png" },
    { id: 5, name: "Alex Starlight", occupation: "Musician", rank: 5, imageSrc: "/avatar/female_02_avatar.png" },
  ]

  // Mock data for trending female characters
  const trendingFemaleCharacters = [
    { id: 4, name: "Price", occupation: "Model", rank: 1, imageSrc: "/avatar/alexander_avatar.png" },
    { id: 5, name: "Kie", occupation: "Dancer", rank: 2, imageSrc: "/avatar/female_03_avatar.png" },
    {
      id: 6,
      name: "Yumi Yamamoto",
      occupation: "Student",
      rank: 3,
      imageSrc: "/avatar/female_04_avatar.png",
    },
    { id: 7, name: "Aynaz", occupation: "Artist", rank: 4, imageSrc: "/avatar/female_01_avatar.png" },
    { id: 8, name: "Joyce", occupation: "Teacher", rank: 5, imageSrc: "/avatar/female_02_avatar.png" },
  ]

  // Filter tags
  const maleFilterTags = [
    "For You",
    "Popular",
    "Alpha",
    "Mysterious",
    "Adventurous",
    "Anti-Hero",
    "Mafia",
    "Cold Exterior",
    "Witty",
    "Werewolf",
    "Billionaire",
    "Badboy",
    "Mature",
    "Gentle",
  ]

  const femaleFilterTags = [
    "For You",
    "Popular",
    "Mysterious",
    "Girl-Next-Door",
    "Independent",
    "Playful",
    "Smart",
    "Caring",
    "Brave",
    "Elegant",
    "Nurturing",
    "Teacher",
    "Nurse",
    "Cheerleader",
    "Lawyer",
    "Seductive",
  ]

  // Mock data for recent chats (only shown if there are any)
  const recentChats = [
    {
      id: 1,
      name: "Ethan",
      imageSrc: "/avatar/female_03_avatar.png",
    },
    {
      id: 5,
      name: "Makenzie",
      imageSrc: "/avatar/female_04_avatar.png",
    },
    {
      id: 2,
      name: "Alexander",
      imageSrc: "/avatar/alexander_avatar.png",//首页explore的recent chat的头像
    },
  ]

  // Determine if we should show recent chats (in a real app, this would be based on user data)
  const hasRecentChats = recentChats.length > 0

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
              <Link href="/profile">
                <div className="flex items-center space-x-2 bg-[#1a0a24] px-3 py-1 rounded-full text-sm hover:bg-[#2a1a34] transition-colors cursor-pointer">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <Image src={user?.avatar || "/placeholder.svg?height=128&width=128&text=U"} alt="User" width={32} height={32} />
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
                {recentChats.map((chat) => (
                  <Link href={`/chat/${chat.id}`} key={chat.id} className="text-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-pink-500">
                      <Image
                        src={chat.imageSrc || "/placeholder.svg"}
                        alt={chat.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-base">{chat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hero Banner */}
          <div className="relative rounded-xl overflow-hidden mb-8 gradient-bg">
            <div className="flex flex-col md:flex-row items-center p-6 md:p-10">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Create Your Ideal AI Lover</h2>
                <p className="text-gray-300 mb-6 max-w-lg text-lg">
                  Start creating your ideal AI lover today! Customize every detail, bring them to life, and dive into
                  unforgettable stories together.
                </p>
                <Link href="/create">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 h-auto rounded-full text-lg">
                    <span className="mr-2">+</span> START CREATING NOW
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 relative h-56 md:h-80 overflow-hidden rounded-lg">
                <div className="grid grid-cols-3 gap-2 h-full">
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
                        width={120}
                        height={160}
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
                👧 Girls
              </TabsTrigger>
              <TabsTrigger value="guys" className="rounded-full px-8 py-2.5 text-base data-[state=active]:bg-pink-500">
                👦 Guys
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Tags */}
          <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <div className="flex space-x-3">
              {(activeGender === "guys" ? maleFilterTags : femaleFilterTags).map((tag, index) => (
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
