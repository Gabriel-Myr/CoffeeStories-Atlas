
import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigation } from '../App';
import { useUser } from '../contexts/UserContext';
import { AppTab } from '../types';
import { addCoffeeBean } from '../services/coffeeBeanService';
import { generateDescription } from '../services/aiService';
import { Autocomplete } from '../components/Autocomplete';
import { ORIGIN_OPTIONS, VARIETY_OPTIONS, PROCESS_OPTIONS, HARVEST_YEAR_OPTIONS, MOCK_ROASTERS } from '../constants';
import { supabase } from '../supabaseClient';

const AddBean: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { addTastingNote } = useUser();
  const [activeTab, setActiveTab] = useState<'bean' | 'brewing'>('bean');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brewingFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    roaster: '',
    origin: '',
    region: '',
    lot: '',
    variety: '',
    process: '',
    harvestYear: '',
    price: '',
    platform: '',
    description: ''
  });

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // 烘焙商模糊搜索选项
  const [roasterOptions, setRoasterOptions] = useState<string[]>([]);

  useEffect(() => {
    async function loadRoasterOptions() {
      try {
        // 直接从数据库获取roaster字段
        const { data, error } = await supabase
          .from('coffee_beans')
          .select('roaster')
          .not('roaster', 'is', null);

        if (error) {
          console.error('查询烘焙商失败:', error);
          setRoasterOptions(MOCK_ROASTERS.map(r => r.name));
          return;
        }

        const existingRoasters = [...new Set(data?.map(b => b.roaster).filter(Boolean) || [])];
        const mockRoasterNames = MOCK_ROASTERS.map(r => r.name);
        setRoasterOptions([...new Set([...mockRoasterNames, ...existingRoasters])]);
      } catch (error) {
        console.error('加载烘焙商选项失败:', error);
        setRoasterOptions(MOCK_ROASTERS.map(r => r.name));
      }
    }
    loadRoasterOptions();
  }, []);

  // 冲煮数据表单
  const [brewingData, setBrewingData] = useState({
    beanName: '',
    grinder: '',
    grindSize: '',
    dripper: '',
    waterTemp: '',
    coffeeAmount: '',
    ratio: '',
    score: 7.5,
    notes: ''
  });
  const [brewingImagePreview, setBrewingImagePreview] = useState<string | null>(null);
  const [brewingSaved, setBrewingSaved] = useState(false);
  const [brewingLoading, setBrewingLoading] = useState(false);

  const isFormValid = formData.name && formData.roaster && formData.origin;
  const isBrewingFormValid = brewingData.beanName && brewingData.grinder && brewingData.dripper && brewingData.waterTemp && brewingData.coffeeAmount && brewingData.ratio;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.roaster || !formData.origin) {
      alert('请先填写咖啡豆名称、烘焙商和产地');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = await generateDescription('gemini', {
        name: formData.name,
        roaster: formData.roaster,
        origin: formData.origin,
        region: formData.region,
        variety: formData.variety,
        process: formData.process,
        harvestYear: formData.harvestYear,
      });
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      console.error('生成描述失败:', error);
      alert('生成描述失败，请重试');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (loading || !isFormValid) return;

    setLoading(true);
    try {
      // 如果有 AI 生成的描述则使用，否则使用默认格式
      const description = formData.description || `${formData.roaster} | ${formData.region} | ${formData.variety}`;

      const beanData = {
        name: formData.name,
        origin: formData.origin,
        roastLevel: 'Medium' as const,
        process: formData.process || 'Washed',
        image: imagePreview || 'https://picsum.photos/seed/coffee/400/400',
        description
      };

      const result = await addCoffeeBean(beanData);

      if (result) {
        setIsSaved(true);
        setTimeout(() => {
          navigateTo(AppTab.HOME);
        }, 1200);
      } else {
        alert('提交失败，请重试');
      }
    } catch (err) {
      console.error(err);
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { label: '豆子名称 *', id: 'name', type: 'text', placeholder: '请输入咖啡豆名称' },
    { label: '烘焙商 *', id: 'roaster', type: 'autocomplete', options: roasterOptions, placeholder: '请输入烘焙商名称' },
    { label: '产地 *', id: 'origin', type: 'autocomplete', options: ORIGIN_OPTIONS, placeholder: '请输入产地国家' },
    { label: '产区', id: 'region', type: 'text', placeholder: '请输入具体产区' },
    { label: '地块', id: 'lot', type: 'text', placeholder: '请输入庄园/地块名称' },
    { label: '豆种', id: 'variety', type: 'autocomplete', options: VARIETY_OPTIONS, placeholder: '如:瑰夏,卡杜拉,铁皮卡' },
    { label: '处理法', id: 'process', type: 'select', options: PROCESS_OPTIONS },
    { label: '采收年份', id: 'harvestYear', type: 'select', options: HARVEST_YEAR_OPTIONS },
    { label: '价格 (每克)', id: 'price', type: 'number', placeholder: '¥ 0.00 /g' },
    { label: '购买平台', id: 'platform', type: 'text', placeholder: '请输入购买平台名称' },
  ];

  // AI 生成描述组件
  const AI_GENERATE_PROMPT = () => (
    <motion.div variants={itemVariants} className="pt-4 pb-2">
      <label className="block text-sm font-bold mb-2 text-[#3D2B1F]">AI 描述生成</label>

      {/* 生成按钮 */}
      <motion.button
        onClick={handleGenerateDescription}
        disabled={isGeneratingDescription || !formData.name || !formData.roaster || !formData.origin}
        whileTap={!isGeneratingDescription ? { scale: 0.98 } : {}}
        className={`w-full py-3 rounded-[16px] text-sm font-bold transition-all flex items-center justify-center gap-2 ${
          isGeneratingDescription || !formData.name || !formData.roaster || !formData.origin
            ? 'bg-gray-200 text-gray-400'
            : 'bg-[#F5E6D3] text-[#7B3F00] hover:bg-[#7B3F00] hover:text-white'
        }`}
      >
        {isGeneratingDescription ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>生成中...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>使用 Gemini 生成描述</span>
          </>
        )}
      </motion.button>

      {/* 生成的描述展示 */}
      {formData.description && (
        <div className="mt-3 p-4 bg-[#FDF8F3] rounded-[16px] border border-[#7B3F00]/20">
          <p className="text-sm text-[#3D2B1F] leading-relaxed">{formData.description}</p>
          <button
            onClick={() => setFormData(prev => ({ ...prev, description: '' }))}
            className="text-xs text-[#7B3F00] mt-2 underline"
          >
            清除描述
          </button>
        </div>
      )}
    </motion.div>
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <div className="sticky top-0 bg-[#FAF8F5]/80 ios-blur z-50 px-5 h-16 flex items-center justify-between border-b border-[#E8E2DA]/30">
        <button
          onClick={() => navigateTo(AppTab.HOME)}
          className="flex items-center gap-2 text-[#3D2B1F] font-bold active:scale-95 transition-transform"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">添加新的咖啡豆</span>
        </button>

        <div className="flex bg-[#EFEFEF] p-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => setActiveTab('bean')}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'bean' ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#7B3F00]' : 'text-[#3D2B1F]/55'
            }`}
          >
            豆子信息
          </button>
          <button
            onClick={() => setActiveTab('brewing')}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'brewing' ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] text-[#7B3F00]' : 'text-[#3D2B1F]/55'
            }`}
          >
            冲煮数据
          </button>
        </div>
      </div>

      <motion.div
        key={activeTab}
        className="px-5 pt-6 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 豆子信息 Tab */}
        {activeTab === 'bean' && (
          <>
            {formFields.map((field) => (
          <motion.div key={field.id} variants={itemVariants} className="group">
            <label className={`block text-sm font-bold mb-2 transition-colors ${formData[field.id as keyof typeof formData] ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
              {field.label}
            </label>

            {field.type === 'select' ? (
              <div className="relative">
                <select
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all appearance-none text-sm font-medium ${
                    formData[field.id as keyof typeof formData] ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                  } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10`}
                >
                  <option value="">请选择{field.label}</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">▼</div>
              </div>
            ) : field.type === 'autocomplete' ? (
              <Autocomplete
                value={formData[field.id as keyof typeof formData]}
                onChange={(value) => handleInputChange(field.id, value)}
                options={field.options || []}
                placeholder={field.placeholder}
                label=""
                hasValue={!!formData[field.id as keyof typeof formData]}
              />
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id as keyof typeof formData]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  formData[field.id as keyof typeof formData] ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            )}
          </motion.div>
        ))}

        {/* AI 生成描述 */}
        {AI_GENERATE_PROMPT()}

        <motion.div variants={itemVariants} className="pt-2">
          <label className="block text-sm font-bold mb-2 text-[#3D2B1F]">豆子照片</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[4/3] rounded-[30px] border-2 border-dashed border-[#E8E2DA] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group"
          >
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center p-6">
                <span className="text-4xl block mb-2 opacity-40">📷</span>
                <p className="text-xs text-gray-400 font-medium">点击上传图片</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-8">
          <motion.button
            onClick={handleSave}
            disabled={!isFormValid || isSaved || loading}
            animate={{
              backgroundColor: isSaved ? "#7D9A78" : "#7B3F00",
              opacity: (!isFormValid || loading) ? 0.5 : 1
            }}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className="w-full text-white py-5 rounded-[24px] text-base font-bold shadow-xl shadow-[#7B3F00]/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin text-xl">⏳</span>
            ) : isSaved ? (
              <>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
                <span>提交成功</span>
              </>
            ) : (
              '保存咖啡豆'
            )}
          </motion.button>
          {!isFormValid && (
            <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
              请填写所有带 * 的必填项
            </p>
          )}
        </motion.div>
        </>
        )}

        {/* 冲煮数据 Tab */}
        {activeTab === 'brewing' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 冲煮数据表单 */}
            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold mb-2 transition-colors ${brewingData.beanName ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
                豆子名称 *
              </label>
              <input
                type="text"
                placeholder="例如：埃塞俄比亚 耶加雪菲"
                value={brewingData.beanName}
                onChange={(e) => setBrewingData(prev => ({ ...prev, beanName: e.target.value }))}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  brewingData.beanName ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold mb-2 transition-colors ${brewingData.grinder ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
                磨豆机 *
              </label>
              <input
                type="text"
                placeholder="例如：Comandante C40"
                value={brewingData.grinder}
                onChange={(e) => setBrewingData(prev => ({ ...prev, grinder: e.target.value }))}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  brewingData.grinder ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold mb-2 transition-colors ${brewingData.grindSize ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
                研磨刻度
              </label>
              <input
                type="text"
                placeholder="例如：25格"
                value={brewingData.grindSize}
                onChange={(e) => setBrewingData(prev => ({ ...prev, grindSize: e.target.value }))}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  brewingData.grindSize ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className="block text-sm font-bold mb-2 text-[#3D2B1F]">滤杯 *</label>
              <div className="relative">
                <select
                  value={brewingData.dripper}
                  onChange={(e) => setBrewingData(prev => ({ ...prev, dripper: e.target.value }))}
                  className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all appearance-none text-sm font-medium ${
                    brewingData.dripper ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                  } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10`}
                >
                  <option value="">选择滤杯</option>
                  <option value="V60">V60</option>
                  <option value="Orea">Orea</option>
                  <option value="Solo">Solo</option>
                  <option value="April">April</option>
                  <option value="Kalita Wave">Kalita Wave</option>
                  <option value="Chemex">Chemex</option>
                  <option value="法压壶">法压壶</option>
                  <option value="爱乐压">爱乐压</option>
                  <option value="聪明杯">聪明杯</option>
                  <option value="其它">其它</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">▼</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold mb-2 transition-colors ${brewingData.waterTemp ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
                水温 *
              </label>
              <input
                type="text"
                placeholder="例如：93°C"
                value={brewingData.waterTemp}
                onChange={(e) => setBrewingData(prev => ({ ...prev, waterTemp: e.target.value }))}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  brewingData.waterTemp ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold mb-2 transition-colors ${brewingData.coffeeAmount ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
                粉量 *
              </label>
              <input
                type="text"
                placeholder="例如：15g"
                value={brewingData.coffeeAmount}
                onChange={(e) => setBrewingData(prev => ({ ...prev, coffeeAmount: e.target.value }))}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  brewingData.coffeeAmount ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold mb-2 transition-colors ${brewingData.ratio ? 'text-[#7B3F00]' : 'text-[#3D2B1F]'}`}>
                水粉比 *
              </label>
              <input
                type="text"
                placeholder="例如：1:15"
                value={brewingData.ratio}
                onChange={(e) => setBrewingData(prev => ({ ...prev, ratio: e.target.value }))}
                className={`w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
                  brewingData.ratio ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
                } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`}
              />
            </motion.div>

            {/* 评分 */}
            <motion.div variants={itemVariants} className="group">
              <label className="block text-sm font-bold mb-2 text-[#3D2B1F]">评分: {brewingData.score.toFixed(2)} 分</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.25"
                value={brewingData.score}
                onChange={(e) => setBrewingData(prev => ({ ...prev, score: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-[#E8E2DA] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>2.5</span>
                <span>5</span>
                <span>7.5</span>
                <span>10</span>
              </div>
            </motion.div>

            {/* 风味描述 */}
            <motion.div variants={itemVariants} className="group">
              <label className="block text-sm font-bold mb-2 text-[#3D2B1F]">风味描述</label>
              <textarea
                placeholder="描述这款咖啡的风味特点..."
                value={brewingData.notes}
                onChange={(e) => setBrewingData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium text-[#3D2B1F] focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A] resize-none"
              />
            </motion.div>

            {/* 照片上传 */}
            <motion.div variants={itemVariants} className="pt-2">
              <label className="block text-sm font-bold mb-2 text-[#3D2B1F]">咖啡照片</label>
              <div
                onClick={() => brewingFileInputRef.current?.click()}
                className="w-full aspect-[4/3] rounded-[30px] border-2 border-dashed border-[#E8E2DA] bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group"
              >
                {brewingImagePreview ? (
                  <img src={brewingImagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-6">
                    <span className="text-4xl block mb-2 opacity-40">📷</span>
                    <p className="text-xs text-gray-400 font-medium">点击上传图片</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={brewingFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBrewingImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* 保存按钮 */}
            <motion.div variants={itemVariants} className="pt-8">
              <motion.button
                onClick={async () => {
                  if (brewingLoading || !isBrewingFormValid) return;
                  setBrewingLoading(true);
                  try {
                    await addTastingNote({
                      beanName: brewingData.beanName,
                      grinder: brewingData.grinder,
                      grindSize: brewingData.grindSize,
                      dripper: brewingData.dripper,
                      waterTemp: brewingData.waterTemp,
                      coffeeAmount: brewingData.coffeeAmount,
                      ratio: brewingData.ratio,
                      score: brewingData.score,
                      notes: brewingData.notes,
                      imageUrl: brewingImagePreview || `https://picsum.photos/seed/${Date.now()}/200/200`
                    });
                    setBrewingSaved(true);
                    setBrewingData({
                      beanName: '',
                      grinder: '',
                      grindSize: '',
                      dripper: '',
                      waterTemp: '',
                      coffeeAmount: '',
                      ratio: '',
                      score: 7.5,
                      notes: ''
                    });
                    setBrewingImagePreview(null);
                    setTimeout(() => setBrewingSaved(false), 1500);
                  } catch (err) {
                    console.error(err);
                    alert('提交失败，请重试');
                  } finally {
                    setBrewingLoading(false);
                  }
                }}
                disabled={!isBrewingFormValid || brewingSaved || brewingLoading}
                animate={{
                  backgroundColor: brewingSaved ? "#7D9A78" : "#7B3F00",
                  opacity: (!isBrewingFormValid || brewingLoading) ? 0.5 : 1
                }}
                whileTap={isBrewingFormValid ? { scale: 0.98 } : {}}
                className="w-full text-white py-5 rounded-[24px] text-base font-bold shadow-xl shadow-[#7B3F00]/20 transition-all flex items-center justify-center gap-2"
              >
                {brewingLoading ? (
                  <span className="animate-spin text-xl">⏳</span>
                ) : brewingSaved ? (
                  <>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
                    <span>提交成功</span>
                  </>
                ) : (
                  '保存冲煮记录'
                )}
              </motion.button>
              {!isBrewingFormValid && (
                <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                  请填写所有带 * 的必填项
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AddBean;
