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
  chatCount: number;           // 聊天次数统计，整型
  likeCount: number;           // 喜欢数统计，整型
  followersCount?: number;     // 关注者数量，可选
  imageSrc: string;            // 主图片URL，非空
  avatarSrc: string;           // 头像图片URL，非空
  additionalImages: string[];  // 额外图片URLs，JSON数组存储
  gender: 'male' | 'female';   // 性别枚举，非空
  creatorId: string;           // 创作者ID，外键
  rank?: number;               // 排名，用于排序
  isPopular: boolean;          // 是否热门，默认false
  isNew: boolean;              // 是否新角色，默认false
  isActive: boolean;           // 是否启用，默认true
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
  totalLikes: number;          // 总喜欢数，默认0
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

### 2. 获取单个角色详情

**接口路径:** `GET /api/characters/{id}`

**描述:** 根据 ID 获取角色详细信息

**路径参数:**

- `id` (string): 角色 ID

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

### 3. 获取角色标签

**接口路径:** `GET /api/characters/tags`

**描述:** 获取所有可用的角色标签

**请求参数:**

```typescript
interface GetTagsQuery {
  gender?: 'male' | 'female' | 'all';    // 按性别筛选标签
  popular?: boolean;                     // 是否只返回热门标签，默认false
}
```

**响应结果:**

```typescript
interface GetTagsResponse {
  success: boolean;
  data?: {
    tags: {
      original: string;                   // 原始标签
      mapped: string;                     // 映射后的显示标签
      count: number;                      // 使用该标签的角色数量
      gender: 'male' | 'female' | 'all'; // 适用性别
    }[];
    categories: {
      [category: string]: string[];       // 标签分类
    };
  };
  message?: string;
}
```
