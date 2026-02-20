import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface CoffeeBeanInfo {
  name: string;
  roaster: string;
  origin: string;
  region?: string;
  variety?: string;
  process?: string;
  harvestYear?: string;
}

export async function generateCoffeeBeanDescription(
  beanInfo: CoffeeBeanInfo
): Promise<string> {
  const prompt = `你是一位专业的咖啡品鉴师。请为以下咖啡豆生成一段生动的描述：

咖啡豆名称: ${beanInfo.name}
烘焙商: ${beanInfo.roaster}
产地: ${beanInfo.origin}
${beanInfo.region ? `产区: ${beanInfo.region}` : ''}
${beanInfo.variety ? `豆种: ${beanInfo.variety}` : ''}
${beanInfo.process ? `处理法: ${beanInfo.process}` : ''}
${beanInfo.harvestYear ? `采收年份: ${beanInfo.harvestYear}` : ''}

请生成一段 50-100 字的咖啡描述，包含风味特点、口感描述等。`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find(
      (block) => block.type === 'text'
    );
    return textContent?.type === 'text' ? textContent.text : '';
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}
