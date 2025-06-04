import Link from "next/link"
import { Home, MessageSquare, ImageIcon, PlusCircle, Heart, DiscIcon as Discord, FileText } from "lucide-react"

export default function Sidebar() {
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Explore", href: "/" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Chat", href: "/chat" },
    { icon: <ImageIcon className="h-5 w-5" />, label: "Sneaky", href: "/sneaky" },
    { icon: <PlusCircle className="h-5 w-5" />, label: "Image Generator", href: "/create" },
    { icon: <PlusCircle className="h-5 w-5" />, label: "Create Your Lover", href: "/create-lover" },
    { icon: <Heart className="h-5 w-5 text-pink-400" />, label: "Become Premium", href: "/payment" },
  ]

  const bottomItems = [
    { icon: <Discord className="h-5 w-5" />, label: "Discord", href: "#" },
    { icon: <FileText className="h-5 w-5" />, label: "Survey", href: "#" },
  ]

  return (
    <div className="w-16 md:w-64 bg-[#120518] border-r border-[#3a1a44] flex flex-col h-screen sticky top-0">
      <div className="p-4 md:p-6">
        <Link href="/" className="flex items-center mb-6 md:mb-10">
          <div className="h-8 w-8 rounded-full bg-pink-400 flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-white hidden md:block">LumiLove.ai</span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center p-3 rounded-lg hover:bg-[#2a1a34] transition-colors"
            >
              <div className="text-gray-400">{item.icon}</div>
              <span className="ml-3 text-gray-300 hidden md:block">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 md:p-6">
        <div className="space-y-2">
          {bottomItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center p-3 rounded-lg hover:bg-[#2a1a34] transition-colors"
            >
              <div className="text-gray-400">{item.icon}</div>
              <span className="ml-3 text-gray-300 hidden md:block">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
