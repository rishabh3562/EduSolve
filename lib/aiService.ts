import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

/**
 * Generates an AI answer using Google's Gemini API
 * @param {string} question - The doubt description to generate an answer for
 * @returns {Promise<string>} - The generated answer
 */
export async function generateGeminiAnswer(question: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text() || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate answer.");
  }
}
