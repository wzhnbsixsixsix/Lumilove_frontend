"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Clock,
  Lock,
  CheckCircle,
  ChevronDown,
  Star,
  FlameIcon as Fire,
  ArrowRight,
  ArrowLeft,
  Heart,
  BookmarkIcon,
  CreditCard,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SneakyPage() {
  // State for active filters
  const [activeStyle, setActiveStyle] = useState<string>("All")
  const [activeIntimacy, setActiveIntimacy] = useState<string>("All")
  const [activeTag, setActiveTag] = useState<string>("All")
  const [activeSort, setActiveSort] = useState<string>("Most Popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredPack, setHoveredPack] = useState<number | null>(null)

  // Filter options
  const styleOptions = ["All", "Bedroom", "Cosplay", "Outdoor", "Shower", "Fantasy"]
  const intimacyOptions = ["All", "Soft", "Sexy", "NSFW", "VIP"]
  const tagOptions = ["All", "HOT 🔥", "Limited ⏰", "New 🆕"]
  const sortOptions = ["Most Popular", "Newest", "Price ↓", "Price ↑"]

  // sneaky的封面就放这里(硬编码)
  const photoPacks = [
    {
      id: 1,
      name: "🔥 Forbidden Nurse",
      description: "Tonight, the clinic is closed. But she's ready to take your temperature.",
      images: 4,
      price: 2.99,
      isOwned: false,
      isHot: true,
      isLimited: true,
      limitedTime: "48h",
      style: "Cosplay",
      intimacy: "NSFW",
      coverImage: "/sneaky/heng01.jpg",
      previewImages: [
        "/placeholder.svg?height=400&width=300&text=Nurse1",
        "/placeholder.svg?height=400&width=300&text=Nurse2",
        "/placeholder.svg?height=400&width=300&text=Nurse3",
      ],
    },
    {
      id: 2,
      name: "Midnight Swim",
      description: "The pool is empty. The night is young. And she's waiting for you.",
      images: 6,
      price: 4.99,
      isOwned: true,
      isHot: false,
      isLimited: false,
      style: "Outdoor",
      intimacy: "Sexy",
      coverImage: "/sneaky/heng02.jpg",
      previewImages: [
        "/sneaky/heng0222.jpg",
        "/sneaky/pack_midnight_swim_2.png",
        "/sneaky/pack_midnight_swim_3.png",
        "/sneaky/pack_midnight_swim_4.png",
        "/sneaky/pack_midnight_swim_5.png",
        "/sneaky/pack_midnight_swim_6.png",
      ],
    },
    {
      id: 3,
      name: "⏰ Morning Glow",
      description: "Sunlight through the curtains. Sheets barely covering. Your morning view.",
      images: 5,
      price: 3.99,
      isOwned: false,
      isHot: false,
      isLimited: true,
      limitedTime: "24h",
      style: "Bedroom",
      intimacy: "Soft",
      coverImage: "/sneaky/heng03.jpg",
      previewImages: [
        "/placeholder.svg?height=400&width=300&text=Morning1",
        "/placeholder.svg?height=400&width=300&text=Morning2",
      ],
    },
    {
      id: 4,
      name: "🆕 Fantasy Elf",
      description: "From another realm. Pointed ears. Magical touch. Yours to command.",
      images: 8,
      price: 5.99,
      isOwned: false,
      isHot: false,
      isLimited: false,
      isNew: true,
      style: "Fantasy",
      intimacy: "VIP",
      coverImage: "/sneaky/heng04.jpg",
      previewImages: [
        "/placeholder.svg?height=400&width=300&text=Elf1",
        "/placeholder.svg?height=400&width=300&text=Elf2",
      ],
    },
    {
      id: 5,
      name: "Shower Secrets",
      description: "Steam rising. Water falling. Glass door slightly open. Just for you.",
      images: 4,
      price: 3.49,
      isOwned: false,
      isHot: true,
      isLimited: false,
      style: "Shower",
      intimacy: "NSFW",
      coverImage: "/sneaky/heng05.jpg",
      previewImages: [
        "/placeholder.svg?height=400&width=300&text=Shower1",
        "/placeholder.svg?height=400&width=300&text=Shower2",
      ],
    },
    {
      id: 6,
      name: "Bedroom Eyes",
      description: "Silk sheets. Candlelight. Her gaze never leaves yours.",
      images: 5,
      price: 2.99,
      isOwned: false,
      isHot: false,
      isLimited: false,
      style: "Bedroom",
      intimacy: "Sexy",
      coverImage: "/sneaky/heng06.jpg",
      previewImages: [
        "/placeholder.svg?height=400&width=300&text=Bedroom1",
        "/placeholder.svg?height=400&width=300&text=Bedroom2",
      ],
    },
  ]

  // Mock data for collection (favorited images)
  const collectionItems = [
    {
      id: 101,
      title: "Midnight Swim #3",
      image: "/sneaky/midnight_swim_cer.png",
      packName: "Midnight Swim",
      date: "2023-05-15",
    },
    {
      id: 102,
      title: "Fantasy Elf #2",
      image: "/placeholder.svg?height=400&width=300&text=Elf2",
      packName: "Fantasy Elf",
      date: "2023-06-20",
    },
    {
      id: 103,
      title: "Morning Glow #1",
      image: "/placeholder.svg?height=400&width=300&text=Morning1",
      packName: "Morning Glow",
      date: "2023-07-10",
    },
  ]

  // Mock data for library (purchased packs)
  const libraryItems = [
    {
      id: 2,
      name: "Midnight Swim",
      description: "The pool is empty. The night is young. And she's waiting for you.",
      images: 6,
      purchaseDate: "2023-04-15",
      lastUpdated: "2023-05-20",
      coverImage: "/sneaky/midnight_s_cover.png",
    },
  ]

  // Filter packs based on active filters
  const filteredPacks = photoPacks.filter((pack) => {
    if (activeStyle !== "All" && pack.style !== activeStyle) return false
    if (activeIntimacy !== "All" && pack.intimacy !== activeIntimacy) return false
    if (activeTag === "HOT 🔥" && !pack.isHot) return false
    if (activeTag === "Limited ⏰" && !pack.isLimited) return false
    if (activeTag === "New 🆕" && !pack.isNew) return false
    return true
  })

  // Sort packs based on active sort
  const sortedPacks = [...filteredPacks].sort((a, b) => {
    if (activeSort === "Most Popular") return 0 // In a real app, would sort by popularity
    if (activeSort === "Newest") return 0 // In a real app, would sort by date
    if (activeSort === "Price ↓") return b.price - a.price
    if (activeSort === "Price ↑") return a.price - b.price
    return 0
  })

  // Pagination
  const packsPerPage = 6
  const totalPages = Math.ceil(sortedPacks.length / packsPerPage)
  const currentPacks = sortedPacks.slice((currentPage - 1) * packsPerPage, currentPage * packsPerPage)

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        {/* Top Navigation */}
        <Tabs defaultValue="packs" className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <TabsList className="bg-[#1a0a24] border border-[#3a1a44]">
              <TabsTrigger value="packs" className="data-[state=active]:bg-pink-500">
                Packs
              </TabsTrigger>
              <TabsTrigger value="collection" className="data-[state=active]:bg-pink-500">
                Collection
              </TabsTrigger>
              <TabsTrigger value="library" className="data-[state=active]:bg-pink-500">
                Library
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1a0a24] border border-[#3a1a44] focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                />
              </div>
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=32&width=32&text=U" alt="User" width={32} height={32} />
              </div>
            </div>
          </div>

          <TabsContent value="packs" className="mt-0">
            {/* Filters Section */}
            <div className="mb-6 bg-[#1a0a24] rounded-xl p-4 border border-[#3a1a44]">
              <div className="flex items-center mb-3">
                <Filter className="h-4 w-4 mr-2 text-pink-400" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Style Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Style</label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((style) => (
                      <Badge
                        key={style}
                        variant={style === activeStyle ? "default" : "outline"}
                        className={`cursor-pointer ${
                          style === activeStyle ? "bg-pink-500 hover:bg-pink-600" : "bg-[#2a1a34] hover:bg-[#3a2a44]"
                        }`}
                        onClick={() => setActiveStyle(style)}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Intimacy Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Intimacy</label>
                  <div className="flex flex-wrap gap-2">
                    {intimacyOptions.map((level) => (
                      <Badge
                        key={level}
                        variant={level === activeIntimacy ? "default" : "outline"}
                        className={`cursor-pointer ${
                          level === activeIntimacy ? "bg-pink-500 hover:bg-pink-600" : "bg-[#2a1a34] hover:bg-[#3a2a44]"
                        }`}
                        onClick={() => setActiveIntimacy(level)}
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tag === activeTag ? "default" : "outline"}
                        className={`cursor-pointer ${
                          tag === activeTag ? "bg-pink-500 hover:bg-pink-600" : "bg-[#2a1a34] hover:bg-[#3a2a44]"
                        }`}
                        onClick={() => setActiveTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sort</label>
                  <div className="relative">
                    <select
                      className="w-full bg-[#2a1a34] border border-[#3a1a44] rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                      value={activeSort}
                      onChange={(e) => setActiveSort(e.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Packs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="block"
                  onMouseEnter={() => setHoveredPack(pack.id)}
                  onMouseLeave={() => setHoveredPack(null)}
                >
                  <div className="bg-[#1a0a24] rounded-xl overflow-hidden border border-[#3a1a44] transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:border-pink-500/50 hover:scale-[1.02]">
                    {/* Pack Cover Image with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      {/* Main Cover Image */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          hoveredPack === pack.id ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <Image
                          src={pack.coverImage || "/placeholder.svg"}
                          alt={pack.name}
                          width={300}
                          height={400}
                          className="w-full h-full object-cover filter brightness-75"
                        />
                        {/* Blur/Grayscale effect for non-owned packs */}
                        {!pack.isOwned && <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>}
                      </div>

                      {/* Preview Images Carousel (shown on hover) */}
                      {hoveredPack === pack.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            {pack.previewImages.map((img, index) => (
                              <div
                                key={index}
                                className="absolute inset-0 transition-opacity duration-500"
                                style={{
                                  opacity: index === 0 ? 1 : 0,
                                  animation:
                                    index === 0 ? "fadeInOut 6s infinite" : `fadeInOut 6s infinite ${index * 2}s`,
                                }}
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`${pack.name} preview ${index + 1}`}
                                  width={300}
                                  height={400}
                                  className="w-full h-full object-cover filter brightness-90"
                                />
                                {!pack.isOwned && (
                                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {pack.isHot && (
                          <Badge className="bg-red-500 text-white">
                            <Fire className="h-3 w-3 mr-1" /> HOT
                          </Badge>
                        )}
                        {pack.isLimited && (
                          <Badge className="bg-amber-500 text-white">
                            <Clock className="h-3 w-3 mr-1" /> {pack.limitedTime}
                          </Badge>
                        )}
                        {pack.isNew && <Badge className="bg-blue-500 text-white">NEW</Badge>}
                      </div>

                      {/* Favorite Button */}
                      <button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500/70 transition-colors">
                        <Heart className="h-4 w-4 text-white" />
                      </button>

                      {/* Overlay with info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                        <div>
                          <h3 className="text-xl font-semibold">{pack.name}</h3>
                          <p className="text-sm text-gray-300 line-clamp-2 mt-1">{pack.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-400">{pack.images} images</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pack Footer */}
                    <div className="p-4 border-t border-[#3a1a44]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {pack.isOwned ? (
                            <div className="flex items-center text-green-400">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Owned</span>
                            </div>
                          ) : (
                            <div className="font-semibold text-pink-400">${pack.price}</div>
                          )}
                        </div>
                        {pack.isOwned ? (
                          <Link href={`/sneaky/gallery/${pack.id}`}>
                            <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                              View Gallery
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/premium">
                            <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                              Unlock Now <Lock className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34]"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34]"
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Premium CTA */}
            <div className="mt-12 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Unlock All Packs</h2>
              <p className="text-gray-300 mb-4">
                Subscribe to Premium for unlimited access to all photo packs, including VIP content.
              </p>
              <div className="flex justify-center items-center gap-4">
                <Link
                  href="/premium"
                  className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <Star className="h-4 w-4 inline mr-2" /> Subscribe Now
                </Link>
                <span className="text-gray-400">or</span>
                <Button variant="outline" className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34]">
                  Learn More
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="mt-0">
            <div className="mb-6 bg-[#1a0a24] rounded-xl p-4 border border-[#3a1a44]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-pink-400" />
                  <h2 className="text-lg font-semibold">Your Collection</h2>
                </div>
                <div className="text-sm text-gray-400">{collectionItems.length} saved images</div>
              </div>
            </div>

            {collectionItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {collectionItems.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#1a0a24] border border-[#3a1a44]">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <p className="text-xs text-gray-300">{item.packName}</p>
                    </div>
                    <button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500/70 transition-colors">
                      <Heart className="h-4 w-4 text-pink-400 fill-pink-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your collection is empty</h3>
                <p className="text-gray-400 mb-6">Save your favorite images by clicking the heart icon</p>
                <Button variant="outline" className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34]">
                  Browse Packs
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="library" className="mt-0">
            <div className="mb-6 bg-[#1a0a24] rounded-xl p-4 border border-[#3a1a44]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-pink-400" />
                  <h2 className="text-lg font-semibold">Your Library</h2>
                </div>
                <div className="text-sm text-gray-400">{libraryItems.length} purchased packs</div>
              </div>
            </div>

            {libraryItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryItems.map((pack) => (
                  <Link href={`/sneaky/gallery/${pack.id}`} key={pack.id} className="block">
                    <div className="bg-[#1a0a24] rounded-xl overflow-hidden border border-[#3a1a44] transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:border-pink-500/50 hover:scale-[1.02]">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={pack.coverImage || "/placeholder.svg"}
                          alt={pack.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                          <div>
                            <h3 className="text-xl font-semibold">{pack.name}</h3>
                            <div className="flex items-center mt-2">
                              <span className="text-xs text-gray-400">{pack.images} images</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <div>Purchased: {new Date(pack.purchaseDate).toLocaleDateString()}</div>
                          <div>Updated: {new Date(pack.lastUpdated).toLocaleDateString()}</div>
                        </div>
                        <Button className="w-full mt-4 bg-pink-500 hover:bg-pink-600">View Gallery</Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your library is empty</h3>
                <p className="text-gray-400 mb-6">Purchase photo packs to access exclusive content</p>
                <Button variant="outline" className="bg-[#1a0a24] border-[#3a1a44] hover:bg-[#2a1a34]">
                  Browse Packs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <style jsx global>{`
        @keyframes fadeInOut {
          0%, 33% { opacity: 1; }
          50%, 83% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
