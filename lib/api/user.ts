// 用户相关API

import { mainApiClient } from './client';
import { 
  User, 
  UserProfile, 
  ApiResponse,
  PaginatedResponse
} from './types';
import { API_PATHS } from './config';

export class UserAPI {
  /**
   * 获取用户资料
   */
  static async getProfile(): Promise<User> {
    try {
      const response = await mainApiClient.get<User>(API_PATHS.USER.PROFILE);
      return response;
    } catch (error) {
      console.error('获取用户资料失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await mainApiClient.put<User>(
        API_PATHS.USER.UPDATE_PROFILE,
        profileData
      );
      return response;
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  }

  /**
   * 上传用户头像
   */
  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(
        mainApiClient.buildURL('/users/avatar'),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mainApiClient.getAuthToken()}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('上传头像失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户订阅状态
   */
  static async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    plan: string;
    expiresAt?: string;
  }> {
    try {
      const response = await mainApiClient.get<{
        isSubscribed: boolean;
        plan: string;
        expiresAt?: string;
      }>('/users/subscription');
      
      return response;
    } catch (error) {
      console.error('获取订阅状态失败:', error);
      // 返回默认值
      return {
        isSubscribed: false,
        plan: 'free'
      };
    }
  }

  /**
   * 更新订阅状态
   */
  static async updateSubscription(plan: string): Promise<ApiResponse> {
    try {
      const response = await mainApiClient.post<ApiResponse>(
        '/users/subscription',
        { plan }
      );
      return response;
    } catch (error) {
      console.error('更新订阅状态失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户创建的角色列表
   */
  static async getCreatedCharacters(): Promise<any[]> {
    try {
      const response = await mainApiClient.get<PaginatedResponse<any>>('/users/characters');
      return response.items || [];
    } catch (error) {
      console.error('获取用户角色失败:', error);
      return [];
    }
  }

  /**
   * 删除用户账户
   */
  static async deleteAccount(): Promise<ApiResponse> {
    try {
      const response = await mainApiClient.delete<ApiResponse>('/users/account');
      return response;
    } catch (error) {
      console.error('删除账户失败:', error);
      throw error;
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    try {
      const response = await mainApiClient.post<ApiResponse>(
        '/users/change-password',
        data
      );
      return response;
    } catch (error) {
      console.error('修改密码失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户使用统计
   */
  static async getUserStats(): Promise<{
    chatCount: number;
    messageCount: number;
    favoriteCount: number;
    createdCharacterCount: number;
  }> {
    try {
      const response = await mainApiClient.get<{
        chatCount: number;
        messageCount: number;
        favoriteCount: number;
        createdCharacterCount: number;
      }>('/users/stats');
      
      return response;
    } catch (error) {
      console.error('获取用户统计失败:', error);
      return {
        chatCount: 0,
        messageCount: 0,
        favoriteCount: 0,
        createdCharacterCount: 0
      };
    }
  }
}

export default UserAPI;