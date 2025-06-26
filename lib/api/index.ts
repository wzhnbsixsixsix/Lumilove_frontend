// 统一API入口文件

// 导入API类
import { AuthAPI } from './auth';
import { ChatAPI } from './chat';
import { UserAPI } from './user';

// 导出所有API类
export { AuthAPI } from './auth';
export { ChatAPI } from './chat';
export { UserAPI } from './user';

// 导出客户端实例
export { mainApiClient, ragApiClient } from './client';

// 导出类型定义
export type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  User,
  UserProfile,
  RegisterRequest,
  ChatHistoryItem,
  ChatHistoryResponse,
  StreamChatRequest,
  Character,
  HttpMethod,
  RequestConfig,
  ApiError,
  StreamCallback,
  StreamCompleteCallback,
  StreamErrorCallback
} from './types';

// 导出配置常量
export {
  API_ENDPOINTS,
  CURRENT_API,
  COMMON_HEADERS,
  TIMEOUT_CONFIG,
  RETRY_CONFIG,
  STORAGE_KEYS,
  API_PATHS,
  ERROR_MESSAGES,
  HTTP_STATUS
} from './config';

// 创建统一的API实例，方便使用
export const api = {
  auth: AuthAPI,
  chat: ChatAPI,
  user: UserAPI
};

// 默认导出
export default api;