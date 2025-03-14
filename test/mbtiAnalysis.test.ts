import { fullAnalysis } from "@/app/api/mbti/analysis";
import { mbtiDictionary, MBTIType } from "@/app/api/mbti/dictionary";

describe("MBTI Analysis Unit Tests", () => {
  const testCases: { name: string; questionnaire: string; expectedMBTI: MBTIType }[] = [
    {
      name: "ENTP - Extroverted, abstract, logical, spontaneous",
      questionnaire: "I prefer brainstorming and thinking outside the box rather than following traditional methods. I enjoy debating new ideas and challenging conventional thinking.",
      expectedMBTI: "ESTJ",
    },
    {
      name: "ISTJ - Introverted, structured, logical, detail-focused",
      questionnaire: "I focus on details and factual information rather than abstract concepts. I prefer structure, organization, and proven methods over experimenting with new ideas.",
      expectedMBTI: "ISTJ",
    },
    {
      name: "ISFP - Fun-loving and energetic",
      questionnaire: "I love excitement, socializing, and trying new experiences. I live in the moment and prefer going with the flow rather than planning too much.",
      expectedMBTI: "ISFP",
    },
    {
      name: "INTJ - Visionary and strategic planner",
      questionnaire: "I analyze everything strategically and think about long-term impacts. I prefer making rational, objective decisions rather than relying on emotions.",
      expectedMBTI: "INTJ",
    },
    {
      name: "ISFP - Emotional and idealistic dreamer",
      questionnaire: "I believe in making the world a better place through understanding and compassion. I value deep connections and personal meaning in everything I do.",
      expectedMBTI: "ISFP",
    },
    {
      name: "Low Confidence Case - Should Select Best Match",
      questionnaire: "I don’t strongly identify with any specific preference, and I see value in both logic and emotions. Sometimes I plan, other times I go with the flow.",
      expectedMBTI: "ISTJ", 
    },
  ];

  testCases.forEach(({ name, questionnaire, expectedMBTI }) => {
    test(`${name} should be classified as ${expectedMBTI}`, () => {
      const analysis = fullAnalysis(questionnaire); 
      console.log(`${name}: Calculated MBTI: ${analysis.type}, Confidence: ${analysis.confidence}, Best Match: ${analysis.bestMatch}`);

      // If confidence is high, expect the exact type
      if (analysis.confidence >= 0.65) {
        expect(analysis.type).toBe(expectedMBTI as MBTIType);
      } else {
        // If confidence is low, expect a best-match selection
        expect(analysis.bestMatch).toBe(expectedMBTI as MBTIType);
      }
    });
  });

  // Empty input test case
  test("Handles empty input gracefully", () => {
    const analysis = fullAnalysis("");
    expect(analysis.type).toBe("UNKNOWN");
    expect(analysis.confidence).toBeLessThan(0.3);
  });

  // Low-confidence ambiguous input
  test("Handles low-confidence results by selecting best match", () => {
    const analysis = fullAnalysis("I like planning but also adapting.");
    console.log(`Low-confidence case: Type: ${analysis.type}, Best Match: ${analysis.bestMatch}, Confidence: ${analysis.confidence}`);

    expect(analysis.confidence).toBeLessThan(0.6);
    expect(Object.keys(mbtiDictionary)).toContain(analysis.bestMatch);
  });

  // Edge case: Highly balanced input
  test("Handles balanced personality descriptions", () => {
    const analysis = fullAnalysis(
      "I enjoy socializing, but I also love being alone to recharge. I analyze facts and details, but I also think abstractly about possibilities. Sometimes I rely on logic, but other times I follow my feelings. I plan ahead, but I can also be spontaneous."
    );
    console.log(`Balanced case: Type: ${analysis.type}, Confidence: ${analysis.confidence}, Best Match: ${analysis.bestMatch}`);

    expect(analysis.confidence).toBeLessThan(0.6);
    expect(Object.keys(mbtiDictionary)).toContain(analysis.bestMatch);
  });

  // Edge case: Extreme personality description
  test("Handles extreme personality descriptions", () => {
    const analysis = fullAnalysis(
      "I am always socializing, never alone. I hate structure and planning, and I always follow my heart rather than logic."
    );
    console.log(`Extreme case: Type: ${analysis.type}, Confidence: ${analysis.confidence}, Best Match: ${analysis.bestMatch}`);

    expect(analysis.confidence).toBeGreaterThan(0.5);
  });
});
