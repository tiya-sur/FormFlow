import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDesignNudges(projectContext: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an AI Formwork Optimization Expert. Based on this project context: "${projectContext}", suggest 3 specific "Design Nudges" that could save construction costs by optimizing formwork reuse. 
    Format the response as JSON with an array of objects: { title: string, description: string, estimatedSavings: string }.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nudges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedSavings: { type: Type.STRING }
              },
              required: ["title", "description", "estimatedSavings"]
            }
          }
        },
        required: ["nudges"]
      }
    }
  });

  try {
    return JSON.parse(response.text).nudges;
  } catch (e) {
    return [];
  }
}
