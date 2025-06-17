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

// 创作者数据
const creatorsData = {
  "mei-chan": {
    id: "mei-chan",
    name: "Mei chan",
    avatarSrc: "/avatar/female_01_avatar.png",
    bannerSrc: "/placeholder.svg?height=300&width=1200",
    followers: "18503",
    following: "195",
    interactions: "89.7M",
    description: "In my home you will get stories. No taming, characters humiliation, or gender degradation here. My stories aim to stir emotions and feelings, usually through slow-burn narratives or conflicted settings. If you want her, you'll have to fight for her. I prefer strong, humanized female characters I can relate to.",
    socialLinks: [
      { platform: "tiktok", url: "#" },
      { platform: "twitter", url: "#" },
      { platform: "discord", url: "#" },
      { platform: "website", url: "#" },
    ],
    characters: [
      {
        id: 1,
        name: "Emily",
        tags: ["👧 Sweet", "💕 Romantic"],
        description: "A sweet college student who dreams of becoming a writer...",
        chatCount: "45.2K",
        likeCount: "23.1K",
        imageSrc: "/female/female01.png",
      },
      {
        id: 2,
        name: "Sarah",
        tags: ["🎮 Gamer", "🤓 Nerdy"],
        description: "Your gamer girl next door with a competitive streak...",
        chatCount: "38.7K",
        likeCount: "19.5K",
        imageSrc: "/female/female_02.png",
      },
      {
        id: 3,
        name: "Lily",
        tags: ["🎨 Artist", "🌸 Gentle"],
        description: "A gentle soul who expresses herself through art...",
        chatCount: "35.4K",
        likeCount: "17.8K",
        imageSrc: "/female/female_03.jpg",
      },
      {
        id: 4,
        name: "Isabella",
        tags: ["💃 Dancer", "✨ Energetic"],
        description: "A passionate dancer who lights up any room...",
        chatCount: "42.1K",
        likeCount: "21.3K",
        imageSrc: "/female/female_04.png",
      },
      {
        id: 8,
        name: "Sophia",
        tags: ["👩‍⚕️ Doctor", "💪 Brave"],
        description: "A dedicated doctor who saves lives by day and has a secret wild side...",
        chatCount: "31.7K",
        likeCount: "204",
        imageSrc: "/female/female_05.png",
      },
      {
        id: 9,
        name: "Luna",
        tags: ["🎨 Artist", "🌙 Mysterious"],
        description: "A free-spirited artist who paints with passion...",
        chatCount: "12.5K",
        likeCount: "193",
        imageSrc: "/female/female_06.png",
      },
      {
        id: 10,
        name: "Victoria",
        tags: ["👩‍⚖️ Lawyer", "💼 Professional"],
        description: "A powerful attorney who never loses a case...",
        chatCount: "27.9K",
        likeCount: "204",
        imageSrc: "/female/female_07.png",
      },
      {
        id: 11,
        name: "Emma",
        tags: ["👩‍🏫 Teacher", "💝 Caring"],
        description: "A sweet kindergarten teacher with a hidden naughty side...",
        chatCount: "15.8K",
        likeCount: "193",
        imageSrc: "/female/female_08.png",
      },
      {
        id: 12,
        name: "Olivia",
        tags: ["🎵 Singer", "🌟 Charming"],
        description: "An aspiring singer with a voice that touches hearts...",
        chatCount: "33.2K",
        likeCount: "16.7K",
        imageSrc: "/female/female_09.png",
      }
    ]
  },
  "alexmaster": {
    id: "alexmaster",
    name: "AlexMaster",
    avatarSrc: "/avatar/male_02_avatar.png",
    bannerSrc: "/placeholder.svg?height=300&width=1200",
    followers: "25678",
    following: "156",
    interactions: "120.3M",
    description: "Specializing in creating strong, dominant male characters with complex personalities. My characters are more than just their strength - they have depth, vulnerabilities, and compelling backstories that make them truly unforgettable.",
    socialLinks: [
      { platform: "twitter", url: "#" },
      { platform: "discord", url: "#" },
    ],
    characters: [
      {
        id: 5,
        name: "Alexander",
        tags: ["💪 Alpha", "👔 CEO"],
        description: "A powerful CEO who commands respect in the boardroom...",
        chatCount: "67.8K",
        likeCount: "34.2K",
        imageSrc: "/male/male_01.png",
      },
      {
        id: 13,
        name: "Dominic",
        tags: ["🕴️ Mafia Boss", "🌙 Mysterious"],
        description: "A dangerous man with a soft spot for you. He rules the underworld...",
        chatCount: "45.2K",
        likeCount: "13.0K",
        imageSrc: "/male/male_04.png",
      },
      {
        id: 16,
        name: "Gabriel",
        tags: ["👮 Police", "🛡️ Protective"],
        description: "A dedicated cop who breaks all his own rules for you...",
        chatCount: "19.8K",
        likeCount: "13.0K",
        imageSrc: "/male/male_7.png.png",
      }
    ]
  },
  "nightstalker": {
    id: "nightstalker",
    name: "NightStalker",
    avatarSrc: "/avatar/male_02_avatar.png",
    bannerSrc: "/placeholder.svg?height=300&width=1200",
    followers: "19234",
    following: "178",
    interactions: "95.6M",
    description: "Creating gentle, caring male characters who show that true strength lies in kindness. My characters prove that you don't need to be dominant to be attractive - sometimes the softest hearts make the strongest connections.",
    socialLinks: [
      { platform: "twitter", url: "#" },
      { platform: "discord", url: "#" },
    ],
    characters: [
      {
        id: 6,
        name: "Jake",
        tags: ["📚 Writer", "🎭 Artistic"],
        description: "A sensitive writer who sees the beauty in everything...",
        chatCount: "28.7K",
        likeCount: "9.5K",
        imageSrc: "/male/male_02.png",
      },
      {
        id: 14,
        name: "Marcus",
        tags: ["👨‍⚕️ Doctor", "💖 Caring"],
        description: "A brilliant surgeon who saves lives. His gentle touch heals...",
        chatCount: "28.7K",
        likeCount: "9.5K",
        imageSrc: "/male/male_05.png",
      },
      {
        id: 17,
        name: "Kai",
        tags: ["👨‍🍳 Chef", "😊 Playful"],
        description: "A talented chef who cooks with passion...",
        chatCount: "22.4K",
        likeCount: "9.5K",
        imageSrc: "/male/male_8.png.png",
      }
    ]
  },
  "roadrebel": {
    id: "roadrebel",
    name: "RoadRebel",
    avatarSrc: "/avatar/male_02_avatar.png",
    bannerSrc: "/placeholder.svg?height=300&width=1200",
    followers: "17856",
    following: "143",
    interactions: "82.4M",
    description: "Adventure and excitement are at the heart of my characters. From musicians to entrepreneurs, each character brings their own brand of thrill to your story. Get ready for a wild ride with personalities that never play it safe.",
    socialLinks: [
      { platform: "twitter", url: "#" },
      { platform: "discord", url: "#" },
    ],
    characters: [
      {
        id: 7,
        name: "Ethan",
        tags: ["🏍️ Biker", "🌟 Rebel"],
        description: "A free-spirited biker who lives life on his own terms...",
        chatCount: "33.1K",
        likeCount: "7.6K",
        imageSrc: "/male/male_03.png",
      },
      {
        id: 15,
        name: "Ryan",
        tags: ["🎸 Musician", "😈 Badboy"],
        description: "A rockstar whose music speaks to your soul...",
        chatCount: "33.1K",
        likeCount: "7.6K",
        imageSrc: "/male/male_06.png",
      },
      {
        id: 18,
        name: "Xavier",
        tags: ["💰 Billionaire", "🧊 Cold"],
        description: "A tech mogul with a cold exterior but a burning desire...",
        chatCount: "41.6K",
        likeCount: "7.6K",
        imageSrc: "/male/male_9.png.png",
      }
    ]
  }
}

export default function CreatorProfilePage({ params }: { params: { creatorId: string } }) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // 根据creatorId获取创作者数据
  const creatorData = React.useMemo(() => {
    return creatorsData[params.creatorId as keyof typeof creatorsData] || null
  }, [params.creatorId])

  const shareUrl = React.useMemo(() => {
    return `https://lumilove.com/creator/${params.creatorId}`
  }, [params.creatorId])

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
            <div className="flex gap-2 mt-4 md:mt-0">
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
          <Tabs defaultValue="characters">
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
              <div className="flex gap-2">
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