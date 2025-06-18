"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit3,
  Crown,
  MessageCircle,
  ImageIcon,
  Mic,
  Users,
  Phone,
  X,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from "react"

// User data interface
interface UserData {
  id: string
  name: string
  email: string
  avatarSrc: string
  followers: string
  following: string
  interactions: string
  description: string
  privateCharacters: Character[]
  publicCharacters: Character[]
  isPremium: boolean
  usageStats: {
    textReply: { current: number; limit: number }
    pictureReply: { current: number; limit: number }
    voiceReply: { current: number; limit: number }
    createCharacter: { current: number; limit: number }
    voiceCall: { current: string; limit: string }
  }
}

interface Character {
  id: string
  name: string
  tags: string[]
  description: string
  chatCount: string
  likeCount: string
  imageSrc: string
  creator: { id: string; name: string; likeCount: string }
  isPrivate: boolean
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [userData, setUserData] = React.useState<UserData | null>(null)
  const [editDescriptionOpen, setEditDescriptionOpen] = React.useState(false)
  const [userDescription, setUserDescription] = React.useState("")
  const [view, setView] = React.useState<"profile" | "creator">("profile")
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [userName, setUserName] = React.useState("")
  const [userAvatar, setUserAvatar] = React.useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [characterToDelete, setCharacterToDelete] = React.useState<Character | null>(null)

  // 检查用户登录状态并加载用户数据
  React.useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (typeof window !== "undefined") {
          const user = JSON.parse(localStorage.getItem("user") || '{}')
          const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
          
          if (!isLoggedIn || !user.email) {
            // 用户未登录，重定向到登录页
            router.push("/login")
            return
          }

          setIsAuthenticated(true)
          
          // 加载用户数据
          const loadedUserData = await loadUserData(user)
          setUserData(loadedUserData)
          setUserName(loadedUserData.name)
          setUserAvatar(loadedUserData.avatarSrc)
          setUserDescription(loadedUserData.description)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  // 从localStorage或API加载用户数据
  const loadUserData = async (user: any): Promise<UserData> => {
    // 首先尝试从localStorage加载保存的用户数据
    const savedUserData = localStorage.getItem(`userData_${user.email}`)
    
    if (savedUserData) {
      return JSON.parse(savedUserData)
    }

    // 如果没有保存的数据，创建默认数据结构
    const defaultUserData: UserData = {
      id: user.email,
      name: user.username || user.email.split('@')[0],
      email: user.email,
      avatarSrc: user.avatar || "/placeholder.svg?height=96&width=96&text=" + (user.username?.[0] || "U"),
      followers: "0",
      following: "0", 
      interactions: "0",
      description: "New user exploring the world of AI characters.",
      privateCharacters: [],
      publicCharacters: [],
      isPremium: false,
      usageStats: {
        textReply: { current: 0, limit: 50 },
        pictureReply: { current: 0, limit: 1 },
        voiceReply: { current: 0, limit: 3 },
        createCharacter: { current: 0, limit: 1 },
        voiceCall: { current: "0min", limit: "0s" }
      }
    }

    // 检查是否有用户创建的角色
    const userCharacters = JSON.parse(localStorage.getItem("userCharacters") || "[]")
    const userCreatedCharacters = userCharacters.filter((char: any) => char.creatorId === user.email)
    
    // 分类私密和公开角色
    defaultUserData.privateCharacters = userCreatedCharacters.filter((char: any) => char.isPrivate)
    defaultUserData.publicCharacters = userCreatedCharacters.filter((char: any) => !char.isPrivate)
    
    // 更新创建角色的使用统计
    defaultUserData.usageStats.createCharacter.current = userCreatedCharacters.length

    // 保存用户数据
    localStorage.setItem(`userData_${user.email}`, JSON.stringify(defaultUserData))
    
    return defaultUserData
  }

  // 保存用户数据
  const saveUserData = (updatedData: UserData) => {
    localStorage.setItem(`userData_${updatedData.email}`, JSON.stringify(updatedData))
    setUserData(updatedData)
  }

  // 登出功能
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUserAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditDescription = () => {
    if (userData) {
      const updatedData = { ...userData, description: userDescription }
      saveUserData(updatedData)
    }
    setEditDescriptionOpen(false)
  }

  const handleEditProfile = () => {
    if (userData) {
      const updatedData = { 
        ...userData, 
        name: userName, 
        avatarSrc: userAvatar 
      }
      saveUserData(updatedData)
      
      // 同时更新localStorage中的用户信息
      const user = JSON.parse(localStorage.getItem("user") || '{}')
      user.username = userName
      user.avatar = userAvatar
      localStorage.setItem("user", JSON.stringify(user))
    }
    setEditDialogOpen(false)
  }

  const handleDeleteCharacter = (character: Character) => {
    setCharacterToDelete(character)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCharacter = () => {
    if (characterToDelete && userData) {
      // 从用户数据中删除角色
      const updatedData = { ...userData }
      
      if (characterToDelete.isPrivate) {
        updatedData.privateCharacters = updatedData.privateCharacters.filter(
          (c) => c.id !== characterToDelete.id
        )
      } else {
        updatedData.publicCharacters = updatedData.publicCharacters.filter(
          (c) => c.id !== characterToDelete.id
        )
      }
      
      // 更新创建角色的使用统计
      updatedData.usageStats.createCharacter.current = 
        updatedData.privateCharacters.length + updatedData.publicCharacters.length
      
      saveUserData(updatedData)
      
      // 同时从全局角色列表中删除
      const allCharacters = JSON.parse(localStorage.getItem("userCharacters") || "[]")
      const filteredCharacters = allCharacters.filter((char: any) => char.id !== characterToDelete.id)
      localStorage.setItem("userCharacters", JSON.stringify(filteredCharacters))
    }
    
    setDeleteDialogOpen(false)
    setCharacterToDelete(null)
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a24] to-[#2a1a34] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // 如果未认证，不显示任何内容（会被重定向）
  if (!isAuthenticated || !userData) {
    return null
  }

  const usageStats = [
    {
      icon: MessageCircle,
      label: "Text reply",
      current: userData.usageStats.textReply.current,
      limit: userData.usageStats.textReply.limit,
      color: "text-green-400",
    },
    {
      icon: ImageIcon,
      label: "Picture reply",
      current: userData.usageStats.pictureReply.current,
      limit: userData.usageStats.pictureReply.limit,
      color: "text-blue-400",
    },
    {
      icon: Mic,
      label: "Voice reply",
      current: userData.usageStats.voiceReply.current,
      limit: userData.usageStats.voiceReply.limit,
      color: "text-purple-400",
    },
    {
      icon: Users,
      label: "Create Character",
      current: userData.usageStats.createCharacter.current,
      limit: userData.usageStats.createCharacter.limit,
      color: "text-orange-400",
    },
    {
      icon: Phone,
      label: "Voice Call",
      current: userData.usageStats.voiceCall.current,
      limit: userData.usageStats.voiceCall.limit,
      color: "text-pink-400",
      isTime: true,
    },
  ]

  const CharacterCard = ({ character, showActions = false }: { character: Character; showActions?: boolean }) => (
    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 group">
      <div className="relative aspect-[3/4]">
        <Image src={character.imageSrc || "/placeholder.svg"} alt={character.name} fill className="object-cover" />
        {character.isPrivate && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500/80 text-white text-xs">
              <EyeOff className="h-3 w-3 mr-1" />
              Private
            </Badge>
          </div>
        )}
        {!character.isPrivate && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500/80 text-white text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Public
            </Badge>
          </div>
        )}
        {showActions && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1a0a24] border-[#3a1a44] text-white">
                <DropdownMenuItem
                  className="hover:!bg-red-500/20 text-red-400"
                  onClick={() => handleDeleteCharacter(character)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-1">{character.name}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {character.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs bg-pink-500/20 text-pink-300 border-pink-500/30">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{character.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{character.chatCount} chats</span>
          <span>{character.likeCount} likes</span>
        </div>
      </div>
    </div>
  )

  // Creator Page View
  if (view === "creator") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a24] to-[#2a1a34]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setView("profile")}
              className="flex items-center space-x-2 text-white hover:text-pink-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Profile</span>
            </button>
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 text-green-300"
              >
                <Users className="h-3 w-3 mr-1" />
                My Creator Page
              </Badge>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-8">
            <div className="flex items-end">
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-pink-500 p-1 bg-gradient-to-r from-pink-500 to-purple-500 overflow-hidden">
                <div className="h-full w-full rounded-full overflow-hidden bg-gray-800">
                  <Image src={userAvatar || "/placeholder.svg"} alt={userName} fill className="object-cover" />
                </div>
              </div>
              <div className="ml-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{userName}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span>{userData.followers} Followers</span>
                  <span>{userData.following} Following</span>
                  <span>{userData.interactions} Interactions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button onClick={() => setEditDescriptionOpen(true)} className="bg-pink-500 hover:bg-pink-600 text-white">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Description */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-md mb-8">
            <p className="text-gray-300">{userDescription}</p>
          </div>

          {/* Characters Section */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-white/10 p-1 rounded-full border border-white/20">
                <TabsTrigger
                  value="all"
                  className="px-4 py-1.5 text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-300"
                >
                  All ({userData.privateCharacters.length + userData.publicCharacters.length})
                </TabsTrigger>
                <TabsTrigger
                  value="private"
                  className="px-4 py-1.5 text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-300"
                >
                  Private ({userData.privateCharacters.length})
                </TabsTrigger>
                <TabsTrigger
                  value="public"
                  className="px-4 py-1.5 text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-300"
                >
                  Public ({userData.publicCharacters.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...userData.privateCharacters, ...userData.publicCharacters].map((char) => (
                  <CharacterCard key={char.id} character={char} showActions={true} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="private">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userData.privateCharacters.map((char) => (
                  <CharacterCard key={char.id} character={char} showActions={true} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="public">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userData.publicCharacters.map((char) => (
                  <CharacterCard key={char.id} character={char} showActions={true} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Description Dialog for Creator Page */}
          <Dialog open={editDescriptionOpen} onOpenChange={setEditDescriptionOpen}>
            <DialogContent
              className="bg-gradient-to-br from-[#1a0a24] to-[#2a1a34] border-[#3a1a44] text-white sm:max-w-md p-0"
            >
              <div className="flex items-center justify-between p-6 pb-4">
                <DialogTitle className="text-xl font-bold text-white">Edit Profile</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditDescriptionOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="px-6 pb-6 space-y-6">
                <div>
                  <Label htmlFor="description" className="text-base font-medium text-white mb-3 block">
                    Profile Description
                  </Label>
                  <textarea
                    id="description"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    className="w-full bg-[#0e0314] border border-[#3a1a44] text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500 rounded-lg p-3 h-24 resize-none"
                    placeholder="Tell others about yourself..."
                  />
                </div>

                <Button
                  onClick={handleEditDescription}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-full text-base font-medium h-12"
                >
                  Update Description
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-[#1a0a24] border-[#3a1a44] text-white sm:max-w-md">
              <DialogTitle className="text-xl font-bold text-red-400">Delete Character</DialogTitle>
              <div className="text-gray-300 mb-4">
                Are you sure you want to delete "{characterToDelete?.name}"? This action cannot be undone.
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button onClick={confirmDeleteCharacter} className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a24] to-[#2a1a34]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-pink-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className={`${
                userData.isPremium 
                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300"
                  : "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300"
              }`}
            >
              <Crown className="h-3 w-3 mr-1" />
              {userData.isPremium ? "Premium" : "Free Plan"}
            </Badge>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <button onClick={() => setView("creator")} className="relative group">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-pink-500 to-purple-500 p-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-transform duration-200">
                <div className="h-full w-full rounded-full overflow-hidden bg-gray-800">
                  <Image
                    src={userAvatar || "/placeholder.svg"}
                    alt="Profile Avatar"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="text-white text-xs font-medium">View Creator Page</span>
              </div>
            </button>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-black"></div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{userName}</h1>
          <p className="text-gray-400 mb-4">{userData.following} Following</p>

          <Button
            onClick={() => setEditDialogOpen(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Usage Statistics */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Usage Statistics</h2>
              {!userData.isPremium && (
                <Link href="/premium" className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
                  Upgrade Plan →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usageStats.map((stat, index) => {
                const Icon = stat.icon
                const isAtLimit = stat.isTime ? false : stat.current >= stat.limit

                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                        <span className="text-white text-sm font-medium">{stat.label}</span>
                      </div>
                      {isAtLimit && (
                        <Badge className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-300 text-xs px-2 py-1">
                          ⚠️ Limit
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${stat.color}`}>{stat.current}</span>
                        <span className="text-gray-400 text-sm">/ {stat.limit}</span>
                      </div>

                      {!stat.isTime && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              isAtLimit ? "from-red-500 to-orange-500" : "from-pink-500 to-purple-500"
                            }`}
                            style={{ width: `${Math.min((Number(stat.current) / Number(stat.limit)) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Characters Section */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  All ({userData.privateCharacters.length + userData.publicCharacters.length})
                </TabsTrigger>
                <TabsTrigger value="private" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Private ({userData.privateCharacters.length})
                </TabsTrigger>
                <TabsTrigger value="public" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Public ({userData.publicCharacters.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {userData.privateCharacters.length + userData.publicCharacters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...userData.privateCharacters, ...userData.publicCharacters].map((char) => (
                      <CharacterCard key={char.id} character={char} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      <Users className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No characters here</h3>
                    <p className="text-gray-400 mb-6">Create your first AI character to get started</p>
                    <Link href="/create-lover">
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Create Character
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="private" className="mt-6">
                {userData.privateCharacters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.privateCharacters.map((char) => (
                      <CharacterCard key={char.id} character={char} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      <EyeOff className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No private characters</h3>
                    <p className="text-gray-400">Your private characters will appear here</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="public" className="mt-6">
                {userData.publicCharacters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.publicCharacters.map((char) => (
                      <CharacterCard key={char.id} character={char} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      <Eye className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No public characters</h3>
                    <p className="text-gray-400">Your public characters will appear here</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="bg-gradient-to-br from-[#1a0a24] to-[#2a1a34] border-[#3a1a44] text-white sm:max-w-md p-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <DialogTitle className="text-xl font-bold text-white">My Profile</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditDialogOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-6">Update profile picture</h3>
              <div className="relative inline-block mb-4">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-pink-500 p-1 bg-gradient-to-r from-pink-500 to-purple-500">
                  <div className="h-full w-full rounded-full overflow-hidden bg-gray-800">
                    <Image
                      src={userAvatar || "/placeholder.svg"}
                      alt="Profile Avatar"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-4 py-2 text-sm"
                >
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload new photo
                  </label>
                </Button>
              </div>
            </div>

            {/* Username Section */}
            <div>
              <Label htmlFor="username" className="text-base font-medium text-white mb-3 block">
                Username
              </Label>
              <Input
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-[#0e0314] border border-[#3a1a44] text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                placeholder="Enter your username"
              />
            </div>

            <Button
              onClick={handleEditProfile}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-full text-base font-medium h-12"
            >
              Update Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 