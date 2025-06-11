import axiosInstance from '../lib/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.239.244.183:8080/api';

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