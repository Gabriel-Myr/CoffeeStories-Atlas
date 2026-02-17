# 烘焙商二级页面实现计划

## 概述
为 Coffee Atlas 应用增加烘焙商详情二级页面，用户点击首页"烘焙商"按钮或 HotContentSection 中的烘焙商列表项后可进入查看详细信息和相关咖啡豆。

## 当前架构分析

### 现有文件结构
- `App.tsx` - 主应用组件，使用 NavigationContext 管理页面导航
- `types.ts` - 类型定义（AppTab, CoffeeBean, ActivityRecord 等）
- `views/Home.tsx` - 首页，包含"烘焙商"入口按钮
- `components/HotContentSection.tsx` - 热门内容三栏组件，包含烘焙商列表

### 导航机制
- 使用自定义 NavigationContext 进行页面切换
- 当前支持：HOME, PROFILE 两个主标签
- 通过 `navigateTo(tab)` 和 `goToAddBean()` 进行导航

## 实现方案

### 1. 扩展类型定义 (types.ts)
新增：
- `Roaster` 接口 - 烘焙商数据结构
- `AppView` 类型扩展 - 添加烘焙商详情页面标识

```typescript
export interface Roaster {
  id: string;
  name: string;
  logo?: string;
  location: string;
  description: string;
  foundedYear?: number;
  beanCount: number;
  avgRating: number;
  specialty: string;
  contact?: {
    website?: string;
    phone?: string;
    address?: string;
  };
}
```

### 2. 新增烘焙商详情页面 (views/RoasterDetail.tsx)
页面结构：
- **头部区域**
  - 返回按钮
  - 烘焙商 Logo/首字母
  - 烘焙商名称
  - 位置和评分信息

- **信息卡片**
  - 简介描述
  - 成立年份（如有）
  - 特色专长标签
  - 联系方式

- **咖啡豆列表**
  - 该烘焙商的所有咖啡豆
  - 卡片式展示（图片、名称、产地、价格、评分）

- **底部操作栏**
  - 收藏/关注按钮
  - 分享按钮

### 3. 更新导航系统 (App.tsx)
修改内容：
- NavigationContext 新增 `viewStack` 或 `currentView` 状态
- 新增 `navigateToRoaster(roasterId: string)` 方法
- 新增 `goBack()` 返回方法
- renderContent() 中增加烘焙商详情页渲染逻辑

### 4. 更新首页入口 (views/Home.tsx)
修改内容：
- "烘焙商"按钮添加点击事件
- 点击后跳转到烘焙商列表页或详情页

### 5. 更新 HotContentSection (components/HotContentSection.tsx)
修改内容：
- 烘焙商列表项添加点击事件
- 点击后导航到对应烘焙商详情页

### 6. 新增模拟数据 (constants.tsx)
添加烘焙商模拟数据：
- Grid Coffee
- Metal Hands
- M Stand
- % Arabica
- 以及对应的咖啡豆关联数据

## UI 设计规范

### 颜色系统（沿用项目现有）
- 主色: #7B3F00 (咖啡棕)
- 次色: #3d2b1f (深棕)
- 背景: #FDF8F3 (暖白)
- 边框: #E8DCCF
- 强调: #F59E0B (评分星级)

### 页面布局
- 全屏页面，带返回导航栏
- 头部：大卡片展示烘焙商信息
- 中部：简介和特色
- 下部：咖啡豆列表（可滚动）
- 底部：固定操作栏

### 交互设计
- 点击返回按钮返回上一页
- 咖啡豆卡片点击进入咖啡豆详情（预留）
- 收藏按钮可切换状态
- 下拉可刷新咖啡豆列表

## 文件变更清单

### 修改文件
1. `/types.ts` - 添加 Roaster 接口和视图类型
2. `/App.tsx` - 扩展导航上下文，添加烘焙商页面路由
3. `/views/Home.tsx` - 烘焙商按钮添加导航
4. `/components/HotContentSection.tsx` - 烘焙商列表项添加点击导航
5. `/constants.tsx` - 添加烘焙商模拟数据

### 新增文件
1. `/views/RoasterDetail.tsx` - 烘焙商详情页面组件

## 验收标准

1. ✅ 点击首页"烘焙商"按钮可进入烘焙商相关页面
2. ✅ 点击 HotContentSection 中的烘焙商可进入详情页
3. ✅ 详情页展示烘焙商完整信息（名称、位置、评分、简介等）
4. ✅ 详情页展示该烘焙商的咖啡豆列表
5. ✅ 可以从详情页返回上一页
6. ✅ UI 风格与项目整体保持一致
7. ✅ 移动端响应式适配良好
