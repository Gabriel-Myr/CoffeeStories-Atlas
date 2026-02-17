
export enum AppTab {
  HOME = 'home',
  PROFILE = 'profile',
}

export interface ActivityRecord {
  id: string;
  type: 'rating' | 'checkin' | 'wishlist';
  beanName: string;
  origin: string;
  process: string;
  roastLevel: string;
  score?: number;
  date: string;
  imageUrl?: string;
}

export interface CoffeeBean {
  id: string;
  name: string;
  origin: string;
  roastLevel: 'Light' | 'Medium' | 'Dark';
  process: string;
  rating: number;
  image: string;
  description: string;
  price?: number;
  roasterId?: string;
  isNew?: boolean;
  tags?: string[];
}

export interface SocialPost {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'like' | 'comment' | 'system';
}

// 烘焙商相关类型
export interface Roaster {
  id: string;
  name: string;
  logo?: string;
  location: string;
  description: string;
  foundedYear?: number;
  socialMedia?: string;
}

export interface RoasterBean {
  id: string;
  roasterId: string;
  name: string;
  origin: string;
  roastLevel: 'Light' | 'Medium' | 'Dark';
  process: string;
  rating: number;
  image: string;
  description: string;
  price: number;
  isNew?: boolean;
  newArrivalDate?: string;
  tags: string[];
  sales?: number;
}

// 用户相关类型
export interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
  createdAt: string;
}

// 用户状态
export interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  stats: {
    checkinCount: number;
    originCount: number;
    ratingCount: number;
  };
}

// 冲煮记录
export interface BrewingRecord {
  id: string;
  beanId?: string;
  beanName: string;
  origin?: string;
  process?: string;
  roastLevel?: string;
  brewMethod: string;
  grindSize: string;
  waterTemp: string;
  brewTime: string;
  ratio: string;
  equipment: string;
  score: number;
  notes: string;
  date: string;
  imageUrl?: string;
}

// 品鉴笔记（冲煮记录）
export interface TastingNote {
  id: string;
  // 咖啡豆信息
  beanName: string;        // 豆子名称
  // 冲煮参数
  grinder: string;       // 磨豆机
  grindSize: string;     // 研磨刻度
  dripper: string;       // 滤杯
  waterTemp: string;     // 水温
  coffeeAmount: string;  // 粉量 (克)
  ratio: string;         // 水粉比 (如 1:15)
  // 评分与描述
  score: number;         // 评分 (0-10, 步长0.25)
  notes: string;          // 风味描述
  date: string;
  imageUrl?: string;
}
