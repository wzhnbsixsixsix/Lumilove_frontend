# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个Next.js 15 AI伴侣应用的前端项目，使用TypeScript和Tailwind CSS构建。项目名为"LumiLove"，提供虚拟AI伴侣的情感陪伴体验。

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: pnpm
- **UI Library**: Radix UI components via shadcn/ui
- **State Management**: React hooks + localStorage
- **Deployment**: AWS Amplify

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `components/ui/` - shadcn/ui components
- `lib/` - Utility functions and API clients
- `hooks/` - Custom React hooks
- `public/` - Static assets (character images, avatars)

### Key Files
- `app/layout.tsx` - Root layout with theme provider
- `lib/api.ts` - API client functions for backend communication
- `lib/config.ts` - API configuration and endpoints
- `next.config.js` - API proxy configuration for backend

### API Integration
- Backend API: `http://54.206.37.109:8080`
- RAG服务: `https://54.206.37.109:8001` (for streaming chat)
- API proxying configured in `next.config.js`
- Authentication via Bearer tokens stored in localStorage

### Core Features
- **Auth系统**: 登录/注册 (`/login`, `/register`)
- **角色创建**: 创建和选择AI伴侣 (`/create`, `/create-lover`)
- **聊天功能**: 实时流式对话 (`/chat/[id]`)
- **画廊功能**: 角色图片展示 (`/album`, `/sneaky`)
- **用户档案**: 个人资料管理 (`/profile`)
- **支付系统**: 高级功能付费 (`/payment`, `/premium`)

### State Management
- User data stored in localStorage
- Chat history managed via backend API
- Character stats tracked locally
- Theme managed via next-themes

### Styling System
- Dark theme as default (`bg-[#0e0314]`)
- CSS变量用于主题切换
- Responsive design with Tailwind breakpoints
- Custom animations via tailwindcss-animate

## Development Notes

### API Integration Pattern
```typescript
// Standard API call pattern with auth headers
const response = await fetch(`${API_BASE_URL}/endpoint`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'HTTP-Referer': 'https://main.d3m01u43jjmlec.amplifyapp.com/',
    'X-Title': 'Lumilove',
  },
});
```

### Streaming Chat Implementation
- Uses Server-Sent Events for real-time chat
- Implements abort controller for request cancellation
- Session management with user_id and character_id

### Component Conventions
- Use shadcn/ui components as base
- TypeScript interfaces for all props
- Responsive design patterns
- Consistent color scheme with CSS variables

### Deployment
- AWS Amplify with `amplify.yml` configuration
- Automatic builds on git push to main branch
- PNPM used for faster installs and builds

## Page Structure and Functionality

### Core Pages

#### Home Page (`/`)
- **主页面**: 角色发现和选择中心
- **功能**: 
  - 用户认证状态管理
  - 角色浏览（分男女两个分类）
  - 标签过滤系统（NSFW分类标签）
  - 最近聊天历史显示
  - 趋势角色排行榜
- **特点**: 复杂的标签映射系统，支持性别特定过滤

#### Authentication Pages
- **登录页** (`/login`): 渐变UI设计，包含密码显示切换和记住我功能
- **注册页** (`/register`): 用户账户创建流程

#### Chat System (`/chat/`)
- **聊天首页** (`/chat`): 自动重定向到最近聊天
- **具体聊天页** (`/chat/[id]`): 
  - 实时流式对话功能
  - 语音通话模拟
  - 图片生成请求（hardcoded responses）
  - 聊天历史管理（支持清除）
  - 角色资料侧边栏
  - 响应式设计（移动端适配）

#### Character Creation (`/create`)
- **AI图片生成页面**: 
  - 角色选择或图片上传
  - 场景、服装、姿势、角度选择系统
  - 随机生成功能
  - 图片数量选择（1/4/9，Premium功能）
  - 下载生成图片功能

#### Gallery Pages
- **专辑页** (`/album`): 角色图片展示
- **Sneaky页** (`/sneaky`): 
  - 付费图片包浏览
  - 高级过滤系统（Style, Intimacy, Tags）
  - 分页和排序功能
  - 预览轮播效果
  - Premium内容锁定

#### Payment & Premium (`/payment`, `/premium`)
- **支付页面**: 
  - 4档订阅计划（Free/Lite/Basic/Premium）
  - 订阅状态管理
  - 升级/降级逻辑处理
  - 支付流程模拟

#### User Management
- **用户资料** (`/profile`): 个人信息管理
- **资料编辑** (`/profile/edit`): 用户信息更新

#### Creator Pages
- **创建者页面** (`/creator/[creatorId]`): 角色创建者展示
- **创建伴侣** (`/create-lover`): 角色定制流程

#### Support Pages
- **帮助页** (`/help`): 用户支持
- **条款** (`/terms`): 服务条款
- **隐私政策** (`/privacy`): 隐私保护说明

### Technical Features

#### State Management
- LocalStorage用于用户数据和聊天历史
- React hooks进行状态管理
- 角色数据的动态合并（默认+用户创建）

#### UI/UX特色
- 深色主题为主（`bg-[#0e0314]`）
- 渐变动画效果
- 流式聊天的thinking状态显示
- 移动端响应式sidebar
- 图片悬停预览效果

#### API Integration Patterns
- 流式聊天实现（SSE）
- 认证token管理
- 错误处理和重试机制
- 文件上传处理

### Development Notes
- 使用shadcn/ui组件系统
- 严格的TypeScript类型定义
- 组件化设计模式
- 图片优化（Next.js Image组件）