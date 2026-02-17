import * as XLSX from 'xlsx';
import { Roaster } from '../types';
import { supabase } from '../supabaseClient';

export async function parseRoasterFile(file: File): Promise<{
  roasters: Partial<Roaster>[];
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

        resolve({ roasters });
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

export function exportTemplate(): void {
  const template = [
    {
      '烘焙商名称': '示例烘焙商',
      'Logo': '',
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

export async function importRoastersToDatabase(roasters: Partial<Roaster>[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  for (const roaster of roasters) {
    try {
      const { data: existing } = await supabase
        .from('Roaster')
        .select('id')
        .eq('name', roaster.name)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('Roaster')
          .update({
            logo: roaster.logo,
            location: roaster.location,
            description: roaster.description,
            foundedYear: roaster.foundedYear,
            socialMedia: roaster.socialMedia,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Roaster')
          .insert({
            id: `roaster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: roaster.name,
            logo: roaster.logo,
            location: roaster.location,
            description: roaster.description,
            foundedYear: roaster.foundedYear,
            socialMedia: roaster.socialMedia,
          });

        if (error) throw error;
      }
      success++;
    } catch (err) {
      failed++;
      errors.push(`${roaster.name}: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  }

  return { success, failed, errors };
}

export async function fetchRoastersFromDatabase(): Promise<Roaster[]> {
  const { data, error } = await supabase
    .from('Roaster')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;

  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
    location: item.location,
    description: item.description,
    foundedYear: item.foundedYear,
    socialMedia: item.socialMedia,
  }));
}

export async function deleteRoaster(id: string): Promise<void> {
  const { error } = await supabase
    .from('Roaster')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateRoasterInDatabase(id: string, updates: Partial<Roaster>): Promise<void> {
  const { error } = await supabase
    .from('Roaster')
    .update({
      name: updates.name,
      logo: updates.logo,
      location: updates.location,
      description: updates.description,
      foundedYear: updates.foundedYear,
      socialMedia: updates.socialMedia,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function uploadLogo(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `roasters/${fileName}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) {
    throw new Error(`图片上传失败: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}
