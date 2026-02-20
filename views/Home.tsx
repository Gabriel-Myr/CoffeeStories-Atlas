import React, { useState, useEffect } from 'react';
import { MOCK_BEANS } from '../constants.tsx';
import Layout from '../components/Layout';
import { fetchCoffeeBeans } from '../services/coffeeBeanService';
import { CoffeeBean } from '../types';
import CoffeeBeanSvg from '../assets/coffee-bean-svgrepo-com.svg';
import { motion } from 'framer-motion';
import CoffeeRoasterIcon from '../assets/icons8-coffee-roaster-vector.svg';
import { useNavigation } from '../App';
import WorldMap from '../components/WorldMap';

const COFFEE_REGIONS = {
  asia: {
    name: '亚洲',
    icon: '🌏',
    color: '#E07A5F',
    origins: [
      { name: '印度尼西亚', enName: 'Indonesia', lat: -6, lng: 113 },
      { name: '巴布亚新几内亚', enName: 'Papua New Guinea', lat: -6, lng: 144 },
      { name: '也门', enName: 'Yemen', lat: 15, lng: 48 },
    ]
  },
  africa: {
    name: '非洲',
    icon: '🌍',
    color: '#F2CC8F',
    origins: [
      { name: '埃塞俄比亚', enName: 'Ethiopia', lat: 9, lng: 40 },
      { name: '肯尼亚', enName: 'Kenya', lat: 0, lng: 38 },
      { name: '卢旺达', enName: 'Rwanda', lat: -2, lng: 30 },
      { name: '布隆迪', enName: 'Burundi', lat: -3, lng: 30 },
      { name: '乌干达', enName: 'Uganda', lat: 1, lng: 32 },
    ]
  },
  americas: {
    name: '美洲',
    icon: '🌎',
    color: '#81B29A',
    origins: [
      { name: '哥伦比亚', enName: 'Colombia', lat: 4, lng: -74 },
      { name: '巴西', enName: 'Brazil', lat: -15, lng: -52 },
      { name: '危地马拉', enName: 'Guatemala', lat: 15, lng: -90 },
      { name: '巴拿马', enName: 'Panama', lat: 9, lng: -80 },
      { name: '哥斯达黎加', enName: 'Costa Rica', lat: 10, lng: -84 },
      { name: '秘鲁', enName: 'Peru', lat: -9, lng: -75 },
      { name: '洪都拉斯', enName: 'Honduras', lat: 15, lng: -86 },
      { name: '墨西哥', enName: 'Mexico', lat: 23, lng: -102 },
      { name: '古巴', enName: 'Cuba', lat: 21, lng: -78 },
    ]
  }
};

const MAP_DIMENSIONS = {
  width: 895.92,
  height: 471.76,
} as const;

const WorldMapSection: React.FC<{ beans: CoffeeBean[] }> = ({ beans }) => {
  const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<keyof typeof COFFEE_REGIONS>('asia');
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  // 点击处理：切换选中状态
  const handleOriginClick = (originName: string, lat: number, lng: number, name: string) => {
    if (selectedOrigin === originName) {
      setSelectedOrigin(null);
    } else {
      setSelectedOrigin(originName);
    }
    setHoveredOrigin(originName);
  };
  
  const originCount = beans.reduce((acc, bean) => {
    const origin = bean.origin || '';
    Object.values(COFFEE_REGIONS).forEach(region => {
      region.origins.forEach(country => {
        if (origin.toLowerCase().includes(country.enName.toLowerCase()) || 
            origin.toLowerCase().includes(country.name)) {
          acc[country.enName] = (acc[country.enName] || 0) + 1;
        }
      });
    });
    return acc;
  }, {} as Record<string, number>);

  const getContinentStats = (regionKey: keyof typeof COFFEE_REGIONS) => {
    const region = COFFEE_REGIONS[regionKey];
    let total = 0;
    region.origins.forEach(origin => {
      total += originCount[origin.enName] || 0;
    });
    return total;
  };

  return (
    <div className="mb-10">
      {/* 头部区域：强化高级感和对齐 */}
      <div className="flex justify-between items-end mb-6 border-b border-[#F0EBE1] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#4A3525] flex items-center justify-center text-[#F5EBE1] shadow-inner">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#3E2A1E] tracking-widest">咖啡世界地图</h2>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#4A3525]" style={{ fontFamily: '"Playfair Display", serif', fontVariantNumeric: 'lining-nums' }}>
            {beans.length}
          </span>
          <span className="text-xs text-[#A08C7D] font-medium tracking-widest ml-1">款</span>
        </div>
      </div>

      {/* 优化后的大洲统计卡片 */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {(Object.keys(COFFEE_REGIONS) as Array<keyof typeof COFFEE_REGIONS>).map((regionKey) => {
          const region = COFFEE_REGIONS[regionKey];
          const stats = getContinentStats(regionKey);
          const isSelected = selectedContinent === regionKey;

          return (
            <motion.div
              key={regionKey}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden rounded-[1.5rem] p-5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-[#4A3525] text-[#F5EBE1] shadow-lg shadow-[#4A3525]/20'
                  : 'bg-[#FAFAF8] border-2 border-[#F0EBE1] text-[#4A3525] hover:border-[#D5C5B5] hover:shadow-md hover:shadow-[#4A3525]/5'
              }`}
              onClick={() => setSelectedContinent(regionKey)}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`text-sm md:text-base font-bold tracking-widest ${isSelected ? 'text-[#F5EBE1]' : 'text-[#6E5A4B]'}`}>
                  {region.name}
                </span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#E5B582] shadow-[0_0_8px_#E5B582]"></div>
                )}
              </div>

              <div className="text-center relative z-10 mt-1 mb-2">
                <span
                  className="text-4xl md:text-5xl"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontVariantNumeric: 'lining-nums',
                    color: isSelected ? '#F5EBE1' : '#2C1E16'
                  }}
                >
                  {stats}
                </span>
                <span className={`text-xs ml-1 font-light tracking-widest ${isSelected ? 'opacity-70 text-[#F5EBE1]' : 'text-[#A08C7D]'}`}>
                  款
                </span>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* 地图与详情容器（无边框，纯白+阴影） */}
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_-15px_rgba(74,53,37,0.08)] border border-[#FAFAF8]">
        <WorldMap
          regions={COFFEE_REGIONS}
          selectedContinent={selectedContinent}
          onOriginClick={handleOriginClick}
          selectedOrigin={selectedOrigin || undefined}
          hoveredOrigin={hoveredOrigin}
          setHoveredOrigin={setHoveredOrigin}
        />

        {selectedOrigin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 bg-[#FAFAF8] rounded-2xl p-4 border border-[#F0EBE1] flex flex-col gap-2"
          >
            {Object.values(COFFEE_REGIONS).flatMap(region =>
              region.origins.filter(o => o.enName === selectedOrigin).map(origin => ({
                ...origin,
                regionName: region.name,
                regionColor: region.color
              }))
            ).map(origin => (
              <div key={origin.enName} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full shadow-sm" 
                    style={{ backgroundColor: origin.regionColor }}
                  />
                  <div>
                    <p className="font-bold text-[#3E2A1E] text-sm tracking-wide">{origin.name}</p>
                    <p className="text-[11px] text-[#A08C7D] tracking-wider mt-0.5 font-medium">{origin.enName} · {origin.regionName}</p>
                  </div>
                </div>
                <div className="text-right flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-[#4A3525]" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {originCount[selectedOrigin] || 0}
                  </p>
                  <p className="text-xs text-[#A08C7D] font-light tracking-widest">款</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface HomeProps {
  onAddBean?: () => void;
}

const Home: React.FC<HomeProps> = ({ onAddBean }) => {
  const [activeTopTab, setActiveTopTab] = useState<'beans' | 'shops'>('beans');
  const [searchQuery, setSearchQuery] = useState('');
  const [beans, setBeans] = useState<CoffeeBean[]>(MOCK_BEANS);
  const [loading, setLoading] = useState(true);
  const { goToRoasterList } = useNavigation();

  useEffect(() => {
    loadBeans();
  }, []);

  async function loadBeans() {
    setLoading(true);
    const data = await fetchCoffeeBeans();
    
    // 合并模拟数据和数据库数据，避免重复
    const existingIds = new Set(MOCK_BEANS.map(b => b.id));
    const dbBeans = data.filter(b => !existingIds.has(b.id));
    const combined = [...MOCK_BEANS, ...dbBeans];

    setBeans(combined);
    setLoading(false);
  }

  const filteredBeans = beans.length > 0 ? beans.filter(bean => 
    bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bean.origin.toLowerCase().includes(searchQuery.toLowerCase())
  ) : MOCK_BEANS.filter(bean => 
    bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bean.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* 1. 头部区域：Logo在左，切换器在右 */}
      <div className="flex justify-between items-center mb-8 pt-2">
        {/* Logo 区域 */}
        <div className="flex flex-col ml-4">
          {/* 新 Logo 设计 */}
          <div className="flex flex-col items-start">
            {/* 顶部装饰线 */}
            <div className="w-8 h-[3px] bg-[#D4A574] mb-1.5 rounded-full"></div>
            {/* COFFEE 大写粗体 */}
            <h1
              className="text-[22px] font-bold text-[#3E2A1E] tracking-[0.05em] leading-none"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              COFFEE
            </h1>
            {/* Atlas 斜体衬线 */}
            <h2
              className="text-[26px] italic font-medium text-[#8B7355] tracking-[0.02em] leading-none -mt-0.5"
              style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
            >
              Atlas
            </h2>
          </div>
        </div>

        {/* 状态切换器 Toggle (胶囊样式) */}
        <div className="bg-[#F4EFEA] p-1 rounded-full flex items-center shadow-inner">
          <button
            onClick={() => setActiveTopTab('beans')}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 tracking-wide ${
              activeTopTab === 'beans'
                ? 'bg-white text-[#4A3525] shadow-sm font-bold'
                : 'text-[#A08C7D] font-medium hover:text-[#4A3525]'
            }`}
          >
            在家喝
          </button>
          <button
            onClick={() => setActiveTopTab('shops')}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 tracking-wide ${
              activeTopTab === 'shops'
                ? 'bg-white text-[#4A3525] shadow-sm font-bold'
                : 'text-[#A08C7D] font-medium hover:text-[#4A3525]'
            }`}
          >
            到店喝
          </button>
        </div>
      </div>

      {activeTopTab === 'shops' ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 mt-10">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-xl font-bold text-[#4B3428] mb-2 tracking-widest">开发中</h2>
          <p className="text-[#4B3428]/60 text-center max-w-xs text-sm tracking-wide">
            咖啡店功能正在紧锣密鼓开发中，敬请期待！
          </p>
        </div>
      ) : (
        <>
          {/* 2. 搜索栏：无边框，融于背景 */}
          <div className="relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#A08C7D] group-focus-within:text-[#4A3525] transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索咖啡豆或咖啡店..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAF8] text-[#4A3525] placeholder-[#B5A598] rounded-2xl py-4 pl-12 pr-4 outline-none border border-transparent focus:border-[#E5D5C5] focus:bg-white transition-all duration-300 text-sm font-medium"
            />
          </div>

          {/* 3. 功能卡片网格：纯白底色 + 柔和投影 */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-10">
            {/* 卡片 A：添加咖啡豆 */}
            <button
              onClick={onAddBean}
              className="group bg-white rounded-[1.5rem] p-6 flex flex-col items-center cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-[#FAFAF8]"
              style={{ boxShadow: '0 12px 30px -10px rgba(74, 53, 37, 0.08)' }}
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-[#FAF5EE] flex items-center justify-center group-hover:bg-[#4A3525] transition-all duration-300">
                <img src={CoffeeBeanSvg} alt="" className="w-7 h-7 group-hover:brightness-0 group-hover:invert transition-all duration-300" />
              </div>
              <h3 className="text-base font-bold text-[#3E2A1E] mb-1 tracking-widest">添加咖啡豆</h3>
              <p className="text-[11px] text-[#A08C7D] font-normal tracking-wide">记录你的咖啡体验</p>
            </button>

            {/* 卡片 B：烘焙商 */}
            <button
              onClick={goToRoasterList}
              className="group bg-white rounded-[1.5rem] p-6 flex flex-col items-center cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-[#FAFAF8]"
              style={{ boxShadow: '0 12px 30px -10px rgba(74, 53, 37, 0.08)' }}
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-[#FAF5EE] flex items-center justify-center group-hover:bg-[#4A3525] transition-all duration-300">
                <img src={CoffeeRoasterIcon} alt="烘焙商" className="w-7 h-7 group-hover:brightness-0 group-hover:invert transition-all duration-300" />
              </div>
              <h3 className="text-base font-bold text-[#3E2A1E] mb-1 tracking-widest">烘焙商</h3>
              <p className="text-[11px] text-[#A08C7D] font-normal tracking-wide">探索精品烘焙商</p>
            </button>
          </div>

          {/* 世界地图模块 */}
          <WorldMapSection beans={filteredBeans} />
        </>
      )}
    </Layout>
  );
};

export default Home;