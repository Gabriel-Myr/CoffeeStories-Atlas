import { localStorageService, CloudData } from './localStorageService';
import { supabase } from '../supabaseClient';
import { Roaster, CoffeeBean, TastingNote } from '../types';

// 私有数据操作 (本地存储)
export const cloudDataService = {
  // 获取私有数据
  async getPrivateData(): Promise<CloudData | null> {
    return localStorageService.loadFromLocal();
  },

  // 保存私有数据
  async savePrivateData(data: CloudData): Promise<void> {
    await localStorageService.saveToLocal(data);
  },

  // 导出数据到文件
  exportData(data: CloudData): void {
    localStorageService.exportData(data);
  },

  // 从文件导入数据
  async importData(file: File): Promise<CloudData | null> {
    return localStorageService.importData(file);
  },

  // 获取存储使用情况
  getStorageUsage() {
    return localStorageService.getStorageUsage();
  },

  // 清除本地数据
  clearLocalData(): void {
    localStorageService.clearLocalData();
  }
};

// 共享数据操作 (Supabase)
export const sharedDataService = {
  // 获取烘焙商列表
  async getRoasters(): Promise<Roaster[]> {
    const { data, error } = await supabase
      .from('roasters')
      .select('*');
    if (error) {
      console.error('Failed to fetch roasters:', error);
      return [];
    }
    return data || [];
  },

  // 获取咖啡豆列表
  async getCoffeeBeans(): Promise<CoffeeBean[]> {
    const { data, error } = await supabase
      .from('coffee_beans')
      .select('*');
    if (error) {
      console.error('Failed to fetch coffee beans:', error);
      return [];
    }
    return data || [];
  },

  // 获取社区品鉴笔记
  async getCommunityNotes(): Promise<TastingNote[]> {
    const { data, error } = await supabase
      .from('tasting_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      console.error('Failed to fetch community notes:', error);
      return [];
    }
    return data || [];
  }
};
