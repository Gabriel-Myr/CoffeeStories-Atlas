
import React from 'react';
import { CoffeeBean, SocialPost, Notification } from './types';

export const MOCK_BEANS: CoffeeBean[] = [
  {
    id: '1',
    name: 'Ethiopia Yirgacheffe G1',
    origin: 'Ethiopia',
    roastLevel: 'Light',
    process: 'Washed',
    rating: 4.8,
    image: 'https://picsum.photos/seed/coffee1/400/400',
    description: 'Notes of jasmine, lemon, and peach.'
  },
  {
    id: '2',
    name: 'Colombia Geisha Spirit',
    origin: 'Colombia',
    roastLevel: 'Light',
    process: 'Natural',
    rating: 4.9,
    image: 'https://picsum.photos/seed/coffee2/400/400',
    description: 'Complex floral aroma with bergamot finish.'
  },
  {
    id: '3',
    name: 'Brazil Santos NY2',
    origin: 'Brazil',
    roastLevel: 'Medium',
    process: 'Pulped Natural',
    rating: 4.2,
    image: 'https://picsum.photos/seed/coffee3/400/400',
    description: 'Classic chocolatey and nutty flavor.'
  }
];

export const MOCK_POSTS: SocialPost[] = [
  {
    id: 'p1',
    user: { name: 'LatteArtMaster', avatar: 'https://i.pravatar.cc/150?u=1' },
    content: 'Finally perfected my swan pour today at Metal Hands! The beans were amazing.',
    image: 'https://picsum.photos/seed/post1/600/400',
    likes: 245,
    comments: 12,
    timestamp: '2h ago'
  },
  {
    id: 'p2',
    user: { name: 'EspressoExplorer', avatar: 'https://i.pravatar.cc/150?u=2' },
    content: 'The new Ethiopia light roast from Grid Coffee is a game changer. Super juicy!',
    likes: 89,
    comments: 5,
    timestamp: '5h ago'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Like', message: 'CoffeeLover liked your post.', time: '10m ago', unread: true, type: 'like' },
  { id: 'n2', title: 'Comment', message: 'Nice review! Where can I buy these beans?', time: '1h ago', unread: true, type: 'comment' },
  { id: 'n3', title: 'System', message: 'Welcome to Coffee Atlas! Start exploring.', time: '1d ago', unread: false, type: 'system' }
];
