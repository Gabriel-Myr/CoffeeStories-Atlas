import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSettingsProps {
  onBack: () => void;
}

type ThemeMode = 'light' | 'dark' | 'system';

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onBack }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem('themeMode', mode);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const themeOptions = [
    {
      id: 'light',
      icon: Sun,
      title: '浅色模式',
      description: '明亮的白色主题',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      iconColor: 'text-amber-500'
    },
    {
      id: 'dark',
      icon: Moon,
      title: '深色模式',
      description: '柔和的暗色主题',
      bgColor: 'bg-gray-900',
      borderColor: 'border-gray-700',
      iconColor: 'text-indigo-400'
    },
    {
      id: 'system',
      icon: Monitor,
      title: '跟随系统',
      description: '自动匹配设备设置',
      bgColor: 'bg-gradient-to-br from-white to-gray-900',
      borderColor: 'border-gray-300',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="text-xl text-[#4B3428]">←</span>
          </button>
          <h1 className="text-xl font-bold text-[#4B3428]">主题设置</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4"
        >
          <h3 className="text-base font-bold text-[#3D2B1F] mb-4">选择主题模式</h3>

          <div className="space-y-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = themeMode === option.id;

              return (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange(option.id as ThemeMode)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#7B3F00] bg-[#7B3F00]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${option.bgColor} border ${option.borderColor} flex items-center justify-center`}>
                      <Icon size={24} className={option.iconColor} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-bold text-[#3D2B1F]">{option.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#7B3F00] bg-[#7B3F00]'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#7B3F00]/10 to-[#8B4513]/10 rounded-2xl p-4 border border-[#7B3F00]/20"
        >
          <h4 className="text-sm font-bold text-[#7B3F00] mb-2">☕ 主题预览</h4>
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-xl p-3 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#7B3F00] mb-2 mx-auto" />
              <div className="h-2 bg-gray-100 rounded mb-1" />
              <div className="h-2 bg-gray-100 rounded w-2/3" />
            </div>
            <div className="flex-1 bg-gray-900 rounded-xl p-3 border border-gray-700">
              <div className="w-8 h-8 rounded-full bg-indigo-400 mb-2 mx-auto" />
              <div className="h-2 bg-gray-700 rounded mb-1" />
              <div className="h-2 bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThemeSettings;
