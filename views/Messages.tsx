
import React from 'react';
import Layout from '../components/Layout';
import { MOCK_NOTIFICATIONS } from '../constants.tsx';

const Messages: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-[#3d2b1f] mb-6">消息通知</h1>
      
      <div className="space-y-2">
        {MOCK_NOTIFICATIONS.map(notif => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-3xl flex gap-4 items-center transition-all ${
              notif.unread ? 'bg-[#FDF8F3]' : 'bg-white'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
              notif.type === 'like' ? 'bg-red-50 text-red-500' : 
              notif.type === 'comment' ? 'bg-blue-50 text-blue-500' : 
              'bg-amber-50 text-amber-500'
            }`}>
              {notif.type === 'like' ? '❤️' : notif.type === 'comment' ? '💬' : '🔔'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-0.5">
                <p className={`text-sm ${notif.unread ? 'font-bold' : 'font-medium'} text-[#3d2b1f]`}>
                  {notif.title}
                </p>
                <span className="text-[10px] text-gray-400">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{notif.message}</p>
            </div>
            {notif.unread && (
              <div className="w-2 h-2 bg-[#7B3F00] rounded-full shrink-0"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8">
        <div className="text-4xl mb-4 opacity-20">📭</div>
        <p className="text-sm text-gray-400">没有更多通知了</p>
      </div>
    </Layout>
  );
};

export default Messages;
