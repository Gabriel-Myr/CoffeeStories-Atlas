import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, User, TastingNote, BrewingRecord } from '../types';
import { cloudDataService } from '../services/cloudDataService';
import { CloudData } from '../services/localStorageService';

// 模拟用户数据
const MOCK_USER: User = {
  id: 'user_1',
  nickname: '咖啡探索者',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coffee',
  createdAt: '2024-01-01'
};

// 模拟品鉴笔记数据
const MOCK_TASTING_NOTES: TastingNote[] = [
  {
    id: 'note_1',
    beanName: '埃塞俄比亚 耶加雪菲',
    grinder: 'Comandante C40',
    grindSize: '25格',
    dripper: 'V60',
    waterTemp: '93°C',
    coffeeAmount: '15g',
    ratio: '1:15',
    score: 8.5,
    notes: '茉莉花香明显，柠檬酸质清新，整体干净度很高',
    date: '2024-05-20',
    imageUrl: 'https://picsum.photos/seed/coffee_n1/200/200'
  },
  {
    id: 'note_2',
    beanName: '哥伦比亚 慧兰',
    grinder: '1Zpresso JX-Pro',
    grindSize: '3.5格',
    dripper: 'Orea',
    waterTemp: '92°C',
    coffeeAmount: '18g',
    ratio: '1:16',
    score: 9.0,
    notes: '巧克力风味突出，坚果尾韵，body 扎实',
    date: '2024-05-18',
    imageUrl: 'https://picsum.photos/seed/coffee_n2/200/200'
  },
  {
    id: 'note_3',
    beanName: '巴拿马 瑰夏',
    grinder: 'Timemore C3',
    grindSize: '15格',
    dripper: 'Solo',
    waterTemp: '94°C',
    coffeeAmount: '20g',
    ratio: '1:14',
    score: 7.75,
    notes: '花香爆炸，蜜桃甜感十足，典型的瑰夏风味',
    date: '2024-05-15',
    imageUrl: 'https://picsum.photos/seed/coffee_n3/200/200'
  }
];

interface UserContextType {
  userState: UserState;
  tastingNotes: TastingNote[];
  brewingRecords: BrewingRecord[];
  isCloudSynced: boolean;
  lastSyncTime: number | null;
  isSyncing: boolean;
  storageUsage: { used: number; quota: number; percentage: number };
  login: () => void;
  logout: () => void;
  addTastingNote: (note: Omit<TastingNote, 'id' | 'date'>) => void;
  deleteTastingNote: (id: string) => void;
  addBrewingRecord: (record: Omit<BrewingRecord, 'id' | 'date'>) => void;
  syncToCloud: () => Promise<void>;
  exportData: () => void;
  importData: (file: File) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: true,
    user: MOCK_USER,
    stats: {
      checkinCount: 42,
      originCount: 12,
      ratingCount: 156
    }
  });

  const [tastingNotes, setTastingNotes] = useState<TastingNote[]>(MOCK_TASTING_NOTES);
  const [brewingRecords, setBrewingRecords] = useState<BrewingRecord[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, quota: 5 * 1024 * 1024, percentage: 0 });

  const login = () => {
    setUserState({
      isLoggedIn: true,
      user: MOCK_USER,
      stats: {
        checkinCount: 42,
        originCount: 12,
        ratingCount: 156
      }
    });
  };

  const logout = () => {
    setUserState({
      isLoggedIn: false,
      user: null,
      stats: {
        checkinCount: 0,
        originCount: 0,
        ratingCount: 0
      }
    });
  };

  const addTastingNote = (note: Omit<TastingNote, 'id' | 'date'>) => {
    const newNote: TastingNote = {
      ...note,
      id: `note_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setTastingNotes(prev => [newNote, ...prev]);
  };

  const deleteTastingNote = (id: string) => {
    setTastingNotes(prev => prev.filter(note => note.id !== id));
  };

  const addBrewingRecord = (record: Omit<BrewingRecord, 'id' | 'date'>) => {
    const newRecord: BrewingRecord = {
      ...record,
      id: `brew_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setBrewingRecords(prev => [newRecord, ...prev]);
  };

  // 同步数据到本地存储
  const syncToCloud = async () => {
    setIsSyncing(true);
    try {
      const cloudData: CloudData = {
        userProfile: userState.user,
        tastingNotes,
        brewingRecords,
        lastSyncTimestamp: Date.now()
      };
      await cloudDataService.savePrivateData(cloudData);
      setLastSyncTime(Date.now());
      setIsCloudSynced(true);
      setStorageUsage(cloudDataService.getStorageUsage());
    } catch (error) {
      console.error('Failed to sync to cloud:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // 导出数据到文件
  const exportData = () => {
    const cloudData: CloudData = {
      userProfile: userState.user,
      tastingNotes,
      brewingRecords,
      lastSyncTimestamp: Date.now()
    };
    cloudDataService.exportData(cloudData);
  };

  // 从文件导入数据
  const importData = async (file: File): Promise<boolean> => {
    try {
      const data = await cloudDataService.importData(file);
      if (data) {
        if (data.userProfile) {
          setUserState(prev => ({
            ...prev,
            isLoggedIn: true,
            user: data.userProfile
          }));
        }
        if (data.tastingNotes?.length > 0) {
          setTastingNotes(data.tastingNotes);
        }
        if (data.brewingRecords?.length > 0) {
          setBrewingRecords(data.brewingRecords);
        }
        setLastSyncTime(data.lastSyncTimestamp);
        setIsCloudSynced(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  // 初始化时加载本地数据
  useEffect(() => {
    const loadCloudData = async () => {
      try {
        const cloudData = await cloudDataService.getPrivateData();
        if (cloudData) {
          if (cloudData.userProfile) {
            setUserState(prev => ({
              ...prev,
              isLoggedIn: true,
              user: cloudData.userProfile
            }));
          }
          if (cloudData.tastingNotes?.length > 0) {
            setTastingNotes(cloudData.tastingNotes);
          }
          if (cloudData.brewingRecords?.length > 0) {
            setBrewingRecords(cloudData.brewingRecords);
          }
          setLastSyncTime(cloudData.lastSyncTimestamp);
          setIsCloudSynced(true);
        }
        setStorageUsage(cloudDataService.getStorageUsage());
      } catch (error) {
        console.error('Failed to load cloud data:', error);
      }
    };
    loadCloudData();
  }, []);

  // 数据变化时自动同步
  useEffect(() => {
    if (isCloudSynced && (tastingNotes.length > 0 || brewingRecords.length > 0)) {
      syncToCloud();
    }
  }, [tastingNotes, brewingRecords]);

  return (
    <UserContext.Provider
      value={{
        userState,
        tastingNotes,
        brewingRecords,
        isCloudSynced,
        lastSyncTime,
        isSyncing,
        storageUsage,
        login,
        logout,
        addTastingNote,
        deleteTastingNote,
        addBrewingRecord,
        syncToCloud,
        exportData,
        importData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
