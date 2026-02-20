import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../App';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { goToDataSync, goToThemeSettings, goToNotificationSettings, goToOtherSettings } = useNavigation();

  const menuItems = [
    {
      id: 'dataSync',
      icon: '🔄',
      title: '数据同步',
      description: '保存、导出、导入数据',
      color: 'bg-blue-50',
      action: goToDataSync
    },
    {
      id: 'theme',
      icon: '🎨',
      title: '主题设置',
      description: '深色/浅色模式切换',
      color: 'bg-purple-50',
      action: goToThemeSettings
    },
    {
      id: 'notification',
      icon: '🔔',
      title: '通知设置',
      description: '评分推送、收藏提醒',
      color: 'bg-orange-50',
      action: goToNotificationSettings
    },
    {
      id: 'other',
      icon: '⚙️',
      title: '其他设置',
      description: '清除缓存、账号绑定',
      color: 'bg-gray-50',
      action: goToOtherSettings
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
          <h1 className="text-xl font-bold text-[#4B3428]">设置</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={item.action}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 transition-colors"
          >
            <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-bold text-[#3D2B1F]">{item.title}</h3>
              <p className="text-xs text-[#3D2B1F]/50 font-medium mt-0.5">{item.description}</p>
            </div>
            <span className="text-gray-300 font-bold text-xl">›</span>
          </motion.button>
        ))}
      </div>

      <div className="p-4 mt-8">
        <p className="text-xs text-gray-400 text-center">Coffee Atlas v1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
