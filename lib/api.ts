import { API_CONFIG } from './config';

interface LoginResponse {
    accessToken: string;
  }
  
  interface ChatResponse {
    message: string;
    // Add other response fields as needed
  }

  const API_BASE_URL = `${API_CONFIG.BASE_URL}/api`;
  
  export async function login(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data: LoginResponse = await response.json();
    return data.accessToken;
  }
  
  export async function sendChatMessage(accessToken: string, message: string, chatId: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message,
        chatId,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  
    return response.json();
  }