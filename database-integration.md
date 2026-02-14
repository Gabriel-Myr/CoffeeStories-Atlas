# 咖啡豆数据接入 PostgreSQL + Prisma 方案

## 整体架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   前端      │ ──▶ │  API 接口   │ ──▶ │  PostgreSQL │
│  (React)   │     │  (Vite)     │     │  (Prisma)   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    (Supabase / Neon)
```

---

## 0. 数据库选择（个人用户推荐）

### 推荐：Supabase（免费）

- ✅ **500MB 免费存储**
- ✅ 纯 PostgreSQL，完全兼容 Prisma
- ✅ 提供 RESTful API、实时订阅
- ✅ 国内访问速度快（日本节点）

### 备选：Neon（免费）

- ✅ 512MB 免费
- ✅ Serverless PostgreSQL
- ✅ 自动暂停/恢复

### 自建方案

- 火山引擎 PostgreSQL（需企业认证）
- Railway / ElephanSQL（付费/免费额度小）

---

## 1. Supabase 配置步骤

### 1.1 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 注册账号
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `coffee-atlas`
   - Database Password: 设置密码（记住它）
   - Region: 选择 `Northeast Asia (Tokyo)`（日本节点，国内快）
4. 等待创建完成（约2分钟）

### 1.2 获取连接信息

1. 进入 Project → Settings → Database
2. 找到 **Connection string** 部分
3. 复制 URI（或者直接使用下方格式）

### 1.3 环境变量配置

```bash
# .env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# 替换为你的实际值：
# [YOUR-PASSWORD] = 你设置的数据库密码
# [YOUR-PROJECT] = 你的项目名（如 abc123）
```

示例：
```bash
DATABASE_URL="postgresql://postgres:MyPassword123@db.xyzabc.supabase.co:5432/postgres"
```

---

## 2. 技术栈

- **数据库**: PostgreSQL (Supabase/Neon)
- **ORM**: Prisma
- **后端**: Vite + React (或独立的 Express 服务)
- **认证**: 简单实现（可后续添加）

---

## 3. Prisma Schema 设计

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 咖啡豆表
model CoffeeBean {
  id          String   @id @default(cuid())
  name        String   // 豆子名称
  roaster     String   // 烘焙商
  origin      String   // 产地
  region      String?  // 产区
  lot         String?  // 地块/庄园
  variety     String?  // 豆种
  process     String?  // 处理法
  harvestYear Int?     // 采收年份
  pricePerGram Float?  // 价格(每克)
  purchasePlatform String? // 购买平台
  imageUrl    String?  // 豆子照片
  userId      String?  // 提交用户ID (可选)
  status      BeanStatus @default(PENDING) // 审核状态
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 索引
  @@index([status])
  @@index([origin])
  @@index([name])
}

// 审核状态枚举
enum BeanStatus {
  PENDING   // 待审核
  APPROVED  // 已通过
  REJECTED  // 已拒绝
}

// 用户表 (可选)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  beans     CoffeeBean[]
  createdAt DateTime @default(now())
}

enum UserRole {
  USER    // 普通用户
  ADMIN   // 管理员
}
```

---

## 4. 环境配置

### Supabase（推荐）

```bash
# .env - 使用连接池模式
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:6543/postgres?connection_pooler=true"

# 替换说明：
# [YOUR-PASSWORD] = 你设置的数据库密码
# [YOUR-PROJECT] = 你的项目名（如 xyzabc）
# 端口用 6543（连接池）
```

### Neon

```bash
# .env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/coffee_atlas?sslmode=require"
```

### 本地开发（SQLite）

```bash
# .env
DATABASE_URL="file:./dev.db"
```

---

## 5. Prisma 客户端设置

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 6. API 接口设计

### 6.1 提交咖啡豆 (用户)

```typescript
// api/beans/create.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBeanSchema = z.object({
  name: z.string().min(1, '豆子名称不能为空'),
  roaster: z.string().min(1, '烘焙商不能为空'),
  origin: z.string().min(1, '产地不能为空'),
  region: z.string().optional(),
  lot: z.string().optional(),
  variety: z.string().optional(),
  process: z.string().optional(),
  harvestYear: z.number().optional(),
  pricePerGram: z.number().optional(),
  purchasePlatform: z.string().optional(),
  imageUrl: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createBeanSchema.parse(body)

    const bean = await prisma.coffeeBean.create({
      data: {
        ...data,
        status: 'PENDING', // 默认待审核
      },
    })

    return NextResponse.json(bean, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '验证失败', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
```

### 6.2 获取咖啡豆列表 (公开)

```typescript
// api/beans/list.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'APPROVED'
  const origin = searchParams.get('origin')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: any = {
    status: status as any,
  }
  if (origin) where.origin = { contains: origin, mode: 'insensitive' }

  const [beans, total] = await Promise.all([
    prisma.coffeeBean.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.coffeeBean.count({ where }),
  ])

  return NextResponse.json({
    data: beans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
```

### 6.3 审核咖啡豆 (管理员)

```typescript
// api/beans/[id]/review.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNote: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = reviewSchema.parse(body)

    const bean = await prisma.coffeeBean.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(bean)
  } catch (error) {
    return NextResponse.json(
      { error: '审核失败' },
      { status: 500 }
    )
  }
}
```

### 6.4 获取待审核列表 (管理员)

```typescript
// api/admin/pending-beans.ts
export async function GET() {
  const pendingBeans = await prisma.coffeeBean.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(pendingBeans)
}
```

---

## 7. 前端对接

### 7.1 提交表单 Service

```typescript
// services/beanService.ts

interface CreateBeanData {
  name: string
  roaster: string
  origin: string
  region?: string
  lot?: string
  variety?: string
  process?: string
  harvestYear?: number
  pricePerGram?: number
  purchasePlatform?: string
  imageUrl?: string
}

export const submitBean = async (data: CreateBeanData) => {
  const response = await fetch('/api/beans/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '提交失败')
  }

  return response.json()
}

export const getBeanList = async (params?: {
  status?: string
  origin?: string
  page?: number
  limit?: number
}) => {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set('status', params.status)
  if (params?.origin) searchParams.set('origin', params.origin)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))

  const response = await fetch(`/api/beans/list?${searchParams}`)
  return response.json()
}

export const reviewBean = async (id: string, status: 'APPROVED' | 'REJECTED') => {
  const response = await fetch(`/api/beans/${id}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  return response.json()
}
```

### 7.2 表单组件使用示例

```typescript
// components/AddBeanForm.tsx
import { useState } from 'react'
import { submitBean } from '@/services/beanService'

export function AddBeanForm() {
  const [formData, setFormData] = useState({
    name: '',
    roaster: '',
    origin: '',
    region: '',
    lot: '',
    variety: '',
    process: '',
    harvestYear: '',
    pricePerGram: '',
    purchasePlatform: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await submitBean({
        ...formData,
        harvestYear: formData.harvestYear ? Number(formData.harvestYear) : undefined,
        pricePerGram: formData.pricePerGram ? Number(formData.pricePerGram) : undefined,
      })
      setMessage('提交成功！等待审核后展示。')
      // 清空表单
      setFormData({ name: '', roaster: '', origin: '', region: '', lot: '', variety: '', process: '', harvestYear: '', pricePerGram: '', purchasePlatform: '' })
    } catch (error) {
      setMessage('提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 输入框字段... */}
      <button type="submit" disabled={loading}>
        {loading ? '提交中...' : '提交'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
```

---

## 8. 管理员审核后台

### 8.1 待审核列表页面

```typescript
// app/admin/pending/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { getBeanList, reviewBean } from '@/services/beanService'

export default function AdminPendingPage() {
  const [beans, setBeans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBeanList({ status: 'PENDING' })
      .then(res => setBeans(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await reviewBean(id, status)
    setBeans(beans.filter(b => b.id !== id))
  }

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <h1>待审核 ({beans.length})</h1>
      {beans.map(bean => (
        <div key={bean.id} className="bean-card">
          <h3>{bean.name}</h3>
          <p>烘焙商: {bean.roaster}</p>
          <p>产地: {bean.origin}</p>
          <button onClick={() => handleReview(bean.id, 'APPROVED')}>通过</button>
          <button onClick={() => handleReview(bean.id, 'REJECTED')}>拒绝</button>
        </div>
      ))}
    </div>
  )
}
```

---

## 9. 数据库初始化命令

```bash
# 1. 安装 Prisma
npm install prisma @prisma/client

# 2. 初始化 Prisma
npx prisma init

# 3. 创建 Schema (复制上面的 schema.prisma 内容)

# 4. 执行数据库迁移
npx prisma migrate dev --name init

# 5. 生成 Prisma 客户端
npx prisma generate
```

---

## 10. 流程总结

```
用户提交豆子
    │
    ▼
┌─────────────────┐
│  status:        │
│  PENDING        │
└─────────────────┘
    │
    ▼
管理员审核
    │
    ├─ 通过 ──► status: APPROVED ──► 公开显示
    │
    └─ 拒绝 ──► status: REJECTED
```

---

## 11. 验收标准

1. ✅ 用户提交豆子后 status 为 PENDING
2. ✅ 只有 status=APPROVED 的豆子会在前台显示
3. ✅ 管理员可以查看待审核列表
4. ✅ 管理员可以审核通过或拒绝
5. ✅ 审核后前台实时更新
