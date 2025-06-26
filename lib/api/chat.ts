// 聊天相关API

import { mainApiClient, ragApiClient } from './client';
import { 
  ChatHistoryItem, 
  ChatHistoryResponse, 
  StreamChatRequest,
  StreamCallback,
  StreamCompleteCallback,
  StreamErrorCallback,
  ApiResponse 
} from './types';
import { API_PATHS } from './config';
import { AuthAPI } from './auth';

export class ChatAPI {
  /**
   * 获取聊天历史
   */
  static async getChatHistory(characterId: number): Promise<ChatHistoryItem[]> {
    try {
      const response = await mainApiClient.get<ChatHistoryResponse>(
        `${API_PATHS.CHAT.HISTORY}/${characterId}`
      );

      if (!response.success) {
        throw new Error(response.error || '获取聊天历史失败');
      }

      return response.histories || [];
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      throw error;
    }
  }

  /**
   * 清除聊天历史
   */
  static async clearChatHistory(characterId: number): Promise<ApiResponse> {
    try {
      const response = await mainApiClient.delete<ApiResponse>(
        `${API_PATHS.CHAT.HISTORY}/${characterId}`
      );

      return response;
    } catch (error) {
      console.error('清除聊天历史失败:', error);
      throw error;
    }
  }

  /**
   * 发送流式聊天消息
   */
  static async sendStreamMessage(
    message: string,
    characterId: number,
    onChunk: StreamCallback,
    onComplete: StreamCompleteCallback,
    onError: StreamErrorCallback
  ): Promise<() => void> {
    const controller = new AbortController();
    
    try {
      // 获取用户ID
      const userId = AuthAPI.getUserId();
      
      // 构建请求数据
      const requestData: StreamChatRequest = {
        user_id: userId,
        session_id: ragApiClient.generateSessionId(characterId),
        message: message
      };

      console.log('🔍 发起流式对话:', requestData);

      // 发起流式请求
      const url = ragApiClient.buildURL(API_PATHS.CHAT.MESSAGE_STREAM);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthAPI.getToken()}`,
          'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
          'X-Title': 'Lumilove'
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`流式请求失败: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      this.processStreamResponse(reader, onChunk, onComplete, onError);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('流式对话失败:', errorMessage);
      onError(errorMessage);
    }

    // 返回取消函数
    return () => {
      console.log('🚫 取消流式请求');
      controller.abort();
    };
  }

  /**
   * 处理流式响应
   */
  private static async processStreamResponse(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: StreamCallback,
    onComplete: StreamCompleteCallback,
    onError: StreamErrorCallback
  ): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('📥 流式响应完成');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            
            if (content === '[DONE]') {
              console.log('✅ 收到结束标识');
              onComplete();
              return;
            }
            
            if (content.trim()) {
              onChunk(content);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('处理流式响应失败:', errorMessage);
      onError(errorMessage);
    }
  }

  /**
   * 生成会话ID
   */
  static generateSessionId(characterId: number): string {
    return ragApiClient.generateSessionId(characterId);
  }

  /**
   * 保存最近聊天记录到本地存储
   */
  static saveRecentChat(characterData: {
    id: string;
    name: string;
    imageSrc: string;
    gender: 'male' | 'female';
  }): void {
    try {
      if (typeof window === 'undefined') return;

      const chatHistory = JSON.parse(
        localStorage.getItem('recentChats') || '[]'
      );

      const newChat = {
        ...characterData,
        timestamp: new Date().toISOString()
      };

      // 检查是否已存在该角色的聊天记录
      const existingIndex = chatHistory.findIndex(
        (chat: any) => chat.id === characterData.id
      );
      
      if (existingIndex !== -1) {
        chatHistory.splice(existingIndex, 1);
      }

      chatHistory.unshift(newChat);
      const updatedHistory = chatHistory.slice(0, 10); // 限制为10条记录
      
      localStorage.setItem('recentChats', JSON.stringify(updatedHistory));
      console.log('💾 最近聊天记录已保存');
    } catch (error) {
      console.error('保存最近聊天记录失败:', error);
    }
  }

  /**
   * 获取最近聊天记录
   */
  static getRecentChats(): any[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const chatHistory = localStorage.getItem('recentChats');
      return chatHistory ? JSON.parse(chatHistory) : [];
    } catch (error) {
      console.error('获取最近聊天记录失败:', error);
      return [];
    }
  }

  /**
   * 转换聊天历史为前端消息格式
   */
  static convertHistoryToMessages(history: ChatHistoryItem[]): any[] {
    const convertedMessages: any[] = [];

    history.forEach((item) => {
      // 添加用户消息
      convertedMessages.push({
        id: item.id * 2 - 1,
        sender: "user",
        text: item.message,
        timestamp: item.createdAt,
      });

      // 添加AI回复（跳过占位符）
      if (
        item.response && 
        item.response !== "[流式响应]" && 
        item.response.trim() !== ""
      ) {
        convertedMessages.push({
          id: item.id * 2,
          sender: "ai",
          text: item.response,
          timestamp: item.createdAt,
        });
      }
    });

    return convertedMessages;
  }

  /**
   * 重新加载聊天历史（用于流式对话完成后同步）
   */
  static async reloadChatHistory(
    characterId: number,
    setMessages: (messages: any[]) => void
  ): Promise<void> {
    try {
      const history = await this.getChatHistory(characterId);
      const convertedMessages = this.convertHistoryToMessages(history);
      setMessages(convertedMessages);
      console.log('🔄 聊天历史已重新加载');
    } catch (error) {
      console.error('重新加载聊天历史失败:', error);
    }
  }

  /**
   * 发送普通聊天消息（非流式）
   */
  static async sendMessage(
    message: string,
    characterId: number
  ): Promise<ApiResponse> {
    try {
      const response = await mainApiClient.post<ApiResponse>('/chat', {
        characterId,
        message,
        chatId: characterId.toString()
      });

      return response;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }
}

export default ChatAPI;