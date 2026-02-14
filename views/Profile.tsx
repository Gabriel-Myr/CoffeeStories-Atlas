
import React from 'react';
import Layout from '../components/Layout';

const Profile: React.FC = () => {
  return (
    <Layout>
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="relative mb-4">
          <img 
            src="https://i.pravatar.cc/150?u=myprofile" 
            alt="User Avatar" 
            className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" 
          />
          <button className="absolute bottom-0 right-0 bg-[#7B3F00] text-white p-2 rounded-full border-2 border-white shadow-lg">
            <span className="text-xs">📸</span>
          </button>
        </div>
        <h2 className="text-xl font-bold text-[#3d2b1f]">咖啡收藏家小李</h2>
        <p className="text-sm text-gray-500 mt-1">探索 42 个产区 · 留下 156 条评分</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: '打卡', value: '42' },
          { label: '关注', value: '128' },
          { label: '获赞', value: '1.2k' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#FDF8F3] p-4 rounded-2xl text-center border border-[#E8DCCF]/30 shadow-sm">
            <p className="text-lg font-bold text-[#7B3F00]">{stat.value}</p>
            <p className="text-[10px] text-gray-400 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My Coffee History */}
      <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm mb-6">
        <div className="flex p-2 gap-2">
          <button className="flex-1 bg-[#7B3F00] text-white py-2 rounded-2xl text-xs font-bold shadow-md shadow-[#7B3F00]/20">
            我的评分
          </button>
          <button className="flex-1 text-gray-400 py-2 rounded-2xl text-xs font-bold">
            心愿清单
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {[
          { title: '耶加雪菲 G1', type: '评分', score: 4.8, date: '昨天' },
          { title: 'Metal Hands (前门店)', type: '打卡', score: 4.5, date: '3天前' },
          { title: '云南 厌氧日晒', type: '评分', score: 4.2, date: '1周前' }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{item.type} · {item.date}</p>
              <p className="font-bold text-sm text-[#3d2b1f]">{item.title}</p>
            </div>
            <div className="text-right">
              <p className="text-[#7B3F00] font-bold text-sm">★ {item.score}</p>
              <span className="text-[10px] text-gray-300">查看详情 →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Settings List */}
      <div className="mt-10 pt-6 border-t border-gray-100 space-y-2">
        {['账号安全', '通知设置', '关于 Coffee Atlas', '切换账号'].map((text, i) => (
          <button key={i} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
            <span className="text-sm font-medium text-[#4a3a2d]">{text}</span>
            <span className="text-gray-300">›</span>
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default Profile;
