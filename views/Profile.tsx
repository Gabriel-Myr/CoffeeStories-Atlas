import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '../App';

const Profile: React.FC = () => {
  const { userState, tastingNotes } = useUser();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { goToRoasterAdmin } = useNavigation();

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

  const { user, stats, isLoggedIn } = userState;

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
              src={isLoggedIn && user?.avatarUrl ? user.avatarUrl : 'https://api.dicebear.com/7.x/avataaars/svg?seed=coffee'}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover relative z-10"
            />
            <button className="absolute bottom-0 right-0 bg-[#7B3F00] text-white p-2 rounded-full border-2 border-white shadow-lg z-20 hover:scale-110 active:scale-90 transition-transform">
              <span className="text-xs">📸</span>
            </button>
          </div>
          <h2 className="text-xl font-bold text-[#3D2B1F]">{isLoggedIn && user ? user.nickname : '点击登录'}</h2>
          <p className="text-sm text-[#3D2B1F]/50 mt-1 font-medium">探索 {stats.originCount} 个产区 · 留下 {stats.ratingCount} 条评分</p>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants} className="flex justify-center mb-10 gap-4">
          {[
            { label: '打卡', value: stats.checkinCount },
            { label: '产区', value: stats.originCount },
            { label: '评分', value: stats.ratingCount },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-[#FDF8F3] px-6 py-4 rounded-3xl text-center border border-[#EDE4DA]/50 shadow-sm flex-1"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-lg font-bold text-[#7B3F00]"
              >
                {stat.value}
              </motion.p>
              <p className="text-[10px] text-[#3D2B1F]/50 font-bold uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 品鉴笔记展示 */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-base font-bold text-[#3D2B1F]">我的冲煮记录</h3>
            <span className="text-xs text-[#7B3F00] font-medium">{tastingNotes.length} 条</span>
          </div>

          <div className="space-y-3">
            {tastingNotes.slice(0, 3).map((note) => (
              <motion.div
                key={note.id}
                whileHover={{ x: 4 }}
                className="bg-white rounded-2xl p-4 border border-[#EDE4DA] shadow-sm flex gap-4"
              >
                <img
                  src={note.imageUrl || 'https://picsum.photos/seed/coffee_default/200/200'}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-[#3D2B1F] truncate pr-2">{note.beanName}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      note.score >= 9 ? 'text-green-600 bg-green-50' :
                      note.score >= 7 ? 'text-amber-600 bg-amber-50' :
                      'text-red-600 bg-red-50'
                    }`}>
                      {note.score.toFixed(2)} 分
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-1">
                    <span className="text-[9px] bg-[#FDF8F3] text-[#3D2B1F]/70 px-2 py-0.5 rounded-md font-medium">{note.grinder}</span>
                    <span className="text-[9px] bg-[#FDF8F3] text-[#3D2B1F]/70 px-2 py-0.5 rounded-md font-medium">{note.dripper}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#7B3F00] font-bold opacity-70">{note.ratio}</span>
                    <span className="text-[9px] text-[#3D2B1F]/40 font-medium">{note.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Regular Menu Options - 替换菜单项 */}
        <motion.div variants={itemVariants} className="space-y-3">
          {[
            { id: 'roaster-admin', label: '烘焙商管理', icon: '🏭', color: 'bg-orange-50', action: goToRoasterAdmin },
            { id: 'favorites', label: '我的收藏', icon: '⭐', color: 'bg-yellow-50', action: null },
            { id: 'settings', label: '设置', icon: '⚙️', color: 'bg-slate-50', action: null },
            { id: 'about', label: '关于 Coffee Atlas', icon: '🌿', color: 'bg-emerald-50', action: null }
          ].map((menu) => (
            <div key={menu.id} className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white">
              <button
                onClick={() => {
                  if (menu.action) {
                    menu.action();
                  } else {
                    setExpandedMenu(expandedMenu === menu.id ? null : menu.id);
                  }
                }}
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
                      <p className="text-xs text-gray-500 px-2 font-medium">
                        {menu.id === 'favorites' ? '收藏功能开发中...' :
                         '暂无详细记录，快去探索吧！'}
                      </p>
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
