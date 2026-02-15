import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ActivityRecord } from '../types';

const MOCK_RECORDS: ActivityRecord[] = [
  {
    id: 'r1',
    type: 'rating',
    beanName: 'Ethiopia Yirgacheffe G1',
    origin: '埃塞俄比亚',
    process: '水洗',
    roastLevel: '浅烘',
    score: 92,
    date: '2024-05-20',
    imageUrl: 'https://picsum.photos/seed/coffee_p1/200/200'
  },
  {
    id: 'r2',
    type: 'checkin',
    beanName: 'Colombia Geisha',
    origin: '哥伦比亚',
    process: '厌氧日晒',
    roastLevel: '浅烘',
    date: '2024-05-18',
    imageUrl: 'https://picsum.photos/seed/coffee_p2/200/200'
  },
  {
    id: 'r3',
    type: 'wishlist',
    beanName: 'Panama Finca Deborah',
    origin: '巴拿马',
    process: '二氧化碳浸渍',
    roastLevel: '浅中烘',
    date: '2024-05-15',
    imageUrl: 'https://picsum.photos/seed/coffee_p3/200/200'
  }
];

const Profile: React.FC = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { ease: "easeOut", duration: 0.4 } }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'rating': return '☕';
      case 'checkin': return '📍';
      case 'wishlist': return '❤️';
      default: return '☕';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'rating': return '评分';
      case 'checkin': return '打卡';
      case 'wishlist': return '心愿单';
      default: return '记录';
    }
  };

  return (
    <Layout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pb-10"
      >
        {/* User Info Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8 pt-4">
          <div className="relative mb-4">
            <div className="absolute inset-0 -m-3 rounded-full bg-[#7B3F00]/10 animate-breathe"></div>
            <motion.img 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src="https://i.pravatar.cc/150?u=myprofile" 
              alt="User Avatar" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover relative z-10" 
            />
            <button className="absolute bottom-0 right-0 bg-[#7B3F00] text-white p-2 rounded-full border-2 border-white shadow-lg z-20 hover:scale-110 active:scale-90 transition-transform">
              <span className="text-xs">📸</span>
            </button>
          </div>
          <h2 className="text-xl font-bold text-[#3d2b1f]">咖啡收藏家小李</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">探索 42 个产区 · 留下 156 条评分</p>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: '打卡', value: '42' },
            { label: '关注', value: '128' },
            { label: '获赞', value: '1.2k' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -4 }}
              className="bg-[#FDF8F3] p-4 rounded-3xl text-center border border-[#E8DCCF]/30 shadow-sm"
            >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-lg font-bold text-[#7B3F00]"
              >
                {stat.value}
              </motion.p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* My Records Section (New & Improved) */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-base font-bold text-[#3d2b1f]">我的记录</h3>
            <button className="text-[10px] font-bold text-[#7B3F00] bg-[#7B3F00]/5 px-3 py-1.5 rounded-full hover:bg-[#7B3F00]/10 transition-colors">
              查看全部
            </button>
          </div>

          <div className="relative pl-4">
            {/* Timeline Line */}
            <div className="absolute left-6 top-2 bottom-8 w-[1.5px] bg-[#E8E2DA]"></div>

            <div className="space-y-6">
              {MOCK_RECORDS.map((record) => (
                <div key={record.id} className="relative pl-8">
                  {/* Timeline Dot Icon */}
                  <div className="absolute left-[-11px] top-4 w-6 h-6 rounded-full bg-white border border-[#E8E2DA] flex items-center justify-center text-[10px] z-10 shadow-sm">
                    {getIcon(record.type)}
                  </div>

                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm flex gap-4"
                  >
                    <img 
                      src={record.imageUrl} 
                      alt="" 
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#3d2b1f] truncate pr-2 mb-1">{record.beanName}</h4>
                      
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-[9px] bg-[#FAF8F5] text-gray-500 px-2 py-0.5 rounded-md font-medium">{record.origin}</span>
                        <span className="text-[9px] bg-[#FAF8F5] text-gray-500 px-2 py-0.5 rounded-md font-medium">{record.process}</span>
                        <span className="text-[9px] bg-[#FAF8F5] text-gray-500 px-2 py-0.5 rounded-md font-medium">{record.roastLevel}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-[#7B3F00] font-bold opacity-70">#{getTypeLabel(record.type)}</span>
                        <span className="text-[9px] text-gray-400 font-medium">{record.date}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Regular Menu Options */}
        <motion.div variants={itemVariants} className="space-y-3">
          {[
            { id: 'orders', label: '我的订单', icon: '📦', color: 'bg-orange-50' },
            { id: 'beans', label: '尝过的豆子', icon: '🫘', color: 'bg-stone-50' },
            { id: 'settings', label: '设置', icon: '⚙️', color: 'bg-slate-50' },
            { id: 'about', label: '关于 Coffee Atlas', icon: '🌿', color: 'bg-emerald-50' }
          ].map((menu) => (
            <div key={menu.id} className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white">
              <button 
                onClick={() => setExpandedMenu(expandedMenu === menu.id ? null : menu.id)}
                className="ripple w-full flex justify-between items-center p-5 transition-colors active:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`${menu.color} w-10 h-10 rounded-2xl flex items-center justify-center text-lg`}>
                    {menu.icon}
                  </div>
                  <span className="text-sm font-bold text-[#3d2b1f]">{menu.label}</span>
                </div>
                <motion.span 
                  animate={{ rotate: expandedMenu === menu.id ? 90 : 0 }}
                  className="text-gray-300 font-bold"
                >
                  ›
                </motion.span>
              </button>
              
              <AnimatePresence>
                {expandedMenu === menu.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="bg-[#fafafa] border-t border-gray-50 overflow-hidden"
                  >
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-gray-500 px-2 font-medium">暂无详细记录，快去探索吧！</p>
                      <div className="h-2" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.button 
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-10 py-4 rounded-3xl border-2 border-red-50 text-red-400 text-sm font-bold hover:bg-red-50/50 transition-colors"
        >
          切换账号
        </motion.button>
      </motion.div>
    </Layout>
  );
};

export default Profile;
