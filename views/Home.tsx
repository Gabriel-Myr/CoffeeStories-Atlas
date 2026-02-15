import React, { useState, useEffect } from 'react';
import { MOCK_BEANS } from '../constants.tsx';
import Layout from '../components/Layout';
import { fetchCoffeeBeans } from '../services/coffeeBeanService';
import { CoffeeBean } from '../types';
import roasterIcon from '/Users/gabi/Downloads/icons8-coffee-roaster-50.png';
import { motion } from 'framer-motion';
import MapChart_MapSvg from '../assets/MapChart_Map.svg';

const COFFEE_REGIONS = {
  asia: {
    name: '亚洲',
    icon: '🌏',
    color: '#E07A5F',
    origins: [
      { name: '印度尼西亚', enName: 'Indonesia', lat: -0.789, lng: 113.921 },
    ]
  },
  africa: {
    name: '非洲',
    icon: '🌍',
    color: '#F2CC8F',
    origins: [
      { name: '埃塞俄比亚', enName: 'Ethiopia', lat: 9.145, lng: 40.489 },
      { name: '肯尼亚', enName: 'Kenya', lat: -0.024, lng: 37.906 },
    ]
  },
  americas: {
    name: '美洲',
    icon: '🌎',
    color: '#81B29A',
    origins: [
      { name: '哥伦比亚', enName: 'Colombia', lat: 4.571, lng: -74.297 },
      { name: '巴西', enName: 'Brazil', lat: -14.235, lng: -51.926 },
      { name: '危地马拉', enName: 'Guatemala', lat: 15.783, lng: -90.231 },
      { name: '巴拿马', enName: 'Panama', lat: 8.538, lng: -80.782 },
      { name: '哥斯达黎加', enName: 'Costa Rica', lat: 9.749, lng: -83.753 },
      { name: '秘鲁', enName: 'Peru', lat: -9.19, lng: -75.015 },
      { name: '洪都拉斯', enName: 'Honduras', lat: 15.2, lng: -86.242 },
    ]
  }
};

const MAP_DIMENSIONS = {
  width: 895.92,
  height: 471.76,
} as const;

const REGION_VIEWBOX: Record<keyof typeof COFFEE_REGIONS, { x: number; y: number; width: number; height: number }> = {
  // 完整展示南美洲 + 北美洲北部
  americas: { x: 100, y: 0, width: 340, height: MAP_DIMENSIONS.height },
  // 非洲 + 欧洲南部
  africa: { x: 330, y: 0, width: 280, height: MAP_DIMENSIONS.height },
  // 亚洲 + 大洋洲
  asia: { x: 520, y: 0, width: 376, height: MAP_DIMENSIONS.height },
};

const WorldMapSection: React.FC<{ beans: CoffeeBean[] }> = ({ beans }) => {
  const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<keyof typeof COFFEE_REGIONS>('asia');
  
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#4B3428]">🌍 咖啡世界地图</h2>
        <span className="text-xs text-[#4B3428]/50 font-medium">{beans.length} 款咖啡豆</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {(Object.keys(COFFEE_REGIONS) as Array<keyof typeof COFFEE_REGIONS>).map((regionKey) => {
          const region = COFFEE_REGIONS[regionKey];
          const stats = getContinentStats(regionKey);
          const isActive = hoveredOrigin && region.origins.some(o => o.enName === hoveredOrigin);
          const isSelected = selectedContinent === regionKey;
          
          return (
            <motion.div
              key={regionKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
                isActive || isSelected ? 'ring-2 ring-[#7B3F00] scale-[1.02]' : ''
              }`}
              style={{ backgroundColor: region.color + '20' }}
              onClick={() => setSelectedContinent(regionKey)}
              onMouseEnter={() => setHoveredOrigin(region.origins[0].enName)}
              onMouseLeave={() => setHoveredOrigin(null)}
            >
              <div className="absolute top-2 right-2 text-2xl opacity-30">{region.icon}</div>
              <div className="font-bold text-[#2C1810] text-sm mb-1">{region.name}</div>
              <div className="text-3xl font-black text-[#7B3F00]">{stats}</div>
              <div className="text-xs text-[#2C1810]/50 mt-1">款咖啡豆</div>
              
              <div className="flex gap-1 mt-3 flex-wrap">
                {region.origins.slice(0, 3).map(origin => (
                  <span 
                    key={origin.enName}
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      (originCount[origin.enName] || 0) > 0 
                        ? 'bg-[#7B3F00] text-white' 
                        : 'bg-[#2C1810]/10 text-[#2C1810]/40'
                    }`}
                  >
                    {origin.name.slice(0, 2)}
                  </span>
                ))}
                {region.origins.length > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2C1810]/10 text-[#2C1810]/40">
                    +{region.origins.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-3xl p-4 bg-white/70 border border-[#E8E1DA]">
        <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl">
          <svg
            viewBox={`${REGION_VIEWBOX[selectedContinent].x} ${REGION_VIEWBOX[selectedContinent].y} ${REGION_VIEWBOX[selectedContinent].width} ${REGION_VIEWBOX[selectedContinent].height}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision' }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <image
              href={MapChart_MapSvg}
              x="0"
              y="0"
              width={MAP_DIMENSIONS.width}
              height={MAP_DIMENSIONS.height}
              preserveAspectRatio="xMinYMin meet"
              style={{ opacity: 0.9, imageRendering: 'auto' }}
            />
          
          {COFFEE_REGIONS[selectedContinent].origins.map((origin, idx) => {
            const x = ((origin.lng + 180) / 360) * MAP_DIMENSIONS.width;
            const y = ((90 - origin.lat) / 180) * MAP_DIMENSIONS.height;
            const beanCount = originCount[origin.enName] || 0;
            const isHovered = hoveredOrigin === origin.enName;
            
            return (
              <g key={origin.enName}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 16 : 10}
                  fill={beanCount > 0 ? COFFEE_REGIONS[selectedContinent].color : '#5C4033'}
                  stroke="#FAF8F5"
                  strokeWidth="2"
                  filter="url(#glow)"
                  className="cursor-pointer"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.2, type: 'spring' }}
                  onMouseEnter={() => setHoveredOrigin(origin.enName)}
                  onMouseLeave={() => setHoveredOrigin(null)}
                />
                {beanCount > 0 && (
                  <>
                    <circle cx={x} cy={y} r={isHovered ? 24 : 18} fill={COFFEE_REGIONS[selectedContinent].color} opacity="0.2">
                      <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.2;0.1;0.2" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x={x} y={y - 20} textAnchor="middle" fill="#FAF8F5" fontSize="11" fontWeight="bold" className="pointer-events-none">
                      {beanCount}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          </svg>
        </div>


        {hoveredOrigin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 bg-[#FAF8F5]/95 backdrop-blur-sm rounded-xl p-3"
          >
            {Object.values(COFFEE_REGIONS).flatMap(region => 
              region.origins.filter(o => o.enName === hoveredOrigin).map(origin => ({
                ...origin,
                regionName: region.name,
                regionColor: region.color
              }))
            ).map(origin => (
              <div key={origin.enName} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: origin.regionColor }}
                  />
                  <div>
                    <p className="font-bold text-[#2C1810] text-sm">{origin.name}</p>
                    <p className="text-xs text-[#2C1810]/50">{origin.enName} · {origin.regionName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#7B3F00]">{originCount[origin.enName] || 0}</p>
                  <p className="text-[10px] text-[#2C1810]/50">款咖啡豆</p>
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
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBeans();
  }, []);

  async function loadBeans() {
    setLoading(true);
    const data = await fetchCoffeeBeans();
    setBeans(data);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#4B3428]">Coffee Atlas</h1>
        <div className="flex bg-[#EFEFEF] p-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => setActiveTopTab('beans')}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTopTab === 'beans' ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#7B3F00]' : 'text-[#3D2B1F]/55'
            }`}
          >
            在家喝
          </button>
          <button
            onClick={() => setActiveTopTab('shops')}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTopTab === 'shops' ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#7B3F00]' : 'text-[#3D2B1F]/55'
            }`}
          >
            到店喝
          </button>
        </div>
      </div>

      {activeTopTab === 'shops' ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-[#4B3428] mb-2">开发中</h2>
          <p className="text-[#4B3428]/60 text-center max-w-xs">
            咖啡店功能正在紧锣密鼓开发中，敬请期待！
          </p>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="搜索咖啡豆或咖啡店"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F3F3] rounded-2xl py-4 px-12 focus:ring-2 focus:ring-[#7B3F00]/20 outline-none transition-all text-sm font-semibold text-[#4B3428] placeholder-[#4B3428]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>

          <div className="rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onAddBean}
                className="bg-[#E1E1E1] rounded-2xl p-5 text-center shadow-[0_2px_0_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
              >
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#2E2E2E] text-3xl leading-none text-[#2E2E2E]">
                  +
                </span>
                <p className="text-sm font-extrabold text-[#2E2E2E]">添加咖啡豆</p>
              </button>
              <button
                className="bg-[#E1E1E1] rounded-2xl p-5 text-center shadow-[0_2px_0_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
              >
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center">
                  <img src={roasterIcon} alt="烘焙商" className="h-12 w-12" />
                </span>
                <p className="text-sm font-extrabold text-[#2E2E2E]">烘焙商</p>
              </button>
            </div>
          </div>

          <WorldMapSection beans={filteredBeans} />
        </>
      )}
    </Layout>
  );
};

export default Home;
