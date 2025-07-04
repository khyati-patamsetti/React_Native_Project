import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig.extra.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSub(category) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate the topic which is being searched: "${category}"
      Return only the result as a **valid JSON string**.
      Example response: ["FRONTEND"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = (await response.text()).trim();

    let cleaned = text;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json|```/g, "").trim();
    }

    const parsed = JSON.parse(cleaned);
    const uppercasedTopics = parsed.map((topic) =>
      typeof topic === "string" ? topic.toUpperCase() : topic
    );

    return uppercasedTopics;
  } catch (error) {
    console.error("Gemini topic generation failed:", error);
    return [];
  }
}
