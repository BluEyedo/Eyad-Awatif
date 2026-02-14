
import { GoogleGenAI } from "@google/genai";

export const generateRomanticPoem = async (proposer: string, recipient: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a very short, deeply romantic four-line poem for a marriage proposal from ${proposer} to ${recipient}. Keep it elegant and sweet.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "You are the light of my life, the beat of my heart.";
  } catch (error) {
    console.error("Error generating poem:", error);
    return "In your eyes, I found my home. In your heart, I found my soul.";
  }
};
