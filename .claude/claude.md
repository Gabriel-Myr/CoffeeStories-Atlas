# Coffee Atlas - 咖啡故事地图

全球咖啡豆探索应用，帮助用户发现和记录世界各地的咖啡风味。

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **后端/数据库**: Supabase (PostgreSQL)
- **ORM**: Prisma 7
- **AI 服务**: Google Gemini (用于生成咖啡豆描述)
- **动画**: Framer Motion
- **图标**: Lucide React
- **样式**: 原生 CSS + CSS 变量

## 项目结构

```
/Users/gabi/CoffeeStories-Atlas
├── components/          # React 组件
│   ├── BottomNav.tsx       # 底部导航栏
│   ├── HotContentSection.tsx  # 热门内容区域
│   └── Layout.tsx          # 布局组件
├── contexts/           # React Context
│   └── UserContext.tsx     # 用户上下文
├── documents/          # 项目文档
├── prisma/             # Prisma Schema
│   └── schema.prisma      # 数据库模型定义
├── public/logos/       # 烘焙商 Logo 图片
├── services/           # 业务服务
│   ├── coffeeBeanService.ts   # 咖啡豆相关服务
│   ├── geminiService.ts       # Gemini AI 服务
│   └── tastingNoteService.ts  # 品鉴笔记服务
├── views/              # 页面视图
│   ├── AddBean.tsx        # 添加咖啡豆页面
│   ├── Home.tsx           # 首页（地图）
│   ├── Profile.tsx        # 个人资料页
│   ├── RoasterList.tsx    # 烘焙商列表
│   └── TastingNotes.tsx   # 品鉴笔记页
├── App.tsx             # 应用入口
├── constants.tsx       # 常量定义
├── supabaseClient.ts   # Supabase 客户端配置
├── types.ts            # TypeScript 类型定义
└── vite.config.ts      # Vite 配置
```

## 关键文件说明

### 数据模型 (types.ts)

- `CoffeeBean`: 咖啡豆实体，包含名称、产地、烘焙度、处理方式、评分、图片等
- `ActivityRecord`: 用户活动记录（评分、签到、心愿单）
- `SocialPost`: 社交帖子
- `AppTab`: 应用标签页枚举 (HOME, PROFILE)

### 服务层

- `coffeeBeanService.ts`: 咖啡豆的 CRUD 操作
- `geminiService.ts`: 调用 Google Gemini API 生成咖啡豆描述
- `tastingNoteService.ts`: 品鉴笔记相关服务
- `supabaseClient.ts`: Supabase 客户端初始化

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

## 环境变量

项目根目录下的 `.env` 文件包含必要的环境变量，包括 Supabase URL 和 API 密钥。

## 开发规范

### 组件规范

- 使用函数式组件 + Hooks
- 组件文件使用 PascalCase 命名（如 `BottomNav.tsx`）
- 优先使用 TypeScript 类型定义，避免使用 `any`

### 样式规范

- 使用 CSS 变量管理主题色
- 组件样式使用 CSS Modules 或内联样式

### 状态管理

- 使用 React Context 进行全局状态管理（如 UserContext）
- 组件内部状态使用 useState

### API 调用

- 通过 service 层封装业务逻辑
- 优先使用 Supabase JavaScript 客户端

## 数据库

使用 Prisma ORM 连接 Supabase (PostgreSQL)。数据库配置见 `prisma/schema.prisma`。

## 常用操作

### 添加新的咖啡豆数据

1. 在 `services/coffeeBeanService.ts` 中添加创建方法
2. 在 `views/AddBean.tsx` 页面中调用

### 修改数据库模型

1. 编辑 `prisma/schema.prisma`
2. 运行 `npx prisma generate` 生成客户端
3. 运行 `npx prisma db push` 同步数据库

### 添加新页面

1. 在 `views/` 目录下创建新的视图组件
2. 在 `App.tsx` 中添加路由
3. 在 `components/BottomNav.tsx` 中添加导航项（如果需要）
