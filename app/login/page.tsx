"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import { buildApiUrl, API_CONFIG } from "@/lib/config"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include'
      })

      const text = await response.text();
      console.log('Raw login response:', text);  // 打印原始响应
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed login response:', data);  // 打印解析后的数据
      } catch (e) {
        console.error("Response parsing error:", e);
        throw new Error('服务器响应格式错误');
      }

      if (response.ok) {
        // 检查响应数据结构
        if (!data.accessToken) {
          console.error('Login response missing accessToken:', data);
          throw new Error('服务器响应缺少accessToken');
        }

        // 存储纯 accessToken，不加 Bearer 前缀
        const token = data.accessToken.replace(/^Bearer\s+/, '');
        console.log('Storing token (no Bearer):', token)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // 验证存储是否成功
        const storedToken = localStorage.getItem('token')
        console.log('Stored token:', storedToken)
        
        router.push("/") // 登录成功后跳转到首页
      } else {
        console.error('Login failed:', data);  // 打印登录失败信息
        setError(data.message || "登录失败，请检查邮箱和密码")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("登录失败，请稍后重试");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0314]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1a0a24] rounded-2xl border border-[#3a1a44]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1 bg-[#2a1a34] border-[#3a1a44] text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1 bg-[#2a1a34] border-[#3a1a44] text-white"
              />

            </div>

          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-[#3a1a44] bg-[#2a1a34] text-pink-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-pink-500 hover:text-pink-400">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-pink-500 hover:text-pink-400">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 