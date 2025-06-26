# 聊天历史 API 文档

## 服务信息

**基础URL:** `http://54.206.37.109:8080/api`

**认证要求:** 所有API都需要Bearer Token认证

**通用请求头:**
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/
X-Title: Lumilove
```

## 数据模型

### 聊天历史项

```typescript
interface ChatHistoryItem {
  id: number;              // 消息记录ID
  userId: number;          // 用户ID
  characterId: number;     // 角色ID
  message: string;         // 用户发送的消息
  response: string;        // AI回复内容
  msgType: 'text' | 'image' | 'voice';  // 消息类型
  createdAt: string;       // 创建时间 (ISO 8601格式)
}
```

### API响应包装

```typescript
interface ChatHistoryResponse {
  success: boolean;          // 请求是否成功
  histories: ChatHistoryItem[];  // 聊天历史数组
  totalCount: number;        // 总记录数
  error?: string;            // 错误信息（失败时）
}
```

## API 端点

### 1. 获取聊天历史

**接口路径:** `GET /chat/history/{characterId}`

**描述:** 获取用户与指定角色的聊天历史记录

**路径参数:**
- `characterId` (number) - 角色ID，必填

**请求头:**
```http
Authorization: Bearer {accessToken}
HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/
X-Title: Lumilove
```

**请求示例:**
```bash
curl -X GET "http://54.206.37.109:8080/api/chat/history/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/" \
  -H "X-Title: Lumilove"
```

**响应结果:**
```typescript
interface GetChatHistoryResponse extends ChatHistoryResponse {
  success: true;
  histories: ChatHistoryItem[];
  totalCount: number;
}
```

**成功响应示例:**
```json
{
  "success": true,
  "histories": [
    {
      "id": 1,
      "userId": 12345,
      "characterId": 1,
      "message": "Hello, how are you?",
      "response": "I'm doing great! Thanks for asking. How has your day been?",
      "msgType": "text",
      "createdAt": "2024-06-26T14:20:00Z"
    },
    {
      "id": 2,
      "userId": 12345,
      "characterId": 1,
      "message": "Can you send me a picture?",
      "response": "[流式响应]",
      "msgType": "image",
      "createdAt": "2024-06-26T14:25:00Z"
    }
  ],
  "totalCount": 2
}
```

**错误响应示例:**
```json
{
  "success": false,
  "histories": [],
  "totalCount": 0,
  "error": "Character not found"
}
```

**状态码:**
- `200 OK` - 获取成功
- `401 Unauthorized` - 令牌无效或已过期
- `403 Forbidden` - 无权访问该角色的聊天记录
- `404 Not Found` - 角色不存在
- `500 Internal Server Error` - 服务器内部错误

### 2. 清除聊天历史

**接口路径:** `DELETE /chat/history/{characterId}`

**描述:** 删除用户与指定角色的所有聊天历史记录

**路径参数:**
- `characterId` (number) - 角色ID，必填

**请求头:**
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/
X-Title: Lumilove
```

**请求示例:**
```bash
curl -X DELETE "http://54.206.37.109:8080/api/chat/history/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -H "HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/" \
  -H "X-Title: Lumilove"
```

**响应结果:**
```typescript
interface ClearChatHistoryResponse {
  success: boolean;        // 操作是否成功
  message?: string;        // 成功消息
  error?: string;          // 错误信息
  deletedCount?: number;   // 删除的记录数量（可选）
}
```

**成功响应示例:**
```json
{
  "success": true,
  "message": "Chat history cleared successfully",
  "deletedCount": 15
}
```

**错误响应示例:**
```json
{
  "success": false,
  "error": "Failed to clear chat history"
}
```

**状态码:**
- `200 OK` - 清除成功
- `401 Unauthorized` - 令牌无效或已过期
- `403 Forbidden` - 无权删除该角色的聊天记录
- `404 Not Found` - 角色不存在
- `500 Internal Server Error` - 服务器内部错误

## 前端集成

### 获取聊天历史

```typescript
// lib/api.ts:165
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
```

### 清除聊天历史

```typescript
// lib/api.ts:193
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
```

### 数据转换处理

前端需要将API返回的历史数据转换为UI消息格式：

```typescript
// app/chat/[id]/page.tsx:216
const convertedMessages: Message[] = [];

history.forEach((item) => {
  // 添加用户消息
  convertedMessages.push({
    id: item.id * 2 - 1,
    sender: "user",
    text: item.message,
    timestamp: item.createdAt,
  });
  
  // 添加AI回复（跳过占位符）
  if (item.response && item.response !== "[流式响应]" && item.response.trim() !== "") {
    convertedMessages.push({
      id: item.id * 2,
      sender: "ai",
      text: item.response,
      timestamp: item.createdAt,
    });
  }
});
```

### 本地存储同步

```typescript
// app/chat/[id]/page.tsx:129
// 保存聊天历史到localStorage
const chatHistory = JSON.parse(localStorage.getItem('recentChats') || '[]');

const newChat = {
  id: chatId,
  name: character.name,
  imageSrc: character.images?.[0] || character.avatarSrc,
  timestamp: new Date().toISOString(),
  gender: character.occupation.toLowerCase().includes('businessman') ? 'male' : 'female'
};

// 检查是否已存在该角色的聊天记录
const existingIndex = chatHistory.findIndex((chat: any) => chat.id === chatId);
if (existingIndex !== -1) {
  chatHistory.splice(existingIndex, 1);
}

chatHistory.unshift(newChat);
const updatedHistory = chatHistory.slice(0, 10);
localStorage.setItem('recentChats', JSON.stringify(updatedHistory));
```

## 数据处理注意事项

1. **占位符过滤**: 响应中包含"[流式响应]"的记录应被跳过
2. **ID映射**: 前端使用`item.id * 2 - 1`和`item.id * 2`生成用户和AI消息的ID
3. **时间格式**: API返回ISO 8601格式的时间戳
4. **消息类型**: 支持text、image、voice三种类型
5. **本地缓存**: 最近聊天列表存储在localStorage中，限制为10条记录

## 错误处理

### 常见错误码
- `401` - Token过期或无效，需要重新登录
- `403` - 权限不足，无法访问该角色的聊天记录
- `404` - 角色不存在
- `500` - 服务器内部错误

### 错误处理示例

```typescript
try {
  const history = await getChatHistory(token, characterId);
  // 处理成功逻辑
} catch (error) {
  if (error.message.includes('401')) {
    // Token无效，清除本地存储并跳转登录
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  } else {
    // 其他错误处理
    console.error('获取聊天历史失败:', error);
  }
}
```

## 相关文件

- `lib/api.ts` - API调用函数实现
- `app/chat/[id]/page.tsx` - 聊天页面历史记录处理
- `lib/config.ts` - API基础配置