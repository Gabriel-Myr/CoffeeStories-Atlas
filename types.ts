
export enum AppTab {
  HOME = 'home',
  CIRCLE = 'circle',
  MESSAGES = 'messages',
  PROFILE = 'profile'
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
