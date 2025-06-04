"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Character {
  id: number
  name: string
  occupation: string
  tags: string[]
  description: string
  chatCount: string
  imageSrc: string
}

export default function CharacterCard({ character }: { character: Character }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-[#1a0a24] border border-[#3a1a44] card-hover-effect"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/chat/${character.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <div className="absolute top-2 left-2 z-10 bg-black/50 rounded-full px-2 py-1 text-xs flex items-center">
            <span className="text-green-400 mr-1">📈</span> {character.chatCount}
          </div>
          <button
            className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1.5"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "text-pink-500 fill-pink-500" : "text-white"}`} />
          </button>
          <Image
            src={character.imageSrc || "/placeholder.svg"}
            alt={character.name}
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src={`/placeholder.svg?height=400&width=300&text=${character.name}-alt`}
            alt={`${character.name} alternative`}
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center mb-1">
            <h3 className="text-lg font-semibold">{character.name}</h3>
            <Phone className="h-4 w-4 ml-2 text-gray-400" />
          </div>
          <p className="text-sm text-gray-300 mb-2">{character.occupation}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {character.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-[#2a1a34] text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{character.description}</p>
        </div>
      </Link>
    </div>
  )
}
