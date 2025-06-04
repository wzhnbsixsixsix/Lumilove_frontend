"use client"

import { useState } from "react"
import { Check, CreditCard, ChevronDown, Shield, Star, Gift, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"

export default function PaymentPage() {
  const [showMorePaymentOptions, setShowMorePaymentOptions] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual")
  const [selectedCoinPackage, setSelectedCoinPackage] = useState<number | null>(1)

  const benefits = [
    "Create your own characters",
    "AI video generation",
    "AI image generation",
    "Request photos",
    "Voice & video calls",
    "1000 coins monthly",
    "Priority access to new features",
  ]

  const coinPackages = [
    {
      id: 0,
      name: "Starter Pack",
      icon: "✨",
      price: 4.99,
      coins: 5,
      bonus: null,
      popular: false,
      valueText: null,
    },
    {
      id: 1,
      name: "Popular Pack",
      icon: "🔥",
      price: 9.99,
      coins: 12,
      bonus: null,
      popular: true,
      valueText: "Best Value",
    },
    {
      id: 2,
      name: "Premium Pack",
      icon: "💎",
      price: 19.99,
      coins: 30,
      bonus: "+5 Bonus Coins",
      popular: false,
      valueText: "Most Popular",
    },
    {
      id: 3,
      name: "Collector's Pack",
      icon: "🏆",
      price: 59.99,
      coins: 100,
      bonus: "+1 VIP Photo Pack",
      popular: false,
      valueText: "Best Deal",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-[#0e0314]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              🎉 Unlock Premium Features
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Choose the plan that works best for you and start enjoying premium features today
            </p>
          </div>

          <Tabs defaultValue="subscribe" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#1a0a24] p-1 rounded-xl">
              <TabsTrigger
                value="subscribe"
                className="text-lg py-3 rounded-lg data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                <Star className="h-4 w-4 mr-2" /> Subscribe
              </TabsTrigger>
              <TabsTrigger
                value="coins"
                className="text-lg py-3 rounded-lg data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" /> Buy Coins
              </TabsTrigger>
            </TabsList>

            {/* Subscribe Tab Content */}
            <TabsContent value="subscribe" className="space-y-8">
              <div className="bg-[#1a0a24] rounded-xl p-6 border border-[#3a1a44]">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Benefits */}
                  <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold mb-6">Premium Benefits</h2>
                    <div className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-pink-500 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-3 bg-[#2a1a34] rounded-lg">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-pink-400 mr-2" />
                        <span className="text-sm text-gray-300">Secure payment & easy cancellation anytime</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="md:w-1/2">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Select Plan</h2>
                      <div className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm font-medium">
                        75% OFF First Period
                      </div>
                    </div>

                    {/* Plan Toggle */}
                    <div className="bg-[#2a1a34] p-2 rounded-lg flex mb-6">
                      <button
                        className={`flex-1 py-3 rounded-md text-center transition-colors ${
                          selectedPlan === "monthly" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setSelectedPlan("monthly")}
                      >
                        Monthly
                      </button>
                      <button
                        className={`flex-1 py-3 rounded-md text-center transition-colors ${
                          selectedPlan === "annual" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setSelectedPlan("annual")}
                      >
                        Annual <span className="text-xs">(-50%)</span>
                      </button>
                    </div>

                    {/* Plan Details */}
                    <div className="bg-[#2a1a34] rounded-xl p-6 mb-6 border-2 border-pink-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {selectedPlan === "monthly" ? "Monthly" : "Annual"} Plan
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {selectedPlan === "monthly" ? "Billed monthly" : "Billed annually (best value)"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className="text-gray-400 line-through mr-2">
                              ${selectedPlan === "monthly" ? "19.99" : "239.88"}
                            </span>
                            <span className="text-2xl font-bold">${selectedPlan === "monthly" ? "9.99" : "59.99"}</span>
                          </div>
                          <p className="text-pink-400 text-sm">
                            {selectedPlan === "monthly" ? "First month, then $19.99/mo" : "First year, then $119.99/yr"}
                          </p>
                        </div>
                      </div>

                      {selectedPlan === "annual" && (
                        <div className="bg-[#3a1a44] p-3 rounded-lg mb-4">
                          <div className="flex items-center">
                            <Gift className="h-5 w-5 text-pink-400 mr-2" />
                            <span className="text-sm">
                              <span className="text-pink-400 font-medium">Save 75%</span> compared to monthly plan
                            </span>
                          </div>
                        </div>
                      )}

                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 h-auto text-lg font-medium">
                        Subscribe Now
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will
                      automatically renew unless canceled at least 24 hours before the end of the current period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="bg-[#1a0a24] rounded-xl p-6 border border-[#3a1a44]">
                <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                    <CreditCard className="h-5 w-5 mr-2" /> Credit Card
                  </button>
                  <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                    </svg>
                    PayPal
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    className="text-gray-400 hover:text-pink-400 flex items-center text-sm"
                    onClick={() => setShowMorePaymentOptions(!showMorePaymentOptions)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 mr-1 transition-transform ${showMorePaymentOptions ? "rotate-180" : ""}`}
                    />
                    More payment options
                  </button>

                  {showMorePaymentOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fadeIn">
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3c-2.209 0-4 1.791-4 4v2h-1v6h10v-6h-1v-2c0-2.209-1.791-4-4-4zm0 2c1.105 0 2 .895 2 2v2h-4v-2c0-1.105.895-2 2-2z" />
                        </svg>
                        Cryptocurrency
                      </button>
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 16.947V17h-2v-.053c-2.015-.177-3.5-1.118-3.5-2.947h2c0 .75.81 1.5 2.5 1.5 1.131 0 2.5-.672 2.5-1.5 0-.945-.993-1.5-2.5-1.5-2.237 0-4.5-1.269-4.5-3.5s1.545-3.473 3.5-3.947V5h2v.053c1.990.173 3.5 1.12 3.5 2.947h-2c0-.75-.81-1.5-2.5-1.5-1.131 0-2.5.672-2.5 1.5 0 .945.993 1.5 2.5 1.5 2.237 0 4.5 1.269 4.5 3.5s-1.545 3.473-3.5 3.947z" />
                        </svg>
                        Bank Transfer
                      </button>
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.813 3.838A10.14 10.14 0 0012 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-1.342-.265-2.643-.763-3.838m-3.22 2.877c.355 0 .687.093.977.256a1.687 1.687 0 01.696.69c.163.29.256.622.256.977a1.687 1.687 0 01-.256.977 1.687 1.687 0 01-.696.69 1.687 1.687 0 01-.977.256 1.687 1.687 0 01-.977-.256 1.687 1.687 0 01-.69-.69 1.687 1.687 0 01-.256-.977c0-.355.093-.687.256-.977a1.687 1.687 0 01.69-.69 1.687 1.687 0 01.977-.256M12 20a8 8 0 01-8-8c0-2.09.808-4.08 2.277-5.598a1.686 1.686 0 01-.277.934 1.687 1.687 0 01-.69.69 1.687 1.687 0 01-.977.256c-.355 0-.687-.093-.977-.256a1.687 1.687 0 01-.69-.69A1.687 1.687 0 012.41 6.36c0-.355.093-.687.256-.977.163-.29.4-.527.69-.69a1.687 1.687 0 01.977-.256c.355 0 .687.093.977.256.29.163.527.4.69.69.163.29.256.622.256.977 0 .355-.093.687-.256.977-.13.232-.312.432-.536.58A6.016 6.016 0 0112 4a6 6 0 016 6v3.5c0 .463.18.908.504 1.232.324.324.769.504 1.232.504.463 0 .908-.18 1.232-.504.324-.324.504-.769.504-1.232V10a8 8 0 01-8 10z" />
                        </svg>
                        Apple Pay
                      </button>
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 17.25h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5zm0-3.75h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5zm0-3.75h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5z" />
                        </svg>
                        Google Pay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Coins Tab Content */}
            <TabsContent value="coins" className="space-y-8">
              <div className="bg-[#1a0a24] rounded-xl p-6 border border-[#3a1a44]">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-3">Purchase Coins</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Coins can be used to unlock exclusive content, request photos, generate custom images, and more
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {coinPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`bg-[#2a1a34] rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 relative ${
                        selectedCoinPackage === pkg.id ? "border-2 border-pink-500" : "border border-[#3a1a44]"
                      }`}
                      onClick={() => setSelectedCoinPackage(pkg.id)}
                    >
                      {pkg.popular && (
                        <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                          Popular
                        </div>
                      )}
                      {pkg.valueText && (
                        <div className="absolute top-3 left-3 bg-[#3a1a44] text-pink-400 px-2 py-1 rounded-md text-xs font-medium">
                          {pkg.valueText}
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="text-3xl mr-3">{pkg.icon}</div>
                          <h3 className="text-xl font-bold">{pkg.name}</h3>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-full border-2 ${
                            selectedCoinPackage === pkg.id ? "border-pink-500 bg-pink-500" : "border-gray-500"
                          } flex items-center justify-center`}
                        >
                          {selectedCoinPackage === pkg.id && <div className="h-3 w-3 bg-white rounded-full"></div>}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-3xl font-bold">${pkg.price}</div>
                        <div className="bg-[#3a1a44] px-4 py-2 rounded-full">
                          <span className="text-yellow-400">💎</span> {pkg.coins} coins
                        </div>
                      </div>
                      {pkg.bonus && (
                        <div className="bg-[#3a1a44] p-3 rounded-lg mb-4 text-center">
                          <span className="text-pink-400">🎁 {pkg.bonus}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 h-auto text-xl font-medium">
                  Purchase Coins
                </Button>
              </div>

              {/* What you can do with coins */}
              <div className="bg-[#1a0a24] rounded-xl p-6 border border-[#3a1a44]">
                <h3 className="text-xl font-bold mb-4">What You Can Do With Coins</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#2a1a34] p-4 rounded-lg">
                    <div className="text-3xl mb-2">🖼️</div>
                    <h4 className="text-lg font-medium mb-1">Unlock Photo Packs</h4>
                    <p className="text-sm text-gray-400">
                      Access exclusive photo collections of your favorite characters
                    </p>
                  </div>
                  <div className="bg-[#2a1a34] p-4 rounded-lg">
                    <div className="text-3xl mb-2">📸</div>
                    <h4 className="text-lg font-medium mb-1">Request Photos</h4>
                    <p className="text-sm text-gray-400">Ask for custom photos in specific outfits or scenarios</p>
                  </div>
                  <div className="bg-[#2a1a34] p-4 rounded-lg">
                    <div className="text-3xl mb-2">🎨</div>
                    <h4 className="text-lg font-medium mb-1">Generate Images</h4>
                    <p className="text-sm text-gray-400">Create custom AI-generated images with your preferences</p>
                  </div>
                </div>
              </div>

              {/* Payment methods - same as subscribe tab */}
              <div className="bg-[#1a0a24] rounded-xl p-6 border border-[#3a1a44]">
                <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                    <CreditCard className="h-5 w-5 mr-2" /> Credit Card
                  </button>
                  <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                    </svg>
                    PayPal
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    className="text-gray-400 hover:text-pink-400 flex items-center text-sm"
                    onClick={() => setShowMorePaymentOptions(!showMorePaymentOptions)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 mr-1 transition-transform ${showMorePaymentOptions ? "rotate-180" : ""}`}
                    />
                    More payment options
                  </button>

                  {showMorePaymentOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fadeIn">
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3c-2.209 0-4 1.791-4 4v2h-1v6h10v-6h-1v-2c0-2.209-1.791-4-4-4zm0 2c1.105 0 2 .895 2 2v2h-4v-2c0-1.105.895-2 2-2z" />
                        </svg>
                        Cryptocurrency
                      </button>
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 16.947V17h-2v-.053c-2.015-.177-3.5-1.118-3.5-2.947h2c0 .75.81 1.5 2.5 1.5 1.131 0 2.5-.672 2.5-1.5 0-.945-.993-1.5-2.5-1.5-2.237 0-4.5-1.269-4.5-3.5s1.545-3.473 3.5-3.947V5h2v.053c1.990.173 3.5 1.12 3.5 2.947h-2c0-.75-.81-1.5-2.5-1.5-1.131 0-2.5.672-2.5 1.5 0 .945.993 1.5 2.5 1.5 2.237 0 4.5 1.269 4.5 3.5s-1.545 3.473-3.5 3.947z" />
                        </svg>
                        Bank Transfer
                      </button>
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.813 3.838A10.14 10.14 0 0012 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-1.342-.265-2.643-.763-3.838m-3.22 2.877c.355 0 .687.093.977.256a1.687 1.687 0 01.696.69c.163.29.256.622.256.977a1.687 1.687 0 01-.256.977 1.687 1.687 0 01-.696.69 1.687 1.687 0 01-.977.256 1.687 1.687 0 01-.977-.256 1.687 1.687 0 01-.69-.69 1.687 1.687 0 01-.256-.977c0-.355.093-.687.256-.977a1.687 1.687 0 01.69-.69 1.687 1.687 0 01.977-.256M12 20a8 8 0 01-8-8c0-2.09.808-4.08 2.277-5.598a1.686 1.686 0 01-.277.934 1.687 1.687 0 01-.69.69 1.687 1.687 0 01-.977.256c-.355 0-.687-.093-.977-.256a1.687 1.687 0 01-.69-.69A1.687 1.687 0 012.41 6.36c0-.355.093-.687.256-.977.163-.29.4-.527.69-.69a1.687 1.687 0 01.977-.256c.355 0 .687.093.977.256.29.163.527.4.69.69.163.29.256.622.256.977 0 .355-.093.687-.256.977-.13.232-.312.432-.536.58A6.016 6.016 0 0112 4a6 6 0 016 6v3.5c0 .463.18.908.504 1.232.324.324.769.504 1.232.504.463 0 .908-.18 1.232-.504.324-.324.504-.769.504-1.232V10a8 8 0 01-8 10z" />
                        </svg>
                        Apple Pay
                      </button>
                      <button className="flex items-center justify-center bg-[#2a1a34] hover:bg-[#3a1a44] py-4 rounded-lg transition-colors">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 17.25h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5zm0-3.75h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5zm0-3.75h-9a.75.75 0 010-1.5h9a.75.75 0 010 1.5z" />
                        </svg>
                        Google Pay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-10 text-center text-sm text-gray-500">
            <p>
              By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically
              renew unless canceled at least 24 hours before the end of the current period.
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
