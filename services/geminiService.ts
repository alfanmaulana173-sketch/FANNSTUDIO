import { GoogleGenAI } from "@google/genai";
import { ImageFile, AspectRatio } from "../types";

// Using the recommended Nano Banana model for image tasks
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
// Using Flash for text tasks (Prompt Generation)
const TEXT_MODEL_NAME = 'gemini-2.5-flash';

// Helper to initialize AI only when needed, preventing startup crashes if env is missing
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateAIImage = async (
  prompt: string,
  images: ImageFile[],
  systemInstruction?: string,
  aspectRatio: AspectRatio = "1:1"
): Promise<string> => {
  try {
    const ai = getAiClient();
    const parts: any[] = [];

    // Add images to parts
    images.forEach(img => {
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = img.base64.split(',')[1];
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: img.mimeType
        }
      });
    });

    // Add prompt text
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        imageConfig: {
          aspectRatio: aspectRatio
        }
        // No responseMimeType for nano banana models as per guidelines
      }
    });

    // Parse response for image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Determine mime type, default to png if not specified in response (common in API)
          const mime = part.inlineData.mimeType || 'image/png';
          return `data:${mime};base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image generated in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateTextResponse = async (
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    throw error;
  }
};