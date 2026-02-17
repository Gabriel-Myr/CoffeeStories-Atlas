/**
 * 手动上传Logo工具
 * 将您收集的logo图片批量应用到项目
 * 
 * 使用方法:
 * 1. 把logo图片放入 public/logos/ 目录
 *    - 命名格式: r-0.jpg, r-1.png 等 (对应烘焙商ID)
 * 2. 运行: node Scripts/manualUpload.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 烘焙商列表
const ROASTERS = [
  { id: 'r-0', name: '乔治队长' },
  { id: 'r-1', name: '合豆' },
  { id: 'r-2', name: '启程拓殖' },
  { id: 'r-3', name: '有容乃大' },
  { id: 'r-4', name: '白鲸咖啡' },
  { id: 'r-5', name: 'YELEI' },
  { id: 'r-6', name: 'Rightpaw' },
];

const LOGO_DIR = path.join(__dirname, '..', 'public', 'logos');

console.log('🚀 手动上传Logo工具\n');
console.log('='.repeat(50));
console.log('使用步骤:');
console.log('1. 准备logo图片 (建议尺寸: 200x200~800x800)');
console.log('2. 放入 public/logos/ 目录');
console.log('3. 按以下格式命名:');
ROASTERS.forEach(r => {
  console.log(`   ${r.name} → ${r.id}.jpg 或 ${r.id}.png`);
});
console.log('='.repeat(50) + '\n');

// 检查目录
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
  console.log('✅ 已创建目录: public/logos/');
}

// 扫描已有图片
const files = fs.readdirSync(LOGO_DIR);
const logoFiles = files.filter(f => f.match(/^r-\d+\.(jpg|jpeg|png)$/i));

if (logoFiles.length === 0) {
  console.log('⚠️ 未找到logo图片');
  console.log('请将图片放入 public/logos/ 目录后再运行\n');
  process.exit(0);
}

console.log(`📁 找到 ${logoFiles.length} 个logo文件:\n`);
logoFiles.forEach(f => {
  const stats = fs.statSync(path.join(LOGO_DIR, f));
  console.log(`   ✓ ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
});

// 应用到项目
console.log('\n🚀 应用到项目...\n');

const constantsPath = path.join(__dirname, '..', 'constants.tsx');
let content = fs.readFileSync(constantsPath, 'utf-8');

const results = {};

for (const roaster of ROASTERS) {
  // 查找对应的图片文件
  const matchedFile = logoFiles.find(f => f.startsWith(roaster.id + '.'));
  
  if (matchedFile) {
    const ext = path.extname(matchedFile);
    const logoPath = `/logos/${roaster.id}${ext}`;
    results[roaster.id] = logoPath;
    
    // 更新constants.tsx
    const hasLogo = new RegExp(`id: '${roaster.id}',[\\s\\S]{0,200}logo:`).test(content);
    if (hasLogo) {
      const updatePattern = new RegExp(`(id: '${roaster.id}',[\\s\\S]{0,100}logo: )'[^']*'`, 'g');
      content = content.replace(updatePattern, `$1'${logoPath}'`);
    } else {
      const pattern = new RegExp(`(id: '${roaster.id}',\\n)(\\s+name: '[^']+',\\n)`, 'g');
      content = content.replace(pattern, `$1$2    logo: '${logoPath}',
`);
    }
    
    console.log(`✅ ${roaster.name}: ${logoPath}`);
  } else {
    console.log(`⚠️ ${roaster.name}: 未找到图片`);
  }
}

fs.writeFileSync(constantsPath, content);

console.log('\n' + '='.repeat(50));
console.log(`💾 已更新 constants.tsx`);
console.log(`✅ 成功: ${Object.keys(results).length}/${ROASTERS.length}`);
console.log('='.repeat(50));
console.log('\n请刷新浏览器查看效果！');
