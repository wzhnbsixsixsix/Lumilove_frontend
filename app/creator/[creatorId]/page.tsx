"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, UserPlus, Settings, Filter, Share2 } from "lucide-react"
import Sidebar from "@/components/sidebar"
import CharacterCard from "@/components/character-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import React from "react"

// Mock Creator Data (replace with actual data fetching)
const mockCreatorData = {
  id: "mei-chan",
  name: "Mei chan",
  avatarSrc: "/placeholder.svg?height=128&width=128&text=MC",
  bannerSrc: "/placeholder.svg?height=300&width=1200",
  followers: "18503",
  following: "195",
  interactions: "89.7M",
  description:
    "In my home you will get stories. No taming, characters humiliation, or gender degradation here. My stories aim to stir emotions and feelings, usually through slow-burn narratives or conflicted settings. If you want her, you'll have to fight for her. I prefer strong, humanized female characters I can relate to.",
  socialLinks: [
    { platform: "tiktok", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "discord", url: "#" },
    { platform: "website", url: "#" },
  ],
  characters: [
    {
      id: 10,
      name: "Embrace of forgiveness",
      tags: ["👧 FemalePOV", "🤫 Cheating"],
      description: "Five years ago, Maddie betrayed you on the fateful...",
      chatCount: "23.1K",
      likeCount: "12.5K",
      imageSrc: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 11,
      name: "Blake Devis - Out of time",
      tags: ["👧 FemalePOV", "🤫 Cheating"],
      description: "曲折、困难、女性角色驱动、浪漫模式...",
      chatCount: "30.1K",
      likeCount: "15.2K",
      imageSrc: "/placeholder.svg?height=400&width=300",
    },
  ],
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = await params;

  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // 在实际应用中，这里应该根据 creatorId 获取数据
  const creatorData = React.useMemo(() => {
    // 这里可以添加数据获取逻辑
    return mockCreatorData
  }, [creatorId])

  const shareUrl = React.useMemo(() => {
    return `https://lumilove.com/creator/${creatorId}`
  }, [creatorId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!creatorData) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-xl text-gray-400">Creator not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#0e0314]">
        {/* Header with back button */}
        <div className="p-4 flex items-center">
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34] text-white mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="px-6 pt-2 pb-6">
          <div className="flex flex-col md:flex-row items-end justify-between">
            <div className="flex items-end">
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-[#0e0314] overflow-hidden bg-gray-600">
                <Image
                  src={creatorData.avatarSrc || "/placeholder.svg"}
                  alt={creatorData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{creatorData.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span>{creatorData.followers} Followers</span>
                  <span>{creatorData.following} Following</span>
                  <span>{creatorData.interactions} Interactions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <UserPlus className="h-4 w-4 mr-2" /> Follow
              </Button>
              <Button
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="bg-[#1a0a24] rounded-xl p-6 border border-[#3a1a44] mb-6">
            <p className="text-gray-300 mb-4">{creatorData.description}</p>
          </div>

          {/* Character Tabs */}
          <Tabs defaultValue="characters" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-[#1a0a24] p-1 rounded-full border border-[#3a1a44]">
                <TabsTrigger
                  value="characters"
                  className="px-4 py-1.5 text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-300"
                >
                  Characters
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="px-4 py-1.5 text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-300"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="collections"
                  className="px-4 py-1.5 text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-300"
                >
                  Collections
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34] text-sm text-gray-300"
                    >
                      <Filter className="h-3.5 w-3.5 mr-1.5" /> All Genders
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a0a24] border-[#3a1a44] text-white">
                    <DropdownMenuItem className="hover:!bg-[#2a1a34]">🧑‍🦱 Male</DropdownMenuItem>
                    <DropdownMenuItem className="hover:!bg-[#2a1a34]">👩 Female</DropdownMenuItem>
                    <DropdownMenuItem className="hover:!bg-[#2a1a34]">🌈 Non-Binary</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34] text-sm text-gray-300"
                    >
                      <Settings className="h-3.5 w-3.5 mr-1.5" /> Sort by: Newest
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a0a24] border-[#3a1a44] text-white">
                    <DropdownMenuItem className="hover:!bg-[#2a1a34]">Newest</DropdownMenuItem>
                    <DropdownMenuItem className="hover:!bg-[#2a1a34]">Most Popular</DropdownMenuItem>
                    <DropdownMenuItem className="hover:!bg-[#2a1a34]">Most Liked</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <TabsContent value="characters">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {creatorData.characters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={{
                      ...char,
                      creator: {
                        id: creatorData.id,
                        name: creatorData.name,
                        likeCount: creatorData.followers
                      }
                    }}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="posts">
              <div className="text-center py-10 text-gray-400">
                <p className="text-xl">No posts yet.</p>
              </div>
            </TabsContent>
            <TabsContent value="collections">
              <div className="text-center py-10 text-gray-400">
                <p className="text-xl">No collections yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="bg-[#1a0a24] border-[#3a1a44] text-white sm:max-w-md">
            <DialogTitle className="text-xl font-bold">分享个人资料</DialogTitle>
            <DialogDescription className="text-gray-300">您可以与朋友分享链接。</DialogDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="flex-1 bg-[#0e0314] rounded-md p-2 overflow-hidden">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-gray-300"
                />
              </div>
              <Button onClick={copyToClipboard} className="bg-purple-600 hover:bg-purple-700 text-white">
                {copied ? "已复制" : "复制"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 