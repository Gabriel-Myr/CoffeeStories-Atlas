
import React from 'react';
import { AppTab } from '../types';
import coffeeCupIcon from '../assets/coffee-cup-icon.svg';
import personIcon from '../assets/person-icon.svg';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.HOME, label: '喝一杯', icon: coffeeCupIcon },
    { id: AppTab.PROFILE, label: '我的', icon: personIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-24 bg-white/80 ios-blur border-t border-[#EDE4DA] flex justify-around items-center px-4 z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            activeTab === item.id ? 'text-[#7B3F00]' : 'text-[#3D2B1F]/40'
          }`}
        >
          <img
            src={item.icon}
            alt={item.label}
            className={item.id === AppTab.PROFILE ? 'w-8 h-8' : 'w-7 h-7'}
          />
          <span className={`text-xs font-semibold ${activeTab === item.id ? 'opacity-100' : 'opacity-50'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
