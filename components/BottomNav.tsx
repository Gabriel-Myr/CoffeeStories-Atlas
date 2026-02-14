
import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.HOME, label: '喝一杯', icon: '☕' },
    { id: AppTab.CIRCLE, label: '咖啡圈', icon: '🌐' },
    { id: AppTab.MESSAGES, label: '消息', icon: '💬' },
    { id: AppTab.PROFILE, label: '我的', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-20 bg-white/80 ios-blur border-t border-gray-100 flex justify-around items-center px-4 z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            activeTab === item.id ? 'text-[#7B3F00] scale-110' : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className={`text-[10px] font-semibold ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
