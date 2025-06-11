"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, Lock, Heart, Download, ChevronLeft, ChevronRight, Star } from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [packId, setPackId] = useState<number | null>(null)

  // 解析异步的 params
  useEffect(() => {
    params.then(resolvedParams => {
      setPackId(Number.parseInt(resolvedParams.id))
    })
  }, [params])

  // 如果 packId 还没有加载，显示 loading
  if (packId === null) {
    return <div>Loading...</div>
  }

  // Mock data for the gallery
  const pack = {
    id: packId,
    name: packId === 2 ? "Midnight Swim" : "Unknown Pack",
    description: "The pool is empty. The night is young. And she's waiting for you.",//midnight的画廊的图片就放这里
    images: [
      {
        id: 1,
        src: "/sneaky/pack_midnight_swim_1.png",
        isLocked: false,
        isPremium: false,
      },
      {
        id: 2,
        src: "/sneaky/pack_midnight_swim_2.png",
        isLocked: false,
        isPremium: false,
      },
      {
        id: 3,
        src: "/sneaky/pack_midnight_swim_3.png",
        isLocked: false,
        isPremium: false,
      },
      {
        id: 4,
        src: "/sneaky/pack_midnight_swim_4.png",
        isLocked: false,
        isPremium: true,
      },
      {
        id: 5,
        src: "/sneaky/pack_midnight_swim_5.png",
        isLocked: true,
        isPremium: true,
      },
      {
        id: 6,
        src: "/sneaky/pack_midnight_swim_6.png",
        isLocked: true,
        isPremium: true,
      },
    ],
    creator: "Sophia Dreams",
    creatorAvatar: "/placeholder.svg?height=100&width=100&text=SD",
    dateAdded: "2023-05-15",
    lastUpdated: "2023-06-20",
  }

  const handleImageClick = (index: number) => {
    const image = pack.images[index]
    if (!image.isLocked) {
      setSelectedImage(index)
      setIsFullscreen(true)
    }
  }

  const handlePrevImage = () => {
    if (selectedImage === null) return

    let newIndex = selectedImage - 1
    // Skip locked images
    while (newIndex >= 0 && pack.images[newIndex].isLocked) {
      newIndex--
    }

    if (newIndex >= 0) {
      setSelectedImage(newIndex)
    }
  }

  const handleNextImage = () => {
    if (selectedImage === null) return

    let newIndex = selectedImage + 1
    // Skip locked images
    while (newIndex < pack.images.length && pack.images[newIndex].isLocked) {
      newIndex++
    }

    if (newIndex < pack.images.length) {
      setSelectedImage(newIndex)
    }
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/sneaky" className="mr-4">
            <Button variant="outline" size="icon" className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{pack.name}</h1>
            <div className="flex items-center mt-1">
              <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                <Image src={pack.creatorAvatar || "/placeholder.svg"} alt={pack.creator} width={24} height={24} />
              </div>
              <span className="text-sm text-gray-300">{pack.creator}</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {pack.images.map((image, index) => (
            <div
              key={image.id}
              className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group ${
                image.isLocked ? "bg-[#1a0a24]" : ""
              }`}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={`${pack.name} image ${image.id}`}
                width={600}
                height={800}
                className={`w-full h-full object-cover ${image.isLocked ? "blur-md brightness-50" : ""}`}
              />

              {/* Premium badge */}
              {image.isPremium && !image.isLocked && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  PREMIUM
                </div>
              )}

              {/* Lock overlay */}
              {image.isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Lock className="h-8 w-8 text-white mb-2" />
                  <span className="text-white font-medium">Premium Content</span>
                  <Link href="/payment" className="mt-2">
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                      Unlock
                    </Button>
                  </Link>
                </div>
              )}

              {/* Hover actions */}
              {!image.isLocked && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-pink-500 transition-colors">
                    <Heart className="h-5 w-5 text-white" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-pink-500 transition-colors">
                    <Download className="h-5 w-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2">Unlock All Premium Content</h2>
              <p className="text-gray-300">Subscribe to Premium to access all locked images in this pack and others.</p>
            </div>
            <Link href="/payment">
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Star className="h-4 w-4 mr-2" /> Subscribe Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Fullscreen Image Dialog */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-screen-lg p-0 bg-black/90 border-none">
            <div className="relative h-[80vh] flex items-center justify-center">
              {selectedImage !== null && (
                <Image
                  src={pack.images[selectedImage].src || "/placeholder.svg"}
                  alt={`${pack.name} image ${pack.images[selectedImage].id}`}
                  width={1200}
                  height={1600}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              <button
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500 transition-colors"
                onClick={closeFullscreen}
              >
                <X className="h-5 w-5 text-white" />
              </button>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500 transition-colors"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500 transition-colors"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <Heart className="h-5 w-5 text-white" />
                </button>
                <button className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <Download className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
