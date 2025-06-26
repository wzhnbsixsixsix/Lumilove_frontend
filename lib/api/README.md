# Lumilove API 统一管理系统

## 概述

本目录包含了LumiLove前端项目的统一API管理系统，提供类型安全的API调用方式，集中处理认证、错误处理和重试逻辑。

## 目录结构

```
lib/api/
├── index.ts          # 统一入口文件
├── types.ts          # TypeScript类型定义
├── config.ts         # API配置和常量
├── client.ts         # HTTP客户端实现
├── auth.ts           # 认证相关API
├── chat.ts           # 聊天相关API
├── user.ts           # 用户相关API
└── README.md         # 使用文档
```

## 快速开始

### 基本用法

```typescript
// 导入统一API
import api from '@/lib/api';

// 或者导入特定的API类
import { AuthAPI, ChatAPI, UserAPI } from '@/lib/api';

// 使用统一实例
const user = await api.auth.login({ email, password });
const history = await api.chat.getChatHistory(characterId);

// 或者直接使用API类
const user = await AuthAPI.login({ email, password });
const history = await ChatAPI.getChatHistory(characterId);
```

### 类型安全

所有API调用都有完整的TypeScript类型支持：

```typescript
import { LoginRequest, LoginResponse, User } from '@/lib/api';

// 类型安全的登录请求
const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'password123'
};

const response: LoginResponse = await api.auth.login(loginData);
const user: User = response.user;
```

## API模块详解

### 认证API (AuthAPI)

处理用户认证相关功能：

```typescript
// 用户登录
const loginResponse = await AuthAPI.login({
  email: 'user@example.com',
  password: 'password123'
});

// 用户注册
const registerResponse = await AuthAPI.register({
  email: 'user@example.com',
  password: 'password123',
  username: 'username'
});

// 检查登录状态
const isLoggedIn = AuthAPI.isLoggedIn();

// 获取当前用户
const currentUser = await AuthAPI.getCurrentUser();

// 登出
await AuthAPI.logout();
```

### 聊天API (ChatAPI)

处理聊天相关功能：

```typescript
// 获取聊天历史
const history = await ChatAPI.getChatHistory(characterId);

// 发送流式消息
const cancelFn = await ChatAPI.sendStreamMessage(
  'Hello',
  characterId,
  (chunk) => console.log('收到:', chunk),      // onChunk
  () => console.log('完成'),                   // onComplete
  (error) => console.error('错误:', error)     // onError
);

// 取消流式请求
cancelFn();

// 清除聊天历史
await ChatAPI.clearChatHistory(characterId);

// 保存最近聊天
ChatAPI.saveRecentChat({
  id: '1',
  name: '角色名称',
  imageSrc: '/avatar.jpg',
  gender: 'female'
});
```

### 用户API (UserAPI)

处理用户资料相关功能：

```typescript
// 获取用户资料
const profile = await UserAPI.getProfile();

// 更新用户资料
const updatedProfile = await UserAPI.updateProfile({
  username: 'newUsername'
});

// 上传头像
const avatarResult = await UserAPI.uploadAvatar(file);

// 获取订阅状态
const subscription = await UserAPI.getSubscriptionStatus();

// 获取用户统计
const stats = await UserAPI.getUserStats();
```

## 配置说明

### API端点配置

在 `config.ts` 中定义了所有API端点：

```typescript
export const API_ENDPOINTS = {
  MAIN: 'http://54.206.37.109:8080/api',      // 主后端服务
  BACKUP: 'https://54.206.37.109:8443/api',   // 备用后端服务
  RAG: 'https://54.206.37.109:8001/api'       // RAG对话服务
};
```

### 存储键配置

```typescript
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
  RECENT_CHATS: 'recentChats'
};
```

## 错误处理

API客户端提供了统一的错误处理机制：

```typescript
try {
  const response = await api.auth.login(credentials);
} catch (error) {
  if (error.status === 401) {
    // 处理认证错误
    console.log('登录失败，请检查凭据');
  } else if (error.status >= 500) {
    // 处理服务器错误
    console.log('服务器错误，请稍后重试');
  } else {
    // 处理其他错误
    console.log(error.message);
  }
}
```

## 重试机制

API客户端内置了重试机制，会自动重试网络错误和5xx服务器错误：

```typescript
// 重试配置
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,       // 最大重试次数
  RETRY_DELAY: 1000,    // 重试延迟（毫秒）
  BACKOFF_FACTOR: 2     // 指数退避因子
};
```

## 认证管理

API客户端自动处理认证token：

- 自动在请求头中添加Authorization Bearer token
- token存储在localStorage中
- 401错误时自动清除认证信息并跳转到登录页
- 提供token验证方法

## 流式聊天处理

对于实时聊天功能，提供了完整的流式响应处理：

```typescript
// 流式聊天示例
const cancelStream = await ChatAPI.sendStreamMessage(
  message,
  characterId,
  // 处理每个消息块
  (chunk) => {
    setMessages(prev => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], text: prev[prev.length - 1].text + chunk }
    ]);
  },
  // 流完成回调
  () => {
    // 重新加载聊天历史以获取完整记录
    ChatAPI.reloadChatHistory(characterId, setMessages);
  },
  // 错误处理
  (error) => {
    console.error('流式聊天错误:', error);
  }
);

// 在组件卸载时取消流
useEffect(() => {
  return () => {
    if (cancelStream) {
      cancelStream();
    }
  };
}, []);
```

## 迁移指南

### 从旧API调用迁移

#### 登录功能迁移

**旧方式：**
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

**新方式：**
```typescript
const response = await AuthAPI.login({ email, password });
```

#### 聊天历史迁移

**旧方式：**
```typescript
const response = await fetch(`/api/chat/history/${characterId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**新方式：**
```typescript
const history = await ChatAPI.getChatHistory(characterId);
```

## 注意事项

1. **类型安全**: 始终使用提供的TypeScript类型，避免使用any
2. **错误处理**: 所有API调用都应该用try-catch包装
3. **认证状态**: 使用AuthAPI.isLoggedIn()检查登录状态
4. **流式请求**: 记得在组件卸载时取消流式请求
5. **localStorage**: API会自动管理localStorage，不需要手动操作

## 扩展指南

如需添加新的API端点：

1. 在相应的API类中添加新方法
2. 在types.ts中定义相关类型
3. 在config.ts中添加路径常量
4. 更新此文档

示例：

```typescript
// 在UserAPI中添加新方法
static async getFavorites(): Promise<Character[]> {
  return await mainApiClient.get<Character[]>('/users/favorites');
}
```