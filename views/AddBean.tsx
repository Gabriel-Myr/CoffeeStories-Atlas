
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useNavigation } from '../App';
import { AppTab } from '../types';
import { addCoffeeBean } from '../services/coffeeBeanService';

const AddBean: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    platform: ''
  });

  const isFormValid = formData.name && formData.roaster && formData.origin;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (!isFormValid || isLoading) return;
    
    setIsLoading(true);
    
    const beanData = {
      name: formData.name,
      origin: formData.origin,
      roastLevel: 'Medium' as const,
      process: formData.process || 'Washed',
      image: imagePreview || 'https://picsum.photos/seed/coffee/400/400',
      description: `${formData.roaster} | ${formData.region} | ${formData.variety}`
    };

    const result = await addCoffeeBean(beanData);
    
    setIsLoading(false);
    
    if (result) {
      setIsSaved(true);
      setTimeout(() => {
        navigateTo(AppTab.HOME);
      }, 1200);
    } else {
      alert('保存失败，请重试');
    }
  };

  const formFields = [
    { label: '豆子名称 *', id: 'name', type: 'text', placeholder: '请输入咖啡豆名称' },
    { label: '烘焙商 *', id: 'roaster', type: 'text', placeholder: '请输入烘焙商名称' },
    { label: '产地 *', id: 'origin', type: 'text', placeholder: '请输入产地国家' },
    { label: '产区', id: 'region', type: 'text', placeholder: '请输入具体产区' },
    { label: '地块', id: 'lot', type: 'text', placeholder: '请输入庄园/地块名称' },
    { label: '豆种', id: 'variety', type: 'text', placeholder: '如:瑰夏,卡杜拉,铁皮卡' },
    { label: '处理法', id: 'process', type: 'select', options: ['洗处理', '日晒处理', '蜜处理', '厌氧处理', '其它'] },
    { label: '采收年份', id: 'harvestYear', type: 'select', options: ['2023', '2024', '2025'] },
    { label: '价格 (每克)', id: 'price', type: 'number', placeholder: '¥ 0.00 /g' },
    { label: '购买平台', id: 'platform', type: 'text', placeholder: '请输入购买平台名称' },
  ];

  // Explicitly typed as Variants to fix type checking for ease strings
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  // Explicitly typed as Variants to fix type checking for ease strings
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-10">
      {/* Sticky Top Header */}
      <div className="sticky top-0 bg-[#FAF8F5]/80 ios-blur z-50 px-5 h-16 flex items-center justify-between border-b border-[#E8E2DA]/30">
        <button 
          onClick={() => navigateTo(AppTab.HOME)}
          className="flex items-center gap-2 text-[#3D2B1F] font-bold active:scale-95 transition-transform"
        >
          <span className="text-xl">←</span>
          <span className="text-sm">添加新的咖啡豆</span>
        </button>
        
        <motion.button
          onClick={handleSave}
          disabled={!isFormValid || isSaved || isLoading}
          animate={{
            backgroundColor: isSaved ? "#7D9A78" : (isFormValid ? "#7B3F00" : "#7B3F00"),
            opacity: !isFormValid ? 0.5 : 1
          }}
          whileTap={isFormValid ? { scale: 0.95 } : {}}
          className="text-white px-5 py-2 rounded-2xl text-sm font-bold shadow-md transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <span>保存中...</span>
          ) : isSaved ? (
            <>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
              <span>已保存</span>
            </>
          ) : '保存'}
        </motion.button>
      </div>

      <motion.div 
        className="px-5 pt-6 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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

        {/* Photo Upload */}
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
      </motion.div>
    </div>
  );
};

export default AddBean;
