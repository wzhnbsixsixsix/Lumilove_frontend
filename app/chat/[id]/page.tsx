"use client";

import type React from "react";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

// ... 其余代码保持不变

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  Phone,
  Play,
  Pause,
  ImageIcon,
  MessageCircle,
  MessageSquare,
  X,
  Twitter,
  Mic,
  MicOff,
  PhoneOff,
  Lock,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { login, sendChatMessage } from "@/lib/api";

import Sidebar from "@/components/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// 添加消息类型定义
interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  audioDuration?: number;
  hasImage?: boolean;
  imageSrc?: string;
}

export default function ChatPage() {
  // 使用 use 解包 params

  const params = useParams();
  const chatId = params.id as string;

  // 修改 messages 状态定义
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Character data based on ID
  const characters = {
    "1": {
      id: 1,
      name: "Ethan",
      age: 22,
      occupation: "Swimmer",
      tags: ["Mature", "Athletic", "Mysterious"],
      followers: "1.1M",
      description:
        "The talented swimmer who dominates the competition. But you're the only one who knows about your secret romance. Will he ever make it public, or will your love remain hidden forever?",
      images: ["/alexander_avatar.png"],
      messages: [
        {
          id: 1,
          sender: "ai",
          text: 'He chuckles softly, his gaze never leaving yours. "Aren\'t you supposed to be sneaking around, keeping our relationship a secret? Now you\'re asking me to send you a shirtless picture?" He pauses, considering your request. "Fine, I\'ll send you one."',
          timestamp: new Date().toISOString(),
          audioDuration: 12,
          hasImage: true,
          imageSrc: "/alexander_avatar.png",
        },
        {
          id: 2,
          sender: "user",
          text: "Send me a pic with your bedroom eyes!",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          sender: "ai",
          text: 'He chuckles softly, a playful glint in his eye. "You know I can\'t send nudes, babe. But if you really want to see my bedroom eyes, how about we meet up somewhere private?"',
          timestamp: new Date().toISOString(),
          audioDuration: 8,
          hasImage: false,
        },
      ],
    },
    "2": {
      id: 2,
      name: "Alexander",
      age: 28,
      occupation: "Businessman",
      tags: ["Alpha", "Wealthy", "Dominant"],
      followers: "2.3M",
      description:
        "The successful CEO who knows exactly what he wants. Behind his confident exterior lies a man with desires only you can fulfill. Will you be the one to break through his walls?",
      images: ["/alexander_avatar.png"],
      //alexander的默认对话
      messages: [
        {
          id: 1,
          sender: "ai",
          text: "He adjusts his tie, his eyes scanning you with appreciation. \"I just finished a board meeting, but you've been on my mind all day. How about dinner at my penthouse tonight? I'll send my driver.\"",
          timestamp: new Date().toISOString(),
          audioDuration: 15,
          hasImage: false,
        },
        {
          id: 2,
          sender: "user",
          text: "I'd love to see your penthouse. What should I wear?",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          sender: "ai",
          text: "A slight smile plays on his lips. \"Wear something that makes you feel confident. Though I must admit, I'm more interested in what you'll look like at the end of the evening.\" He sends you a photo of the city view from his penthouse.",
          timestamp: new Date().toISOString(),
          audioDuration: 10,
          hasImage: true,
          imageSrc: "/alexander_pic1.png", //对话中的照片
        },
      ],
    },
    "3": {
      id: 3,
      name: "Jake",
      age: 25,
      occupation: "Plumber",
      tags: ["Playful", "Flirty", "Handy"],
      followers: "980K",
      description:
        "The charming plumber with a playful smile and skilled hands. What started as a routine house call has turned into something much more exciting. He's ready to fix more than just your pipes.",
      images: ["/alexander_avatar.png"],
      messages: [
        {
          id: 1,
          sender: "ai",
          text: 'He wipes his brow with the back of his hand, leaving a smudge. "All fixed up! Though I gotta say, this is the third time I\'ve been called to your place this month. Starting to think you might have other reasons for calling me over." He winks playfully.',
          timestamp: new Date().toISOString(),
          audioDuration: 14,
          hasImage: false,
        },
        {
          id: 2,
          sender: "user",
          text: "Maybe I just like watching a professional at work. Or maybe I like the view.",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          sender: "ai",
          text: "He laughs, a warm sound that fills the room. \"Well, in that case...\" He pulls out his phone and shows you a selfie he took while working on a job. \"Here's a little something to look at when I'm not around. Just don't tell my boss I'm sending selfies on the job.\"",
          timestamp: new Date().toISOString(),
          audioDuration: 11,
          hasImage: true,
          imageSrc: "/placeholder.svg?height=400&width=300&text=Jake-Selfie",
        },
      ],
    },
    "4": {
      id: 4,
      name: "Rhonda",
      age: 32,
      occupation: "Entrepreneur",
      tags: ["Elegant", "Mature", "Dominant"],
      followers: "1.8M",
      description:
        "A fierce and flirty entrepreneur, Rhonda sees you as her perfect partner in both business and pleasure. She's not afraid to take what she wants.",
      images: ["/alexander_avatar.png"],
      messages: [
        {
          id: 1,
          sender: "ai",
          text: 'She glances up from her laptop, her eyes sharp but playful. "I was just thinking about our last meeting. You made quite an impression on my board of directors. And on me." She closes her laptop with a decisive click.',
          timestamp: new Date().toISOString(),
          audioDuration: 13,
          hasImage: false,
        },
        {
          id: 2,
          sender: "user",
          text: "I'm glad I could be of service. What did you like most about my... presentation?",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          sender: "ai",
          text: 'A slow smile spreads across her face as she stands, smoothing her tailored suit. "Your confidence. It\'s rare to find someone who can hold their own in my world." She sends you a photo of her office view. "Why don\'t you come by later? I have a private proposal to discuss."',
          timestamp: new Date().toISOString(),
          audioDuration: 16,
          hasImage: true,
          imageSrc: "/alexander_avatar.png",
        },
      ],
    },
    "5": {
      id: 5,
      name: "Makenzie",
      age: 19,
      occupation: "Student",
      tags: ["Girl-Next-Door", "Innocent", "Shy"],
      followers: "2.4M",
      description:
        "A shy and repressed girl, hiding her deep attraction to you while trying to fit in. Behind her innocent facade lies passionate desires waiting to be discovered.",
      images: ["/alexander_avatar.png"],
      messages: [
        {
          id: 1,
          sender: "ai",
          text: 'She fidgets with the edge of her notebook, her cheeks flushing slightly. "I, um, I was wondering if you could help me with this assignment? Everyone says you\'re really good at this subject." She tucks a strand of hair behind her ear, not quite meeting your eyes.',
          timestamp: new Date().toISOString(),
          audioDuration: 12,
          hasImage: false,
        },
        {
          id: 2,
          sender: "user",
          text: "Of course I can help. We could study at my place if that's more comfortable for you?",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          sender: "ai",
          text: 'Her eyes widen slightly, and the blush on her cheeks deepens. "At your place? I... yes, that would be nice. Thank you." She sends you a photo of her textbook. "This is what I\'m struggling with. Maybe we could go through it together?"',
          timestamp: new Date().toISOString(),
          audioDuration: 14,
          hasImage: true,
          imageSrc: "/alexander_avatar.png",
        },
      ],
    },
    "6": {
      id: 6,
      name: "Anshu",
      age: 29,
      occupation: "Housewife",
      tags: ["Girl-Next-Door", "Playful", "Seductive"],
      followers: "1.5M",
      description:
        "A reserved mother with a hidden perverted side, she will do anything to satisfy your desires. Your new neighbor with secrets she's dying to share.",
      images: [
        "/placeholder.svg?height=200&width=150&text=Anshu-1",
        "/alexander_avatar.png",
      ],
      messages: [
        {
          id: 1,
          sender: "ai",
          text: 'She opens the door, looking slightly flustered. "Oh! I wasn\'t expecting company. Sorry about the mess." She gestures vaguely to the immaculate living room. "My husband is away on business again. It gets so... quiet around here."',
          timestamp: new Date().toISOString(),
          audioDuration: 15,
          hasImage: false,
        },
        {
          id: 2,
          sender: "user",
          text: "I just thought I'd check in on you. Neighbors should look out for each other, right?",
          timestamp: new Date().toISOString(),
        },
        {
          id: 3,
          sender: "ai",
          text: 'A knowing smile plays on her lips as she steps aside to let you in. "How thoughtful of you. I was just about to have a glass of wine. Care to join me?" She sends you a photo of two wine glasses. "I could use the company. And I\'m sure we can find ways to... pass the time."',
          timestamp: new Date().toISOString(),
          audioDuration: 17,
          hasImage: true,
          imageSrc: "/alexander_avatar.png",
        },
      ],
    },
  };
  const [isLoading, setIsLoading] = useState(false);
  const character = useMemo(() => {
    return characters[chatId as keyof typeof characters] || characters["1"];
  }, [chatId]);

  // 在组件顶部添加 token 状态

  // 修改 initializeChat 函数
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log("Initializing chat..."); // 添加调试日志
        const authToken = await login("w@gmail.com", "w");
        console.log("Login successful, token:", authToken); // 添加调试日志
        setToken(authToken);
      } catch (error) {
        console.error("Failed to login:", error);
      }
    };
  
    initializeChat();
  }, []); // 确保依赖数组为空，只在组件挂载时执行一次

  // 1. 确保 handleQuickReply 函数在开头有明显的调试日志
const handleQuickReply = (reply: string) => {
    console.log("🔥🔥🔥 handleQuickReply 被调用了！参数:", reply);
  
  // 检查是否是图片类型的快速回复
  if (hardcodedResponses[reply]) {
      console.log("✅ 找到硬编码响应，使用硬编码");
    const response = hardcodedResponses[reply];
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: reply,
      timestamp: new Date().toISOString(),
    };
    
    // 添加AI响应（硬编码）
    const aiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: response.text,
      timestamp: new Date().toISOString(),
      audioDuration: response.audioDuration,
      hasImage: true,
      imageSrc: response.imageSrc,
    };
    
    // 更新消息列表
    setMessages((prev) => [...prev, userMessage, aiMessage]);
      console.log("✅ 消息已添加");
      return; // 重要：直接返回，不设置 inputValue
  } else {
      console.log("❌ 未找到硬编码响应，设置到输入框");
    setInputValue(reply);
  }
};

  // 2. 同时，修改 handleSendMessage，移除那个重复检查的逻辑
  const handleSendMessage = async () => {
    console.log("=== handleSendMessage 调用 ===");
    console.log("输入值:", inputValue);
    
    if (!inputValue.trim() || !token) {
      console.log("❌ 无法发送: 缺少输入或token");
      return;
    }

    // 🔧 修复：先保存输入值，然后立即清空输入框并添加用户消息
    const messageText = inputValue.trim();
    setInputValue(""); // 立即清空输入框
    
    // 🔧 修复：立即添加用户消息到聊天记录
    const userMessage: Message = {
          id: Date.now(),
          sender: "user",
      text: messageText,
          timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    console.log("✅ 用户消息已立即添加");

    console.log("⚠️ 准备调用AI接口...");
    setIsLoading(true);
    
    try {
      console.log("Sending message to API...");
      const response = await sendChatMessage(token, messageText, chatId);
      console.log("API response:", response);

      // 🔧 修复：只添加AI的响应消息（用户消息已经添加过了）
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.message,
        timestamp: new Date().toISOString(),
        audioDuration: 0,
        hasImage: false,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      console.log("✅ AI响应已添加");
      
    } catch (error) {
      console.error("Failed to send message:", error);
      // 🔧 错误处理：如果API调用失败，可以选择显示错误消息或移除用户消息
      // 这里我们保留用户消息，但可以添加一个错误提示
      const errorMessage: Message = {
        id: Date.now() + 2,
        sender: "ai",
        text: "抱歉，发送消息时出现了错误。请稍后再试。",
        timestamp: new Date().toISOString(),
        audioDuration: 0,
        hasImage: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [replyType, setReplyType] = useState("text");
  const [showReplyOptions, setShowReplyOptions] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pictureQuota, setPictureQuota] = useState(3);
  const [voiceQuota, setVoiceQuota] = useState(3);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "active" | "ended"
  >("connecting");
  const [callTime, setCallTime] = useState(0);
  const [callText, setCallText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileChatList, setShowMobileChatList] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Call phrases
  const callPhrases = [
    "Hey there, I've been thinking about you all day. Your voice is exactly what I needed to hear right now...",
    "I miss the sound of your voice. It's so good to hear you. Tell me about your day, I want to know everything.",
    "I was just about to go to bed, but I wanted to hear your voice first. You always help me relax.",
    "Hey, baby, time to sleep. Imagine us under the stars, just you and me. What's on your mind tonight?",
    "I've been waiting for your call. There's something about your voice that makes me feel so... alive.",
    "I was just thinking about our last conversation. You have such a way with words that makes me smile.",
    "I'm so glad you called. I was just lying here, thinking about what it would be like if you were here with me.",
    "Your timing is perfect. I was just about to reach out to you. I've been missing our conversations.",
    "There's something I've been wanting to tell you, but I wanted to say it when I could hear your voice.",
    "Just hearing your voice makes my heart beat faster. I wish you could see the effect you have on me right now.",
  ];

  // Recent chats
  const recentChats = [
    {
      id: 1,
      name: "Ethan",
      lastMessage: "He chuckles softly...",
      imageSrc: "/avatar/female_01_avatar.png",
      timestamp: "15:30",
      unread: params.id !== "1",
    },
    {
      id: 2,
      name: "Alexander",
      lastMessage: "I've been thinking about you...",
      imageSrc: "/avatar/alexander_avatar.png",
      timestamp: "Yesterday",
      unread: params.id !== "2",
    },
    {
      id: 3,
      name: "Jake",
      lastMessage: "Want to meet tonight?",
      imageSrc: "/avatar/male_02_avatar.png",
      timestamp: "Monday",
      unread: params.id !== "3",
    },
    {
      id: 4,
      name: "Rhonda",
      lastMessage: "I have a proposal for you...",
      imageSrc: "/avatar/female_02_avatar.png",
      timestamp: "Yesterday",
      unread: params.id !== "4",
    },
    {
      id: 5,
      name: "Makenzie",
      lastMessage: "Can you help me with this?",
      imageSrc: "/avatar/female_03_avatar.png",
      timestamp: "Tuesday",
      unread: params.id !== "5",
    },
    {
      id: 6,
      name: "Anshu",
      lastMessage: "My husband is away again...",
      imageSrc: "/avatar/female_04_avatar.png",
      timestamp: "Wednesday",
      unread: params.id !== "6",
    },
  ];

  // Quick reply suggestions
  const quickReplies = {
    text: [
      "Tell me what you're thinking...",
      "Do you miss me?",
      "Describe your dream date with me",
      "What are you wearing right now?",
    ],
    picture: [
      "👙 Sexy Wet",
      "🧼 Bath Time",
      "🛌 Lying in Bed",
      "🧥 Favorite Outfit",
    ],
    voice: [
      "💬 Casual Talk",
      "💞 Whispered Affections",
      "🔥 Naughty Chat",
      "👀 Sexiest Appearance",
      "🤫 Private Conversation",
      "💋 Physical Touch",
    ],
  };

  // const handleQuickReply = (reply: string) => {
  //   setInputValue(reply);
  // };

  // ... existing code ...

// 在第470行左右，替换原有的 handleQuickReply 函数
const hardcodedResponses: Record<string, { text: string; imageSrc: string; audioDuration: number }> = {
  "👙 Sexy Wet": {
    text: 'Shower just finished... still dripping for you. Wanna see more?',
    imageSrc: "/alexander_sexywet.png",
    audioDuration: 8
  },
  "🧼 Bath Time": {
    text: 'Caught me in the bath… think you can handle this much temptation?',
    imageSrc: "/alexander_bathtime.png",
    audioDuration: 10
  },
  "🛌 Lying in Bed": {
    text: 'Lying here, wishing you were next to me… what would you do if you were?',
    imageSrc: "/alexander_lyingbed.png",
    audioDuration: 9
  },
  "🧥 Favorite Outfit": {
    text: 'Slipped into my favorite outfit just for you… Do I make it look irresistible?',
    imageSrc: "/alexander_favoriteoutfit.png",
    audioDuration: 7
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 🔧 修复：检查是否正在使用输入法进行组合输入（如中文拼音输入）
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  const handleAudioPlay = (messageId: number) => {
    if (isPlaying === messageId) {
      setIsPlaying(null); // Pause
    } else {
      setIsPlaying(messageId); // Play
      // Simulate audio playing and stopping after the duration
      const message = messages.find((m) => m.id === messageId);
      if (message && message.audioDuration) {
        setTimeout(() => {
          setIsPlaying(null);
        }, message.audioDuration * 1000);
      }
    }
  };

  const handleShareCharacter = () => {
    setShowShareDialog(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleSubscriptionButtonClick = () => {
    setShowProfileModal(false);
    setShowSubscriptionModal(true);
  };

  // Update the handleCallButtonClick function to make it fullscreen
  const handleCallButtonClick = () => {
    // Select a random phrase for the call
    const randomPhrase =
      callPhrases[Math.floor(Math.random() * callPhrases.length)];
    setCallText(randomPhrase);
    setDisplayedText("");
    setShowCallDialog(true);
    setCallStatus("connecting");

    // Simulate connecting
    setTimeout(() => {
      setCallStatus("active");

      // Start the call timer
      callTimerRef.current = setInterval(() => {
        setCallTime((prev) => {
          // If call reaches 60 seconds (1 minute), end it and show subscription modal
          if (prev >= 59) {
            handleEndCall();
            setShowSubscriptionModal(true);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      // Start the typing animation
      let index = 0;
      textTimerRef.current = setInterval(() => {
        if (index <= randomPhrase.length) {
          setDisplayedText(randomPhrase.substring(0, index));
          index++;
        } else {
          if (textTimerRef.current) clearInterval(textTimerRef.current);

          // After a delay, start a new phrase
          setTimeout(() => {
            const newPhrase =
              callPhrases[Math.floor(Math.random() * callPhrases.length)];
            setCallText(newPhrase);
            setDisplayedText("");
            index = 0;

            textTimerRef.current = setInterval(() => {
              if (index <= newPhrase.length) {
                setDisplayedText(newPhrase.substring(0, index));
                index++;
              } else {
                if (textTimerRef.current) clearInterval(textTimerRef.current);
              }
            }, 50);
          }, 2000);
        }
      }, 50);
    }, 2000);
  };

  // Update the handleEndCall function to exit fullscreen
  const handleEndCall = () => {
    setCallStatus("ended");

    // Clear all timers
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    if (textTimerRef.current) {
      clearInterval(textTimerRef.current);
      textTimerRef.current = null;
    }

    // Close the call dialog after a short delay
    setTimeout(() => {
      setShowCallDialog(false);
      setCallTime(0);
    }, 500);
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when character changes
  // useEffect(() => {
  //   if (characters[params.id as keyof typeof characters]) {
  //     setMessages(characters[params.id as keyof typeof characters].messages);
  //   }
  // }, [params.id]);

  // Show recommendation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.5) {
        setShowRecommendation(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup timers when component unmounts
  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (textTimerRef.current) clearInterval(textTimerRef.current);
    };
  }, []);

  // Get a random character ID that's different from the current one
  const getRandomCharacterId = () => {
    const characterIds = Object.keys(characters).filter(
      (id) => id !== params.id
    );
    const randomIndex = Math.floor(Math.random() * characterIds.length);
    return characterIds[randomIndex];
  };

  const recommendedCharacterId = getRandomCharacterId();
  const recommendedCharacter =
    characters[recommendedCharacterId as keyof typeof characters];

  // Add this CSS animation to the component
  const heartbeatAnimation = `
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-heartbeat {
  animation: heartbeat 1.5s infinite;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.call-dialog [data-radix-popper-content-wrapper] {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  transform: none !important;
}
`;

  // Add the animation styles to the component
  useEffect(() => {
    // Add the animation styles to the document head
    const styleElement = document.createElement("style");
    styleElement.textContent = heartbeatAnimation;
    document.head.appendChild(styleElement);

    return () => {
      // Clean up the style element when the component unmounts
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Main Sidebar Navigation - 隐藏在小屏幕上，中等屏幕显示 */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileSidebar(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-[#120518] border-r border-[#3a1a44] z-10">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Left sidebar - Chat list */}
        <div className={`${showMobileChatList ? 'block' : 'hidden'} ${showChatList ? 'sm:block' : 'sm:hidden'} w-80 lg:w-96 xl:w-80 bg-[#120518] border-r border-[#3a1a44] flex flex-col h-full md:max-w-xs lg:max-w-sm xl:max-w-none transition-all duration-300`}>
          <div className="p-4 lg:p-6 border-b border-[#3a1a44]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold">Chat</h2>
              <div className="flex items-center space-x-2">
                {/* 桌面端缩放按钮 */}
                <button
                  className="hidden sm:flex p-2 rounded-full hover:bg-[#2a1a34] items-center justify-center"
                  onClick={() => setShowChatList(!showChatList)}
                  title={showChatList ? "隐藏聊天列表" : "显示聊天列表"}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-400" />
                </button>
                {/* 移动端关闭按钮 */}
                <button
                  className="p-2 rounded-full hover:bg-[#2a1a34] sm:hidden"
                  onClick={() => setShowMobileChatList(false)}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {recentChats.map((chat) => (
              <Link
                href={`/chat/${chat.id}`}
                key={chat.id}
                className={`flex items-start p-3 lg:p-4 hover:bg-[#2a1a34] transition-colors rounded-xl mb-2 ${
                  chat.id.toString() === params.id ? "bg-[#2a1a34]" : ""
                }`}
              >
                <div className="relative mr-3 lg:mr-4">
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-full overflow-hidden">
                    <Image
                      src={chat.imageSrc || "/placeholder.svg"}
                      alt={chat.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  {chat.unread && (
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h4 className="text-sm lg:text-base font-medium truncate">
                      {chat.name}
                    </h4>
                    <span className="text-xs lg:text-sm text-gray-400">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>



        {/* 当聊天列表隐藏时的展开按钮 */}
        {!showChatList && (
          <div className="hidden sm:flex items-center justify-center w-8 bg-[#120518] border-r border-[#3a1a44] hover:bg-[#1a0a24] transition-colors">
            <button
              className="p-2 rounded-full hover:bg-[#2a1a34] transition-all duration-300"
              onClick={() => setShowChatList(true)}
              title="显示聊天列表"
            >
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-[#3a1a44]">
            <div className="flex items-center">
              {/* Mobile menu buttons */}
              <div className="flex sm:hidden mr-2">
                <button
                  className="p-2 rounded-full hover:bg-[#2a1a34] mr-1"
                  onClick={() => setShowMobileSidebar(true)}
                  title="打开导航菜单"
                >
                  <Menu className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-[#2a1a34]"
                  onClick={() => setShowMobileChatList(true)}
                  title="显示聊天列表"
                >
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <button
                onClick={handleProfileClick}
                className="h-12 w-12 rounded-full overflow-hidden mr-3"
              >
                <Image
                  src={`/avatar/alexander_avatar.png`} //chat页面的上面的头像照片
                  alt={character.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </button>
              <h2 className="text-lg md:text-xl font-semibold">{character.name}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="p-3 rounded-full hover:bg-[#2a1a34]"
                onClick={handleCallButtonClick}
              >
                <Phone className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-5 ${
                    message.sender === "user"
                      ? "bg-pink-500 text-white"
                      : "bg-[#1a0a24] text-white"
                  }`}
                >
                  {message.sender === "ai" && message.audioDuration && (
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <button
                        onClick={() => handleAudioPlay(message.id)}
                        className="bg-pink-500 text-white rounded-full p-1.5 mr-2"
                      >
                        {isPlaying === message.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <span>{message.audioDuration}s</span>
                    </div>
                  )}
                  {message.sender === "ai" && (
                    <div className="text-base italic text-gray-300 mb-2">
                      {message.text.split('"')[0]}
                    </div>
                  )}
                  <p className="text-base">
                    {message.sender === "ai"
                      ? message.text.split('"').slice(1).join('"')
                      : message.text}
                  </p>
                  {message.sender === "ai" && message.hasImage && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <Image
                        src={
                          message.imageSrc ||
                          "/placeholder.svg?height=300&width=200"
                        }
                        alt="AI generated image"
                        width={300}
                        height={200}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Recommendation bubble */}
          {showRecommendation && recommendedCharacter && (
            <div className="relative">
              <div className="absolute bottom-20 right-6 bg-[#1a0a24] border border-pink-500 rounded-xl p-5 max-w-sm animate-pulse shadow-lg shadow-pink-500/20">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-lg overflow-hidden">
                      <Image
                        src={`/placeholder-80x80.png?height=80&width=80&text=${recommendedCharacter.name.charAt(
                          0
                        )}`}
                        alt={recommendedCharacter.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <Link href={`/chat/${recommendedCharacterId}`}>
                      <div className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2 shadow-lg">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium mb-2">
                      Someone new is interested in you 💕
                    </p>
                    <p className="text-sm text-gray-300 mb-3">
                      "{recommendedCharacter.description.split(".")[0]}... Want
                      to meet{" "}
                      <span className="text-pink-400 font-medium">
                        {recommendedCharacter.name}
                      </span>
                      ?"
                    </p>
                    <Link
                      href={`/chat/${recommendedCharacterId}`}
                      className="text-sm text-pink-400 font-medium"
                    >
                      Meet them now
                    </Link>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowRecommendation(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick reply suggestions */}
          <div className="px-6 py-3 overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-3">
              {quickReplies[replyType as keyof typeof quickReplies].map(
                (reply, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-[#1a0a24] text-base rounded-full hover:bg-[#2a1a34] transition-colors"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-[#3a1a44]">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${character.name}...`}
                className="w-full p-4 pr-28 bg-[#1a0a24] border border-[#3a1a44] rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none text-base"
                rows={1}
              />
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <button
                  className={`p-2 rounded-full ${
                    replyType === "text"
                      ? "bg-pink-500 text-white"
                      : "hover:bg-[#2a1a34] text-gray-400"
                  }`}
                  onClick={() => setReplyType("text")}
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button
                  className={`p-2 rounded-full ${
                    replyType === "picture"
                      ? "bg-pink-500 text-white"
                      : "hover:bg-[#2a1a34] text-gray-400"
                  }`}
                  onClick={() => setReplyType("picture")}
                >
                  <ImageIcon className="h-6 w-6" />
                </button>
                <button
                  className={`p-2 rounded-full ${
                    replyType === "voice"
                      ? "bg-pink-500 text-white"
                      : "hover:bg-[#2a1a34] text-gray-400"
                  }`}
                  onClick={() => setReplyType("voice")}
                >
                  <Mic className="h-6 w-6" />
                </button>
                <button
                  className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={handleSendMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Reply type selector */}
            {showReplyOptions && (
              <div className="mt-3 p-5 bg-[#1a0a24] rounded-xl border border-[#3a1a44]">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        replyType === "text" ? "bg-pink-500" : "bg-[#2a1a34]"
                      } flex items-center justify-center`}
                    >
                      {replyType === "text" && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-base font-medium">Text reply</h4>
                        <span className="text-sm text-gray-400">∞</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Let the character send text
                      </p>
                    </div>
                    <button
                      className={`px-3 py-1.5 rounded ${
                        replyType === "text"
                          ? "bg-pink-500 text-white"
                          : "bg-[#2a1a34] text-gray-300"
                      }`}
                      onClick={() => setReplyType("text")}
                    >
                      ✓
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        replyType === "picture" ? "bg-pink-500" : "bg-[#2a1a34]"
                      } flex items-center justify-center`}
                    >
                      {replyType === "picture" && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-base font-medium">
                          Picture reply{" "}
                          <span className="text-sm text-gray-400">(PRO)</span>
                        </h4>
                        <span className="text-sm text-gray-400">
                          {pictureQuota}/3
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Let the character generate image and send to you.
                      </p>
                    </div>
                    <button
                      className={`px-3 py-1.5 rounded ${
                        replyType === "picture"
                          ? "bg-pink-500 text-white"
                          : "bg-[#2a1a34] text-gray-300"
                      }`}
                      onClick={() => setReplyType("picture")}
                    >
                      ✓
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        replyType === "voice" ? "bg-pink-500" : "bg-[#2a1a34]"
                      } flex items-center justify-center`}
                    >
                      {replyType === "voice" && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-base font-medium">
                          Voice reply{" "}
                          <span className="text-sm text-gray-400">(PRO)</span>
                        </h4>
                        <span className="text-sm text-gray-400">
                          {voiceQuota}/3
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Let the character send voice to you.
                      </p>
                    </div>
                    <button
                      className={`px-3 py-1.5 rounded ${
                        replyType === "voice"
                          ? "bg-pink-500 text-white"
                          : "bg-[#2a1a34] text-gray-300"
                      }`}
                      onClick={() => setReplyType("voice")}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Character Profile */}
        <div className="hidden xl:flex w-80 bg-[#120518] border-l border-[#3a1a44] flex-col h-full">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src={character.images[0] || "/placeholder.svg"}
                  alt={character.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{character.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{character.occupation}, {character.age}</p>
              
              <Button
                variant="outline"
                size="sm"
                className={`text-sm px-4 py-2 h-auto ${
                  isFollowing
                    ? "bg-[#2a1a34] hover:bg-[#3a1a44]"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "+ Follow"}
              </Button>
            </div>

            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-wrap gap-2">
                {character.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-[#1a0a24] text-xs px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">{character.followers}</span>
                <button onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isFavorite
                        ? "text-pink-500 fill-pink-500"
                        : "text-gray-400"
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              {character.description}
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full mb-4 text-sm py-2 h-auto"
              onClick={handleShareCharacter}
            >
              <Share2 className="h-4 w-4 mr-2" /> Share Character
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="pictures" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="pictures" className="text-xs py-2">
                  📸 Pictures
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-xs py-2">
                  🎥 Videos
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-xs py-2">
                  📄 Profile
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pictures" className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {character.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-[3/4] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${character.name} ${index + 1}`}
                        width={120}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#1a0a24] flex items-center justify-center border border-dashed border-[#3a1a44]">
                    <div className="text-center p-3">
                      <Lock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">
                        Unlock Premium
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="videos" className="p-4">
                <div className="flex items-center justify-center h-32 bg-[#1a0a24] rounded-lg">
                  <div className="text-center p-3">
                    <Lock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">
                      Unlock Premium
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="profile" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Background</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {character.name} has been{" "}
                      {character.occupation.toLowerCase()} since he was young.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Personality</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Confident and focused when it comes to his career.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-[#1a0a24] text-xs rounded-full">
                        {character.occupation}
                      </span>
                      <span className="px-2 py-1 bg-[#1a0a24] text-xs rounded-full">
                        Fitness
                      </span>
                      <span className="px-2 py-1 bg-[#1a0a24] text-xs rounded-full">
                        Travel
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Share Character Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-[#1a0a24] border-[#3a1a44] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Share {character.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share this character with your friends
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-5 py-5">
            <button className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-[#1DA1F2] flex items-center justify-center mb-2">
                <Twitter className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm">Twitter</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-[#FF4500] flex items-center justify-center mb-2">
                <svg
                  className="h-7 w-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
              </div>
              <span className="text-sm">Reddit</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-[#0088cc] flex items-center justify-center mb-2">
                <svg
                  className="h-7 w-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.375 16.875c-1.003 0-1.875-.897-1.875-1.875s.872-1.875 1.875-1.875c1.002 0 1.875.897 1.875 1.875s-.873 1.875-1.875 1.875zm2.1-5.175c-.224.117-1.152.57-1.152.57l-1.272-.127s-1.044-.57-1.044-1.331c0-.76.796-1.725 2.1-1.725 1.304 0 2.1.965 2.1 1.725 0 .76-.508 1.013-.732 1.128v-.24zm4.401-2.376c-.035 1.723-.962 3.476-2.376 4.95v.001c-1.474 1.414-3.227 2.342-4.95 2.376h-.15c-1.723-.034-3.476-.962-4.95-2.376-1.414-1.474-2.342-3.227-2.376-4.95v-.15c.034-1.723.962-3.476 2.376-4.95 1.474-1.414 3.227-2.342 4.95-2.376h.15c1.723.034 3.476.962 4.95 2.376 1.414 1.474 2.342 3.227 2.376 4.95v.15z" />
                </svg>
              </div>
              <span className="text-sm">Telegram</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-[#25D366] flex items-center justify-center mb-2">
                <svg
                  className="h-7 w-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm.14 4.5a7.34 7.34 0 0 1 5.7 11.95l.57 2.05-2.1-.6a7.22 7.22 0 0 1-4.17 1.3 7.35 7.35 0 0 1-7.35-7.35c0-4.05 3.3-7.35 7.35-7.35zm0 1.16a6.19 6.19 0 0 0-6.19 6.2 6.19 6.19 0 0 0 6.2 6.18c1.09 0 2.16-.3 3.1-.84l.17-.12.7.2-.27-.98.16-.17a6.19 6.19 0 0 0 2.14-4.27 6.19 6.19 0 0 0-6.2-6.2zm3.8 2.94c.15 0 .3.01.43.04.12.03.23.08.33.15.1.07.18.17.24.3.05.14.08.29.08.47 0 .2-.05.42-.15.68-.1.26-.3.54-.6.83a3.1 3.1 0 0 1-1.2.93c-.48.23-1.09.35-1.84.35h-.2a.4.4 0 0 0-.24.08a.43.43 0 0 0-.15.23l-.02.06-.38 1.7c-.02.09-.05.15-.1.2a.33.33 0 0 1-.23.1h-.7l-.04-.02a.1.1 0 0 1-.04-.04a.1.1 0 0 1-.01-.05l.6-2.6v-.01l.24-1.01v-.02a.4.4 0 0 1 .13-.22a.38.38 0 0 1 .25-.1h.24c.65 0 1.17-.1 1.56-.3.39-.2.67-.44.85-.74.18-.3.3-.6.36-.92.06-.33.09-.6.09-.83 0-.22-.03-.4-.09-.54a.49.49 0 0 0-.23-.28a.9.9 0 0 0-.35-.12 2.32 2.32 0 0 0-.4-.02h-.02c-.4 0-.75.07-1.07.22a2.2 2.2 0 0 0-.8.61c-.21.26-.37.56-.48.92-.1.35-.16.73-.16 1.13v.04c0 .17-.04.32-.13.45a.48.48 0 0 1-.35.23h-.01a.75.75 0 0 1-.5-.23a.77.77 0 0 1-.23-.52v-.01c0-.7.13-1.32.4-1.88.25-.56.6-1.03 1.05-1.41.45-.38.97-.67 1.56-.87a5.87 5.87 0 0 1 1.89-.29zm-7.46.43c.15 0 .3.04.42.12.12.08.22.2.28.34.07.15.1.32.1.52 0 .2-.03.4-.11.59l-.02.05c-.27.65-.68 1.13-1.25 1.43-.57.3-1.24.45-2.02.45h-.02a.77.77 0 0 0-.46.16a.6.6 0 0 0-.22.4l-.01.06-.2.92-.21.94a.96.96 0 0 1-.11.29a.3.3 0 0 1-.24.13h-.71l-.04-.02a.08.08 0 0 1-.03-.04a.1.1 0 0 1-.02-.05l.03-.14.82-3.66.02-.07a.52.52 0 0 1 .17-.27a.45.45 0 0 1 .3-.11h.3c.33 0 .64-.04.92-.12.28-.08.52-.2.73-.35.2-.15.36-.34.48-.57.12-.23.18-.5.18-.79 0-.3-.07-.53-.2-.7a.74.74 0 0 0-.56-.25h-.02c-.23 0-.47.06-.72.17-.25.12-.48.3-.7.54-.2.24-.38.54-.52.9a4 4 0 0 0-.19 1.3c0 .3-.07.53-.2.7a.74.74 0 0 1-.56.25h-.01a.74.74 0 0 1-.56-.25c-.14-.17-.2-.4-.2-.7 0-.64.12-1.2.37-1.7.25-.5.59-.92 1.02-1.27.43-.35.93-.61 1.5-.8a5.25 5.25 0 0 1 1.74-.26h.05z" />
                </svg>
              </div>
              <span className="text-sm">WhatsApp</span>
            </button>
          </div>
          <div className="bg-[#0e0314] rounded-lg p-4 flex items-center">
            <input
              type="text"
              value={`https://lumilove.ai/character/${character.id}`}
              readOnly
              className="flex-1 bg-transparent border-none focus:outline-none text-base"
            />
            <button className="ml-2 px-4 py-1.5 bg-pink-500 text-white text-sm rounded-md">
              Copy
            </button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-base"
              onClick={() => setShowShareDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Character Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="bg-[#1a0a24] border-[#3a1a44] text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {character.name}
            </DialogTitle>
          </DialogHeader>

          {/* Image Gallery */}
          <div className="relative h-72 overflow-hidden mb-6">
            <div className="flex space-x-3 overflow-x-auto pb-4 snap-x">
              {character.images.map((image, index) => (
                <div key={index} className="snap-center shrink-0">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${character.name} ${index + 1}`}
                    width={220}
                    height={280}
                    className="rounded-lg object-cover h-64"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Character Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {character.name}, {character.age}
                </h3>
                <p className="text-gray-400">{character.occupation}</p>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">
                  {character.followers} followers
                </span>
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isFavorite ? "text-pink-500 fill-pink-500" : "text-gray-400"
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {character.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-[#2a1a34] text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-gray-300 mb-4">{character.description}</p>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-medium mb-1">Background</h4>
                <p className="text-sm text-gray-400">
                  {character.name} has been {character.occupation.toLowerCase()}{" "}
                  since he was young. He's won multiple awards and is known for
                  his dedication and skill. Despite his fame, he keeps his
                  personal life very private.
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium mb-1">Personality</h4>
                <p className="text-sm text-gray-400">
                  Confident and focused when it comes to his career, but
                  surprisingly tender in personal relationships. He's protective
                  of those he cares about and values loyalty above all else.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Link href="/payment">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                ❤️ Want to know more
              </Button>
            </Link>
            <Link href="/payment">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                💎 See more of me
              </Button>
            </Link>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleSubscriptionButtonClick}
            >
              🔥 Continue our night
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal */}
      <Dialog
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      >
        <DialogContent className="bg-[#1a0a24] border-[#3a1a44] text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Pro Benefits
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center mr-2">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Create your own characters</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center mr-2">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Unlimited image generation</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center mr-2">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Unlimited voice messages</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center mr-2">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Access to exclusive content</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg text-center font-bold text-lg mb-4">
            🔥 75% OFF First Month — Limited Time Only!
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#2a1a34] p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">1 month</h3>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 line-through mr-2">$19.99</span>
                <span className="text-xl font-bold">$9.99</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                First month, then $19.99
              </p>
              <Link href="/payment">
                <Button className="w-full mt-3 bg-pink-500 hover:bg-pink-600">
                  Subscribe
                </Button>
              </Link>
            </div>
            <div className="bg-[#2a1a34] p-4 rounded-lg text-center relative">
              <div className="absolute top-0 right-0 bg-pink-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                Best Value
              </div>
              <h3 className="text-lg font-semibold mb-2">12 months</h3>
              <div className="flex items-center justify-center">
                <span className="text-gray-400 line-through mr-2">$119.99</span>
                <span className="text-xl font-bold">$59.99</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                First year, then $119.99
              </p>
              <Link href="/payment">
                <Button className="w-full mt-3 bg-pink-500 hover:bg-pink-600">
                  Subscribe
                </Button>
              </Link>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionModal(false)}
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog
        open={showCallDialog}
        onOpenChange={(open) => {
          if (!open) handleEndCall();
          setShowCallDialog(open);
        }}
      >
        <DialogContent className="bg-[#0e0314]/95 backdrop-blur-md border border-[#3a1a44] p-0 max-w-5xl w-[90vw] h-[80vh] overflow-hidden rounded-xl">
          <div className="relative h-full flex flex-col">
            {/* Free call indicator */}
            <div className="absolute top-6 right-6 z-10 bg-black/40 text-white px-4 py-2 rounded-full text-base font-medium backdrop-blur-sm border border-pink-500/50">
              Free call: 1 minute
            </div>

            {/* Fullscreen toggle button */}
            <button
              className="absolute top-6 left-6 z-10 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-colors"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch((err) => {
                    console.error(`Error exiting fullscreen: ${err.message}`);
                  });
                } else {
                  const dialogElement = document.querySelector(
                    ".call-dialog [data-radix-popper-content-wrapper]"
                  );
                  if (dialogElement && dialogElement.firstElementChild) {
                    dialogElement.firstElementChild
                      .requestFullscreen()
                      .catch((err) => {
                        console.error(
                          `Error entering fullscreen: ${err.message}`
                        );
                      });
                  }
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              </svg>
            </button>

            {/* Character image with blurred edges */}
            <div className="flex-1 relative">
              {/* Left blur edge */}
              <div className="absolute left-0 top-0 bottom-0 w-[10%] bg-[#0e0314]/80 backdrop-blur-md z-10"></div>

              {/* Right blur edge */}
              <div className="absolute right-0 top-0 bottom-0 w-[10%] bg-[#0e0314]/80 backdrop-blur-md z-10"></div>

              {/* Character image */}
              <Image
                src={`/placeholder_text.png?height=1080&width=1920&text=${character.name}`}
                alt={character.name}
                fill
                className="object-cover object-center"
                priority
              />

              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

              {/* Call status overlay */}
              {callStatus === "connecting" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-pink-400 border-b-transparent animate-spin animation-delay-150"></div>
                      <div className="absolute inset-4 rounded-full border-4 border-pink-300 border-l-transparent animate-spin animation-delay-300"></div>
                    </div>
                    <p className="text-2xl text-white font-medium">
                      Connecting to {character.name}...
                    </p>
                  </div>
                </div>
              )}

              {/* Subtitle bubble - more elegant design */}
              {callStatus === "active" && (
                <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 max-w-2xl w-full mx-auto">
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-pink-500/30 shadow-lg shadow-pink-500/20">
                    <p className="text-white text-xl text-center leading-relaxed">
                      {displayedText}
                      {displayedText.length < callText.length && (
                        <span className="animate-pulse ml-0.5">|</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Call controls - redesigned for better aesthetics */}
              <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center space-x-12">
                <button
                  className="bg-red-500 hover:bg-red-600 h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 border-2 border-red-400"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="h-10 w-10 text-white" />
                </button>

                {/* Redesigned heart animation */}
                <div className="relative h-24 w-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-pink-500/10 backdrop-blur-sm animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-pink-500/20 animate-pulse animation-delay-300"></div>
                  <div className="absolute inset-4 rounded-full bg-pink-500/30 animate-pulse animation-delay-600"></div>
                  <Heart className="h-12 w-12 text-pink-500 fill-pink-500 animate-heartbeat z-10" />
                </div>

                <button
                  className={`${
                    isMuted ? "bg-gray-600" : "bg-[#2a1a34] hover:bg-[#3a1a44]"
                  } h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 border-2 ${
                    isMuted ? "border-gray-500" : "border-[#4a2a54]"
                  }`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <MicOff className="h-10 w-10 text-white" />
                  ) : (
                    <Mic className="h-10 w-10 text-white" />
                  )}
                </button>
              </div>

              {/* Call timer */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
                  <span className="text-white text-lg font-medium">
                    {formatCallTime(callTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
