import { generateCoffeeBeanDescription as generateWithGemini, CoffeeBeanInfo } from './claudeService';

export type AIServiceProvider = 'gemini';

export interface AIBeanInfo {
  name: string;
  roaster: string;
  origin: string;
  region?: string;
  variety?: string;
  process?: string;
  harvestYear?: string;
}

export async function generateDescription(
  provider: AIServiceProvider,
  beanInfo: AIBeanInfo
): Promise<string> {
  // 目前只支持 Gemini
  return generateWithGemini(beanInfo);
}
