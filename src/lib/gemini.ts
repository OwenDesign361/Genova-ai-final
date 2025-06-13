import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This function generates text content
export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    return marked.parse(rawText) as string;
  } catch (error) {
    console.error("Gemini Text Generation Error:", error);
    return "<p>Sorry, there was an error generating the text. Please try again.</p>";
  }
}

// This function simulates image generation and downloading
// A real implementation requires a backend server for security
export const generateAndDownloadImage = async (prompt: string, count: number = 1): Promise<string[]> => {
  console.log(`Simulating generation for prompt: "${prompt}"`);
  // Use a placeholder service to simulate image generation
  const keywords = prompt.split(' ').join(',');
  const urls = Array.from({ length: count }, (_, i) => 
    `https://source.unsplash.com/512x512/?${keywords},futuristic,art&t=${new Date().getTime() + i}`
  );
  return urls;
};
