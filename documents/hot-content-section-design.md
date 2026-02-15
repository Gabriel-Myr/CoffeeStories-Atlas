# Coffee Atlas - 三栏可选热门推荐组件设计

## 概述

设计一个可切换的三栏布局组件，显示：
1. 热门烘焙商 (Hot Roasters)
2. 社区评分 (Community Ratings)  
3. 本周热门推荐 (Weekly Top Picks)

每栏底部有"查看更多"链接。

---

## 数据结构

### CoffeeBean (咖啡豆)
```json
{
  "id": "string",
  "name": "string",
  "origin": "string",
  "roastLevel": "Light" | "Medium" | "Dark",
  "process": "string",
  "rating": 4.8,
  "image": "string",
  "description": "string"
}
```

### Roaster (烘焙商)
```json
{
  "id": "string",
  "name": "string",
  "logo": "string",
  "location": "string",
  "beanCount": 42,
  "avgRating": 4.6,
  "specialty": "single-origin"
}
```

### CommunityRating (社区评分)
```json
{
  "id": "string",
  "beanId": "string",
  "beanName": "string",
  "userCount": 128,
  "avgScore": 4.5,
  "tags": ["果香", "醇厚", "回甘"]
}
```

---

## UI 设计规范

### 布局结构
- 三栏并排显示 (grid grid-cols-3)
- 每栏可点击切换选中状态
- 选中栏高亮显示 (#7B3F00 主题色)
- 每栏内容可滚动

### 颜色系统
- 主色: #7B3F00 (咖啡棕)
- 次色: #3d2b1f (深棕)
- 背景: #FDF8F3 (暖白)
- 边框: #E8DCCF
- 强调: #F59E0B (评分星级)

### 组件交互
- 点击标签切换内容
- "查看更多"按钮在每栏底部
- 平滑过渡动画 (300ms)

---

## React 组件示例

```tsx
import React, { useState } from 'react';

type TabType = 'roasters' | 'ratings' | 'weekly';

interface TabData {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: TabData[] = [
  { id: 'roasters', label: '热门烘焙商', icon: '🔥' },
  { id: 'ratings', label: '社区评分', icon: '⭐' },
  { id: 'weekly', label: '本周热门', icon: '🏆' }
];

const HotContentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('roasters');

  return (
    <section className="mb-8">
      {/* 三栏切换标签 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-[#7B3F00] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8DCCF] min-h-[300px]">
        {activeTab === 'roasters' && <RoastersContent />}
        {activeTab === 'ratings' && <RatingsContent />}
        {activeTab === 'weekly' && <WeeklyContent />}
        
        {/* 查看更多 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-[#7B3F00] font-semibold text-sm hover:text-[#5a2f00] transition-colors">
            查看更多 →
          </button>
        </div>
      </div>
    </section>
  );
};

// 热门烘焙商内容
const RoastersContent: React.FC = () => (
  <div className="space-y-4">
    {[
      { name: 'Grid Coffee', location: '北京', rating: 4.8, beans: 23 },
      { name: 'Metal Hands', location: '上海', rating: 4.7, beans: 18 },
      { name: 'M Stand', location: '全国', rating: 4.6, beans: 31 }
    ].map((roaster, i) => (
      <div key={i} className="flex items-center p-3 rounded-2xl bg-[#FDF8F3]">
        <div className="w-12 h-12 rounded-full bg-[#7B3F00]/10 flex items-center justify-center text-[#7B3F00] font-bold">
          {roaster.name[0]}
        </div>
        <div className="ml-3 flex-1">
          <p className="font-semibold text-[#3d2b1f]">{roaster.name}</p>
          <p className="text-xs text-gray-500">{roaster.location} · {roaster.beans}款豆子</p>
        </div>
        <span className="text-[#F59E0B] font-bold">{roaster.rating}</span>
      </div>
    ))}
  </div>
);

// 社区评分内容
const RatingsContent: React.FC = () => (
  <div className="space-y-4">
    {[
      { name: '埃塞俄比亚耶加雪菲', score: 4.8, votes: 256, tags: ['柑橘', '茉莉花'] },
      { name: '哥伦比亚瑰夏', score: 4.7, votes: 189, tags: ['佛手柑', '红茶'] },
      { name: '巴西皇后庄园', score: 4.5, votes: 342, tags: ['巧克力', '坚果'] }
    ].map((item, i) => (
      <div key={i} className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex justify-between items-start mb-2">
          <p className="font-semibold text-[#3d2b1f]">{item.name}</p>
          <div className="flex items-center">
            <span className="text-[#F59E0B] mr-1">★</span>
            <span className="font-bold text-[#3d2b1f]">{item.score}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {item.tags.map((tag, j) => (
            <span key={j} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">{item.votes}人评分</p>
      </div>
    ))}
  </div>
);

// 本周热门内容
const WeeklyContent: React.FC = () => (
  <div className="space-y-4">
    {[
      { name: '巴拿马翡翠庄园红标', origin: 'Panama', rating: 4.9, price: '¥168' },
      { name: '肯尼亚AA TOP', origin: 'Kenya', rating: 4.7, price: '¥128' },
      { name: '危地马拉安提瓜', origin: 'Guatemala', rating: 4.6, price: '¥98' }
    ].map((bean, i) => (
      <div key={i} className="flex items-center p-3 rounded-2xl border border-[#E8DCCF]">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 overflow-hidden">
          <img src={`https://picsum.photos/seed/bean${i}/200/200`} alt={bean.name} className="w-full h-full object-cover" />
        </div>
        <div className="ml-3 flex-1">
          <p className="font-semibold text-[#3d2b1f]">{bean.name}</p>
          <p className="text-xs text-gray-500">{bean.origin}</p>
          <p className="text-[#7B3F00] font-bold text-sm mt-1">{bean.price}</p>
        </div>
        <div className="text-right">
          <span className="text-[#F59E0B]">★</span>
          <span className="font-bold text-[#3d2b1f]">{bean.rating}</span>
        </div>
      </div>
    ))}
  </div>
);

export default HotContentSection;
```

---

## Google AI Studio 提示词模板

### 系统提示词
```
你是一个专业的咖啡应用程序UI设计师。用户需要为"Coffee Atlas"咖啡发现应用创建一个三栏切换的热门推荐组件。

设计要求：
1. 三个可切换的标签：热门烘焙商、社区评分、本周热门推荐
2. 遵循咖啡主题的暖色调设计（主色#7B3F00）
3. 移动端优先的响应式设计
4. 每栏底部需要"查看更多"按钮
5. 使用Tailwind CSS进行样式设计

请根据用户需求生成相应的React组件代码。
```

### 用户提示词示例
```
帮我设计一个三栏可选的热门推荐组件，包含：
- 热门烘焙商：显示烘焙商名称、位置、评分、咖啡豆数量
- 社区评分：显示咖啡豆名称、评分、投票数、风味标签
- 本周热门：显示咖啡豆名称、产地、评分、价格

每栏底部要有"查看更多"按钮，使用咖啡主题的暖色调设计。
```

---

## 验收标准

1. ✅ 三栏标签可正常切换
2. ✅ 每栏显示对应的内容
3. ✅ 每栏底部有"查看更多"按钮
4. ✅ 颜色符合项目主题 (#7B3F00)
5. ✅ 响应式布局适配移动端
6. ✅ 过渡动画流畅
