
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCoffeeInsights = async (beanName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief professional tasting note (30 words max) and food pairing suggestion for the coffee bean: ${beanName}. Use a sophisticated yet accessible tone.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tastingNotes: { type: Type.STRING },
            pairing: { type: Type.STRING }
          },
          required: ["tastingNotes", "pairing"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      tastingNotes: "A balanced profile with distinct origin characteristics.",
      pairing: "Best enjoyed with a light pastry."
    };
  }
};
