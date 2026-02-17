import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserState, User, TastingNote, BrewingRecord } from '../types';

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
  login: () => void;
  logout: () => void;
  addTastingNote: (note: Omit<TastingNote, 'id' | 'date'>) => void;
  deleteTastingNote: (id: string) => void;
  addBrewingRecord: (record: Omit<BrewingRecord, 'id' | 'date'>) => void;
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

  return (
    <UserContext.Provider
      value={{
        userState,
        tastingNotes,
        brewingRecords,
        login,
        logout,
        addTastingNote,
        deleteTastingNote,
        addBrewingRecord
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
