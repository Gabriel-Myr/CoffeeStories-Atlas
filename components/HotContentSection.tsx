import React, { useState } from 'react';

type TabType = 'roasters' | 'ratings' | 'weekly';

interface TabData {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: TabData[] = [
  { id: 'roasters', label: '烘焙商', icon: '🔥' },
  { id: 'ratings', label: '社区评分', icon: '⭐' },
  { id: 'weekly', label: '本周热门豆', icon: '🏆' }
];

interface HotContentSectionProps {
  activeTab?: TabType;
}

const HotContentSection: React.FC<HotContentSectionProps> = ({ activeTab }) => {
  const [internalTab, setInternalTab] = useState<TabType>('roasters');
  const currentTab = activeTab ?? internalTab;
  const showTabs = activeTab === undefined;

  return (
    <section className="mb-8">
      {showTabs && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setInternalTab(tab.id)}
              className={`py-3 px-3 rounded-2xl font-semibold text-xs transition-all duration-300 relative overflow-hidden ${
                currentTab === tab.id
                  ? 'bg-gradient-to-br from-[#7B3F00] to-[#5a2f00] text-white shadow-lg shadow-[#7B3F00]/30'
                  : 'bg-[#FDF8F3] text-[#7B3F00]/70 hover:bg-[#E8DCCF]'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="bg-[#d6c4b0] rounded-3xl p-5 shadow-[0_6px_20px_rgba(84,50,49,0.14)] border border-[#c0bea5] min-h-[320px]">
        <div className="transition-all duration-300">
          {currentTab === 'roasters' && <RoastersContent />}
          {currentTab === 'ratings' && <RatingsContent />}
          {currentTab === 'weekly' && <WeeklyContent />}
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#c0bea5]">
          <button className="w-full flex items-center justify-center gap-2 text-[#543231] font-semibold text-sm hover:text-[#44312b] transition-colors group">
            <span>查看更多</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

const RoastersContent: React.FC = () => (
  <div className="space-y-3">
    {[
      { name: 'Grid Coffee', location: '北京', rating: 4.8, beans: 23, specialty: '手冲精品' },
      { name: 'Metal Hands', location: '上海', rating: 4.7, beans: 18, specialty: '意式经典' },
      { name: 'M Stand', location: '全国', rating: 4.6, beans: 31, specialty: '创意特调' },
      { name: '% Arabica', location: '北京/上海', rating: 4.5, beans: 15, specialty: '拿铁专家' }
    ].map((roaster, i) => (
      <div key={i} className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-[#d6c4b0] to-[#e6d6c6] border border-[#c0bea5] hover:border-[#d89f8e] hover:shadow-md transition-all duration-300 group">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c0bea5] to-[#d6c4b0] flex items-center justify-center text-[#543231] font-bold text-lg shadow-sm">
            {roaster.name[0]}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#543231] rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg">
            {i + 1}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="font-bold text-[#543231] group-hover:text-[#44312b] transition-colors">{roaster.name}</p>
          <p className="text-xs text-[#543231]/60 mt-1">{roaster.location} · {roaster.beans}款豆子</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-[#c0bea5] text-[#543231] rounded-full text-[10px] font-semibold">
            {roaster.specialty}
          </span>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-[#543231]">
            <span>★</span>
            <span className="font-bold text-[#543231] text-lg">{roaster.rating}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RatingsContent: React.FC = () => (
  <div className="space-y-3">
    {[
      { name: '埃塞俄比亚耶加雪菲', score: 4.8, votes: 256, tags: ['柑橘', '茉莉花', '茶感'], color: 'from-[#FDF8F3] to-white' },
      { name: '哥伦比亚瑰夏', score: 4.7, votes: 189, tags: ['佛手柑', '红茶', '蜂蜜'], color: 'from-[#FDF8F3] to-white' },
      { name: '巴西皇后庄园', score: 4.5, votes: 342, tags: ['巧克力', '坚果', '焦糖'], color: 'from-[#FDF8F3] to-white' },
      { name: '肯尼亚AA TOP', score: 4.6, votes: 215, tags: ['黑醋栗', '红酒', '酸质明亮'], color: 'from-[#FDF8F3] to-white' }
    ].map((item, i) => (
      <div key={i} className="p-4 rounded-2xl bg-gradient-to-r from-[#d6c4b0] to-[#e6d6c6] border border-[#c0bea5] hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#543231]">★</span>
              <p className="font-bold text-[#543231] text-sm">{item.name}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#543231]">{item.score}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map((tag, j) => (
            <span key={j} className="px-3 py-1 bg-[#c0bea5] rounded-full text-xs text-[#543231]/70 font-medium shadow-sm">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#543231]/60">
          <span>👥</span>
          <span>{item.votes}位咖啡爱好者共同推荐</span>
        </div>
      </div>
    ))}
  </div>
);

const WeeklyContent: React.FC = () => (
  <div className="space-y-3">
    {[
      { name: '巴拿马翡翠庄园红标', origin: 'Panama', rating: 4.9, price: '¥168', process: '水洗', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop' },
      { name: '肯尼亚AA TOP', origin: 'Kenya', rating: 4.7, price: '¥128', process: '日晒', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop' },
      { name: '危地马拉安提瓜', origin: 'Guatemala', rating: 4.6, price: '¥98', process: '蜜处理', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop' },
      { name: '哥伦比亚慧兰', origin: 'Colombia', rating: 4.5, price: '¥88', process: '水洗', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' }
    ].map((bean, i) => (
      <div key={i} className="flex items-center p-4 rounded-2xl border border-[#c0bea5] bg-[#d6c4b0] hover:border-[#d89f8e] hover:shadow-xl transition-all duration-300 group">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img src={bean.image} alt={bean.name} className="w-full h-full object-cover" />
          </div>
          {i < 3 && (
            <div className="absolute -top-2 -left-2 w-7 h-7 bg-[#543231] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {i + 1}
            </div>
          )}
        </div>
        <div className="ml-4 flex-1">
          <p className="font-bold text-[#543231] group-hover:text-[#44312b] transition-colors text-sm leading-tight">{bean.name}</p>
          <p className="text-xs text-[#543231]/60 mt-1">{bean.origin} · {bean.process}</p>
          <p className="text-[#543231] font-bold text-lg mt-2">{bean.price}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-[#543231] mb-1">
            <span>★</span>
            <span className="font-bold text-[#543231]">{bean.rating}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default HotContentSection;
