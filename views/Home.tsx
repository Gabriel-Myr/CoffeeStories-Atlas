
import React, { useState, useEffect } from 'react';
import { MOCK_BEANS } from '../constants.tsx';
import Layout from '../components/Layout';
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
        <h1 className="text-2xl font-bold text-[#3d2b1f]">Coffee Atlas</h1>
        <div className="flex bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => setActiveTopTab('beans')}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTopTab === 'beans' ? 'bg-white shadow-sm text-[#7B3F00]' : 'text-gray-500'
            }`}
          >
            在家喝
          </button>
          <button
            onClick={() => setActiveTopTab('shops')}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTopTab === 'shops' ? 'bg-white shadow-sm text-[#7B3F00]' : 'text-gray-500'
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
          className="w-full bg-gray-100 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-[#7B3F00]/20 outline-none transition-all text-sm font-medium"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      </div>

      {/* Location Suggestions - 2x2 Grid Style */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { icon: '☕️', title: '添加豆子', desc: '记录你的每一杯', color: 'bg-[#FDF8F3]', border: 'border-[#E8DCCF]', onClick: onAddBean },
          { icon: '🌿', title: '精品豆库', desc: '发现全球产区', color: 'bg-green-50', border: 'border-green-100', onClick: undefined },
          { icon: '🗺️', title: '热门烘焙商', desc: '谁的熟豆最懂你？', color: 'bg-blue-50', border: 'border-blue-100', onClick: undefined },
          { icon: '🏆', title: '社区评分', desc: '你爱的就是好咖啡', color: 'bg-amber-50', border: 'border-amber-100', onClick: undefined }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.onClick}
            className={`${item.color} ${item.border} p-5 rounded-3xl text-center transition-transform active:scale-95 shadow-sm border ${item.onClick ? 'cursor-pointer' : ''}`}
          >
            <span className="text-3xl block mb-3">{item.icon}</span>
            <p className="font-bold text-sm text-[#7B3F00]">{item.title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Feature Section: Weekly Top Beans */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-[#3d2b1f]">本周热门推荐</h2>
          <button className="text-[#7B3F00] text-sm font-semibold">查看更多</button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : (
          <div className="space-y-4">
            {filteredBeans.map(bean => (
              <div key={bean.id} className="bg-white border border-gray-100 rounded-3xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <img src={bean.image} alt={bean.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#3d2b1f] leading-tight">{bean.name}</h3>
                    <span className="text-xs bg-[#FDF8F3] text-[#7B3F00] px-2 py-0.5 rounded-full font-bold">★ {bean.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{bean.origin} · {bean.roastLevel}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-1">{bean.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
