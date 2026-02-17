import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Roaster } from '../types';
import {
  fetchRoastersFromDatabase,
  deleteRoaster,
  updateRoasterInDatabase,
  parseRoasterFile,
  importRoastersToDatabase,
  exportTemplate,
  uploadLogo
} from '../services/roasterDbService';
import { MOCK_ROASTERS } from '../constants';

interface RoasterAdminProps {
  onBack: () => void;
}

const RoasterAdmin: React.FC<RoasterAdminProps> = ({ onBack }) => {
  const [roasters, setRoasters] = useState<Roaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoaster, setSelectedRoaster] = useState<Roaster | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState<Partial<Roaster>>({});

  useEffect(() => {
    loadRoasters();
  }, []);

  const loadRoasters = async () => {
    try {
      setLoading(true);
      const data = await fetchRoastersFromDatabase();
      if (data.length > 0) {
        setRoasters(data);
      } else {
        setRoasters(MOCK_ROASTERS);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load roasters:', err);
      setRoasters(MOCK_ROASTERS);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个烘焙商吗？此操作不可恢复。')) return;
    
    try {
      await deleteRoaster(id);
      setRoasters(prev => prev.filter(r => r.id !== id));
      setSelectedRoaster(null);
    } catch (err) {
      alert('删除失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  const handleEdit = (roaster: Roaster) => {
    setEditForm(roaster);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedRoaster || !editForm.name) {
      alert('请填写烘焙商名称');
      return;
    }

    try {
      await updateRoasterInDatabase(selectedRoaster.id, editForm);
      setRoasters(prev => prev.map(r => 
        r.id === selectedRoaster.id ? { ...r, ...editForm } : r
      ));
      setIsEditing(false);
      setSelectedRoaster(prev => prev ? { ...prev, ...editForm } : null);
    } catch (err) {
      alert('保存失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const { roasters: parsedRoasters } = await parseRoasterFile(file);
      const result = await importRoastersToDatabase(parsedRoasters);
      setImportResult(result);
      
      if (result.success > 0) {
        await loadRoasters();
      }
    } catch (err) {
      alert('导入失败: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExportTemplate = () => {
    exportTemplate();
  };

  const filteredRoasters = roasters.filter(roaster =>
    roaster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roaster.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7B3F00] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-[#4B3428]">烘焙商管理</h1>
          <div className="w-10"></div>
        </div>

        <div className="relative mb-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="搜索烘焙商..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F5F5] rounded-full py-3 pl-11 pr-4 text-sm text-[#4B3428] placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 bg-[#7B3F00] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            <span>📥</span> 批量导入
          </button>
          <button
            onClick={handleExportTemplate}
            className="flex-1 py-2.5 bg-[#4B3428] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            <span>📄</span> 下载模板
          </button>
          <button
            onClick={loadRoasters}
            className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
          >
            🔄
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {importResult && (
        <div className="mx-4 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            导入完成: 成功 {importResult.success} 条，失败 {importResult.failed} 条
          </p>
          {importResult.errors.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-red-500 cursor-pointer">查看错误</summary>
              <ul className="mt-1 text-xs text-red-600">
                {importResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {isImporting && (
        <div className="mx-4 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">正在导入...</p>
        </div>
      )}

      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">共 {filteredRoasters.length} 家烘焙商</span>
        </div>

        <div className="space-y-3">
          {filteredRoasters.map((roaster) => (
            <motion.div
              key={roaster.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                selectedRoaster?.id === roaster.id
                  ? 'border-[#7B3F00]'
                  : 'border-transparent'
              }`}
              onClick={() => setSelectedRoaster(roaster)}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7B3F00] to-[#4B3428] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                  {roaster.logo ? (
                    <img src={roaster.logo} alt={roaster.name} className="w-full h-full object-cover" />
                  ) : (
                    roaster.name[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#4B3428] truncate">{roaster.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {roaster.location}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">{roaster.description.slice(0, 50)}...</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRoasters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">☕</div>
            <p className="text-gray-500">没有找到匹配的烘焙商</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedRoaster && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => { setSelectedRoaster(null); setIsEditing(false); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#4B3428]">
                    {isEditing ? '编辑烘焙商' : '烘焙商详情'}
                  </h2>
                  <button 
                    onClick={() => { setSelectedRoaster(null); setIsEditing(false); }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                      <div className="flex items-center gap-3">
                        {editForm.logo && (
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                            <img src={editForm.logo} alt="Logo预览" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                          选择图片
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const url = await uploadLogo(file);
                                  setEditForm(prev => ({ ...prev, logo: url }));
                                } catch (err) {
                                  alert('图片上传失败: ' + (err instanceof Error ? err.message : '未知错误'));
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">成立年份</label>
                      <input
                        type="number"
                        value={editForm.foundedYear || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, foundedYear: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">社媒账号</label>
                      <input
                        type="text"
                        value={editForm.socialMedia || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, socialMedia: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-[#7B3F00] text-white rounded-lg font-medium"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7B3F00] to-[#4B3428] flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 overflow-hidden">
                        {selectedRoaster.logo ? (
                          <img src={selectedRoaster.logo} alt={selectedRoaster.name} className="w-full h-full object-cover" />
                        ) : (
                          selectedRoaster.name[0]
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#4B3428]">{selectedRoaster.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">📍 {selectedRoaster.location}</p>
                        {selectedRoaster.foundedYear && (
                          <p className="text-xs text-gray-400">成立于 {selectedRoaster.foundedYear} 年</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-sm font-bold text-[#4B3428] mb-2">描述</h4>
                      <p className="text-sm text-gray-600">{selectedRoaster.description}</p>
                    </div>

                    {selectedRoaster.socialMedia && (
                      <div className="mb-5">
                        <h4 className="text-sm font-bold text-[#4B3428] mb-2">社媒账号</h4>
                        <p className="text-sm text-gray-600">📱 {selectedRoaster.socialMedia}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(selectedRoaster)}
                        className="flex-1 py-3 bg-[#4B3428] text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        ✏️ 编辑
                      </button>
                      <button
                        onClick={() => handleDelete(selectedRoaster.id)}
                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoasterAdmin;
