import { TastingNote, BrewingRecord, User } from '../types';

export interface CloudData {
  userProfile: User | null;
  tastingNotes: TastingNote[];
  brewingRecords: BrewingRecord[];
  lastSyncTimestamp: number;
}

const DATA_KEY = 'coffee_atlas_data';

export const localStorageService = {
  // 保存数据到本地存储
  async saveToLocal(data: CloudData): Promise<void> {
    const dataToSave: CloudData = {
      ...data,
      lastSyncTimestamp: Date.now()
    };
    localStorage.setItem(DATA_KEY, JSON.stringify(dataToSave));
  },

  // 从本地存储加载数据
  async loadFromLocal(): Promise<CloudData | null> {
    try {
      const stored = localStorage.getItem(DATA_KEY);
      if (stored) {
        return JSON.parse(stored) as CloudData;
      }
      return null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  },

  // 导出数据为 JSON 文件 (可保存到 iCloud Drive)
  exportData(data: CloudData): void {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `coffee_atlas_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 从 JSON 文件导入数据
  async importData(file: File): Promise<CloudData | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as CloudData;
          // 验证数据格式
          if (!data || typeof data.lastSyncTimestamp !== 'number') {
            reject(new Error('Invalid data format'));
            return;
          }
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse JSON'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // 获取存储使用情况
  getStorageUsage(): { used: number; quota: number; percentage: number } {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length * 2; // UTF-16 characters = 2 bytes each
      }
    }
    // 浏览器通常提供 5MB 的 localStorage 配额
    const quota = 5 * 1024 * 1024;
    return {
      used,
      quota,
      percentage: Math.round((used / quota) * 100)
    };
  },

  // 清除本地数据
  clearLocalData(): void {
    localStorage.removeItem(DATA_KEY);
  }
};
