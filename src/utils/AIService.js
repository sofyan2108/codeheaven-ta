import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeCodeWithAI = async (codeSnippet) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following code snippet and return a JSON object (without Markdown formatting). 
      The JSON must have these keys:
      1. "title": A short, descriptive title (max 50 chars).
      2. "language": The programming language (lowercase, e.g., "javascript", "python", "html", "css").
      3. "description": A concise explanation of what the code does (max 200 chars, in Indonesian language).
      4. "tags": An array of 3-5 keywords relevant to the code (lowercase).

      Code to analyze:
      ${codeSnippet}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Bersihkan format jika AI mengembalikan Markdown (```json ... ```)
    const cleanedText = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Gagal menganalisis kode. Coba lagi manual.");
  }
};