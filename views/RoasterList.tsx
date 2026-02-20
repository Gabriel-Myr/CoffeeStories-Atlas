import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Roaster } from '../types';
import { MOCK_ROASTERS } from '../constants';
import SearchIcon from '../assets/icons8-search.svg';

interface RoasterListProps {
  onBack?: () => void;
  onRoasterClick?: (roaster: Roaster) => void;
}

// 为每个烘焙商分配一个固定的渐变色
const getRoasterGradient = (id: string): string => {
  const gradients: Record<string, string> = {
    'r-0': 'from-[#3D3D3D] to-[#1A1A1A]',
    'r-1': 'from-[#D2691E] to-[#8B4513]',
    'r-2': 'from-[#E07C4F] to-[#C45C3E]',
    'r-3': 'from-[#6B5B95] to-[#4A3F6B]',
    'r-4': 'from-[#2C3E50] to-[#1A252F]',
    'r-5': 'from-[#8B7355] to-[#5C4A3A]',
    'r-6': 'from-[#4A90A4] to-[#2E5A6B]',
  };
  return gradients[id] || 'from-[#7B3F00] to-[#A0522D]';
};

// 固定分类标签
const CATEGORY_TAGS = [
  { id: 'all', name: '全部' },
  { id: 'shanghai', name: '上海' },
  { id: 'other', name: '其他城市' },
];

const RoasterList: React.FC<RoasterListProps> = ({ onBack, onRoasterClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 根据分类过滤烘焙商
  const filteredRoasters = useMemo(() => {
    return MOCK_ROASTERS.filter(roaster => {
      const matchesSearch = searchQuery === '' ||
        roaster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roaster.location.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = true;
      if (selectedCategory === 'shanghai') {
        matchesCategory = roaster.location.includes('上海');
      } else if (selectedCategory === 'other') {
        matchesCategory = !roaster.location.includes('上海');
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* 顶部标题区域 */}
      <div className="bg-white px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          {/* 左侧：返回按钮 */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-xl text-[#4B3428]">←</span>
          </button>

          {/* 右侧：软件名称 - 艺术字体 */}
          <div className="text-right">
            <h1
              className="text-3xl font-black tracking-tight"
              style={{
                fontFamily: '"Libre Baskerville", "Georgia", serif',
                background: 'linear-gradient(135deg, #7B3F00 0%, #4B3428 50%, #A0522D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 4px rgba(123, 63, 0, 0.1)'
              }}
            >
              CoffeeAtlas
            </h1>
            <p className="text-[10px] text-gray-400 tracking-widest mt-0.5">
              全球精品咖啡地图
            </p>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="relative">
          <img
            src={SearchIcon}
            alt="搜索"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          />
          <input
            type="text"
            placeholder="搜索烘焙商、所在地..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F3F3F3] rounded-2xl py-4 pl-12 pr-4 text-sm text-[#4B3428] placeholder-[#4B3428]/40 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]/20"
          />
        </div>
      </div>

      {/* 分类标签筛选 */}
      <div className="bg-white px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedCategory(tag.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === tag.id
                  ? 'bg-[#4B3428] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-24">
        {/* 烘焙商列表 */}
        <div className="mt-2 bg-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <span className="font-bold text-[#4B3428] text-base">
              烘焙商
            </span>
            <span className="text-xs text-gray-400 font-medium">
              共{filteredRoasters.length}家
            </span>
          </div>

          <div className="px-4 pb-4 space-y-3">
            <AnimatePresence>
              {filteredRoasters.map((roaster) => (
                <motion.div
                  key={roaster.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onRoasterClick?.(roaster)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  {/* Logo */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRoasterGradient(roaster.id)} flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md overflow-hidden`}>
                    {roaster.logo ? (
                      <img
                        src={roaster.logo}
                        alt={roaster.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // 图片加载失败时显示首字
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerText = roaster.name[0];
                        }}
                      />
                    ) : (
                      roaster.name[0]
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#4B3428] text-sm truncate mb-1">
                      {roaster.name.split(' ')[0]}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-1.5">
                      <span className="flex items-center gap-0.5">
                        <span className="text-[#E07C4F]">📍</span>
                        {roaster.location}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 truncate">
                      {roaster.description.slice(0, 40)}...
                    </p>
                  </div>

                  {/* 箭头 */}
                  <span className="text-gray-300 text-xl flex-shrink-0">
                    ›
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredRoasters.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-500 text-sm">没有找到匹配的烘焙商</p>
              <button
                onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                className="mt-3 text-[#7B3F00] text-sm font-medium"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoasterList;
