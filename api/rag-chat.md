# RAG 对话 API 文档

## 服务信息

**基础URL:** `https://54.206.37.109:8001/api`

**协议:** HTTPS + Server-Sent Events (SSE)

**认证要求:** Bearer Token认证

**通用请求头:**
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

## 数据模型

### 流式对话请求

```typescript
interface StreamChatRequest {
  user_id: string;      // 用户ID
  session_id: string;   // 会话ID，格式：user_{userId}_character_{characterId}
  message: string;      // 用户发送的消息内容
}
```

### 流式响应数据

RAG服务使用Server-Sent Events (SSE)协议返回流式数据：

```
data: {content_chunk}
data: {content_chunk}
data: [DONE]
```

## API 端点

### 流式对话接口

**接口路径:** `POST /chat/message/stream/authenticated`

**描述:** 发送消息并接收流式AI回复，支持实时显示AI思考和回复过程

**请求头:**
```http
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**请求参数:**
```typescript
interface StreamChatRequest {
  user_id: string;      // 用户ID，从localStorage获取
  session_id: string;   // 会话标识符
  message: string;      // 用户消息内容
}
```

**请求示例:**
```bash
curl -X POST "https://54.206.37.109:8001/api/chat/message/stream/authenticated" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "user_id": "12345",
    "session_id": "user_12345_character_1",
    "message": "Hello, how are you today?"
  }'
```

**JSON请求体示例:**
```json
{
  "user_id": "12345",
  "session_id": "user_12345_character_1", 
  "message": "Can you tell me about yourself?"
}
```

**响应格式 (SSE):**
```
data: I'm
data:  an
data:  AI
data:  assistant
data:  designed
data:  to
data:  help
data:  you
data:  with
data:  various
data:  tasks
data: [DONE]
```

**状态码:**
- `200 OK` - 连接成功，开始流式传输
- `400 Bad Request` - 请求参数无效
- `401 Unauthorized` - 令牌无效或已过期
- `429 Too Many Requests` - 请求频率过高
- `500 Internal Server Error` - 服务器内部错误

## 前端集成实现

### 流式对话函数

```typescript
// lib/api.ts:61
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
        // 获取用户ID的策略
        userId = user.id?.toString() || user.email?.split('@')[0] || "0";
        console.log(`🔍 获取到用户ID: ${userId}`);
      } catch (e) {
        console.error('解析用户数据失败:', e);
      }
    }
    
    // 调用RAG服务的认证流式接口
    const response = await fetch(`https://54.206.37.109:8001/api/chat/message/stream/authenticated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_id: userId,
        session_id: `user_${userId}_character_${characterId}`,
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
```

### 前端使用示例

```typescript
// app/chat/[id]/page.tsx:306
const handleSendMessage = async () => {
  if (!inputValue.trim() || !token) return;
  
  const messageText = inputValue.trim();
  const characterId = typeof character.id === 'string' ? parseInt(character.id, 10) : character.id;
  setInputValue("");
  
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now(),
    sender: "user",
    text: messageText,
    timestamp: new Date().toISOString(),
  };
  
  // 创建AI消息占位
  const aiMessageId = Date.now() + 1;
  const tempAiMessage: Message = {
    id: aiMessageId,
    sender: "ai",
    text: "",
    timestamp: new Date().toISOString(),
    isThinking: true,  // 显示思考状态
  };
  
  setMessages(prev => [...prev, userMessage, tempAiMessage]);
  setIsLoading(true);
  
  try {
    let accumulatedContent = "";
    
    await sendChatMessageStream(
      token,
      messageText,
      chatId,
      characterId,
      // onChunk: 处理每个数据块
      (content: string) => {
        accumulatedContent += content;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  text: accumulatedContent,
                  isThinking: false  // 停止思考状态
                }
              : msg
          )
        );
      },
      // onComplete: 流式完成
      async () => {
        setIsLoading(false);
        await reloadChatHistory();  // 重新加载历史记录
      },
      // onError: 错误处理
      (error: string) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  text: `错误: ${error}`,
                  isThinking: false 
                }
              : msg
          )
        );
        setIsLoading(false);
      }
    );
  } catch (error) {
    console.error("流式处理失败:", error);
    setIsLoading(false);
  }
};
```

## 会话管理

### Session ID 生成规则

```typescript
// 会话ID格式
const sessionId = `user_${userId}_character_${characterId}`;

// 示例
// 用户ID: 12345, 角色ID: 1
// Session ID: "user_12345_character_1"
```

### 用户ID获取策略

```typescript
// lib/api.ts:220
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
```

## UI状态管理

### 思考状态显示

```typescript
// 消息接口包含思考状态
interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isThinking?: boolean;  // 标识是否正在思考
}

// UI渲染思考状态
{message.sender === "ai" && message.isThinking && (
  <div className="flex items-center space-x-2 text-gray-400">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
    </div>
    <span className="text-sm italic">Thinking...</span>
  </div>
)}
```

### 加载状态管理

```typescript
// 加载状态提示
{isLoading && (
  <div className="mb-3 flex items-center justify-center space-x-2 text-gray-400">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
    </div>
    <span className="text-sm">AI is responding...</span>
  </div>
)}
```

## 错误处理

### 常见错误类型

1. **网络错误**: 连接超时、网络中断
2. **认证错误**: Token过期或无效
3. **请求限制**: 频率限制、配额用尽
4. **服务错误**: RAG服务内部错误

### 错误处理策略

```typescript
// 请求中断控制
const controller = new AbortController();

// 错误重试机制
const MAX_RETRIES = 3;
let retryCount = 0;

const handleError = (error: string) => {
  if (error.includes('401') || error.includes('Unauthorized')) {
    // Token过期，跳转登录
    localStorage.removeItem('token');
    router.push('/login');
  } else if (retryCount < MAX_RETRIES) {
    // 重试机制
    retryCount++;
    setTimeout(() => {
      // 重新发送请求
    }, 1000 * retryCount);
  } else {
    // 显示错误信息
    console.error('流式对话失败:', error);
  }
};
```

## 性能优化

### 流式数据缓冲

```typescript
// 使用缓冲区处理流式数据
let buffer = '';

// 处理数据块
buffer += decoder.decode(value, { stream: true });
const lines = buffer.split('\n');
buffer = lines.pop() || '';  // 保留未完成的行
```

### 请求取消

```typescript
// 组件卸载时取消请求
useEffect(() => {
  return () => {
    abortController?.abort();
  };
}, []);
```

## 安全考虑

1. **HTTPS**: RAG服务强制使用HTTPS协议
2. **Token验证**: 每个请求都需要有效的Bearer Token
3. **会话隔离**: 通过session_id确保用户会话隔离
4. **请求限制**: 服务端应实现频率限制
5. **输入验证**: 消息内容需要进行安全验证

## 相关文件

- `lib/api.ts` - RAG对话API实现
- `app/chat/[id]/page.tsx` - 聊天页面集成
- `lib/config.ts` - API配置