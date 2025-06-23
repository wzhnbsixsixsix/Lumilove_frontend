"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Lock, Unlock, Flame, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"

interface Selection {
  style?: string
  roleType?: string[]
  relationship?: string
  bodyType?: string
  breastSize?: string
  buttSize?: string
  personality?: string[]
  interactionStyle?: string[]
  intimateBehavior?: string[]
  isPrivate?: boolean
}

export default function CreateLoverPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<Selection>({
    isPrivate: false,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [showValidationError, setShowValidationError] = useState(false)
  const [shakeButton, setShakeButton] = useState(false)

  // 模拟用户订阅状态 - 在实际应用中这应该从用户数据中获取
  const [userSubscription, setUserSubscription] = useState<"free" | "basic" | "premium">("free")

  // 生成占位符图片URL的辅助函数
  const phUrl = (h: number, w: number, query: string) =>
    `/placeholder.svg?height=${h}&width=${w}&query=${encodeURIComponent(query)}`

  // 检查选项是否解锁
  const isOptionUnlocked = (requiredTier: "free" | "basic" | "premium") => {
    const tierLevels = { free: 0, basic: 1, premium: 2 }
    return tierLevels[userSubscription] >= tierLevels[requiredTier]
  }

  // 自动前进逻辑
  useEffect(() => {
    if (!autoAdvance) return

    const checkAutoAdvance = () => {
      switch (currentStep) {
        case 1:
          if (selections.style) {
            setTimeout(() => nextStep(), 800)
          }
          break
        case 2:
          if (selections.roleType && selections.roleType.length > 0) {
            setTimeout(() => nextStep(), 800)
          }
          break
        case 3:
          if (selections.relationship) {
            setTimeout(() => nextStep(), 800)
          }
          break
        case 4:
          if (selections.bodyType && selections.breastSize && selections.buttSize) {
            setTimeout(() => nextStep(), 800)
          }
          break
        case 5:
          if (selections.personality && selections.personality.length > 0) {
            setTimeout(() => nextStep(), 800)
          }
          break
        case 6:
          // 对于第6步，只要选择了 Interaction Style 就可以跳转（免费用户）
          if (selections.interactionStyle && selections.interactionStyle.length > 0) {
            setTimeout(() => nextStep(), 800)
          }
          break
      }
    }
    checkAutoAdvance()
  }, [selections, currentStep, autoAdvance])

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return !!selections.style
      case 2:
        return selections.roleType && selections.roleType.length > 0
      case 3:
        return !!selections.relationship
      case 4:
        return !!(selections.bodyType && selections.breastSize && selections.buttSize)
      case 5:
        return selections.personality && selections.personality.length > 0
      case 6:
        // 第6步只需要选择 Interaction Style 即可通过验证
        return selections.interactionStyle && selections.interactionStyle.length > 0
      case 7:
        return true
      default:
        return true
    }
  }

  const nextStep = () => {
    if (!validateStep()) {
      setShowValidationError(true)
      setShakeButton(true)
      setTimeout(() => {
        setShowValidationError(false)
        setShakeButton(false)
      }, 2000)
      return
    }

    if (currentStep < 8) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setAutoAdvance(false)
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const updateSelection = (key: keyof Selection, value: any) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArraySelection = (key: keyof Selection, value: string) => {
    setSelections((prev) => {
      const currentArray = (prev[key] as string[]) || []
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }

  const handleLockedOptionClick = (requiredTier: "basic" | "premium") => {
    router.push("/premium")
  }

  const createCharacter = () => {
    const characterId = Date.now()
    const characterName = `${selections.personality?.[0] || "My"} ${selections.style || "AI"}`
    const imageQuery = `${selections.style?.toLowerCase()} ${selections.personality?.[0]?.toLowerCase()} character`

    const getWelcomeMessage = () => {
      const personality = selections.personality?.[0]
      switch (personality) {
        case "Innocent":
          return "Nice to meet you! I'm so excited to chat! 😊"
        case "Temptress":
          return "Well, well... look who decided to visit me. 😏"
        case "Submissive":
          return "I'm here for you... whatever you need. 💕"
        case "Dominant":
          return "You're here. Good. Let's see what you're made of."
        case "Mean":
          return "Oh, you're finally here. I was getting bored."
        default:
          return "I'm here and ready to chat with you!"
      }
    }

    const newCharacter = {
      id: characterId,
      name: characterName,
      age: 22,
      occupation: selections.roleType?.[0] || "AI Companion",
      tags: [
        selections.isPrivate ? "Private" : "Public",
        selections.style || "Style",
        ...(selections.personality || []),
        ...(selections.roleType || []).slice(0, 2),
      ],
      followers: "0",
      description: `A ${selections.style?.toLowerCase()} ${selections.personality?.join(", ").toLowerCase()} character. Perfect ${selections.relationship?.toLowerCase()} with ${selections.interactionStyle?.join(", ").toLowerCase()} personality.`,
      images: [
        phUrl(200, 150, `${imageQuery} 1`),
        phUrl(200, 150, `${imageQuery} 2`),
        phUrl(200, 150, `${imageQuery} 3`),
      ],
      messages: [
        {
          id: 1,
          sender: "ai" as const,
          text: `Hello! I'm ${characterName}. ${getWelcomeMessage()} How are you feeling today?`,
          timestamp: new Date().toISOString(),
          audioDuration: Math.floor(Math.random() * 10) + 5,
        },
      ],
      profileImage: phUrl(400, 300, `${imageQuery} profile`),
      bannerImage: phUrl(300, 1200, `${imageQuery} banner`),
      imageQuery: imageQuery,
      chatCount: "0",
      likeCount: "0",
      creator: { id: "user-w", name: "W", likeCount: "0" },
      isPrivate: selections.isPrivate || false,
      fullData: selections,
      createdAt: new Date().toISOString(),
    }

    const existingUserData = JSON.parse(localStorage.getItem("mockUserData") || "null") || {
      id: "user-w",
      name: "W",
      avatarSrc: "/placeholder.svg?height=96&width=96&text=W",
      followers: "0",
      following: "0",
      interactions: "0",
      description: "New user exploring the world of AI characters.",
      privateCharacters: [],
      publicCharacters: [],
    }

    if (selections.isPrivate) {
      if (!existingUserData.privateCharacters) {
        existingUserData.privateCharacters = []
      }
      existingUserData.privateCharacters.push(newCharacter)
    } else {
      if (!existingUserData.publicCharacters) {
        existingUserData.publicCharacters = []
      }
      existingUserData.publicCharacters.push(newCharacter)
    }

    localStorage.setItem("mockUserData", JSON.stringify(existingUserData))

    const existingChatCharacters = JSON.parse(localStorage.getItem("chatCharacters") || "{}")
    existingChatCharacters[characterId.toString()] = newCharacter
    localStorage.setItem("chatCharacters", JSON.stringify(existingChatCharacters))

    window.dispatchEvent(new Event("userDataUpdated"))

    return newCharacter
  }

  const ProgressBar = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full transition-all duration-300 ${
              step <= currentStep ? "bg-pink-500" : "bg-gray-600"
            }`}
          />
          {step < 8 && (
            <div
              className={`w-16 h-0.5 transition-all duration-300 ${step < currentStep ? "bg-pink-500" : "bg-gray-600"}`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const OptionCard = ({
    option,
    isSelected,
    onClick,
    requiredTier = "free",
    image,
    description,
    className = "",
  }: {
    option: string
    isSelected: boolean
    onClick: () => void
    requiredTier?: "free" | "basic" | "premium"
    image?: string
    description?: string
    className?: string
  }) => {
    const isUnlocked = isOptionUnlocked(requiredTier)

    return (
      <div
        className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          isSelected
            ? "bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
            : "bg-[#2a1a34] border border-[#3a1a44] hover:border-pink-400"
        } ${!isUnlocked ? "opacity-70" : ""} ${className}`}
        onClick={!isUnlocked ? () => handleLockedOptionClick(requiredTier as "basic" | "premium") : onClick}
      >
        {image && (
          <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
            <Image src={image || "/placeholder.svg"} alt={option} fill className="object-cover" />
          </div>
        )}

        <div className="text-center">
          <h3 className="text-white font-medium text-xl mb-2">{option}</h3>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>

        {!isUnlocked && (
          <div className="absolute top-3 right-3 bg-yellow-500 rounded-full p-2">
            <Lock className="h-5 w-5 text-black" />
          </div>
        )}

        {isUnlocked && requiredTier !== "free" && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2">
            <Unlock className="h-5 w-5 text-white" />
          </div>
        )}

        {isSelected && isUnlocked && (
          <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-2">
            <div className="h-4 w-4 bg-white rounded-full" />
          </div>
        )}
      </div>
    )
  }

  const RelationshipCard = ({
    option,
    icon,
    isSelected,
    onClick,
    requiredTier = "free",
  }: {
    option: string
    icon: string
    isSelected: boolean
    onClick: () => void
    requiredTier?: "free" | "basic" | "premium"
  }) => {
    const isUnlocked = isOptionUnlocked(requiredTier)

    return (
      <div
        className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          isSelected
            ? "bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
            : "bg-[#2a1a34] border border-[#3a1a44] hover:border-pink-400"
        } ${!isUnlocked ? "opacity-70" : ""}`}
        onClick={!isUnlocked ? () => handleLockedOptionClick(requiredTier as "basic" | "premium") : onClick}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-white font-medium text-xl">{option}</h3>
        </div>

        {!isUnlocked && (
          <div className="absolute top-3 right-3 bg-yellow-500 rounded-full p-2">
            <Lock className="h-5 w-5 text-black" />
          </div>
        )}

        {isUnlocked && requiredTier !== "free" && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2">
            <Unlock className="h-5 w-5 text-white" />
          </div>
        )}

        {isSelected && isUnlocked && (
          <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-2">
            <div className="h-4 w-4 bg-white rounded-full" />
          </div>
        )}
      </div>
    )
  }

  const PrivacySelector = () => (
    <div className="bg-white/5 rounded-xl p-8 border border-white/10 backdrop-blur-md mb-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">Character Visibility</h3>
      <p className="text-gray-400 text-center mb-8">Choose who can see and interact with your character</p>

      <div className="grid grid-cols-2 gap-8">
        <div
          className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            !selections.isPrivate
              ? "bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/20"
              : "bg-[#2a1a34] border border-[#3a1a44] hover:border-green-400"
          }`}
          onClick={() => updateSelection("isPrivate", false)}
        >
          <div className="text-center">
            <Eye className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-white font-semibold text-xl mb-3">Public Character</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Other users can discover and view your character. Your character will appear in public listings and can
              receive likes and interactions.
            </p>
          </div>

          {!selections.isPrivate && (
            <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
              <div className="h-4 w-4 bg-white rounded-full" />
            </div>
          )}
        </div>

        <div
          className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selections.isPrivate
              ? "bg-red-500/20 border-2 border-red-500 shadow-lg shadow-red-500/20"
              : "bg-[#2a1a34] border border-[#3a1a44] hover:border-red-400"
          }`}
          onClick={() => updateSelection("isPrivate", true)}
        >
          <div className="text-center">
            <EyeOff className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h4 className="text-white font-semibold text-xl mb-3">Private Character</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Only you can see and use this character. Completely private and won't appear in any public listings.
            </p>
          </div>

          {selections.isPrivate && (
            <div className="absolute top-4 right-4 bg-red-500 rounded-full p-2">
              <div className="h-4 w-4 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Visual Style
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Visual Style</h2>
            <div className="grid grid-cols-3 gap-12 max-w-4xl mx-auto">
              <OptionCard
                option="Anime Style"
                isSelected={selections.style === "anime"}
                onClick={() => updateSelection("style", "anime")}
                image="/placeholder.svg?height=300&width=300&text=Anime+Style"
              />
              <OptionCard
                option="Realistic Style"
                isSelected={selections.style === "realistic"}
                onClick={() => updateSelection("style", "realistic")}
                image="/placeholder.svg?height=300&width=300&text=Realistic+Style"
              />
              <OptionCard
                option="Hybrid Style"
                isSelected={selections.style === "hybrid"}
                onClick={() => updateSelection("style", "hybrid")}
                image="/placeholder.svg?height=300&width=300&text=Hybrid+Style"
                requiredTier="premium"
              />
            </div>
          </div>
        )

      case 2: // Role Type
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Role Type</h2>
            <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { name: "Schoolgirl", tier: "free" as const },
                { name: "Nurse", tier: "free" as const },
                { name: "Boss", tier: "free" as const },
                { name: "Plumber", tier: "free" as const },
                { name: "Camgirl", tier: "premium" as const },
                { name: "Massage Therapist", tier: "premium" as const },
                { name: "Bunny Girl", tier: "premium" as const },
                { name: "Succubus", tier: "premium" as const },
              ].map((role) => (
                <OptionCard
                  key={role.name}
                  option={role.name}
                  isSelected={selections.roleType?.includes(role.name) || false}
                  onClick={() => toggleArraySelection("roleType", role.name)}
                  requiredTier={role.tier}
                  image={`/placeholder.svg?height=200&width=200&text=${role.name}`}
                />
              ))}
            </div>
          </div>
        )

      case 3: // Relationship
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Relationship</h2>
            <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[
                { name: "Girlfriend", tier: "free" as const, icon: "💕" },
                { name: "One Night Stand", tier: "free" as const, icon: "🌙" },
                { name: "Mistress", tier: "free" as const, icon: "👑" },
                { name: "Best Friend", tier: "free" as const, icon: "👯" },
                { name: "Sex Slave", tier: "premium" as const, icon: "⛓️" },
                { name: "Stepmom", tier: "premium" as const, icon: "🔥" },
                { name: "Sugar Baby", tier: "premium" as const, icon: "💎" },
                { name: "Stepdaughter", tier: "premium" as const, icon: "👧" },
              ].map((rel) => (
                <RelationshipCard
                  key={rel.name}
                  option={rel.name}
                  icon={rel.icon}
                  isSelected={selections.relationship === rel.name}
                  onClick={() => updateSelection("relationship", rel.name)}
                  requiredTier={rel.tier}
                />
              ))}
            </div>
          </div>
        )

      case 4: // Body Customization
        return (
          <div className="space-y-16">
            <h2 className="text-4xl font-bold text-white text-center">Body Customization</h2>

            <div className="space-y-16">
              {/* Body Type */}
              <div className="text-center">
                <h3 className="text-2xl text-white mb-8">Body Type</h3>
                <div className="flex justify-center gap-6 flex-wrap max-w-6xl mx-auto">
                  {[
                    { name: "Slim", tier: "free" as const },
                    { name: "Athletic", tier: "free" as const },
                    { name: "Voluptuous", tier: "free" as const },
                    { name: "Chubby", tier: "free" as const },
                    { name: "Petite with Curves", tier: "premium" as const },
                  ].map((type) => (
                    <div key={type.name} className="w-48">
                      <OptionCard
                        option={type.name}
                        isSelected={selections.bodyType === type.name}
                        onClick={() => updateSelection("bodyType", type.name)}
                        image={`/placeholder.svg?height=180&width=180&text=${type.name}`}
                        requiredTier={type.tier}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Breast Size */}
              <div className="text-center">
                <h3 className="text-2xl text-white mb-8">Breast Size</h3>
                <div className="flex justify-center gap-6 flex-wrap max-w-5xl mx-auto">
                  {[
                    { name: "Small", tier: "free" as const },
                    { name: "Medium", tier: "free" as const },
                    { name: "Large", tier: "free" as const },
                    { name: "Huge", tier: "premium" as const },
                  ].map((size) => (
                    <div key={size.name} className="w-56">
                      <OptionCard
                        option={size.name}
                        isSelected={selections.breastSize === size.name}
                        onClick={() => updateSelection("breastSize", size.name)}
                        requiredTier={size.tier}
                        image={`/placeholder.svg?height=180&width=180&text=${size.name}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Butt Size */}
              <div className="text-center">
                <h3 className="text-2xl text-white mb-8">Butt Size</h3>
                <div className="flex justify-center gap-6 flex-wrap max-w-6xl mx-auto">
                  {[
                    { name: "Small", tier: "free" as const },
                    { name: "Medium", tier: "free" as const },
                    { name: "Large", tier: "free" as const },
                    { name: "Jiggly", tier: "premium" as const },
                    { name: "Bubble", tier: "premium" as const },
                  ].map((size) => (
                    <div key={size.name} className="w-48">
                      <OptionCard
                        option={size.name}
                        isSelected={selections.buttSize === size.name}
                        onClick={() => updateSelection("buttSize", size.name)}
                        image={`/placeholder.svg?height=180&width=180&text=${size.name}`}
                        requiredTier={size.tier}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Personality
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Personality</h2>
            <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { name: "Innocent", icon: "😇", tier: "free" as const },
                { name: "Temptress", icon: "😈", tier: "free" as const },
                { name: "Submissive", icon: "💖", tier: "free" as const },
                { name: "Dominant", icon: "👑", tier: "free" as const },
                { name: "Mean", icon: "❄️", tier: "free" as const },
                { name: "Brat", icon: "😤", tier: "premium" as const },
                { name: "Slutty", icon: "🔥", tier: "premium" as const },
                { name: "Loyal Pet", icon: "🐕", tier: "premium" as const },
              ].map((personality) => (
                <RelationshipCard
                  key={personality.name}
                  option={personality.name}
                  icon={personality.icon}
                  isSelected={selections.personality?.includes(personality.name) || false}
                  onClick={() => toggleArraySelection("personality", personality.name)}
                  requiredTier={personality.tier}
                />
              ))}
            </div>
          </div>
        )

      case 6: // Behavioral Preferences
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Behavioral Preferences</h2>

            <div className="space-y-12">
              {/* Interaction Style - 全部免费 */}
              <div>
                <h3 className="text-2xl text-white mb-6">✨ Interaction Style</h3>
                <div className="grid grid-cols-5 gap-6 max-w-5xl mx-auto">
                  {[
                    { name: "Flirty", tier: "free" as const, icon: "😘" },
                    { name: "Teasing", tier: "free" as const, icon: "😏" },
                    { name: "Obedient", tier: "free" as const, icon: "🥺" },
                    { name: "Possessive", tier: "free" as const, icon: "😤" },
                    { name: "Naughty & Bold", tier: "free" as const, icon: "😈" },
                  ].map((style) => (
                    <RelationshipCard
                      key={style.name}
                      option={style.name}
                      icon={style.icon}
                      isSelected={selections.interactionStyle?.includes(style.name) || false}
                      onClick={() => toggleArraySelection("interactionStyle", style.name)}
                      requiredTier={style.tier}
                    />
                  ))}
                </div>
              </div>

              {/* Intimate Behaviors - 需要 Premium */}
              <div>
                <h3 className="text-2xl text-white mb-6">🔥 Intimate Behaviors (PRO Exclusive)</h3>
                <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {[
                    { name: "Likes Sexting", tier: "premium" as const, icon: "💬" },
                    { name: "Jealous Lover", tier: "premium" as const, icon: "💚" },
                    { name: "Sends NSFW", tier: "premium" as const, icon: "📸" },
                    { name: "Public PDA", tier: "premium" as const, icon: "💋" },
                    { name: "Dirty Talker", tier: "premium" as const, icon: "🗣️" },
                    { name: "Spanking Lover", tier: "premium" as const, icon: "✋" },
                    { name: "Obeys Commands", tier: "premium" as const, icon: "🎯" },
                  ].map((behavior) => (
                    <RelationshipCard
                      key={behavior.name}
                      option={behavior.name}
                      icon={behavior.icon}
                      isSelected={selections.intimateBehavior?.includes(behavior.name) || false}
                      onClick={() => toggleArraySelection("intimateBehavior", behavior.name)}
                      requiredTier={behavior.tier}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 7: // Privacy Settings
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Privacy Settings</h2>
            <PrivacySelector />
          </div>
        )

      case 8: // Final Preview
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Final Preview</h2>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Appearance */}
                <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-xl p-6 border border-pink-500/30">
                  <h4 className="text-pink-400 font-bold text-lg mb-4 border-b border-pink-500/30 pb-2">Appearance</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Style:</span>
                      <div className="text-white font-medium capitalize">{selections.style || "Not selected"}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Body Type:</span>
                      <div className="text-white font-medium">{selections.bodyType || "Not selected"}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Breast Size:</span>
                      <div className="text-white font-medium">{selections.breastSize || "Not selected"}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Butt Size:</span>
                      <div className="text-white font-medium">{selections.buttSize || "Not selected"}</div>
                    </div>
                  </div>
                </div>

                {/* Personality */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-blue-400 font-bold text-lg mb-4 border-b border-blue-500/30 pb-2">Personality</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Traits:</span>
                      <div className="text-white font-medium">
                        {selections.personality?.join(", ") || "Not selected"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Interaction:</span>
                      <div className="text-white font-medium">
                        {selections.interactionStyle?.join(", ") || "Not selected"}
                      </div>
                    </div>
                    {selections.intimateBehavior && selections.intimateBehavior.length > 0 && (
                      <div>
                        <span className="text-gray-400 text-sm">Intimate:</span>
                        <div className="text-white font-medium">{selections.intimateBehavior.join(", ")}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role & Relationship */}
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30">
                  <h4 className="text-purple-400 font-bold text-lg mb-4 border-b border-purple-500/30 pb-2">
                    Role & Relationship
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Role:</span>
                      <div className="text-white font-medium">{selections.roleType?.[0] || "Not selected"}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Relationship:</span>
                      <div className="text-white font-medium">{selections.relationship || "Not selected"}</div>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-6 border border-green-500/30">
                  <h4 className="text-green-400 font-bold text-lg mb-4 border-b border-green-500/30 pb-2">Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Privacy:</span>
                      <div className={`font-medium ${selections.isPrivate ? "text-red-400" : "text-green-400"}`}>
                        {selections.isPrivate ? "Private" : "Public"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleFinalAction = () => {
    const newCharacter = createCharacter()
    
    if (!newCharacter) {
      console.error("Failed to create character")
      return
    }

    const hasPremiumFeatures =
      selections.roleType?.some((role) => ["Camgirl", "Massage Therapist", "Bunny Girl", "Succubus"].includes(role)) ||
      ["Sex Slave", "Stepmom", "Sugar Baby", "Stepdaughter"].includes(selections.relationship || "") ||
      selections.breastSize === "Huge" ||
      selections.buttSize === "Jiggly" ||
      selections.buttSize === "Bubble" ||
      selections.personality?.some((p) => ["Brat", "Slutty", "Loyal Pet"].includes(p)) ||
      selections.style === "hybrid"

    if (hasPremiumFeatures) {
      router.push("/premium")
    } else {
      router.push(`/chat/${newCharacter.id}`)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-[#1a0a24]">
        <div className="max-w-[1600px] mx-auto py-8 pl-4 pr-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <Flame className="h-10 w-10 text-pink-500" />
              Create my AI
            </h1>
            <ProgressBar />
          </div>

          {showValidationError && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500/20 border border-red-500 rounded-xl p-6 z-50 animate-bounce backdrop-blur-md">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Please make a selection to continue</span>
              </div>
            </div>
          )}

          <div
            className={`transition-all duration-300 ${isAnimating ? "opacity-0 transform translate-x-4" : "opacity-100 transform translate-x-0"}`}
          >
            {renderStep()}
          </div>

          <div className="flex justify-between items-center mt-16">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 px-10 py-4 text-lg"
            >
              <ArrowLeft className="mr-2 h-6 w-6" />
              Previous
            </Button>

            {currentStep === 8 ? (
              <Button
                onClick={handleFinalAction}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-16 py-6 rounded-full text-2xl font-medium"
              >
                Bring my AI to life
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={currentStep === 8}
                className={`bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 text-lg ${
                  shakeButton ? "animate-pulse" : ""
                }`}
              >
                Next
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
