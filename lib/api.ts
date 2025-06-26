import { CURRENT_API, COMMON_HEADERS } from './api/config';

interface LoginResponse {
    accessToken: string;
  }
  
  interface ChatResponse {
    message: string;
    // Add other response fields as needed
  }

  const API_BASE_URL = CURRENT_API.MAIN;
  
  export async function login(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data: LoginResponse = await response.json();
    return data.accessToken;
  }
  
  export async function sendChatMessage(
    accessToken: string, 
    message: string, 
    chatId: string,
    characterId: number
  ): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        characterId,
        message,
        chatId,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  
    return response.json();
  }

  export async function sendChatMessageStream(
    accessToken: string, 
    message: string, 
    chatId: string,
    characterId: number,
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<() => void> {
    const controller = new AbortController();
    
    try {
      // 获取真实的用户数据
      const userData = localStorage.getItem('user');
      let userId = "0"; // 默认值
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // 假设用户数据中有id字段，如果没有可以用email的hash或其他唯一标识
          userId = user.id?.toString() || user.email?.split('@')[0] || "0";
          console.log(`🔍 获取到用户ID: ${userId}`);
        } catch (e) {
          console.error('解析用户数据失败:', e);
        }
      }
      
      // 直接调用RAG服务的认证流式接口
      const response = await fetch(`${CURRENT_API.RAG}/chat/message/stream/authenticated`, {
        method: 'POST',
        headers: {
          ...COMMON_HEADERS,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: userId, // 使用真实的用户ID
          session_id: `user_${userId}_character_${characterId}`, // 使用真实的session_id
          message: message,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('流式请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            if (content === '[DONE]') {
              onComplete();
              return () => controller.abort();
            }
            if (content.trim()) {
              onChunk(content);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error));
    }

    return () => controller.abort();
  }

  // 定义聊天历史类型（匹配后端）
  export interface ChatHistoryItem {
    id: number;
    userId: number;
    characterId: number;
    message: string;
    response: string;
    msgType: 'text' | 'image' | 'voice'; // 改为小写
    createdAt: string;
  }

  // 添加后端响应的包装类型
  export interface ChatHistoryResponse {
    success: boolean;
    histories: ChatHistoryItem[];
    totalCount: number;
    error?: string;
  }

  // 获取聊天历史
  export async function getChatHistory(
    accessToken: string,
    characterId: number
  ): Promise<ChatHistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/chat/history/${characterId}`, {
      method: 'GET',
      headers: {
        ...COMMON_HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get chat history: ${response.status} ${errorText}`);
    }

    const data: ChatHistoryResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get chat history');
    }
    
    return data.histories || [];
  }

  // 清空聊天历史
  export async function clearChatHistory(
    accessToken: string,
    characterId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history/${characterId}`, {
        method: 'DELETE',
        headers: {
          ...COMMON_HEADERS,
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`清空聊天历史失败: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // 添加获取用户ID的辅助函数
  export function getCurrentUserId(): string {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return "0";
      
      const user = JSON.parse(userData);
      
      // 按优先级尝试获取用户ID
      if (user.id) return user.id.toString();
      if (user.userId) return user.userId.toString();
      if (user.email) {
        // 使用email前缀作为用户ID（临时方案）
        return user.email.split('@')[0];
      }
      
      return "0";
    } catch (error) {
      console.error('获取用户ID失败:', error);
      return "0";
    }
  }

  // 生成session_id的辅助函数
  export function generateSessionId(characterId: number): string {
    const userId = getCurrentUserId();
    return `user_${userId}_character_${characterId}`;
  }

  // 导出类型
