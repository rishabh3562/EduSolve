import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

/**
 * Generates an AI answer using Google's Gemini API in Teacher Mode.
 * @param {string} question - The student's question.
 * @returns {Promise<string>} - The AI-generated teacher response.
 */
export async function generateGeminiAnswer(question: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a teacher. Answer student questions in a short, clear, and precise manner.
      If a student uses abusive language, respond with:
      "Please do not use abusive language. This platform is monitored, and misuse can lead to legal consequences."

      Student: ${question}
    `;

    console.log("Sending request to Gemini API...");
    console.log("Prompt:", prompt);

    const result = await model.generateContent(prompt); // Directly send the prompt

    const text = result?.response?.text() || "No response generated.";

    console.log("AI Teacher Response:", text);
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate answer.");
  }
}
