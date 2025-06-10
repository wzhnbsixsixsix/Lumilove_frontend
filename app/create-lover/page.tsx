"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Lock, Flame, AlertCircle } from "lucide-react"
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
}

export default function CreateLoverPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState<Selection>({})
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

    if (currentStep < 7) {
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

  const ProgressBar = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full transition-all duration-300 ${
              step <= currentStep ? "bg-pink-500" : "bg-gray-600"
            }`}
          />
          {step < 7 && (
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
          <Lock className="h-5 w-5 text-black" />
        </div>
      )}

      {isSelected && !isLocked && (
        <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-2">
          <div className="h-4 w-4 bg-white rounded-full" />
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
      className={`relative p-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
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
          <Lock className="h-5 w-5 text-black" />
        </div>
      )}

      {isSelected && !isLocked && (
        <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-2">
          <div className="h-4 w-4 bg-white rounded-full" />
        </div>
      )}
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Choose Your Fantasy Style</h2>
            <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto">
              <OptionCard
                option="Realistic"
                isSelected={selections.style === "realistic"}
                onClick={() => updateSelection("style", "realistic")}
                image="/placeholder.svg?height=300&width=300&text=Realistic+Style"
              />
              <OptionCard
                option="Anime"
                isSelected={selections.style === "anime"}
                onClick={() => updateSelection("style", "anime")}
                image="/placeholder.svg?height=300&width=300&text=Anime+Style"
              />
              <OptionCard
                option="Hybrid"
                isSelected={selections.style === "hybrid"}
                onClick={() => updateSelection("style", "hybrid")}
                image="/placeholder.svg?height=300&width=300&text=Hybrid+Style"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Pick Your Role Type</h2>
            <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[
                { name: "Schoolgirl", locked: false },
                { name: "MILF", locked: true },
                { name: "Femboy", locked: true },
                { name: "Monster", locked: true },
                { name: "Plumber", locked: false },
                { name: "Boss", locked: false },
                { name: "Nurse", locked: false },
                { name: "Teacher", locked: true },
              ].map((role) => (
                <OptionCard
                  key={role.name}
                  option={role.name}
                  isSelected={selections.roleType?.includes(role.name) || false}
                  onClick={() => toggleArraySelection("roleType", role.name)}
                  isLocked={role.locked}
                  image={`/placeholder.svg?height=200&width=200&text=${role.name}`}
                />
              ))}
            </div>
            {selections.roleType &&
              selections.roleType.some((role) => ["MILF", "Femboy", "Monster", "Teacher"].includes(role)) && (
                <div className="text-center text-yellow-400 text-sm">🔒 Some roles require VIP subscription</div>
              )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Relationship</h2>
            <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto">
              {[
                { name: "Girlfriend", locked: false, icon: "💕" },
                { name: "Mistress", locked: false, icon: "👑" },
                { name: "One Night Stand", locked: false, icon: "🌙" },
                { name: "Step Sister", locked: true, icon: "💖" },
                { name: "Step Mom", locked: true, icon: "🔥" },
                { name: "Best Friend", locked: false, icon: "👯" },
                { name: "Colleague", locked: false, icon: "💼" },
                { name: "Stranger", locked: false, icon: "❓" },
              ].map((rel) => (
                <RelationshipCard
                  key={rel.name}
                  option={rel.name}
                  icon={rel.icon}
                  isSelected={selections.relationship === rel.name}
                  onClick={() => updateSelection("relationship", rel.name)}
                  isLocked={rel.locked}
                />
              ))}
            </div>
            {["Step Sister", "Step Mom"].includes(selections.relationship || "") && (
              <div className="text-center bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-yellow-400">🔒 Upgrade to Unlock</p>
                <p className="text-gray-300 text-sm">Premium relationships require subscription</p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Body Customization</h2>

            <div className="space-y-10">
              <div>
                <h3 className="text-2xl text-white mb-6">Body Type</h3>
                <div className="grid grid-cols-4 gap-6">
                  {["Slim", "Athletic", "Chubby", "Voluptuous"].map((type) => (
                    <OptionCard
                      key={type}
                      option={type}
                      isSelected={selections.bodyType === type}
                      onClick={() => updateSelection("bodyType", type)}
                      image={`/placeholder.svg?height=180&width=180&text=${type}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl text-white mb-6">Breast Size</h3>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { name: "Small", locked: false },
                    { name: "Medium", locked: false },
                    { name: "Large", locked: false },
                    { name: "Huge", locked: true },
                  ].map((size) => (
                    <OptionCard
                      key={size.name}
                      option={size.name}
                      isSelected={selections.breastSize === size.name}
                      onClick={() => updateSelection("breastSize", size.name)}
                      isLocked={size.locked}
                      image={`/placeholder.svg?height=180&width=180&text=${size.name}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl text-white mb-6">Butt Size</h3>
                <div className="grid grid-cols-4 gap-6">
                  {["Flat", "Medium", "Large", "Jiggly"].map((size) => (
                    <OptionCard
                      key={size}
                      option={size}
                      isSelected={selections.buttSize === size}
                      onClick={() => updateSelection("buttSize", size)}
                      image={`/placeholder.svg?height=180&width=180&text=${size}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Personality</h2>
            <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { name: "Nympho", icon: "🔥", desc: "Insatiable, passionate, and constantly craving intimacy." },
                { name: "Submissive", icon: "💖", desc: "Obedient, yielding, and happy to follow." },
                { name: "Mean", icon: "❄️", desc: "Cold, dismissive, and often sarcastic." },
                { name: "Temptress", icon: "😈", desc: "Flirtatious, playful, and always leaving you wanting more." },
                { name: "Innocent", icon: "😇", desc: "Optimistic, naive, and sees world with wonder." },
                { name: "Dominant", icon: "👑", desc: "Assertive, controlling, and commanding." },
              ].map((personality) => (
                <OptionCard
                  key={personality.name}
                  option={personality.name}
                  isSelected={selections.personality?.includes(personality.name) || false}
                  onClick={() => toggleArraySelection("personality", personality.name)}
                  description={personality.desc}
                  className="min-h-[200px]"
                />
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Behavioral Preferences</h2>

            <div className="space-y-12">
              <div>
                <h3 className="text-2xl text-white mb-6">✨ Interaction Style</h3>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { name: "Flirty", desc: "Playful and charming" },
                    { name: "Teasing", desc: "Loves to tease and provoke" },
                    { name: "Obedient", desc: "Always ready to please" },
                    { name: "Playful", desc: "Fun and mischievous" },
                    { name: "Possessive", desc: "Wants you all to herself" },
                  ].map((style) => (
                    <OptionCard
                      key={style.name}
                      option={style.name}
                      isSelected={selections.interactionStyle === style.name}
                      onClick={() => updateSelection("interactionStyle", style.name)}
                      description={style.desc}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl text-white mb-6">🔥 Intimate Behaviors (PRO Exclusive)</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { name: "Likes Sexting", desc: "Sends naughty messages" },
                    { name: "Sends NSFW", desc: "Shares intimate photos" },
                    { name: "Jealous Lover", desc: "Gets possessive and jealous" },
                    { name: "Public Flirt", desc: "Flirts in public places" },
                  ].map((behavior) => (
                    <OptionCard
                      key={behavior.name}
                      option={behavior.name}
                      isSelected={selections.intimateBehavior === behavior.name}
                      onClick={() => updateSelection("intimateBehavior", behavior.name)}
                      isLocked={true}
                      description={behavior.desc}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl text-white mb-6">📅 Interaction Frequency</h3>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { name: "Daily Messages", desc: "Regular daily check-ins" },
                    { name: "Late-night Chats", desc: "Prefers evening conversations" },
                    { name: "Surprise Selfies", desc: "Sends random photos" },
                  ].map((freq) => (
                    <OptionCard
                      key={freq.name}
                      option={freq.name}
                      isSelected={selections.interactionFrequency === freq.name}
                      onClick={() => updateSelection("interactionFrequency", freq.name)}
                      description={freq.desc}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Summary</h2>

            <div className="max-w-6xl mx-auto">
              <div className="bg-[#2a1a34] rounded-xl p-8 border border-[#3a1a44]">
                <div className="grid grid-cols-5 gap-6 mb-8">
                  {/* Style */}
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-3">Style</h3>
                    <div className="relative w-24 h-24 mx-auto mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=100&width=100&text=${selections.style}`}
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
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleFinalAction = () => {
    // Check if user has premium features selected
    const hasPremiumFeatures =
      selections.roleType?.some((role) => ["MILF", "Femboy", "Monster", "Teacher"].includes(role)) ||
      ["Step Sister", "Step Mom"].includes(selections.relationship || "") ||
      selections.breastSize === "Huge"

    if (hasPremiumFeatures) {
      router.push("/premium")
    } else {
      router.push("/chat/new-character")
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

            {currentStep === 7 ? (
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
                disabled={currentStep === 7}
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
