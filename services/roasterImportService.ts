import * as XLSX from 'xlsx';
import { Roaster, RoasterBean } from '../types';

export function parseRoasterFile(file: File): Promise<{
  roasters: Partial<Roaster>[];
  beans: Partial<RoasterBean>[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: ''
        }) as Record<string, unknown>[];

        const roasters = parseRoasters(jsonData);
        const beans = parseRoasterBeans(jsonData);

        resolve({ roasters, beans });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsBinaryString(file);
  });
}

function parseRoasters(data: Record<string, unknown>[]): Partial<Roaster>[] {
  const roasterMap = new Map<string, Partial<Roaster>>();

  for (const row of data) {
    const name = String(row['name'] || row['烘焙商名称'] || row['名称'] || '').trim();
    if (!name) continue;

    if (!roasterMap.has(name)) {
      roasterMap.set(name, {
        name,
        logo: String(row['logo'] || row['Logo'] || row['logo'] || ''),
        location: String(row['location'] || row['所在地'] || row['位置'] || ''),
        description: String(row['description'] || row['描述'] || ''),
        foundedYear: parseYear(row['foundedYear'] || row['成立年份']),
        socialMedia: String(row['socialMedia'] || row['社媒账号'] || ''),
      });
    }
  }

  return Array.from(roasterMap.values());
}

function parseRoasterBeans(data: Record<string, unknown>[]): Partial<RoasterBean>[] {
  const beans: Partial<RoasterBean>[] = [];

  for (const row of data) {
    const beanName = String(row['beanName'] || row['豆子名称'] || row['name'] || '').trim();
    const roasterName = String(row['roasterName'] || row['烘焙商'] || '').trim();

    if (!beanName) continue;

    beans.push({
      roasterId: roasterName,
      name: beanName,
      origin: String(row['origin'] || row['产地'] || ''),
      roastLevel: normalizeRoastLevel(String(row['roastLevel'] || row['烘焙度'] || '')),
      process: String(row['process'] || row['处理方式'] || ''),
      rating: parseFloat(String(row['rating'] || row['评分'] || '0')) || 0,
      image: String(row['image'] || row['图片'] || ''),
      description: String(row['description'] || row['描述'] || ''),
      price: parseFloat(String(row['price'] || row['价格'] || '0')) || 0,
      isNew: parseBoolean(row['isNew'] || row['新品']),
      tags: parseTags(row['tags'] || row['标签']),
      sales: parseNumber(row['sales'] || row['销量']) || 0,
    });
  }

  return beans;
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(/[,，;；]/).map(t => t.trim()).filter(Boolean);
  }
  return [];
}

function parseNumber(value: unknown): number | undefined {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function parseYear(value: unknown): number | undefined {
  const num = parseNumber(value);
  if (num && num > 1900 && num <= new Date().getFullYear()) {
    return num;
  }
  return undefined;
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return ['true', '1', '是', 'yes', 'hot'].includes(value.toLowerCase());
  }
  return false;
}

function normalizeRoastLevel(value: string): 'Light' | 'Medium' | 'Dark' {
  const v = value.toLowerCase();
  if (v.includes('浅') || v === 'light' || v === 'l') return 'Light';
  if (v.includes('深') || v === 'dark' || v === 'd') return 'Dark';
  return 'Medium';
}

export function exportTemplate(): void {
  const template = [
    {
      '烘焙商名称': '示例烘焙商',
      'Logo': 'https://example.com/logo.png',
      '所在地': '上海',
      '描述': '精品咖啡烘焙商',
      '成立年份': 2020,
      '社媒账号': '@example',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '烘焙商导入模板');
  XLSX.writeFile(workbook, 'roaster_import_template.xlsx');
}
