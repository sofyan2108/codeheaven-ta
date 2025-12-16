import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Inisialisasi hanya jika API Key ada
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const analyzeCodeWithAI = async (codeSnippet) => {
  // 1. Cek apakah API Key sudah dipasang
  if (!apiKey || !genAI) {
    console.error("API Key Gemini belum dipasang di .env.local");
    throw new Error("API Key Google Gemini belum dikonfigurasi. Silakan cek file .env.local Anda.");
  }

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
    console.error("AI Service Error:", error);
    // Lempar error yang lebih user-friendly
    if (error.message.includes("API key")) {
        throw new Error("API Key tidak valid. Cek konfigurasi.");
    }
    throw new Error("Gagal menganalisis kode. Silakan isi manual.");
  }
};