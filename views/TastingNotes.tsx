import React, { useState, useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

interface TastingNotesProps {
  onBack: () => void;
}

type FilterType = 'all' | 'score9' | 'score7';

const LONG_PRESS_DURATION = 500;

const TastingNotes: React.FC<TastingNotesProps> = ({ onBack }) => {
  const { tastingNotes } = useUser();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredNotes = useMemo(() => {
    let notes = [...tastingNotes];

    // 按日期倒序
    notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 筛选
    if (selectedFilter === 'score9') {
      notes = notes.filter(note => note.score >= 9);
    } else if (selectedFilter === 'score7') {
      notes = notes.filter(note => note.score >= 7);
    }

    return notes;
  }, [tastingNotes, selectedFilter]);

  const handleLongPress = (noteId: string) => {
    setSelectedNote(noteId);
  };

  // 触摸开始（移动端长按）
  const handleTouchStart = (noteId: string) => {
    longPressTimerRef.current = setTimeout(() => {
      handleLongPress(noteId);
    }, LONG_PRESS_DURATION);
  };

  // 触摸结束/取消时清除定时器
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // 鼠标右键（电脑端）
  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    handleLongPress(noteId);
  };

  const handleShare = async (note: typeof tastingNotes[0]) => {
    const text = `☕ ${note.beanName}\n评分: ${note.score.toFixed(2)} 分\n冲煮: ${note.grinder} + ${note.dripper}\n水粉比: ${note.ratio}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '我的冲煮记录',
          text: text,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    }
    setSelectedNote(null);
  };

  const handleEdit = (noteId: string) => {
    console.log('编辑:', noteId);
    setSelectedNote(null);
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'score9', label: '9分以上' },
    { id: 'score7', label: '7分以上' },
  ];

  return (
    <Layout>
      <div className="pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#7B3F00] font-bold"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-[#3D2B1F]">全部冲煮记录</h1>
        </div>

        {/* Filter Tags */}
        <div className="flex gap-2 mb-6">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-[#7B3F00] text-white'
                  : 'bg-[#FDF8F3] text-[#3D2B1F]/70'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10 text-[#3D2B1F]/50 text-sm">
              暂无记录
            </div>
          ) : (
            filteredNotes.map(note => (
              <div key={note.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-white to-[#FDFBF9] rounded-2xl p-4 border border-[#EDE4DA] shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 touch-manipulation cursor-pointer"
                  onTouchStart={() => handleTouchStart(note.id)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  onContextMenu={(e) => handleContextMenu(e, note.id)}
                >
                  <img
                    src={note.imageUrl || 'https://picsum.photos/seed/coffee_default/200/200'}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-[#3D2B1F] truncate pr-2">{note.beanName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
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

                  {/* 操作按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNote(selectedNote === note.id ? null : note.id);
                    }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#F5EDE4] flex items-center justify-center text-[#7B3F00] text-xs"
                  >
                    ⋯
                  </motion.button>
                </motion.div>

                {/* 悬停菜单 - 改在卡片下方 */}
                <AnimatePresence>
                  {selectedNote === note.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', damping: 22, stiffness: 400 }}
                      className="absolute top-full left-0 right-0 mt-2 z-10"
                    >
                      <div className="bg-gradient-to-b from-white to-[#FDF8F3] rounded-2xl shadow-lg border border-[#E8DDD0] overflow-hidden">
                        <div className="flex">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(note.id);
                            }}
                            className="flex-1 py-3 text-center text-sm font-semibold text-[#5D4037] hover:bg-[#7B3F00]/5 flex items-center justify-center gap-2 border-r border-[#E8DDD0]/50"
                          >
                            ✏️ 编辑
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(note);
                            }}
                            className="flex-1 py-3 text-center text-sm font-semibold text-[#5D4037] hover:bg-[#7B3F00]/5 flex items-center justify-center gap-2"
                          >
                            📤 分享
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* 遮罩层 */}
        <AnimatePresence>
          {selectedNote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 z-0"
              onClick={() => setSelectedNote(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default TastingNotes;
