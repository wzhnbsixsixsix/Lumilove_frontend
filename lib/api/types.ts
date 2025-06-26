// API 通用类型定义

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

// 聊天相关类型
export interface ChatHistoryItem {
  id: number;
  userId: number;
  characterId: number;
  message: string;
  response: string;
  msgType: 'text' | 'image' | 'voice';
  createdAt: string;
}

export interface ChatHistoryResponse {
  success: boolean;
  histories: ChatHistoryItem[];
  totalCount: number;
  error?: string;
}

export interface StreamChatRequest {
  user_id: string;
  session_id: string;
  message: string;
}

// 角色相关类型
export interface Character {
  id: string | number;
  name: string;
  age?: number;
  occupation: string;
  tags: string[];
  mappedTags?: string[];
  description: string;
  chatCount: string;
  likeCount: string;
  followers?: string;
  imageSrc: string;
  avatarSrc: string;
  images?: string[];
  gender: 'male' | 'female';
  creator: {
    id: string;
    name: string;
    likeCount: string;
  };
  rank?: number;
  isPopular?: boolean;
  isNew?: boolean;
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求配置
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  signal?: AbortSignal;
}

// 错误类型
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// 流式回调类型
export type StreamCallback = (content: string) => void;
export type StreamCompleteCallback = () => void;
export type StreamErrorCallback = (error: string) => void;