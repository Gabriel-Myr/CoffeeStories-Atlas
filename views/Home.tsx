import React, { useState, useEffect } from 'react';
import { MOCK_BEANS } from '../constants.tsx';
import Layout from '../components/Layout';
import { fetchCoffeeBeans } from '../services/coffeeBeanService';
import { CoffeeBean } from '../types';
import CoffeeBeanSvg from '../assets/coffee-bean-svgrepo-com.svg';
import { motion } from 'framer-motion';
import MapChart_MapSvg from '../assets/MapChart_Map.svg';
import CoffeeRoasterIcon from '../assets/icons8-coffee-roaster-vector.svg';
import { useNavigation } from '../App';


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
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  // 点击处理：切换选中状态
  const handleOriginClick = (originName: string) => {
    setSelectedOrigin(prev => prev === originName ? null : originName);
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#4B3428]">🌍 咖啡世界地图</h2>
        <span className="text-xs text-[#4B3428]/50 font-medium">{beans.length} 款咖啡豆</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {(Object.keys(COFFEE_REGIONS) as Array<keyof typeof COFFEE_REGIONS>).map((regionKey) => {
          const region = COFFEE_REGIONS[regionKey];
          const stats = getContinentStats(regionKey);
          const isSelected = selectedContinent === regionKey;
          
          return (
            <motion.div
              key={regionKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer touch-manipulation ${
                isSelected ? 'ring-2 ring-[#7B3F00] scale-[1.02]' : ''
              }`}
              style={{ backgroundColor: region.color + '20' }}
              onClick={() => setSelectedContinent(regionKey)}
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
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              { /* 咖啡豆图标 */ }
              <symbol id="coffee-bean-marker" viewBox="0 0 24 24">
                <path d="M19.151,4.868a6.744,6.744,0,0,0-5.96-1.69,12.009,12.009,0,0,0-6.54,3.47,11.988,11.988,0,0,0-3.48,6.55,6.744,6.744,0,0,0,1.69,5.95,6.406,6.406,0,0,0,4.63,1.78,11.511,11.511,0,0,0,7.87-3.56C21.3,13.428,22.1,7.818,19.151,4.868Zm-14.99,8.48a11.041,11.041,0,0,1,3.19-5.99,10.976,10.976,0,0,1,5.99-3.19,8.016,8.016,0,0,1,1.18-.09,5.412,5.412,0,0,1,3.92,1.49.689.689,0,0,1,.11.13,6.542,6.542,0,0,1-2.12,1.23,7.666,7.666,0,0,0-2.96,1.93,7.666,7.666,0,0,0-1.93,2.96,6.589,6.589,0,0,1-1.71,2.63,6.7,6.7,0,0,1-2.63,1.71,7.478,7.478,0,0,0-2.35,1.36A6.18,6.18,0,0,1,4.161,13.348Zm12.49,3.31c-3.55,3.55-8.52,4.35-11.08,1.79a1.538,1.538,0,0,1-.12-.13,6.677,6.677,0,0,1,2.13-1.23,7.862,7.862,0,0,0,2.96-1.93,7.738,7.738,0,0,0,1.93-2.96,6.589,6.589,0,0,1,1.71-2.63,6.589,6.589,0,0,1,2.63-1.71,7.6,7.6,0,0,0,2.34-1.37C20.791,9.2,19.821,13.488,16.651,16.658Z"/>
              </symbol>
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
            const isHovered = hoveredOrigin === origin.enName;
            const isSelected = selectedOrigin === origin.enName;
            // 统一大小，选中时放大
            const size = isSelected ? 32 : 26;
            const markerColor = '#7B3F00';

            return (
              <g key={origin.enName}>
                <motion.g
                  className="cursor-pointer touch-manipulation"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                  onClick={() => handleOriginClick(origin.enName)}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  <use
                    href="#coffee-bean-marker"
                    x={x - size/2}
                    y={y - size/2}
                    width={size}
                    height={size}
                    fill={markerColor}
                    filter={isHovered || isSelected ? "url(#glow)" : undefined}
                  />
                </motion.g>
              </g>
            );
          })}
          </svg>
        </div>


        {selectedOrigin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 bg-[#FAF8F5]/95 backdrop-blur-sm rounded-xl p-3"
          >
            {Object.values(COFFEE_REGIONS).flatMap(region =>
              region.origins.filter(o => o.enName === selectedOrigin).map(origin => ({
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
                  <p className="text-xl font-black text-[#7B3F00]">{originCount[selectedOrigin] || 0}</p>
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

// 烘焙商按钮组件
const RoasterButton: React.FC = () => {
  const { goToRoasterList } = useNavigation();

  return (
    <motion.button
      onClick={goToRoasterList}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="group bg-gradient-to-br from-[#F8F6F4] to-[#EDE9E6] rounded-2xl p-5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.8)_inset] border border-[#D8D4D0] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(139,119,101,0.12)] hover:-translate-y-1"
    >
      <span className="mx-auto mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#E8DDD4] shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_4px_12px_rgba(139,119,101,0.15)] group-hover:bg-[#E0D3C8] transition-all duration-300">
        <img src={CoffeeRoasterIcon} alt="烘焙商" className="w-14 h-14 group-hover:scale-110 transition-transform duration-300" />
      </span>
      <p className="text-base font-extrabold text-[#4A4A4A] mb-1">烘焙商</p>
      <p className="text-sm text-[#8B8B8B]">探索精品烘焙商</p>
    </motion.button>
  );
};

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
        {/* 左侧：切换按钮 */}
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

        {/* 右侧：软件名称 */}
        <div className="text-right">
          <h1 
            className="text-3xl font-black tracking-tight"
            style={{ 
              fontFamily: '"Libre Baskerville", "Georgia", serif',
              background: 'linear-gradient(135deg, #7B3F00 0%, #4B3428 50%, #A0522D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            CoffeeAtlas
          </h1>
          <p className="text-[10px] text-gray-400 tracking-widest mt-0.5">
            全球精品咖啡地图
          </p>
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
                className="group bg-gradient-to-br from-[#F8F6F4] to-[#EDE9E6] rounded-2xl p-5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.8)_inset] border border-[#D8D4D0] active:scale-95 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(139,119,101,0.12)] hover:-translate-y-1"
              >
                <span className="mx-auto mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#E8DDD4] shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_4px_12px_rgba(139,119,101,0.15)] group-hover:bg-[#E0D3C8] transition-all duration-300">
                  <img src={CoffeeBeanSvg} alt="" className="w-14 h-14 group-hover:scale-110 transition-transform duration-300" />
                </span>
                <p className="text-base font-extrabold text-[#4A4A4A] mb-1">添加咖啡豆</p>
                <p className="text-sm text-[#8B8B8B]">记录你的咖啡体验</p>
              </button>
              <RoasterButton />
            </div>
          </div>

          <WorldMapSection beans={filteredBeans} />
        </>
      )}
    </Layout>
  );
};

export default Home;
