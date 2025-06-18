"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Lock, Flame, AlertCircle, Eye, EyeOff, Globe, Shield } from "lucide-react"
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
  interactionStyle?: string
  intimateBehavior?: string
  interactionFrequency?: string
  isPrivate?: boolean
}

export default function CreateLoverPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<Selection>({ isPrivate: false })
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [showValidationError, setShowValidationError] = useState(false)
  const [shakeButton, setShakeButton] = useState(false)

  // Auto-advance when selection is complete (only if autoAdvance is true)
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
          if (
            selections.interactionStyle &&
            selections.interactionFrequency
            // intimateBehavior is optional for free users
          ) {
            setTimeout(() => nextStep(), 800)
          }
          break
        case 7:
          if (selections.isPrivate !== undefined) {
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
        return !!(selections.interactionStyle && selections.interactionFrequency)
      case 7:
        return selections.isPrivate !== undefined
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
      setAutoAdvance(false) // Disable auto-advance when user manually goes back
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

  const handleLockedOptionClick = () => {
    router.push("/premium")
  }

  // 根据性格生成个性化欢迎消息
  const getWelcomeMessage = () => {
    const personality = selections.personality?.[0]
    switch (personality) {
      case "Nympho":
        return "I've been waiting for you... 😈"
      case "Innocent":
        return "Nice to meet you! I'm so excited to chat! 😊"
      case "Dominant":
        return "You're here. Good. Let's see what you're made of."
      case "Submissive":
        return "I'm here for you... whatever you need 😇"
      case "Playful":
        return "Hey there! Ready to have some fun? 😄"
      case "Romantic":
        return "I've been thinking about you all day... 💕"
      case "Mysterious":
        return "There's so much you don't know about me yet... 🌙"
      case "Confident":
        return "You made the right choice coming to me 😏"
      default:
        return "Hello! I'm excited to get to know you better! ✨"
    }
  }

  // 创建角色的完整逻辑
  const createCharacter = () => {
    const characterId = Date.now()
    const characterName = `${selections.personality?.[0] || "My"} ${selections.style || "AI"}`

    // 创建完整角色数据结构
    const newCharacter = {
      id: characterId,
      name: characterName,
      age: 22,
      occupation: selections.roleType?.[0] || "Friend",
      tags: selections.personality || ["Friendly"],
      followers: Math.floor(Math.random() * 1000000) + "K",
      description: `A ${selections.personality?.[0]?.toLowerCase() || "friendly"} ${selections.style?.toLowerCase() || "AI"} who loves ${selections.relationship?.toLowerCase() || "chatting"}. ${selections.bodyType} build with ${selections.personality?.join(", ").toLowerCase()} personality.`,
      images: [`/placeholder.svg?height=400&width=300&text=${characterName}`],
      createdAt: new Date().toISOString(),
      isPrivate: selections.isPrivate || false,
      creatorId: "user", // 用户创建的角色
      stats: {
        views: 0,
        likes: 0,
        chats: 0
      },
      // 角色属性
      attributes: {
        style: selections.style,
        roleType: selections.roleType,
        relationship: selections.relationship,
        bodyType: selections.bodyType,
        breastSize: selections.breastSize,
        buttSize: selections.buttSize,
        personality: selections.personality,
        interactionStyle: selections.interactionStyle,
        intimateBehavior: selections.intimateBehavior,
        interactionFrequency: selections.interactionFrequency
      },
      // 聊天系统需要的消息
      messages: [
        {
          id: 1,
          sender: "ai" as const,
          text: getWelcomeMessage(),
          timestamp: new Date().toISOString(),
          audioDuration: 8,
          hasImage: false,
        }
      ]
    }

    // 1. 保存到用户数据（用于资料页面）
    const existingUserData = JSON.parse(localStorage.getItem('mockUserData') || '{}')
    if (!existingUserData.characters) {
      existingUserData.characters = { private: [], public: [] }
    }

    const characterForProfile = {
      id: characterId,
      name: characterName,
      imageSrc: `/placeholder.svg?height=400&width=300&text=${characterName}`,
      tags: selections.personality || ["Friendly"],
      description: newCharacter.description,
      isPrivate: selections.isPrivate || false,
      createdAt: new Date().toISOString(),
      stats: newCharacter.stats
    }

    if (selections.isPrivate) {
      existingUserData.characters.private.push(characterForProfile)
    } else {
      existingUserData.characters.public.push(characterForProfile)
    }

    localStorage.setItem('mockUserData', JSON.stringify(existingUserData))

    // 2. 保存到聊天系统
    const existingChatCharacters = JSON.parse(localStorage.getItem('chatCharacters') || '{}')
    existingChatCharacters[characterId.toString()] = newCharacter
    localStorage.setItem('chatCharacters', JSON.stringify(existingChatCharacters))

    // 3. 触发数据更新事件
    window.dispatchEvent(new CustomEvent('userDataUpdated'))

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

  // 隐私选择器组件
  const PrivacySelector = () => (
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div
        className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          selections.isPrivate === false
            ? "bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/20"
            : "bg-[#2a1a34] border border-[#3a1a44] hover:border-green-400"
        }`}
        onClick={() => updateSelection("isPrivate", false)}
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <Globe className="h-10 w-10 text-green-400" />
          </div>
          <h3 className="text-white font-bold text-2xl mb-4">Public Character</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Other users can discover and view your character. Your character will appear in public listings and can receive likes and interactions.
          </p>
          <div className="bg-green-500/10 rounded-lg p-4">
            <div className="flex items-center justify-center text-green-400 text-sm">
              <Eye className="h-4 w-4 mr-2" />
              Discoverable by other users
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          selections.isPrivate === true
            ? "bg-purple-500/20 border-2 border-purple-500 shadow-lg shadow-purple-500/20"
            : "bg-[#2a1a34] border border-[#3a1a44] hover:border-purple-400"
        }`}
        onClick={() => updateSelection("isPrivate", true)}
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-purple-400" />
          </div>
          <h3 className="text-white font-bold text-2xl mb-4">Private Character</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Only you can see and use this character. Completely private and won't appear in any public listings.
          </p>
          <div className="bg-purple-500/10 rounded-lg p-4">
            <div className="flex items-center justify-center text-purple-400 text-sm">
              <EyeOff className="h-4 w-4 mr-2" />
              Visible only to you
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const OptionCard = ({
    option,
    isSelected,
    onClick,
    isLocked = false,
    image,
    description,
    className = "",
  }: {
    option: string
    isSelected: boolean
    onClick: () => void
    isLocked?: boolean
    image?: string
    description?: string
    className?: string
  }) => (
    <div
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? "bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
          : "bg-[#2a1a34] border border-[#3a1a44] hover:border-pink-400"
      } ${isLocked ? "opacity-60 blur-sm" : ""} ${className}`}
      onClick={isLocked ? handleLockedOptionClick : onClick}
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

      {isLocked && (
        <div className="absolute top-3 right-3 bg-yellow-500 rounded-full p-2">
          <Lock className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  )

  const RelationshipCard = ({
    option,
    icon,
    isSelected,
    onClick,
    isLocked = false,
  }: {
    option: string
    icon: string
    isSelected: boolean
    onClick: () => void
    isLocked?: boolean
  }) => (
    <div
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? "bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
          : "bg-[#2a1a34] border border-[#3a1a44] hover:border-pink-400"
      } ${isLocked ? "opacity-60 blur-sm" : ""}`}
      onClick={isLocked ? handleLockedOptionClick : onClick}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-white font-medium text-xl">{option}</h3>
      </div>

      {isLocked && (
        <div className="absolute top-3 right-3 bg-yellow-500 rounded-full p-2">
          <Lock className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Choose a Style</h2>
            <p className="text-gray-300 text-xl mb-12">Pick the visual style for your AI companion</p>

            <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { style: "Anime Style", image: "/placeholder.svg?height=300&width=300&text=Anime+Style" },
                { style: "Realistic Style", image: "/placeholder.svg?height=300&width=300&text=Realistic+Style" },
                { style: "Hybrid Style", image: "/placeholder.svg?height=300&width=300&text=Hybrid+Style" },
              ].map((item) => (
                <OptionCard
                  key={item.style}
                  option={item.style}
                  image={item.image}
                  isSelected={selections.style === item.style}
                  onClick={() => updateSelection("style", item.style)}
                />
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Role Type</h2>
            <p className="text-gray-300 text-xl mb-12">What kind of character do you want? (Select multiple)</p>

            <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { role: "Schoolgirl", image: "/placeholder.svg?height=200&width=200&text=Schoolgirl" },
                { role: "Boss", image: "/placeholder.svg?height=200&width=200&text=Boss" },
                { role: "Plumber", image: "/placeholder.svg?height=200&width=200&text=Plumber" },
                { role: "Monster", image: "/placeholder.svg?height=200&width=200&text=Monster", isLocked: true },
                { role: "Femboy", image: "/placeholder.svg?height=200&width=200&text=Femboy", isLocked: true },
                { role: "MILF", image: "/placeholder.svg?height=200&width=200&text=MILF", isLocked: true },
                { role: "Teacher", image: "/placeholder.svg?height=200&width=200&text=Teacher", isLocked: true },
                { role: "Nurse", image: "/placeholder.svg?height=200&width=200&text=Nurse" },
              ].map((item) => (
                <OptionCard
                  key={item.role}
                  option={item.role}
                  image={item.image}
                  isSelected={selections.roleType?.includes(item.role) || false}
                  onClick={() => toggleArraySelection("roleType", item.role)}
                  isLocked={item.isLocked}
                />
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Relationship</h2>
            <p className="text-gray-300 text-xl mb-12">What's your relationship with this character?</p>

            <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { relationship: "Girlfriend", icon: "💕" },
                { relationship: "Friend", icon: "👫" },
                { relationship: "Roommate", icon: "🏠" },
                { relationship: "Neighbor", icon: "🏘️" },
                { relationship: "Step Sister", icon: "👭", isLocked: true },
                { relationship: "Step Mom", icon: "👩‍👧", isLocked: true },
                { relationship: "Stranger", icon: "❓" },
                { relationship: "Coworker", icon: "💼" },
              ].map((item) => (
                <RelationshipCard
                  key={item.relationship}
                  option={item.relationship}
                  icon={item.icon}
                  isSelected={selections.relationship === item.relationship}
                  onClick={() => updateSelection("relationship", item.relationship)}
                  isLocked={item.isLocked}
                />
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Physical Attributes</h2>
            <p className="text-gray-300 text-xl mb-12">Customize the physical appearance</p>

            <div className="space-y-16">
              {/* Body Type */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Body Type</h3>
                <div className="grid grid-cols-6 gap-4 max-w-6xl mx-auto">
                  {["Slim", "Athletic", "Medium", "Voluptuous", "Chubby", "Small"].map((type) => (
                    <OptionCard
                      key={type}
                      option={type}
                      image={`/placeholder.svg?height=180&width=180&text=${type}`}
                      isSelected={selections.bodyType === type}
                      onClick={() => updateSelection("bodyType", type)}
                      className="p-4"
                    />
                  ))}
                </div>
              </div>

              {/* Breast Size */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Breast Size</h3>
                <div className="grid grid-cols-5 gap-4 max-w-5xl mx-auto">
                  {[
                    { size: "Flat", isLocked: false },
                    { size: "Small", isLocked: false },
                    { size: "Medium", isLocked: false },
                    { size: "Large", isLocked: false },
                    { size: "Huge", isLocked: true },
                  ].map((item) => (
                    <OptionCard
                      key={item.size}
                      option={item.size}
                      image={`/placeholder.svg?height=180&width=180&text=${item.size}`}
                      isSelected={selections.breastSize === item.size}
                      onClick={() => updateSelection("breastSize", item.size)}
                      isLocked={item.isLocked}
                      className="p-4"
                    />
                  ))}
                </div>
              </div>

              {/* Butt Size */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Butt Size</h3>
                <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {["Small", "Medium", "Large", "Jiggly"].map((size) => (
                    <OptionCard
                      key={size}
                      option={size}
                      image={`/placeholder.svg?height=180&width=180&text=${size}`}
                      isSelected={selections.buttSize === size}
                      onClick={() => updateSelection("buttSize", size)}
                      className="p-4"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Personality</h2>
            <p className="text-gray-300 text-xl mb-12">Choose personality traits (Select multiple)</p>

            <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { trait: "Nympho", icon: "😈", description: "Highly passionate and seductive" },
                { trait: "Innocent", icon: "😇", description: "Sweet and pure-hearted" },
                { trait: "Dominant", icon: "👑", description: "Takes charge and leads" },
                { trait: "Submissive", icon: "🙇‍♀️", description: "Gentle and accommodating" },
                { trait: "Playful", icon: "😄", description: "Fun-loving and energetic" },
                { trait: "Romantic", icon: "💕", description: "Loving and affectionate" },
                { trait: "Mysterious", icon: "🌙", description: "Enigmatic and intriguing" },
                { trait: "Confident", icon: "💪", description: "Self-assured and bold" },
              ].map((item) => (
                <div
                  key={item.trait}
                  className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selections.personality?.includes(item.trait)
                      ? "bg-pink-500/20 border-2 border-pink-500 shadow-lg shadow-pink-500/20"
                      : "bg-[#2a1a34] border border-[#3a1a44] hover:border-pink-400"
                  }`}
                  onClick={() => toggleArraySelection("personality", item.trait)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-white font-medium text-xl mb-2">{item.trait}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Interaction Preferences</h2>
            <p className="text-gray-300 text-xl mb-12">How should your AI behave?</p>

            <div className="space-y-16">
              {/* Interaction Style */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Interaction Style</h3>
                <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    { style: "Flirty", description: "Playful and teasing" },
                    { style: "Sweet", description: "Kind and caring" },
                    { style: "Bold", description: "Direct and confident" },
                  ].map((item) => (
                    <OptionCard
                      key={item.style}
                      option={item.style}
                      description={item.description}
                      isSelected={selections.interactionStyle === item.style}
                      onClick={() => updateSelection("interactionStyle", item.style)}
                    />
                  ))}
                </div>
              </div>

              {/* Interaction Frequency */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Response Style</h3>
                <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    { freq: "Quick", description: "Short, frequent messages" },
                    { freq: "Detailed", description: "Longer, descriptive responses" },
                    { freq: "Balanced", description: "Mix of both styles" },
                  ].map((item) => (
                    <OptionCard
                      key={item.freq}
                      option={item.freq}
                      description={item.description}
                      isSelected={selections.interactionFrequency === item.freq}
                      onClick={() => updateSelection("interactionFrequency", item.freq)}
                    />
                  ))}
                </div>
              </div>

              {/* Intimate Behavior (Premium) */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Intimate Behavior (Premium)</h3>
                <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    { behavior: "Romantic", description: "Focus on emotional connection", isLocked: true },
                    { behavior: "Passionate", description: "Intense and intimate", isLocked: true },
                    { behavior: "Adventurous", description: "Experimental and bold", isLocked: true },
                  ].map((item) => (
                    <OptionCard
                      key={item.behavior}
                      option={item.behavior}
                      description={item.description}
                      isSelected={selections.intimateBehavior === item.behavior}
                      onClick={() => updateSelection("intimateBehavior", item.behavior)}
                      isLocked={item.isLocked}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Privacy Settings</h2>
            <p className="text-gray-300 text-xl mb-12">Choose whether your character is public or private</p>
            <PrivacySelector />
          </div>
        )

      case 8:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Preview Your AI</h2>
            <p className="text-gray-300 text-xl mb-12">Here's what you've created!</p>

            <div className="max-w-4xl mx-auto bg-[#2a1a34] rounded-2xl p-8 border border-[#3a1a44]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500">
                    <Image
                      src={`/placeholder.svg?height=80&width=80&text=${selections.personality?.[0] || "AI"}`}
                      alt="Character"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white">
                      {`${selections.personality?.[0] || "My"} ${selections.style || "AI"}`}
                    </h3>
                    <p className="text-gray-400">{selections.roleType?.[0] || "Friend"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selections.isPrivate ? (
                    <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                      <EyeOff className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 text-sm">Private</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <Eye className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Public</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-6 mb-8">
                {/* Style */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Style</h3>
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=100&width=100&text=${selections.style?.split(" ")[0]}`}
                      alt="Style"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white capitalize text-sm">{selections.style}</p>
                </div>

                {/* Age */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Age</h3>
                  <div className="w-24 h-24 mx-auto mb-2 bg-[#3a1a44] rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">20s</span>
                  </div>
                  <p className="text-white text-sm">20s</p>
                </div>

                {/* Eyes Color */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Eyes Color</h3>
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=100&width=100&text=Blue+Eyes"
                      alt="Eyes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-sm">Blue</p>
                </div>

                {/* Hair Style */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Hair Style</h3>
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=100&width=100&text=Short+Hair"
                      alt="Hair"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-sm">Short</p>
                </div>

                {/* Hair Color */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Hair Color</h3>
                  <div className="w-24 h-24 mx-auto mb-2 bg-amber-600 rounded-lg"></div>
                  <p className="text-white text-sm">Brunette</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-6">
                {/* Body Type */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Body Type</h3>
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=100&width=100&text=${selections.bodyType}`}
                      alt="Body"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-sm">{selections.bodyType}</p>
                </div>

                {/* Breast Size */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Breast Size</h3>
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=100&width=100&text=${selections.breastSize}`}
                      alt="Breast"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-sm">{selections.breastSize}</p>
                </div>

                {/* Butt Size */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Butt Size</h3>
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=100&width=100&text=${selections.buttSize}`}
                      alt="Butt"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-sm">{selections.buttSize}</p>
                </div>

                {/* Personality */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Personality</h3>
                  <div className="w-24 h-24 mx-auto mb-2 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-pink-400 text-2xl">😈</span>
                  </div>
                  <p className="text-white text-sm">{selections.personality?.[0]}</p>
                </div>

                {/* Relationship */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-3">Relationship</h3>
                  <div className="w-24 h-24 mx-auto mb-2 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-2xl">💕</span>
                  </div>
                  <p className="text-white text-sm">{selections.relationship}</p>
                </div>
              </div>

              {/* 预览欢迎消息 */}
              <div className="mt-8 bg-[#1a0a24] rounded-lg p-6">
                <h4 className="text-white font-medium mb-3">First message preview:</h4>
                <p className="text-gray-300 italic">"{getWelcomeMessage()}"</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleFinalAction = () => {
    // 创建角色
    const newCharacter = createCharacter()
    
    // 检查是否有付费功能
    const hasPremiumFeatures =
      selections.roleType?.some((role) => ["MILF", "Femboy", "Monster", "Teacher"].includes(role)) ||
      ["Step Sister", "Step Mom"].includes(selections.relationship || "") ||
      selections.breastSize === "Huge" ||
      selections.intimateBehavior

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
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500/20 border border-red-500 rounded-lg p-4 z-50 animate-bounce">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>Please make a selection to continue</span>
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
