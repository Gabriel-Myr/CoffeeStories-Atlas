/**
 * 将获取到的Logo应用到 constants.tsx
 * 使用 ES Module 语法
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 获取 __dirname 等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 手动维护的烘焙商Logo映射表
// 您可以通过以下方式获取真实logo：
// 1. 访问烘焙商淘宝/官网，右键logo复制图片地址
// 2. 使用 Google 图片搜索
// 3. 上传到图床（如imgur、sm.ms等）获取URL
const ROASTER_LOGOS = {
  // 乔治队长 - 使用淘宝店铺logo
  'r-0': 'https://img.alicdn.com/imgextra/i4/2200782491719/O1CN01X7Hk1n1XLeZc8fC0s_!!2200782491719.png',

  // 合豆 - 使用咖啡相关占位图
  'r-1': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop',

  // 启程拓殖 Terraform - Black Sheep旗下
  'r-2': 'https://images.unsplash.com/photo-1442512595331-e89e7385a861?w=200&h=200&fit=crop',

  // 有容乃大
  'r-3': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',

  // 白鲸咖啡
  'r-4': 'https://images.unsplash.com/photo-1509042239860-f550ce710b99?w=200&h=200&fit=crop',

  // YELEI叶磊
  'r-5': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop',

  // Rightpaw希爪咖啡
  'r-6': 'https://images.unsplash.com/photo-1510707579353-3c1b4b5f2b4a?w=200&h=200&fit=crop',
};

/**
 * 应用Logo到 constants.tsx
 */
function applyLogosToConstants() {
  const constantsPath = path.join(__dirname, '..', 'constants.tsx');
  let content = fs.readFileSync(constantsPath, 'utf-8');

  console.log('🚀 开始应用Logo到 constants.tsx...\n');

  for (const [id, logoUrl] of Object.entries(ROASTER_LOGOS)) {
    // 构建正则表达式来查找烘焙商对象
    // 匹配模式：id: 'r-X', 后面跟着各种字段
    const pattern = new RegExp(
      `(id: '${id}',\\n)(\\s+name: '[^']+',\\n)`,
      'g'
    );

    // 检查是否已经有logo字段
    const hasLogo = new RegExp(`id: '${id}',[\\s\\S]{0,200}logo:`).test(content);

    if (hasLogo) {
      // 更新现有的logo
      const updatePattern = new RegExp(
        `(id: '${id}',[\\s\\S]{0,100}logo: )'[^']*'`,
        'g'
      );
      content = content.replace(updatePattern, `$1'${logoUrl}'`);
      console.log(`🔄 更新 logo: ${id} -> ${logoUrl.substring(0, 50)}...`);
    } else {
      // 在 name 字段后添加 logo 字段
      content = content.replace(
        pattern,
        `$1$2    logo: '${logoUrl}',
`
      );
      console.log(`✅ 添加 logo: ${id} -> ${logoUrl.substring(0, 50)}...`);
    }
  }

  // 写回文件
  fs.writeFileSync(constantsPath, content);
  console.log(`\n💾 已更新 ${constantsPath}`);
  console.log('\n📋 下一步：');
  console.log('1. 检查 constants.tsx 中的logo URL是否正确');
  console.log('2. 运行开发服务器查看效果');
  console.log('3. 如需替换为真实logo，修改 Scripts/applyLogos.mjs 中的 ROASTER_LOGOS 对象');
}

// 执行
applyLogosToConstants();
