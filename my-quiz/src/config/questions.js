import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig.extra.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const getQuestionsFromAPI = async (selectedCategory) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
    const prompt = ` 
    Generate 15 multiple choice quiz questions about "${selectedCategory}", grouped by difficulty:
    - 5 Easy
    - 5 Medium
    - 5 Hard 
    Requirements:
    - Questions must be concise (under 20 words).
    - Each option should be a short phrase (1–5 words max).
    - Format the response as a JSON array of objects like this:
    [ 
      {
        "question": "Short question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A",
        "difficulty": "easy" // or "medium", "hard"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log("Gemini raw response:", text); 
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json|```/g, "").trim();
    }

    try {
      const formatted = JSON.parse(cleaned);
      const validQuestions = formatted.filter(q =>
        q.question && Array.isArray(q.options) && q.options.length >= 2 && q.correctAnswer
      );

      return validQuestions;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError, "\nRaw text:", text);
      return [];
    }

  } catch (error) {
    console.error("Gemini failed to generate questions:", error);
    return [];
  }
};
