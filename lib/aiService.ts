import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

/**
 * Generates an AI answer using Google's Gemini API in Teacher Mode.
 * @param {string} question - The student's question.
 * @returns {Promise<string>} - The AI-generated teacher response.
 */

export async function generateGeminiAnswer(
  title: string,
  description: string,
  context?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a knowledgeable teacher. Answer student questions clearly and concisely.
      Question Title: ${title}
      Question Description: ${description}
      ${context ? `Additional Context: ${context}` : ""}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI answer.");
  }
}

// export async function generateGeminiAnswer(
//   title: string,
//   description: string
// ): Promise<string> {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = `
//   You are a knowledgeable teacher. Answer student questions clearly, concisely, and accurately.  

//   - Your first approach should be to **answer the question** based on the available information.  
//   - If either the title or description is meaningful, **focus on that and provide an answer**.  
//   - If one is unclear (random characters, numbers, or empty), ignore it and answer based on the meaningful part.  
//   - If both are unclear and you truly cannot infer meaning, only then ask for clarification.  
//   - Be prepared to answer variations of the same question, as students may ask in different ways.  
//   - If the question is vague but still answerable, provide the best possible response.  
//   - **Assume the context of a technical trainer answering a student's question.**  

//   **Student's Question Title:** ${title}  
//   **Student's Question Description:** ${description}  
// `;



//     const result = await model.generateContent(prompt);
//     console.log("result",result)
//     return result?.response?.text() || "No response generated.";
//   } catch (error) {
//     throw new Error("Failed to generate answer.");
//   }
// }


// export async function generateGeminiAnswer(question: string): Promise<string> {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       You are a teacher. Answer student questions in a short, clear, and precise manner.
//       If a student uses abusive language, respond with:
//       "Please do not use abusive language. This platform is monitored, and misuse can lead to legal consequences."

//       Student: ${question}
//     `;

//     // console.log("Sending request to Gemini API...");
//     // console.log("Prompt:", prompt);

//     const result = await model.generateContent(prompt); // Directly send the prompt

//     const text = result?.response?.text() || "No response generated.";

//     // console.log("AI Teacher Response:", text);
//     return text;
//   } catch (error) {
//     // console.error("Gemini API Error:", error);
//     throw new Error("Failed to generate answer.");
//   }
// }
