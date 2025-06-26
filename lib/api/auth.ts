// 认证相关API

import { mainApiClient } from './client';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  ApiResponse 
} from './types';
import { API_PATHS, STORAGE_KEYS } from './config';

export class AuthAPI {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await mainApiClient.post<LoginResponse>(
        API_PATHS.AUTH.LOGIN,
        credentials
      );

      // 处理token格式
      if (response.accessToken) {
        const token = response.accessToken.replace(/^Bearer\s+/, '');
        
        // 存储认证信息
        this.setAuthData(token, response.user);
        
        return {
          ...response,
          accessToken: token
        };
      }

      throw new Error('登录响应缺少accessToken');
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * 用户注册
   */
  static async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    try {
      return await mainApiClient.post<ApiResponse<User>>(
        API_PATHS.AUTH.REGISTER,
        userData
      );
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<void> {
    try {
      // 尝试调用服务端登出接口
      await mainApiClient.post(API_PATHS.AUTH.LOGOUT);
    } catch (error) {
      console.error('服务端登出失败:', error);
      // 即使服务端登出失败，也要清除本地数据
    } finally {
      // 清除本地认证数据
      this.clearAuthData();
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await mainApiClient.get<User>(API_PATHS.AUTH.ME);
      return response;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 验证token有效性
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const response = await mainApiClient.get<any>('/auth/verify');
      return !!response;
    } catch (error) {
      console.error('Token验证失败:', error);
      return false;
    }
  }

  /**
   * 检查登录状态
   */
  static isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    
    return !!(token && isLoggedIn === 'true');
  }

  /**
   * 获取存储的token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * 获取存储的用户信息
   */
  static getStoredUser(): User | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('解析用户数据失败:', error);
      return null;
    }
  }

  /**
   * 获取用户ID
   */
  static getUserId(): string {
    const user = this.getStoredUser();
    if (!user) return "0";
    
    // 按优先级尝试获取用户ID
    if (user.id) return user.id.toString();
    if ((user as any).userId) return (user as any).userId.toString();
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return "0";
  }

  /**
   * 设置认证数据
   */
  private static setAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    
    console.log('认证数据已存储');
  }

  /**
   * 清除认证数据
   */
  private static clearAuthData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    
    console.log('认证数据已清除');
  }

  /**
   * 验证token有效性
   */
  static async validateToken(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * 刷新用户信息
   */
  static async refreshUserInfo(): Promise<User | null> {
    try {
      const user = await this.getCurrentUser();
      if (user) {
        // 更新本地存储的用户信息
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      return null;
    }
  }
}

export default AuthAPI;