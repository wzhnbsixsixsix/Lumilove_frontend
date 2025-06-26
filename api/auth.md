# 用户认证 API 文档

## 服务信息

**基础URL:** `http://54.206.37.109:8080/api`  
**备用URL:** `https://54.206.37.109:8443/api`

**通用请求头:**
```http
Content-Type: application/json
HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/
X-Title: Lumilove
```

## API 端点

### 1. 用户登录

**接口路径:** `POST /auth/login`

**描述:** 用户邮箱密码登录，获取访问令牌

**请求参数:**
```typescript
interface LoginRequest {
  email: string;     // 用户邮箱，必填
  password: string;  // 用户密码，必填
}
```

**请求示例:**
```bash
curl -X POST "http://54.206.37.109:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "HTTP-Referer: https://main.d3m01u43jjmlec.amplifyapp.com/" \
  -H "X-Title: Lumilove" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**响应结果:**
```typescript
interface LoginResponse {
  accessToken: string;  // JWT访问令牌（可能包含"Bearer "前缀）
  user: {
    id: number;         // 用户ID
    username: string;   // 用户名
    email: string;      // 用户邮箱
  };
  message?: string;     // 成功消息
}
```

**成功响应示例:**
```json
{
  "accessToken": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 12345,
    "username": "testuser",
    "email": "user@example.com"
  },
  "message": "Login successful"
}
```

**错误响应:**
```typescript
interface ErrorResponse {
  message: string;      // 错误消息
  error?: string;       // 错误类型
  statusCode?: number;  // HTTP状态码
}
```

**错误示例:**
```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**状态码:**
- `200 OK` - 登录成功
- `401 Unauthorized` - 邮箱或密码错误
- `400 Bad Request` - 请求参数无效
- `500 Internal Server Error` - 服务器内部错误

### 2. 用户登出

**接口路径:** `POST /auth/logout`

**描述:** 注销用户登录状态

**请求头:**
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**请求示例:**
```bash
curl -X POST "http://54.206.37.109:8080/api/auth/logout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**响应结果:**
```typescript
interface LogoutResponse {
  message: string;      // 成功消息
  success: boolean;     // 操作状态
}
```

**成功响应示例:**
```json
{
  "message": "Logout successful",
  "success": true
}
```

**状态码:**
- `200 OK` - 登出成功
- `401 Unauthorized` - 令牌无效或已过期

### 3. 获取当前用户信息

**接口路径:** `GET /auth/me`

**描述:** 获取当前登录用户的详细信息

**请求头:**
```http
Authorization: Bearer {accessToken}
```

**请求示例:**
```bash
curl -X GET "http://54.206.37.109:8080/api/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应结果:**
```typescript
interface UserInfoResponse {
  id: number;           // 用户ID
  username: string;     // 用户名
  email: string;        // 用户邮箱
  createdAt?: string;   // 注册时间
  updatedAt?: string;   // 更新时间
  profile?: {           // 用户档案信息（可选）
    avatar?: string;    // 头像URL
    bio?: string;       // 个人简介
  };
}
```

**成功响应示例:**
```json
{
  "id": 12345,
  "username": "testuser",
  "email": "user@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-06-26T14:20:00Z",
  "profile": {
    "avatar": "/avatars/12345.png",
    "bio": "AI enthusiast"
  }
}
```

**状态码:**
- `200 OK` - 获取成功
- `401 Unauthorized` - 令牌无效或已过期

## 前端集成

### localStorage 存储

登录成功后，前端会将以下数据存储到 localStorage：

```typescript
// 存储逻辑 (app/login/page.tsx:64-66)
const token = data.accessToken.replace(/^Bearer\s+/, ""); // 移除Bearer前缀
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(data.user));
localStorage.setItem("isLoggedIn", "true");
```

### 令牌使用

在后续API调用中，使用存储的token：

```typescript
// 获取token
const token = localStorage.getItem('token');

// 使用token调用API
const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 用户ID获取

从localStorage中获取用户ID的辅助函数：

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
```

## 注意事项

1. **令牌处理**: API返回的token可能包含"Bearer "前缀，前端需要处理
2. **错误处理**: 401状态码表示需要重新登录
3. **安全性**: 所有敏感操作都需要携带有效的Authorization头
4. **跨域**: 使用`credentials: "include"`处理跨域认证
5. **多端口**: 主服务在8080端口，备用在8443端口

## 相关文件

- `app/login/page.tsx` - 登录页面实现
- `app/services/auth.service.ts` - 认证服务类
- `app/lib/axios.ts` - Axios实例配置
- `lib/config.ts` - API配置
- `lib/api.ts` - API工具函数