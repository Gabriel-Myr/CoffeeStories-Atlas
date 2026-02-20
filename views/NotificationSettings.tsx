import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Star, Heart, Mail } from 'lucide-react';

interface NotificationSettingsProps {
  onBack: () => void;
}

interface NotificationItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'rating',
      icon: Star,
      title: '评分推送',
      description: '当您对咖啡豆进行评分时接收通知',
      enabled: true
    },
    {
      id: 'favorite',
      icon: Heart,
      title: '收藏提醒',
      description: '您收藏的咖啡豆有新动态时通知',
      enabled: true
    },
    {
      id: 'marketing',
      icon: Mail,
      title: '推送通知',
      description: '接收新咖啡豆、活动优惠等信息',
      enabled: false
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    const updated = notifications.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
  };

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
          <h1 className="text-xl font-bold text-[#4B3428]">通知设置</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Bell size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#3D2B1F]">通知管理</h3>
                <p className="text-xs text-gray-500">控制您想接收的通知类型</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {notifications.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 flex items-center justify-between active:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.enabled ? 'bg-[#7B3F00]/10' : 'bg-gray-100'
                    }`}>
                      <Icon size={20} className={item.enabled ? 'text-[#7B3F00]' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#3D2B1F]">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => toggleNotification(item.id)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      item.enabled ? 'bg-[#7B3F00]' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ left: item.enabled ? '26px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-2xl p-4 border border-blue-100"
        >
          <h4 className="text-sm font-bold text-blue-800 mb-2">💡 提示</h4>
          <p className="text-xs text-blue-700">
            关闭所有通知后将不再收到任何推送提醒。某些功能性通知（如数据同步状态）无法关闭。
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationSettings;
