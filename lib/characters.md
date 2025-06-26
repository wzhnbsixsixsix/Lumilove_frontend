# Characters API 文档

## 概述

`lib/characters.ts` 提供了统一的角色数据管理系统，包括角色信息、标签映射、筛选分页等功能。

## 核心接口

### Character 接口

角色数据的核心类型定义。

```typescript
interface Character {
  id: string | number;          // 角色ID，兼容不同组件需求
  name: string;                 // 角色名称
  age?: number;                 // 年龄（可选）
  occupation: string;           // 职业
  tags: string[];              // 原始标签数组
  mappedTags?: string[];       // 映射后的标签数组
  description: string;         // 角色描述
  chatCount: string;           // 聊天次数显示文本
  likeCount: string;           // 喜欢数显示文本
  followers?: string;          // 关注者数量
  imageSrc: string;            // 主要图片路径
  avatarSrc: string;           // 头像图片路径
  images?: string[];           // 图片数组（兼容chat页面）
  gender: 'male' | 'female';   // 性别
  creator: {                   // 创作者信息
    id: string;
    name: string;
    likeCount: string;
  };
  rank?: number;               // 排名（用于trending排序）
  isPopular?: boolean;         // 是否热门
  isNew?: boolean;             // 是否新角色
}
```

### CharacterFilterOptions 接口

角色筛选和分页选项。

```typescript
interface CharacterFilterOptions {
  gender?: 'male' | 'female' | 'all';  // 性别筛选
  tags?: string[];                     // 标签筛选
  activeTag?: string;                  // 当前激活标签
  page?: number;                       // 页码
  pageSize?: number;                   // 每页数量
  sortBy?: 'popular' | 'newest' | 'chatCount' | 'rank';  // 排序方式
  includeUserCreated?: boolean;        // 是否包含用户创建角色
}
```

### CharacterListResponse 接口

角色列表响应结果。

```typescript
interface CharacterListResponse {
  characters: Character[];      // 角色列表
  totalCount: number;          // 总数量
  totalPages: number;          // 总页数
  currentPage: number;         // 当前页码
  hasNext: boolean;            // 是否有下一页
  hasPrev: boolean;            // 是否有上一页
}
```

## 核心函数

### getCharacters(options?)

获取角色列表，支持筛选、分页和排序。

```typescript
function getCharacters(options: CharacterFilterOptions = {}): CharacterListResponse
```

**参数：**
- `options` (可选): 筛选选项对象

**返回值：**
- `CharacterListResponse`: 包含角色列表和分页信息

**示例：**
```typescript
// 获取所有男性角色，按热度排序
const result = getCharacters({
  gender: 'male',
  sortBy: 'popular',
  page: 1,
  pageSize: 12
});

// 按标签筛选
const muscleCharacters = getCharacters({
  activeTag: '💪 Muscle',
  gender: 'male'
});
```

### getCharacterById(id)

根据ID获取单个角色信息。

```typescript
function getCharacterById(id: string): Character | undefined
```

**参数：**
- `id`: 角色ID

**返回值：**
- `Character | undefined`: 角色对象或undefined

**示例：**
```typescript
const character = getCharacterById("1");
if (character) {
  console.log(character.name); // "Ethan"
}
```

### getTrendingCharacters(gender?, limit?)

获取趋势角色列表。

```typescript
function getTrendingCharacters(
  gender: 'male' | 'female' = 'male', 
  limit: number = 5
): Character[]
```

**参数：**
- `gender` (可选): 性别筛选，默认'male'
- `limit` (可选): 返回数量限制，默认5

**返回值：**
- `Character[]`: 趋势角色数组

### getRecentChatCharacters(limit?)

获取最近聊天的角色列表。

```typescript
function getRecentChatCharacters(limit: number = 3): Character[]
```

**参数：**
- `limit` (可选): 返回数量限制，默认3

**返回值：**
- `Character[]`: 最近聊天角色数组

### getUserCreatedCharacters()

获取用户创建的角色。

```typescript
function getUserCreatedCharacters(): Record<string, Character>
```

**返回值：**
- `Record<string, Character>`: 用户创建的角色对象

## 辅助函数

### getCharacterAvatar(id)

获取角色头像路径。

```typescript
function getCharacterAvatar(id: string): string
```

### getCharacterName(id)

获取角色名称。

```typescript
function getCharacterName(id: string): string
```

### getFilterTags(gender)

获取指定性别的过滤标签。

```typescript
function getFilterTags(gender: 'male' | 'female'): string[]
```

### mapTags(tags, gender)

将原始标签映射为显示标签。

```typescript
function mapTags(tags: string[], gender: 'male' | 'female'): string[]
```

## 标签系统

### 男性角色标签映射

```typescript
const maleTagMap: Record<string, string> = {
  "Alpha": "🔥 Dominant",
  "Mature": "🔥 Dominant", 
  "Gentle": "💪 Muscle",
  "Playful": "👦 MalePOV",
  // ... 更多映射
}
```

### 女性角色标签映射

```typescript
const femaleTagMap: Record<string, string> = {
  "Girl-Next-Door": "👧 FemalePOV",
  "Innocent": "👧 FemalePOV",
  "Elegant": "🌑 Yandere",
  // ... 更多映射
}
```

### 过滤标签

```typescript
const maleFilterTags = [
  "For You", "Popular", "🔥 Dominant", "👦 MalePOV", 
  "💪 Muscle", "🩸 Sadistic", "👶 CNC", "🧬 Breeding",
  // ... 更多标签
];

const femaleFilterTags = [
  "For You", "Popular", "👧 FemalePOV", "🌑 Yandere",
  "🙇 Submissive", "👩‍⚕️ Nurse", "🎒 Schoolgirl",
  // ... 更多标签
];
```

## 数据存储

### 默认角色数据

系统内置18个预定义角色，存储在 `charactersData` 对象中：

- **角色1-3**: 男性角色（Ethan, Alexander, Jake）
- **角色4-12**: 女性角色（Rhonda, Makenzie, Anshu等）
- **角色13-18**: 更多男性角色（Dominic, Marcus, Ryan等）

### 用户创建角色

用户创建的角色存储在 `localStorage` 中的 `chatCharacters` 键下。

## 使用示例

### 基础使用

```typescript
import { 
  getCharacters, 
  getCharacterById, 
  getTrendingCharacters 
} from '@/lib/characters';

// 获取首页角色列表
const homePageCharacters = getCharacters({
  gender: 'all',
  activeTag: 'For You',
  page: 1,
  pageSize: 12
});

// 获取特定角色
const ethan = getCharacterById("1");

// 获取男性趋势角色
const trendingMales = getTrendingCharacters('male', 5);
```

### 高级筛选

```typescript
// 按标签和性别筛选
const dominantMales = getCharacters({
  gender: 'male',
  activeTag: '🔥 Dominant',
  sortBy: 'popular'
});

// 分页浏览女性角色
const femalePage2 = getCharacters({
  gender: 'female',
  page: 2,
  pageSize: 8,
  sortBy: 'chatCount'
});
```

### 在组件中使用

```tsx
import React, { useMemo } from 'react';
import { getCharacters } from '@/lib/characters';

function CharacterGrid({ gender, activeTag }) {
  const { characters, totalPages, hasNext } = useMemo(() => 
    getCharacters({ gender, activeTag, pageSize: 12 }), 
    [gender, activeTag]
  );

  return (
    <div className="character-grid">
      {characters.map(character => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
```

## 注意事项

1. **类型兼容性**: `Character.id` 支持 `string | number` 以兼容不同组件需求
2. **图片路径**: 所有图片路径都是相对于 `public/` 目录的绝对路径
3. **本地存储**: 用户创建角色依赖 `localStorage`，在服务端渲染时需要注意
4. **标签映射**: 原始标签会根据性别自动映射为显示标签
5. **分页**: 默认每页12个角色，支持自定义页面大小

## 扩展性

系统设计支持：
- 添加新的角色属性
- 扩展标签映射系统  
- 增加新的排序方式
- 支持更多筛选条件
- 集成外部API数据源