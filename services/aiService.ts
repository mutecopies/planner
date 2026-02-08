import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseCoursesFromData = async (input: string, type: 'text' | 'image'): Promise<Course[]> => {
  try {
    const parts = [];

    if (type === 'image') {
      // Input is base64 data URL, we need to strip the prefix
      const base64Data = input.split(',')[1];
      const mimeType = input.substring(input.indexOf(':') + 1, input.indexOf(';'));
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
      parts.push({
        text: "Extract university course information from this image of a schedule/table."
      });
    } else {
      parts.push({
        text: `Extract university course information from the following text: "${input}"`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          ...parts,
          {
            text: `
            Format the output into a strict JSON structure.
            
            Rules:
            1. Map days to numbers: Saturday=0, Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6.
            2. If a course has multiple time slots (e.g. Saturday and Monday), create multiple entries in the 'timeSlots' array.
            3. Parse times strictly as "HH:MM" (24-hour format).
            4. Parse exam dates as strings.
            5. Generate a unique ID for each course.
            6. Assume Persian language context for days (شنبه, یکشنبه, etc.).
            7. If you cannot see a specific field (like instructor), leave it as an empty string.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              code: { type: Type.STRING },
              instructor: { type: Type.STRING },
              group: { type: Type.STRING },
              units: { type: Type.NUMBER },
              examDate: { type: Type.STRING },
              timeSlots: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    startTime: { type: Type.STRING },
                    endTime: { type: Type.STRING },
                  }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    return result as Course[];
  } catch (error) {
    console.error("Error parsing courses with AI:", error);
    throw new Error("Failed to parse course data. Please try again.");
  }
};