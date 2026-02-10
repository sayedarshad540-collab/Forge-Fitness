
import { GoogleGenAI } from "@google/genai";

export const getWorkoutSuggestions = async (membershipType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional fitness coach at Forge Fitness. Suggest a specific 1-day workout routine for a member on a "${membershipType}" plan. Provide the output in a concise Markdown format with exercises, sets, and reps. Keep it high-energy and professional.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Unable to load AI recommendations at this time. Keep pushing your limits!";
  }
};
