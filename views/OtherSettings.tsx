import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, LogOut, User, Info, ExternalLink } from 'lucide-react';

interface OtherSettingsProps {
  onBack: () => void;
}

const OtherSettings: React.FC<OtherSettingsProps> = ({ onBack }) => {
  const menuItems = [
    {
      id: 'account',
      icon: User,
      title: '账号绑定',
      description: '绑定邮箱或第三方账号',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
      action: () => alert('账号绑定功能开发中')
    },
    {
      id: 'clearCache',
      icon: Trash2,
      title: '清除缓存',
      description: '清理本地缓存数据',
      color: 'bg-red-50',
      iconColor: 'text-red-500',
      action: () => {
        if (confirm('确定要清除缓存吗？这不会删除您的数据。')) {
          localStorage.clear();
          alert('缓存已清除');
        }
      }
    },
    {
      id: 'logout',
      icon: LogOut,
      title: '退出登录',
      description: '当前未登录',
      color: 'bg-orange-50',
      iconColor: 'text-orange-500',
      action: () => alert('当前未登录，无需退出')
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
          <h1 className="text-xl font-bold text-[#4B3428]">其他设置</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={item.action}
                className="w-full p-4 flex items-center gap-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50"
              >
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={item.iconColor} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-bold text-[#3D2B1F]">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <ExternalLink size={16} className="text-gray-300" />
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4"
        >
          <div className="p-4 flex items-center gap-4">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center">
              <Info size={22} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#3D2B1F]">关于 Coffee Atlas</h4>
              <p className="text-xs text-gray-500 mt-0.5">版本 1.0.0</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                Coffee Atlas 是一个帮助咖啡爱好者发现和记录世界各地咖啡风味的移动端应用。
              </p>
              <p className="text-xs text-gray-400 mt-2">© 2024 Coffee Atlas. All rights reserved.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#7B3F00]/5 to-[#8B4513]/5 rounded-2xl p-4 border border-[#7B3F00]/10"
        >
          <h4 className="text-sm font-bold text-[#7B3F00] mb-2">☕ 感谢使用</h4>
          <p className="text-xs text-[#7B3F00]/70">
            如果您喜欢 Coffee Atlas，请分享给更多的咖啡爱好者。如果您有任何建议或反馈，欢迎联系我们。
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OtherSettings;
