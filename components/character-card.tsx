"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export interface Character {
  id: number
  name: string
  description: string
  chatCount: string
  likeCount: string
  imageSrc: string
  altImageSrc?: string // 新增：悬停时显示的第二张图
  tags: string[]
  creator: {
    id: string
    name: string
    likeCount: string
  }
}

export default function CharacterCard({ character }: { character: Character }) {
  const [isHovered, setIsHovered] = useState(false)
  const creatorName = character?.creator?.name || ''
  const creatorLikeCount = character?.creator?.likeCount || '0'

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-[#1a0a24] border border-[#3a1a44] transition-all duration-300 hover:scale-[1.03] shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 图片区域，支持主图+悬浮副图 */}
      <Link href={`/chat/${character.id}`}>
        <div className="relative aspect-[3/4]">
          {/* 主图（默认显示，悬停时渐隐） */}
          <Image
            src={character.imageSrc || "/placeholder.svg"}
            alt={character.name}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isHovered && character.altImageSrc ? "opacity-0" : "opacity-100"
            }`}
            priority
          />
          {/* 副图（有altImageSrc时，悬停渐显） */}
          {character.altImageSrc && (
            <Image
              src={character.altImageSrc}
              alt={`${character.name} alt`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
          )}
          {/* 左下角数据 */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-2">
            <div className="bg-black/60 rounded-full px-2 py-0.5 text-xs text-white">
              {character.chatCount}
            </div>
            <div className="bg-black/60 rounded-full px-2 py-0.5 text-xs text-white">
              {character.likeCount}
            </div>
          </div>
        </div>
      </Link>

      {/* 内容区域 */}
      <div className="p-3">
        {/* 标题和描述 */}
        <h3 className="text-base font-medium mb-1">{character.name}</h3>
        <p className="text-sm text-gray-400 mb-2 line-clamp-1">{character.description}</p>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {character.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-[#2a1a34] text-xs px-3 py-1 rounded-full border-none hover:bg-[#3a1a44]"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* 创作者信息 */}
        <div className="mt-2 flex items-center">
          <Link 
            href={`/creator/${creatorName}`}
            className="flex items-center text-xs text-gray-400 hover:text-pink-400"
          >
            <div className="w-5 h-5 rounded-full bg-gray-600 mr-1 flex items-center justify-center">
              <span className="text-white text-xs">@</span>
            </div>
            {creatorName}
          </Link>
          <div className="ml-auto flex items-center text-xs text-pink-500">
            <Heart className="h-3 w-3 mr-1" />
            {creatorLikeCount}
          </div>
        </div>
      </div>
    </div>
  )
}
