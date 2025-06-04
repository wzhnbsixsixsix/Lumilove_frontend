"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Upload, X, ArrowRight, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"

export default function CreateLoverPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for character creation
  const [gender, setGender] = useState<"male" | "female">("male")
  const [artStyle, setArtStyle] = useState<"realistic" | "anime" | "hybrid">("realistic")
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [useAsProfileImage, setUseAsProfileImage] = useState(false)
  const [description, setDescription] = useState("")
  const [step, setStep] = useState(1)

  // Art style examples based on gender
  const artStyleExamples = {
    male: {
      realistic: "/placeholder.svg?height=200&width=200&text=Realistic+Male",
      anime: "/placeholder.svg?height=200&width=200&text=Anime+Male",
      hybrid: "/placeholder.svg?height=200&width=200&text=Hybrid+Male",
    },
    female: {
      realistic: "/placeholder.svg?height=200&width=200&text=Realistic+Female",
      anime: "/placeholder.svg?height=200&width=200&text=Anime+Female",
      hybrid: "/placeholder.svg?height=200&width=200&text=Hybrid+Female",
    },
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setReferenceImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemoveImage = () => {
    setReferenceImage(null)
    setUseAsProfileImage(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAIWriter = () => {
    // Simulate AI generating a description
    const maleDescriptions = [
      "Tall with a muscular build, sharp jawline, and piercing blue eyes. Short brown hair styled casually. Usually dressed in fitted t-shirts and dark jeans that highlight his athletic physique.",
      "Medium height with a lean, toned body. Has warm hazel eyes and wavy blonde hair. Often seen in business casual attire with rolled-up sleeves, revealing a subtle tattoo on his forearm.",
      "Athletic build with broad shoulders. Has a charming smile with a slight dimple, olive skin, and dark curly hair. Typically wears stylish streetwear with a signature leather jacket.",
    ]

    const femaleDescriptions = [
      "Tall and graceful with an hourglass figure. Long flowing auburn hair frames her heart-shaped face. Emerald green eyes and full lips. Usually dressed in elegant, form-fitting dresses.",
      "Petite with a dancer's physique. Has shoulder-length blonde hair with subtle highlights and bright blue eyes. Often wears bohemian-style clothing with unique accessories.",
      "Athletic build with toned arms and legs. Has a warm smile, sun-kissed skin, and dark hair typically worn in a stylish bob. Prefers casual chic outfits that combine comfort and style.",
    ]

    const descriptions = gender === "male" ? maleDescriptions : femaleDescriptions
    const randomIndex = Math.floor(Math.random() * descriptions.length)
    setDescription(descriptions[randomIndex])
  }

  const handleNext = () => {
    // In a real app, this would save the data and move to the next step
    // For now, we'll just simulate moving to the next step
    setStep(step + 1)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-[#1a0a24]">
        <div className="max-w-6xl mx-auto py-8 px-6">
          {step === 1 && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-center text-white mb-8">Character&apos;s Appearance</h1>

              {/* Gender Selection */}
              <div className="flex justify-end">
                <div className="bg-[#2a1a34] rounded-full p-1.5 flex">
                  <button
                    className={`px-8 py-3 rounded-full flex items-center gap-2 text-lg ${
                      gender === "male" ? "bg-[#1a0a24] text-white" : "text-gray-400"
                    }`}
                    onClick={() => setGender("male")}
                  >
                    <span className="text-blue-500 text-xl">♂</span> Male
                  </button>
                  <button
                    className={`px-8 py-3 rounded-full flex items-center gap-2 text-lg ${
                      gender === "female" ? "bg-[#1a0a24] text-white" : "text-gray-400"
                    }`}
                    onClick={() => setGender("female")}
                  >
                    <span className="text-pink-500 text-xl">♀</span> Female
                  </button>
                </div>
              </div>

              {/* Art Style Selection */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Select Art Style</h2>
                <div className="grid grid-cols-3 gap-8">
                  {(["realistic", "anime", "hybrid"] as const).map((style) => (
                    <div key={style} className="flex flex-col items-center">
                      <div
                        className={`relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer ${
                          artStyle === style ? "ring-4 ring-pink-500" : ""
                        }`}
                        onClick={() => setArtStyle(style)}
                      >
                        <Image
                          src={artStyleExamples[gender][style] || "/placeholder.svg"}
                          alt={style}
                          fill
                          className="object-cover"
                        />
                        {artStyle === style && (
                          <div className="absolute top-3 right-3 bg-pink-500 rounded-full h-8 w-8 flex items-center justify-center">
                            <div className="h-4 w-4 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <span className="mt-3 text-white capitalize text-lg">{style}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Image Upload */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Reference Image (optional)</h2>
                <div className="border border-dashed border-[#3a1a44] rounded-xl p-10 relative">
                  {referenceImage ? (
                    <div className="relative">
                      <div className="relative w-60 h-60 mx-auto">
                        <Image
                          src={referenceImage || "/placeholder.svg"}
                          alt="Reference"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <button
                        className="absolute top-0 right-0 bg-[#2a1a34] rounded-full p-1.5"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-6 w-6 text-gray-400" />
                      </button>
                      <div className="mt-6 flex justify-center">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useAsProfileImage}
                            onChange={(e) => setUseAsProfileImage(e.target.checked)}
                            className="rounded-full h-6 w-6 accent-pink-500"
                          />
                          <span className="text-gray-300 text-lg">Set the image as cover</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center cursor-pointer py-8"
                      onClick={handleUploadClick}
                    >
                      <div className="bg-[#3a1a44] rounded-full p-6 mb-6">
                        <Upload className="h-10 w-10 text-pink-500" />
                      </div>
                      <p className="text-center text-gray-300 mb-2 text-lg">Upload a photo as a face reference.</p>
                      <p className="text-center text-gray-400 text-base">Or use it as the character cover directly.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appearance Description */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-white">Appearance Description (optional)</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-base">{description.length}/500 characters</span>
                    <button
                      className="bg-[#2a1a34] hover:bg-[#3a1a44] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-base"
                      onClick={handleAIWriter}
                    >
                      <Wand2 className="h-5 w-5 text-yellow-500" />
                      <span>AI Writer</span>
                    </button>
                  </div>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  placeholder="Please describe the character's appearance, including race, facial features, body type, clothing, background, etc. The 'AI Writer' button could help you expand it."
                  className="w-full h-48 bg-[#2a1a34] border border-[#3a1a44] rounded-xl p-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
                />
              </div>

              {/* Next Button */}
              <div className="flex justify-center mt-8">
                <Button
                  className="bg-pink-500 hover:bg-pink-600 text-white px-16 py-7 rounded-full text-xl font-medium"
                  onClick={handleNext}
                >
                  Next <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-white mb-6">Character Personality</h2>
              <p className="text-gray-300 mb-10">This would be the next step in character creation.</p>
              <Button
                className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-6 rounded-full text-lg"
                onClick={() => setStep(1)} // Go back to step 1 for demo purposes
              >
                Go Back
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
    </div>
  )
}
