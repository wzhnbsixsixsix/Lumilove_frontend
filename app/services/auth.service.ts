import axiosInstance from '../lib/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://54.206.37.109:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

class AuthService {
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`/auth/login`, loginRequest);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AuthError('Invalid email or password');
      }
      throw new AuthError('Login failed. Please try again later.');
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // 即使登出失败，我们也继续清除本地状态
    } finally {
      // 无论API调用成功与否，都要清除本地token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken'); // 如果有refresh token也要清除
      console.log('Local auth data cleared');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosInstance.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService(); 