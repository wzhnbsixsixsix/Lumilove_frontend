// API 统一配置管理

export const API_ENDPOINTS = {
  // 主后端服务 (认证、聊天历史)
  MAIN: 'http://54.206.37.109:8080/api',
  // 备用后端服务
  BACKUP: 'https://54.206.37.109:8443/api',
  // RAG对话服务
  RAG: 'https://54.206.37.109:8001/api'
} as const;

// 当前使用的端点
export const CURRENT_API = {
  MAIN: API_ENDPOINTS.MAIN,
  RAG: API_ENDPOINTS.RAG
} as const;

// 通用请求头
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
  'X-Title': 'Lumilove'
} as const;

// 请求超时配置
export const TIMEOUT_CONFIG = {
  DEFAULT: 10000,      // 10秒
  UPLOAD: 30000,       // 30秒
  STREAM: 0,           // 流式请求不设超时
} as const;

// 重试配置
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,   // 1秒
  BACKOFF_FACTOR: 2    // 指数退避
} as const;

// localStorage键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
  RECENT_CHATS: 'recentChats',
  CHAT_CHARACTERS: 'chatCharacters',
  USER_SUBSCRIPTION: 'userSubscription'
} as const;

// API路径常量
export const API_PATHS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REGISTER: '/auth/register'
  },
  // 聊天相关
  CHAT: {
    HISTORY: '/chat/history',
    MESSAGE_STREAM: '/chat/message/stream/authenticated'
  },
  // 用户相关
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile'
  }
} as const;

// 错误消息映射
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  AUTH_ERROR: '认证失败，请重新登录',
  SERVER_ERROR: '服务器错误，请稍后重试',
  INVALID_REQUEST: '请求参数无效',
  UNKNOWN_ERROR: '未知错误，请联系客服'
} as const;

// HTTP状态码映射
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500
} as const;