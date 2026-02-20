// services/coffeeBeanService.ts
import { supabase } from '../supabaseClient'
import { CoffeeBean } from '../types'
import { MOCK_BEANS } from '../constants'

interface SupabaseBean {
  id: string
  name: string
  origin: string
  process: string | null
  image_url: string | null
  created_at: string
}

function mapToCoffeeBean(bean: SupabaseBean): CoffeeBean {
  return {
    id: bean.id,
    name: bean.name,
    origin: bean.origin,
    roastLevel: 'Light',
    process: bean.process || 'Washed',
    rating: 0,
    image: bean.image_url || 'https://picsum.photos/seed/coffee/400/400',
    description: '',
    createdAt: bean.created_at
  }
}

// 获取所有咖啡豆（只显示已通过的）
export async function fetchCoffeeBeans(): Promise<CoffeeBean[]> {
  try {
    console.log('[CoffeeBean] Starting fetch...');

    const { data, error } = await supabase
      .from('coffee_beans')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('[CoffeeBean] Response:', { data, error });

    if (error) {
      console.error('[CoffeeBean] Error:', error)
      return MOCK_BEANS
    }

    if (!data || data.length === 0) {
      console.log('[CoffeeBean] No data, returning MOCK_BEANS');
      return MOCK_BEANS
    }

    console.log('[CoffeeBean] Got data, count:', data.length);
    return (data || []).map(mapToCoffeeBean)
  } catch (err) {
    console.error('[CoffeeBean] Catch error:', err);
    return MOCK_BEANS
  }
}

// 添加咖啡豆
export async function addCoffeeBean(bean: Omit<CoffeeBean, 'id' | 'rating'>): Promise<CoffeeBean | null> {
  const { data, error } = await supabase
    .from('coffee_beans')
    .insert([
      {
        name: bean.name,
        origin: bean.origin,
        roaster: bean.description?.split('|')[0]?.trim() || '',
        region: bean.description?.split('|')[1]?.trim() || '',
        variety: bean.description?.split('|')[2]?.trim() || '',
        process: bean.process,
        image_url: bean.image
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding bean:', error)
    return null
  }

  return mapToCoffeeBean(data)
}

// 更新咖啡豆
export async function updateCoffeeBean(id: string, updates: Partial<CoffeeBean>): Promise<boolean> {
  const updateData: Record<string, unknown> = {}
  
  if (updates.name) updateData.name = updates.name
  if (updates.origin) updateData.origin = updates.origin
  if (updates.process) updateData.process = updates.process
  if (updates.image) updateData.image_url = updates.image

  const { error } = await supabase
    .from('coffee_beans')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating bean:', error)
    return false
  }

  return true
}

// 删除咖啡豆
export async function deleteCoffeeBean(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('coffee_beans')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting bean:', error)
    return false
  }

  return true
}