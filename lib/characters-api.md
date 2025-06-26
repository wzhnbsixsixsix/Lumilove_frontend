# Characters API 接口文档 - 后端开发参考

## 概述

本文档定义了角色管理系统的 API 接口规范，供后端开发人员实现相应的数据库操作和 API 端点。所有角色数据将存储在数据库中，通过 RESTful API 提供服务。

## 数据模型

### Character 实体

角色数据库实体定义。

```typescript
interface Character {
  id: string;                  // 主键，角色唯一标识符
  name: string;                // 角色名称，非空
  age?: number;                // 年龄，可选字段
  occupation: string;          // 职业描述，非空
  tags: string[];              // 原始标签数组，JSON存储
  description: string;         // 角色详细描述，TEXT类型
  chatCount: string;           // 聊天次数统计（显示格式，如"1.4M"）
  likeCount: string;           // 喜欢数统计（显示格式，如"13.0K"）
  followers?: string;          // 关注者数量（显示格式）
  imageSrc: string;            // 主图片URL，非空
  avatarSrc: string;           // 头像图片URL，非空
  images?: string[];           // 额外图片URLs数组
  gender: 'male' | 'female';   // 性别枚举，非空
  creatorId: string;           // 创作者ID，外键
  rank?: number;               // 排名，用于trending排序
  isPopular?: boolean;         // 是否热门，默认false
  isNew?: boolean;             // 是否新角色，默认false
  isActive?: boolean;          // 是否启用，默认true
  createdAt: Date;             // 创建时间，自动生成
  updatedAt: Date;             // 更新时间，自动更新
}
```

### Creator 实体

创作者数据库实体定义。

```typescript
interface Creator {
  id: string;                  // 主键，创作者唯一标识符
  name: string;                // 创作者名称，非空
  email?: string;              // 邮箱，可选
  likeCount: string;           // 总喜欢数（显示格式）
  characterCount: number;      // 创建角色数量，默认0
  isVerified: boolean;         // 是否认证，默认false
  createdAt: Date;             // 创建时间
  updatedAt: Date;             // 更新时间
}
```

## API 端点

### 1. 获取角色列表

**接口路径:** `GET /api/characters`

**描述:** 获取角色列表，支持筛选、分页和排序

**请求参数 (Query Parameters):**

```typescript
interface GetCharactersQuery {
  gender?: 'male' | 'female' | 'all';     // 性别筛选，默认'all'
  tags?: string[];                        // 标签筛选，逗号分隔
  activeTag?: string;                     // 激活标签筛选
  page?: number;                          // 页码，从1开始，默认1
  pageSize?: number;                      // 每页数量，默认12，最大50
  sortBy?: 'popular' | 'newest' | 'chatCount' | 'rank';  // 排序方式，默认'popular'
  sortOrder?: 'asc' | 'desc';            // 排序方向，默认'desc'
  includeUserCreated?: boolean;           // 是否包含用户创建角色，默认true
  creatorId?: string;                     // 按创作者筛选
  isActive?: boolean;                     // 是否启用，默认true
}
```

**请求示例:**
```bash
GET /api/characters?gender=female&activeTag=👧%20FemalePOV&page=1&pageSize=12&sortBy=popular
```

**响应结果:**

```typescript
interface GetCharactersResponse {
  success: boolean;                       // 请求是否成功
  data: {
    characters: Character[];              // 角色列表
    pagination: {
      totalCount: number;                 // 总记录数
      totalPages: number;                 // 总页数
      currentPage: number;                // 当前页码
      pageSize: number;                   // 每页数量
      hasNext: boolean;                   // 是否有下一页
      hasPrev: boolean;                   // 是否有上一页
    };
    filters: {
      appliedFilters: Record<string, any>; // 应用的筛选条件
      availableTags: string[];            // 可用标签列表
    };
  };
  message?: string;                       // 错误消息
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "4",
        "name": "Rhonda",
        "age": 32,
        "occupation": "Entrepreneur",
        "tags": ["Elegant", "Mature", "Dominant"],
        "description": "A fierce and flirty entrepreneur, Rhonda sees you as her perfect partner in both business and pleasure. She's not afraid to take what she wants.",
        "chatCount": "22.2K",
        "likeCount": "5.2K",
        "followers": "1.8M",
        "imageSrc": "/female/female01.png",
        "avatarSrc": "/avatar/female_01_avatar.png",
        "images": ["/female/female01.png"],
        "gender": "female",
        "creatorId": "mei-chan",
        "rank": 1,
        "isPopular": true,
        "isNew": false,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-06-26T14:20:00Z"
      }
    ],
    "pagination": {
      "totalCount": 15,
      "totalPages": 2,
      "currentPage": 1,
      "pageSize": 12,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "appliedFilters": {
        "gender": "female",
        "activeTag": "👧 FemalePOV"
      },
      "availableTags": ["👧 FemalePOV", "🌑 Yandere", "🙇 Submissive"]
    }
  }
}
```

### 2. 获取单个角色详情

**接口路径:** `GET /api/characters/{id}`

**描述:** 根据 ID 获取角色详细信息

**路径参数:**

- `id` (string): 角色 ID

**请求示例:**
```bash
GET /api/characters/4
```

**响应结果:**

```typescript
interface GetCharacterResponse {
  success: boolean;
  data?: {
    character: Character & {
      creator: Creator;                   // 关联的创作者信息
      relatedCharacters: Character[];     // 相关角色推荐
      stats: {
        viewCount: number;                // 查看次数
        favoriteCount: number;            // 收藏次数
        shareCount: number;               // 分享次数
      };
    };
  };
  message?: string;
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "character": {
      "id": "4",
      "name": "Rhonda",
      "age": 32,
      "occupation": "Entrepreneur",
      "tags": ["Elegant", "Mature", "Dominant"],
      "description": "A fierce and flirty entrepreneur, Rhonda sees you as her perfect partner in both business and pleasure. She's not afraid to take what she wants.",
      "chatCount": "22.2K",
      "likeCount": "5.2K",
      "followers": "1.8M",
      "imageSrc": "/female/female01.png",
      "avatarSrc": "/avatar/female_01_avatar.png",
      "images": ["/female/female01.png"],
      "gender": "female",
      "creatorId": "mei-chan",
      "rank": 1,
      "creator": {
        "id": "mei-chan",
        "name": "Mei chan",
        "likeCount": "204",
        "characterCount": 8,
        "isVerified": true,
        "createdAt": "2023-12-01T00:00:00Z",
        "updatedAt": "2024-06-26T14:20:00Z"
      },
      "relatedCharacters": [
        {
          "id": "5",
          "name": "Makenzie",
          "occupation": "Student",
          "imageSrc": "/female/female_02.png",
          "gender": "female"
        }
      ],
      "stats": {
        "viewCount": 45230,
        "favoriteCount": 1205,
        "shareCount": 89
      }
    }
  }
}
```

### 3. 获取角色标签

**接口路径:** `GET /api/characters/tags`

**描述:** 获取所有可用的角色标签及映射关系

**请求参数:**

```typescript
interface GetTagsQuery {
  gender?: 'male' | 'female' | 'all';    // 按性别筛选标签
  popular?: boolean;                     // 是否只返回热门标签，默认false
}
```

**请求示例:**
```bash
GET /api/characters/tags?gender=female&popular=true
```

**响应结果:**

```typescript
interface GetTagsResponse {
  success: boolean;
  data?: {
    originalTags: string[];               // 原始标签列表
    tagMapping: {
      [gender: string]: {
        [originalTag: string]: string;    // 原始标签到显示标签的映射
      };
    };
    filterTags: {
      male: string[];                     // 男性角色过滤标签
      female: string[];                   // 女性角色过滤标签
    };
    tagStats: {
      [tag: string]: {
        count: number;                    // 使用该标签的角色数量
        gender: 'male' | 'female' | 'all';
      };
    };
  };
  message?: string;
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "originalTags": ["Girl-Next-Door", "Innocent", "Elegant", "Independent"],
    "tagMapping": {
      "male": {
        "Alpha": "🔥 Dominant",
        "Mature": "🔥 Dominant",
        "Gentle": "💪 Muscle"
      },
      "female": {
        "Girl-Next-Door": "👧 FemalePOV",
        "Innocent": "👧 FemalePOV",
        "Elegant": "🌑 Yandere"
      }
    },
    "filterTags": {
      "male": ["For You", "Popular", "🔥 Dominant", "👦 MalePOV", "💪 Muscle"],
      "female": ["For You", "Popular", "👧 FemalePOV", "🌑 Yandere", "🙇 Submissive"]
    },
    "tagStats": {
      "Girl-Next-Door": {
        "count": 3,
        "gender": "female"
      },
      "Alpha": {
        "count": 5,
        "gender": "male"
      }
    }
  }
}
```

### 4. 获取趋势角色

**接口路径:** `GET /api/characters/trending`

**描述:** 获取按排名排序的趋势角色

**请求参数:**

```typescript
interface GetTrendingQuery {
  gender?: 'male' | 'female' | 'all';    // 性别筛选，默认'all'
  limit?: number;                        // 返回数量限制，默认5，最大20
}
```

**请求示例:**
```bash
GET /api/characters/trending?gender=male&limit=5
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "1",
        "name": "Ethan",
        "occupation": "Swimmer",
        "imageSrc": "/male/male_01.png",
        "avatarSrc": "/avatar/alexander_avatar.png",
        "rank": 1,
        "chatCount": "1.4M",
        "likeCount": "13.0K"
      },
      {
        "id": "13",
        "name": "Dominic",
        "occupation": "Mafia Boss",
        "imageSrc": "/male/male_04.png",
        "avatarSrc": "/avatar/alexander_avatar.png",
        "rank": 2,
        "chatCount": "45.2K",
        "likeCount": "13.0K"
      }
    ]
  }
}
```

### 5. 获取用户创建的角色

**接口路径:** `GET /api/characters/user-created`

**描述:** 获取用户创建的角色列表

**请求头:**
```
Authorization: Bearer {token}
```

**请求参数:**

```typescript
interface GetUserCreatedQuery {
  page?: number;                         // 页码，默认1
  pageSize?: number;                     // 每页数量，默认12
  sortBy?: 'newest' | 'chatCount';      // 排序方式，默认'newest'
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "user_001",
        "name": "Custom Character",
        "occupation": "Artist",
        "tags": ["Creative", "Mysterious"],
        "description": "A custom character created by user.",
        "chatCount": "150",
        "likeCount": "25",
        "imageSrc": "/uploads/user_001/character.png",
        "avatarSrc": "/uploads/user_001/avatar.png",
        "gender": "female",
        "creatorId": "user_12345",
        "isActive": true,
        "createdAt": "2024-06-20T15:30:00Z"
      }
    ],
    "pagination": {
      "totalCount": 3,
      "totalPages": 1,
      "currentPage": 1,
      "pageSize": 12,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 6. 获取最近聊天角色

**接口路径:** `GET /api/characters/recent-chats`

**描述:** 获取用户最近聊天的角色列表

**请求头:**
```
Authorization: Bearer {token}
```

**请求参数:**

```typescript
interface GetRecentChatsQuery {
  limit?: number;                        // 返回数量限制，默认3，最大10
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "2",
        "name": "Alexander",
        "occupation": "Businessman",
        "imageSrc": "/male/male_02.png",
        "avatarSrc": "/avatar/alexander_avatar.png",
        "gender": "male",
        "lastChatAt": "2024-06-26T14:20:00Z"
      },
      {
        "id": "4",
        "name": "Rhonda",
        "occupation": "Entrepreneur",
        "imageSrc": "/female/female01.png",
        "avatarSrc": "/avatar/female_01_avatar.png",
        "gender": "female",
        "lastChatAt": "2024-06-25T18:45:00Z"
      }
    ]
  }
}
```

## 错误响应

所有API在发生错误时返回统一格式：

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;                        // 错误代码
    message: string;                     // 错误信息
    details?: any;                       // 错误详情（可选）
  };
}
```

**常见错误代码:**
- `CHARACTER_NOT_FOUND`: 角色不存在
- `INVALID_PARAMETERS`: 请求参数无效
- `UNAUTHORIZED`: 未授权访问
- `RATE_LIMIT_EXCEEDED`: 请求频率超限
- `INTERNAL_SERVER_ERROR`: 服务器内部错误

**错误响应示例:**
```json
{
  "success": false,
  "error": {
    "code": "CHARACTER_NOT_FOUND",
    "message": "Character with id '999' not found",
    "details": {
      "requestedId": "999"
    }
  }
}
```
