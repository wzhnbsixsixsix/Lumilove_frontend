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
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
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

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          while (true) {
            const lineEnd = buffer.indexOf('\n');
            if (lineEnd === -1) break;

            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);

            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                onComplete();
                return () => controller.abort();
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  onChunk(content);
                }
              } catch (e) {
                console.warn('解析流式数据失败:', data);
              }
            }
          }
        }
        onComplete();
      } finally {
        reader.cancel();
      }
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'AbortError') {
        onError(err.message || '流式请求出错');
      }
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
    msgType: 'TEXT' | 'IMAGE' | 'VOICE'; // 注意大写，匹配数据库枚举
    createdAt: string;
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

    return response.json();
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
