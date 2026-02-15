
import React, { useState, useEffect } from 'react';
import { MOCK_BEANS } from '../constants.tsx';
import Layout from '../components/Layout';
import HotContentSection from '../components/HotContentSection';
import { fetchCoffeeBeans } from '../services/coffeeBeanService';
import { CoffeeBean } from '../types';

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
      {/* Header Tabs */}
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

      {/* Search Bar */}
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

      {/* Quick Actions */}
      <div className="border-2 border-dashed border-[#8B61FF] rounded-2xl p-4 mb-6">
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
            <span className="mx-auto mb-3 block h-12 w-12">
              <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#2E2E2E]" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M32 10c9 0 16 7 16 16 0 14-16 28-16 28S16 40 16 26c0-9 7-16 16-16z" />
                <path d="M22 32c6-2 14-10 20-20" />
              </svg>
            </span>
            <p className="text-sm font-extrabold text-[#2E2E2E]">在线数据库</p>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <button className="bg-[#E1E1E1] rounded-2xl p-5 text-center shadow-[0_2px_0_rgba(0,0,0,0.08)] active:scale-95 transition-transform w-[148px]">
          <span className="mx-auto mb-3 block h-12 w-12">
            <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#4B3428]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
              <path d="M16 8h26v40H16z" />
              <path d="M42 14h10v34H26" />
              <path d="M24 22h8M24 28h8M24 34h8" />
              <path d="M40 8l-6 10h12z" />
            </svg>
          </span>
          <p className="text-sm font-extrabold text-[#4B3428]">烘焙商</p>
        </button>
      </div>

      {/* Hot Content Section - 三栏可切换热门推荐 */}
      <HotContentSection />
    </Layout>
  );
};

export default Home;
