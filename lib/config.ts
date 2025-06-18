// API配置
export const API_CONFIG = {
  // 生产环境的后端URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://16.176.180.19:8443',
  
  // API端点
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      VERIFY: '/api/auth/verify',
    },
    USERS: {
      PROFILE: '/api/users/profile',
    },
    CHAT: {
      SEND_MESSAGE: '/api/chat/send',
    }
  }
}

// 辅助函数：构建完整的API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
} 