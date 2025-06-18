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
        'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
        'X-Title': 'Lumilove',
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
        'X-Title': 'Lumilove',
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
      // 直接调用RAG服务的认证流式接口
      const response = await fetch(`http://54.206.37.109:8001/api/chat/message/stream/authenticated`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: "0", // 会被服务器覆盖
          session_id: `user_0_character_${characterId}`,
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
        'Authorization': `Bearer ${accessToken}`,
        'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
        'X-Title': 'Lumilove',
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
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
          'X-Title': 'Lumilove',
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

  // 导出类型
