// 统一HTTP客户端

import { 
  ApiResponse, 
  RequestConfig, 
  ApiError,
  HttpMethod 
} from './types';
import { 
  CURRENT_API, 
  COMMON_HEADERS, 
  TIMEOUT_CONFIG, 
  RETRY_CONFIG,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  HTTP_STATUS
} from './config';

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = { ...COMMON_HEADERS };
  }

  /**
   * 获取认证token
   */
  public getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * 获取用户ID
   */
  private getUserId(): string {
    try {
      if (typeof window === 'undefined') return "0";
      
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) return "0";
      
      const user = JSON.parse(userData);
      
      // 按优先级尝试获取用户ID
      if (user.id) return user.id.toString();
      if (user.userId) return user.userId.toString();
      if (user.email) {
        return user.email.split('@')[0];
      }
      
      return "0";
    } catch (error) {
      console.error('获取用户ID失败:', error);
      return "0";
    }
  }

  /**
   * 生成会话ID
   */
  public generateSessionId(characterId: number): string {
    const userId = this.getUserId();
    return `user_${userId}_character_${characterId}`;
  }

  /**
   * 构建完整URL
   */
  public buildURL(path: string): string {
    return `${this.baseURL}${path}`;
  }

  /**
   * 构建请求头
   */
  private buildHeaders(config?: RequestConfig): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    
    // 添加认证头
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 合并自定义头
    if (config?.headers) {
      Object.assign(headers, config.headers);
    }
    
    return headers;
  }

  /**
   * 构建查询参数
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) return '';
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return searchParams.toString() ? `?${searchParams.toString()}` : '';
  }

  /**
   * 处理API错误
   */
  private handleError(error: any, url: string): never {
    console.error(`API请求失败 [${url}]:`, error);
    
    if (error.name === 'AbortError') {
      throw new Error('请求已取消');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    const apiError: ApiError = {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      status: error.status,
      code: error.code,
      details: error.details
    };
    
    throw apiError;
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    // 处理非JSON响应
    if (!contentType?.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.text() as unknown as T;
    }
    
    const data = await response.json();
    
    // 处理业务错误
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || `HTTP ${response.status}`,
        status: response.status,
        code: data.code || response.status.toString(),
        details: data
      };
      
      // 特殊处理401错误
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        this.handleUnauthorized();
        error.message = ERROR_MESSAGES.AUTH_ERROR;
      }
      
      throw error;
    }
    
    return data;
  }

  /**
   * 处理401未授权错误
   */
  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return;
    
    // 清除本地认证信息
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    
    // 跳转到登录页面
    window.location.href = '/login';
  }

  /**
   * 重试机制
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = RETRY_CONFIG.MAX_RETRIES
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(RETRY_CONFIG.RETRY_DELAY * (RETRY_CONFIG.MAX_RETRIES - retries + 1));
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any): boolean {
    // 网络错误或5xx错误可以重试
    return (
      error.name === 'TypeError' || 
      (error.status >= 500 && error.status < 600) ||
      error.status === HTTP_STATUS.RATE_LIMITED
    );
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 通用请求方法
   */
  public async request<T = any>(
    method: HttpMethod,
    path: string,
    config?: RequestConfig
  ): Promise<T> {
    const url = this.buildURL(path + this.buildQueryString(config?.params));
    const headers = this.buildHeaders(config);
    
    const requestConfig: RequestInit = {
      method,
      headers,
      signal: config?.signal,
      credentials: 'include'
    };
    
    // 添加请求体
    if (config?.data && method !== 'GET') {
      requestConfig.body = JSON.stringify(config.data);
    }
    
    return this.withRetry(async () => {
      try {
        const response = await fetch(url, requestConfig);
        return this.handleResponse<T>(response);
      } catch (error) {
        this.handleError(error, url);
      }
    });
  }

  /**
   * GET请求
   */
  public get<T = any>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', path, config);
  }

  /**
   * POST请求
   */
  public post<T = any>(path: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', path, { ...config, data });
  }

  /**
   * PUT请求
   */
  public put<T = any>(path: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', path, { ...config, data });
  }

  /**
   * DELETE请求
   */
  public delete<T = any>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', path, config);
  }

  /**
   * PATCH请求
   */
  public patch<T = any>(path: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', path, { ...config, data });
  }
}

// 创建客户端实例
export const mainApiClient = new ApiClient(CURRENT_API.MAIN);
export const ragApiClient = new ApiClient(CURRENT_API.RAG);

// 默认导出主客户端
export default mainApiClient;