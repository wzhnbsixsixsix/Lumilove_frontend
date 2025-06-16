"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { buildApiUrl, API_CONFIG } from "@/lib/config"

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || '{}')
      return user.username || ""
    }
    return ""
  })
  const [avatar, setAvatar] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || '{}')
      return user.avatar || null
    }
    return null
  })
  const [preview, setPreview] = useState<string | null>(avatar)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 检查文件大小（限制为 1MB）
      if (file.size > 1024 * 1024) {
        setError('图片大小不能超过 1MB')
        return
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setError('请上传图片文件')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          // 压缩图片
          const img = document.createElement('img')
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const MAX_WIDTH = 200
            const MAX_HEIGHT = 200
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height
                height = MAX_HEIGHT
              }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height)
              // 转换为较低质量的 JPEG
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6)
              setPreview(compressedDataUrl)
            }
          }
          img.src = e.target.result as string
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const user = {
      username,
      avatar: preview,
    }
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('请先登录')
        router.push('/login')
        return
      }

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USERS.PROFILE), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
          'X-Title': 'Lumilove',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      })

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError('登录已过期，请重新登录')
        router.push('/login')
        return
      }

      let data
      try {
        const text = await response.text()
        data = text ? JSON.parse(text) : {}
      } catch (e) {
        console.error('Response parsing error:', e)
        data = {}
      }

      if (response.ok) {
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          username: user.username,
          avatar: user.avatar
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        router.push('/profile')
      } else {
        setError(data.message || '更新失败，请稍后重试')
      }
    } catch (err) {
      console.error('Update profile error:', err)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a0a24] flex flex-col items-center py-10">
      <div className="w-full max-w-xl bg-[#23202a] rounded-2xl p-8">
        <button className="mb-6 text-white flex items-center gap-2" onClick={() => router.back()}>
          <span className="text-2xl">←</span>
          <span className="text-xl font-bold">My Profile</span>
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <div className="text-white text-lg font-semibold mb-3">Update profile picture</div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500">
                <Image src={preview || "/placeholder.svg?height=128&width=128&text=U"} alt="avatar" width={128} height={128} className="object-cover" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <Button type="button" onClick={handleUploadClick} className="bg-pink-500 text-white rounded-full px-6">
                Upload
              </Button>
            </div>
          </div>
          <div>
            <div className="text-white text-lg font-semibold mb-3">Username</div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#1a0a24] border border-[#3a1a44] text-white text-lg focus:outline-none"
            />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <Button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-full text-lg" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  )
} 