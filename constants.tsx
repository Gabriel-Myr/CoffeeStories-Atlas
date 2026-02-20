import { CoffeeBean, Roaster } from './types';

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
  },
  {
    id: '4',
    name: 'Kenya AA Plus',
    origin: 'Kenya',
    roastLevel: 'Light',
    process: 'Washed',
    rating: 4.7,
    image: 'https://picsum.photos/seed/coffee4/400/400',
    description: 'Bold blackcurrant, grapefruit, and brown sugar notes.'
  },
  {
    id: '5',
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    roastLevel: 'Medium',
    process: 'Washed',
    rating: 4.5,
    image: 'https://picsum.photos/seed/coffee5/400/400',
    description: 'Rich cocoa, spice, and subtle fruit acidity.'
  },
  {
    id: '6',
    name: 'Costa Rica Tarrazu',
    origin: 'Costa Rica',
    roastLevel: 'Medium',
    process: 'Honey',
    rating: 4.6,
    image: 'https://picsum.photos/seed/coffee6/400/400',
    description: 'Honey sweetness with citrus and caramel finish.'
  },
  {
    id: '7',
    name: 'Indonesia Sumatra Mandheling',
    origin: 'Indonesia',
    roastLevel: 'Dark',
    process: 'Wet Hulled',
    rating: 4.3,
    image: 'https://picsum.photos/seed/coffee7/400/400',
    description: 'Earthy, herbal, with low acidity and full body.'
  },
  {
    id: '8',
    name: 'Panama Geisha Emerald',
    origin: 'Panama',
    roastLevel: 'Light',
    process: 'Natural',
    rating: 4.9,
    image: 'https://picsum.photos/seed/coffee8/400/400',
    description: 'Explosive jasmine, tropical fruit, and honey sweetness.'
  },
  {
    id: '9',
    name: 'Colombia Pink Bourbon',
    origin: 'Colombia',
    roastLevel: 'Light',
    process: 'Washed',
    rating: 4.8,
    image: 'https://picsum.photos/seed/coffee9/400/400',
    description: 'Delicate floral notes with citrus and caramel.'
  },
  {
    id: '10',
    name: 'Ethiopia Sidamo Natural',
    origin: 'Ethiopia',
    roastLevel: 'Medium',
    process: 'Natural',
    rating: 4.6,
    image: 'https://picsum.photos/seed/coffee10/400/400',
    description: 'Wine-like, fruity with blueberry and chocolate.'
  },
  {
    id: '11',
    name: 'Brazil Yellow Bourbon',
    origin: 'Brazil',
    roastLevel: 'Medium',
    process: 'Natural',
    rating: 4.4,
    image: 'https://picsum.photos/seed/coffee11/400/400',
    description: 'Smooth caramel, nuts, and mild chocolate.'
  },
  {
    id: '12',
    name: 'Rwanda Red Bourbon',
    origin: 'Rwanda',
    roastLevel: 'Light',
    process: 'Washed',
    rating: 4.7,
    image: 'https://picsum.photos/seed/coffee12/400/400',
    description: 'Bright red berries, citrus, and floral aroma.'
  },
  {
    id: '13',
    name: 'Peru SHB',
    origin: 'Peru',
    roastLevel: 'Medium',
    process: 'Washed',
    rating: 4.3,
    image: 'https://picsum.photos/seed/coffee13/400/400',
    description: 'Balanced body with chocolate and citrus notes.'
  },
  {
    id: '14',
    name: 'Honduras SHG',
    origin: 'Honduras',
    roastLevel: 'Medium',
    process: 'Washed',
    rating: 4.4,
    image: 'https://picsum.photos/seed/coffee14/400/400',
    description: 'Sweet caramel, apple, and nutty finish.'
  },
  {
    id: '15',
    name: 'Papua New Guinea',
    origin: 'Papua New Guinea',
    roastLevel: 'Medium',
    process: 'Washed',
    rating: 4.5,
    image: 'https://picsum.photos/seed/coffee15/400/400',
    description: 'Unique herbal notes with citrus and chocolate.'
  },
  {
    id: '16',
    name: 'Mexico Chiapas',
    origin: 'Mexico',
    roastLevel: 'Medium',
    process: 'Washed',
    rating: 4.2,
    image: 'https://picsum.photos/seed/coffee16/400/400',
    description: 'Nutty, chocolatey with subtle spice notes.'
  },
  {
    id: '17',
    name: 'Yemen Ismaili',
    origin: 'Yemen',
    roastLevel: 'Dark',
    process: 'Natural',
    rating: 4.8,
    image: 'https://picsum.photos/seed/coffee17/400/400',
    description: 'Complex dried fruit, wine, and exotic spices.'
  },
  {
    id: '18',
    name: 'Cuba Serrano',
    origin: 'Cuba',
    roastLevel: 'Medium',
    process: 'Natural',
    rating: 4.1,
    image: 'https://picsum.photos/seed/coffee18/400/400',
    description: 'Earthy, herbal with mild sweetness.'
  },
  {
    id: '19',
    name: 'Burundi AA',
    origin: 'Burundi',
    roastLevel: 'Light',
    process: 'Washed',
    rating: 4.6,
    image: 'https://picsum.photos/seed/coffee19/400/400',
    description: 'Bright acidity, red fruit, and floral notes.'
  },
  {
    id: '20',
    name: 'Uganda Robusta',
    origin: 'Uganda',
    roastLevel: 'Dark',
    process: 'Wet Hulled',
    rating: 3.8,
    image: 'https://picsum.photos/seed/coffee20/400/400',
    description: 'Strong, bitter with chocolate and earthy notes.'
  }
];

export const MOCK_ROASTERS: Roaster[] = [
  {
    id: 'r-0',
    name: '乔治队长 Captain George',
    logo: '/logos/r-0.jpg',
    location: '贵州贵阳',
    description: '淘宝精品咖啡豆店铺榜一，亚洲最大精品咖啡烘焙厂之一。主理人彭近洋是2025年WBrC世界咖啡冲煮大赛冠军，以黑猫拼配、荒诞故事等意式拼配闻名。',
    foundedYear: 2015,
    socialMedia: '@captaingeorge'
  },
  {
    id: 'r-1',
    name: '合豆',
    logo: '/logos/r-1.jpg',
    location: '湖南株洲',
    description: '湖南本土精品咖啡烘焙品牌，专注单品咖啡豆烘焙，为中南地区咖啡爱好者提供新鲜烘焙的精品咖啡豆。',
    foundedYear: 2018
  },
  {
    id: 'r-2',
    name: '启程拓殖 Terraform',
    logo: '/logos/r-2.jpg',
    location: '上海',
    description: '上海精品咖啡馆Black Sheep的烘焙品牌，2019年成立。与Gantea等知名品牌联名推出限定款，浅中深烘焙全线覆盖，烘焙水准业内高度认可。',
    foundedYear: 2019,
    socialMedia: '@terraformcoffee'
  },
  {
    id: 'r-3',
    name: '有容乃大',
    logo: '/logos/r-3.png',
    location: '上海',
    description: '上海精品咖啡代表品牌，品质和稳定度广受认可。大乐透系列是低价位拼配代表产品，曾与静安世界咖啡文化节合作打造限定拼配。',
    foundedYear: 2016,
    socialMedia: '@yourongnaida'
  },
  {
    id: 'r-4',
    name: '白鲸咖啡',
    logo: '/logos/r-4.jpg',
    location: '上海',
    description: '2015年创立的上海老牌精品咖啡烘焙品牌，陆家嘴咖啡节"元老"级品牌。创始人路摇是咖啡文化节策划参与者，以FULL CITY挂耳咖啡闻名。',
    foundedYear: 2015
  },
  {
    id: 'r-5',
    name: 'YELEI叶磊',
    logo: '/logos/r-5.jpg',
    location: '上海',
    description: '白鲸咖啡创始人叶磊创立的高端烘焙品牌，叶磊是白鲸咖啡的资深烘焙师，拥有丰富烘焙经验，连续7届参与陆家嘴咖啡节。',
    foundedYear: 2019
  },
  {
    id: 'r-6',
    name: 'Rightpaw希爪咖啡',
    logo: '/logos/r-6.jpg',
    location: '上海',
    description: '上海精品咖啡豆线上品牌，圈内简称RP。没有线下门店，只在线上售卖小批次闪购咖啡豆，以COE获奖庄园豆和希爪品种闻名，是资深咖啡爱好者的私藏宝藏店。',
    foundedYear: 2020
  }
];

// 模糊搜索数据源
export const ORIGIN_OPTIONS = [
  '埃塞俄比亚', '肯尼亚', '卢旺达', '布隆迪', '乌干达',
  '哥伦比亚', '巴西', '危地马拉', '巴拿马', '哥斯达黎加', '秘鲁', '洪都拉斯', '墨西哥', '古巴',
  '印度尼西亚', '巴布亚新几内亚', '也门',
  '中国云南', '印度', '越南', '泰国',
];

export const PROCESS_OPTIONS = [
  '水洗处理', '日晒处理', '蜜处理', '厌氧处理', '半水洗', '湿刨法', '其他'
];

export const VARIETY_OPTIONS = [
  '瑰夏', '卡杜拉', '铁皮卡', '波旁', 'SL28', 'SL34', '卡杜艾', '新世界', '黄波旁', '粉红波旁',
  '帕卡玛拉', '马拉戈吉佩', '象豆', '雷哈利', '爪哇', '蒂姆', '阿纳科尔', '维拉萨奇'
];

export const HARVEST_YEAR_OPTIONS = ['2022', '2023', '2024', '2025', '2026'];
