"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Sidebar from "@/components/sidebar"

type PlanType = "Free" | "Lite" | "Basic" | "Premium"

interface DialogState {
  isOpen: boolean
  type: "subscribe" | "upgrade" | "downgrade" | "success" | "error" | "already-subscribed"
  targetPlan?: PlanType
  currentPlan?: PlanType
}

export default function PaymentPage() {
  const [currentSubscription, setCurrentSubscription] = useState<PlanType>("Free") // 模拟当前订阅状态
  const [dialog, setDialog] = useState<DialogState>({ isOpen: false, type: "subscribe" })
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = [
    {
      name: "Free" as PlanType,
      monthlyPrice: 0,
      annualPrice: 0,
      annualMonthlyPrice: 0,
      originalAnnualPrice: 0,
      popular: false,
      features: [
        "💗 30 Text messages / month",
        "💗 1 Picture / month",
        "💗 1 Voice message / month",
        "💗 Create 1 character",
        "💗 30-second voice call trial",
        "🚫 Cannot unlock NSFW traits",
        "🚫 Cannot use multi-picture (4/9) generation",
        "🚀 Standard response speed",
      ],
      note: "No credit card required",
    },
    {
      name: "Lite" as PlanType,
      monthlyPrice: 7.99,
      annualPrice: 95.88,
      annualMonthlyPrice: 7.99,
      originalAnnualPrice: 95.88,
      popular: false,
      features: [
        "💗 1000 Text messages / month",
        "💗 50 Pictures / month",
        "💗 60 Voice messages / month",
        "💗 Create up to 2 characters",
        "💗 3-minute voice call / month",
        "❌ NSFW traits not available",
        "❌ Multi-picture generation not supported",
        "🚀 Standard response speed",
      ],
      note: "Cancel anytime",
    },
    {
      name: "Basic" as PlanType,
      monthlyPrice: 14.99,
      annualPrice: 119,
      annualMonthlyPrice: 9.91,
      originalAnnualPrice: 179.88,
      popular: true,
      features: [
        "💗 3000 Text messages / month",
        "💗 150 Pictures / month",
        "💗 180 Voice messages / month",
        "💗 Create up to 10 characters",
        "💗 10-minute voice call / month",
        "❌ NSFW traits not available",
        "❌ Multi-picture generation not supported",
        "🚀 Standard response speed",
      ],
      note: "Cancel anytime",
    },
    {
      name: "Premium" as PlanType,
      monthlyPrice: 29.99,
      annualPrice: 229,
      annualMonthlyPrice: 19.08,
      originalAnnualPrice: 359.88,
      popular: false,
      features: [
        "💗 Unlimited Text messages",
        "💗 200 Pictures / month",
        "💗 Unlimited Voice messages",
        "💗 Create unlimited characters",
        "💗 Unlimited voice call time",
        "✅ Unlock NSFW and advanced character traits",
        "✅ Enable 4 / 9 picture generation",
        "💗 VIP response speed",
      ],
      note: "Cancel anytime",
    },
  ]

  const planHierarchy = { Free: 0, Lite: 1, Basic: 2, Premium: 3 }

  const calculateSavings = (originalPrice: number, currentPrice: number) => {
    if (originalPrice === 0 || originalPrice === currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  const handleSubscribeClick = (targetPlan: PlanType) => {
    if (targetPlan === "Free") return

    const currentLevel = planHierarchy[currentSubscription]
    const targetLevel = planHierarchy[targetPlan]

    if (currentSubscription === targetPlan) {
      // 逻辑 2: 已订阅相同档位
      setDialog({
        isOpen: true,
        type: "already-subscribed",
        targetPlan,
        currentPlan: currentSubscription,
      })
    } else if (currentLevel > targetLevel) {
      // 逻辑 3: 降级不允许
      setDialog({
        isOpen: true,
        type: "downgrade",
        targetPlan,
        currentPlan: currentSubscription,
      })
    } else if (currentLevel < targetLevel) {
      if (currentSubscription === "Free") {
        // 逻辑 1: 未订阅用户
        setDialog({
          isOpen: true,
          type: "subscribe",
          targetPlan,
          currentPlan: currentSubscription,
        })
      } else {
        // 逻辑 4: 升级
        setDialog({
          isOpen: true,
          type: "upgrade",
          targetPlan,
          currentPlan: currentSubscription,
        })
      }
    }
  }

  const handleConfirmSubscription = async () => {
    setIsProcessing(true)

    // 模拟支付流程
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 模拟网络请求

      // 随机模拟成功/失败 (90% 成功率)
      if (Math.random() > 0.1) {
        setCurrentSubscription(dialog.targetPlan!)
        setDialog({
          isOpen: true,
          type: "success",
          targetPlan: dialog.targetPlan,
          currentPlan: dialog.currentPlan,
        })
      } else {
        setDialog({
          isOpen: true,
          type: "error",
          targetPlan: dialog.targetPlan,
          currentPlan: dialog.currentPlan,
        })
      }
    } catch (error) {
      setDialog({
        isOpen: true,
        type: "error",
        targetPlan: dialog.targetPlan,
        currentPlan: dialog.currentPlan,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const closeDialog = () => {
    setDialog({ isOpen: false, type: "subscribe" })
  }

  const getButtonState = (planName: PlanType) => {
    if (planName === "Free") {
      return currentSubscription === "Free" ? "subscribed" : "downgrade"
    }

    const currentLevel = planHierarchy[currentSubscription]
    const planLevel = planHierarchy[planName]

    if (currentSubscription === planName) {
      return "current"
    } else if (currentLevel > planLevel) {
      return "downgrade"
    } else {
      return "available"
    }
  }

  const getUpgradeFeatures = (targetPlan: PlanType) => {
    switch (targetPlan) {
      case "Basic":
        return [
          "3× more messages, pictures and voices",
          "Up to 10 characters",
          "Longer voice call time",
          "Faster AI response",
        ]
      case "Premium":
        return [
          "Unlimited messages, voices and pictures",
          "NSFW & advanced traits",
          "Multi-picture generation (4/9)",
          "VIP AI response speed",
        ]
      default:
        return []
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-[#0e0314]">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Choose your plan. Unlock your Love Story.
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed">
              Ready to fall deeper? Upgrade to enjoy more messages, voices, images, and romantic possibilities.
            </p>
            <div className="mt-4 text-pink-400 text-lg">
              Current Plan: <span className="font-bold">{currentSubscription}</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const savings = calculateSavings(plan.originalAnnualPrice, plan.annualPrice)
              const buttonState = getButtonState(plan.name)

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 relative border-2 flex flex-col transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-br from-pink-500 to-pink-600 border-pink-400"
                      : "bg-[#1a0a24] border-[#3a1a44]"
                  } ${currentSubscription === plan.name ? "ring-2 ring-pink-400" : ""}`}
                  style={{ minHeight: "700px", minWidth: "280px" }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 right-6">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                        🔥 Most Popular
                      </div>
                    </div>
                  )}

                  {currentSubscription === plan.name && (
                    <div className="absolute -top-4 left-6">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        ✅ Current Plan
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-8">{plan.name}</h3>

                    <div className="space-y-5 mb-10">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-white text-base leading-relaxed">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-4 mb-8">
                    {/* Annual Pricing */}
                    <div
                      className={`rounded-xl p-5 border ${plan.popular ? "bg-black/20 border-pink-300" : "bg-[#2a1a34] border-[#4a2a54]"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-base font-medium">Annually</span>
                        {savings > 0 && (
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                            save {savings}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-300 text-sm">
                          {plan.originalAnnualPrice > 0 && plan.originalAnnualPrice !== plan.annualPrice && (
                            <div className="line-through">${plan.originalAnnualPrice}/year</div>
                          )}
                          {plan.annualPrice > 0 && <div>${plan.annualPrice}/year</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            ${plan.annualMonthlyPrice.toFixed(plan.annualMonthlyPrice === 0 ? 1 : 2)}
                          </div>
                          <div className="text-gray-300 text-sm">/Month</div>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Pricing */}
                    <div
                      className={`rounded-xl p-5 border ${plan.popular ? "bg-black/20 border-pink-300" : "bg-[#2a1a34] border-[#4a2a54]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white text-base font-medium">Monthly</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            ${plan.monthlyPrice.toFixed(plan.monthlyPrice === 0 ? 1 : 2)}
                          </div>
                          <div className="text-gray-300 text-sm">/Month</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      className={`w-full py-4 text-base font-semibold ${
                        buttonState === "subscribed" || buttonState === "current"
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : buttonState === "downgrade"
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : plan.popular
                              ? "bg-white text-pink-600 hover:bg-gray-100"
                              : "bg-white text-black hover:bg-gray-100"
                      }`}
                      disabled={
                        buttonState === "subscribed" || buttonState === "current" || buttonState === "downgrade"
                      }
                      onClick={() => handleSubscribeClick(plan.name)}
                    >
                      {buttonState === "subscribed"
                        ? "SUBSCRIBED"
                        : buttonState === "current"
                          ? "SUBSCRIBED"
                          : buttonState === "downgrade"
                            ? plan.name === "Free"
                              ? "DOWNGRADE NOT AVAILABLE"
                              : "DOWNGRADE NOT AVAILABLE"
                            : currentSubscription === "Free"
                              ? "SUBSCRIBE"
                              : "UPGRADE"}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-gray-300 text-sm">🕒 {plan.note}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <Dialog open={dialog.isOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-[#1a0a24] border-[#3a1a44] text-white max-w-md">
          {dialog.type === "subscribe" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  Unlock your Love Story 💘
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-center mt-4">
                  Subscribe to the {dialog.targetPlan} plan and start enjoying:
                  <ul className="mt-4 space-y-2 text-left">
                    <li>• More messages and voice interactions</li>
                    <li>• Multiple characters</li>
                    <li>• Exclusive image generation features</li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleConfirmSubscription}
                  disabled={isProcessing}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  {isProcessing ? "Processing..." : "Subscribe Now"}
                </Button>
                <Button onClick={closeDialog} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
              <div className="mt-4 p-3 bg-[#2a1a34] rounded-lg border border-[#3a1a44]">
                <p className="text-gray-400 text-sm flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Note: Plan changes will take effect immediately. No credit or refund will be applied.</span>
                </p>
              </div>
            </>
          )}

          {dialog.type === "upgrade" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">Upgrade to {dialog.targetPlan} Plan</DialogTitle>
                <DialogDescription className="text-gray-300 mt-4">
                  You're currently subscribed to the {dialog.currentPlan} Plan.
                  <br />
                  <br />
                  Switching to the {dialog.targetPlan} Plan unlocks:
                  <ul className="mt-4 space-y-2">
                    {getUpgradeFeatures(dialog.targetPlan!).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                  <br />
                  <strong>Note:</strong> Upgrading will replace your current plan immediately. No credit or refund will
                  be applied.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleConfirmSubscription}
                  disabled={isProcessing}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  {isProcessing ? "Processing..." : `Upgrade Now`}
                </Button>
                <Button onClick={closeDialog} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
              <div className="mt-4 p-3 bg-[#2a1a34] rounded-lg border border-[#3a1a44]">
                <p className="text-gray-400 text-sm flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Note: You won't receive a refund for unused time in your current plan.</span>
                </p>
              </div>
            </>
          )}

          {dialog.type === "downgrade" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">Current Plan: {dialog.currentPlan}</DialogTitle>
                <DialogDescription className="text-gray-300 text-center mt-4">
                  Downgrades are not supported at this time.
                  <br />
                  Please wait until your current plan expires.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center mt-6">
                <Button onClick={closeDialog} className="bg-pink-500 hover:bg-pink-600">
                  OK
                </Button>
              </div>
              <div className="mt-4 p-3 bg-[#2a1a34] rounded-lg border border-[#3a1a44]">
                <p className="text-gray-400 text-sm flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Note: Switching to a lower plan is not available while your current plan is active.</span>
                </p>
              </div>
            </>
          )}

          {dialog.type === "already-subscribed" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">Already Subscribed</DialogTitle>
                <DialogDescription className="text-gray-300 text-center mt-4">
                  You are already subscribed to this plan.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center mt-6">
                <Button onClick={closeDialog} className="bg-pink-500 hover:bg-pink-600">
                  OK
                </Button>
              </div>
              <div className="mt-4 p-3 bg-[#2a1a34] rounded-lg border border-[#3a1a44]">
                <p className="text-gray-400 text-sm flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Note: You are on this plan already. No further action is needed.</span>
                </p>
              </div>
            </>
          )}

          {dialog.type === "success" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-green-400">
                  🎉 Subscription Successful!
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-center mt-4">
                  You're now enjoying the {dialog.targetPlan} plan.
                  <br />
                  Your benefits have been activated. 💖
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center mt-6">
                <Button onClick={closeDialog} className="bg-green-500 hover:bg-green-600">
                  Awesome!
                </Button>
              </div>
              <div className="mt-4 p-3 bg-[#2a1a34] rounded-lg border border-[#3a1a44]">
                <p className="text-gray-400 text-sm flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Note: Your new plan is now active. Previous plan benefits are no longer in effect.</span>
                </p>
              </div>
            </>
          )}

          {dialog.type === "error" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center text-red-400">⚠️ Payment Failed</DialogTitle>
                <DialogDescription className="text-gray-300 text-center mt-4">
                  Something went wrong with your transaction.
                  <br />
                  Please try again or contact support if the issue persists.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 mt-6">
                <Button onClick={handleConfirmSubscription} className="flex-1 bg-pink-500 hover:bg-pink-600">
                  Try Again
                </Button>
                <Button onClick={closeDialog} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
              <div className="mt-4 p-3 bg-[#2a1a34] rounded-lg border border-[#3a1a44]">
                <p className="text-gray-400 text-sm flex items-start">
                  <span className="mr-2">💡</span>
                  <span>Note: Your current plan has not changed.</span>
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
