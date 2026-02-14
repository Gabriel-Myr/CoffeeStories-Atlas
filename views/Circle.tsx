
import React from 'react';
import Layout from '../components/Layout';
import { MOCK_POSTS } from '../constants.tsx';

const Circle: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#3d2b1f]">咖啡圈</h1>
        <button className="bg-[#7B3F00] text-white p-2.5 rounded-full shadow-lg shadow-[#7B3F00]/30 transition-transform active:scale-90">
          <span className="text-xl">✍️</span>
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="group">
            <div className="flex items-center gap-3 mb-3">
              <img src={post.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              <div>
                <p className="font-bold text-sm text-[#3d2b1f]">{post.user.name}</p>
                <p className="text-[10px] text-gray-400">{post.timestamp}</p>
              </div>
              <button className="ml-auto text-gray-400 text-lg">•••</button>
            </div>
            
            <p className="text-sm text-[#4a3a2d] leading-relaxed mb-4">{post.content}</p>
            
            {post.image && (
              <div className="rounded-3xl overflow-hidden mb-4 shadow-sm">
                <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="flex gap-6 items-center">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                <span className="text-lg">❤️</span>
                <span className="text-xs font-semibold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                <span className="text-lg">💬</span>
                <span className="text-xs font-semibold">{post.comments}</span>
              </button>
              <button className="ml-auto flex items-center gap-1.5 text-gray-500">
                <span className="text-lg">✈️</span>
              </button>
            </div>
            <div className="h-[1px] bg-gray-50 mt-8"></div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Circle;
