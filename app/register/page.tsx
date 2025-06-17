"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { buildApiUrl, API_CONFIG } from "@/lib/config"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // 验证密码是否匹配
    if (password !== confirmPassword) {
      setError("密码不匹配，请重新输入")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        credentials: 'include'
      })

      const text = await response.text()
      console.log('Raw response:', text)

      if (!text) {
        throw new Error('服务器响应为空')
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
        throw new Error('服务器响应格式错误')
      }

      if (response.ok) {
        alert("注册成功！现在可以登录了")
        router.push("/login")
      } else {
        setError(data.message || "注册失败，请稍后重试")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("注册失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a24] to-[#2a1a34] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main register card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-pulse">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-[#1a0a24] to-[#2a1a34] flex items-center justify-center">
                    <Heart className="h-10 w-10 text-white drop-shadow-lg" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-lg -z-10"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Create Account
            </h1>
            <p className="text-gray-400 text-lg">Join our community today</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-300 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Register form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white font-medium text-sm flex items-center space-x-2">
                <User className="h-4 w-4 text-pink-400" />
                <span>用户名</span>
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  required
                  className="h-12 bg-gradient-to-r from-[#0e0314]/80 to-[#1a0a24]/80 border-[#3a1a44] text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium text-sm flex items-center space-x-2">
                <Mail className="h-4 w-4 text-pink-400" />
                <span>邮箱地址</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  required
                  className="h-12 bg-gradient-to-r from-[#0e0314]/80 to-[#1a0a24]/80 border-[#3a1a44] text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium text-sm flex items-center space-x-2">
                <Lock className="h-4 w-4 text-pink-400" />
                <span>密码</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                  className="h-12 bg-gradient-to-r from-[#0e0314]/80 to-[#1a0a24]/80 border-[#3a1a44] text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl backdrop-blur-sm transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium text-sm flex items-center space-x-2">
                <Lock className="h-4 w-4 text-pink-400" />
                <span>确认密码</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  required
                  className="h-12 bg-gradient-to-r from-[#0e0314]/80 to-[#1a0a24]/80 border-[#3a1a44] text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 rounded-xl backdrop-blur-sm transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>注册中...</span>
                </div>
              ) : (
                "创建账户"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              已有账户？{" "}
              <Link
                href="/login"
                className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              服务条款
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              隐私政策
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-gray-400 transition-colors">
              帮助中心
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 