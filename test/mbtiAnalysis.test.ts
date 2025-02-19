import { fullAnalysis } from "../app/utils/mbtiAnalysis";
import { mbtiDictionary, MBTIType } from "@/app/api/mbti-dictionary/mbtiDictionary";

describe("MBTI Analysis Unit Tests", () => {
    const testCases = [
      {
        name: "ENTP - Extroverted, abstract, logical, spontaneous",
        chatHistory: "I love debating, questioning assumptions, and challenging ideas. I thrive on discussions and exploring unconventional viewpoints.",
        questionnaire: "I prefer brainstorming innovative ideas over following traditional methods. I get excited about possibilities and future potential.",
        expectedMBTI: "ENTP",
      },
      {
        name: "ISTJ - Introverted, structured, logical, detail-focused",
        chatHistory: "I prefer routines and structure in my life. Sticking to rules and maintaining order gives me confidence.",
        questionnaire: "I rely on proven methods rather than speculative theories. I like following step-by-step instructions.",
        expectedMBTI: "ISTJ",
      },
      {
        name: "ESFP - Fun-loving and energetic",
        chatHistory: "I love socializing and making people laugh! Being around friends and enjoying life is what I love most.",
        questionnaire: "I prefer spontaneous activities and experiencing things in the moment rather than planning everything.",
        expectedMBTI: "ESFP",
      },
      {
        name: "INTJ - Visionary and strategic planner",
        chatHistory: "I analyze complex systems and create long-term strategies. Thinking ahead and planning is key to success.",
        questionnaire: "I prefer structured planning over spontaneous decisions. I focus on big-picture goals.",
        expectedMBTI: "INTJ",
      },
      {
        name: "INFP - Emotional and idealistic dreamer",
        chatHistory: "I value deep emotional connections and always strive to understand people's feelings. My passion is helping others.",
        questionnaire: "I believe in making the world a better place through creativity and empathy.",
        expectedMBTI: "INFP",
      },
      {
        name: "Low Confidence Case - Should Select Best Match",
        chatHistory: "Sometimes I enjoy social activities, but I also need alone time. I like thinking about ideas, but I also focus on details.",
        questionnaire: "I like planning, but I can be flexible. I enjoy logic, but also value emotions.",
        expectedMBTI: "INFJ", // Best match based on mixed traits
      },
    ];
  
    testCases.forEach(({ name, chatHistory, questionnaire, expectedMBTI }) => {
      test(`${name} should be classified as ${expectedMBTI}`, () => {
        const analysis = fullAnalysis(chatHistory, questionnaire);
        expect(analysis.type).toBe(expectedMBTI as MBTIType);
        expect(analysis.confidence).toBeGreaterThanOrEqual(0.65); // Confidence should be above threshold
      });
    });
  
    test("Handles empty input gracefully", () => {
      const analysis = fullAnalysis("", "");
      expect(analysis.type).toBe("UNKNOWN");
      expect(analysis.confidence).toBeLessThan(0.3); // Confidence should be very low
    });
  
    test("Handles low-confidence results by selecting best match", () => {
      const analysis = fullAnalysis("I enjoy a mix of things, sometimes social, sometimes alone.", "I like planning but also adapting.");
      expect(analysis.confidence).toBeLessThan(0.6); // Ensure low confidence
      expect(Object.keys(mbtiDictionary)).toContain(analysis.bestMatch); // Ensure fallback is valid
    });
  });