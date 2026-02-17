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
