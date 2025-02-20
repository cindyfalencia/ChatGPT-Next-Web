import {
  mbtiDictionary,
  MBTIType,
  isValidMBTIType,
} from "@/app/api/mbti/dictionary";

type DimensionPair = "E/I" | "S/N" | "T/F" | "J/P";

export type AnalysisResult = {
  type: MBTIType | "UNKNOWN";
  confidence: number;
  breakdown: Record<
    DimensionPair,
    {
      score: number;
      indicators: string[];
    }
  >;
  bestMatch: MBTIType;
};

// Configuration
const CONFIDENCE_THRESHOLD = 0.5;

// --- Text Preprocessing ---
const preprocessText = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
};

const countOccurrences = (tokens: string[], terms: string[]): number =>
  tokens.filter((token) => terms.includes(token)).length;

// --- Feature Extraction with Phrases ---
const extractFeatures = (text: string) => {
  const tokens = preprocessText(text);

  return {
    socialTerms: countOccurrences(tokens, [
      "team",
      "friend",
      "party",
      "social",
      "energy",
      "outgoing",
    ]),
    solitaryTerms: countOccurrences(tokens, [
      "alone",
      "read",
      "individual",
      "quiet",
      "introspective",
    ]),
    abstractTerms: countOccurrences(tokens, [
      "theory",
      "future",
      "possibility",
      "idea",
      "concept",
      "hypothesis",
      "metaphor",
      "visionary",
    ]),
    concreteTerms: countOccurrences(tokens, [
      "fact",
      "practical",
      "now",
      "detail",
      "realistic",
      "hands-on",
      "physical",
    ]),
    logicalTerms: countOccurrences(tokens, [
      "logic",
      "objective",
      "analysis",
      "critique",
      "reason",
      "systematic",
      "efficiency",
    ]),
    emotionTerms: countOccurrences(tokens, [
      "feel",
      "value",
      "harmony",
      "empathy",
      "compassion",
      "kindness",
      "sensitive",
      "deep connection",
    ]),
    structuredTerms: countOccurrences(tokens, [
      "plan",
      "organize",
      "deadline",
      "schedule",
      "goal",
      "strict",
      "efficient",
    ]),
    flexibleTerms: countOccurrences(tokens, [
      "flexible",
      "spontaneous",
      "adapt",
      "open",
      "go with the flow",
      "explore",
    ]),

    // Boosted phrase-based detection
    abstractThinking: text.includes("thinking outside the box") ? 4 : 0,
    futurePlanning: text.includes("long-term impact") ? 4 : 0,
    emotionalAwareness: text.includes("understanding emotions") ? 4 : 0,
    logicalDecisionMaking: text.includes("rational decision making") ? 4 : 0,
    excitementSeeking: text.includes("love excitement") ? 4 : 0,
    deepConversations: text.includes("deep conversation") ? 3 : 0,
  };
};

// --- Dimension Analysis ---
const analyzeDimension = (
  text: string,
  positiveTerms: string[],
  negativeTerms: string[],
  phraseBoost: number,
  baseWeight: number,
) => {
  const tokens = preprocessText(text);
  const positiveScore = countOccurrences(tokens, positiveTerms);
  const negativeScore = countOccurrences(tokens, negativeTerms);

  // Add extra weight for key phrases
  let phraseScore = 0;
  const phrases = [
    "deep conversation",
    "new ideas",
    "strategic thinking",
    "creative solutions",
    "love trying new things",
  ];
  phrases.forEach((phrase) => {
    if (text.includes(phrase)) phraseScore += phraseBoost;
  });

  // Normalize scores by total word count
  const totalWords = tokens.length;
  return totalWords > 0
    ? ((positiveScore - negativeScore + phraseScore) * baseWeight) / totalWords
    : 0;
};

// --- Confidence Calculation ---
const calculateConfidence = (
  dimensionScores: Record<DimensionPair, number>,
  type: MBTIType,
): number => {
  const expectedScores = mbtiDictionary[type].analysisCriteria;
  let totalDeviation = 0;
  let maxDeviation = 4;

  Object.entries(dimensionScores).forEach(([dimension, score]) => {
    const expected =
      expectedScores[dimension as DimensionPair]?.expectedScore || 0;
    totalDeviation += Math.abs(score - expected);
  });
  return Math.max(0, 1 - totalDeviation / maxDeviation);
};

// --- Full MBTI Analysis ---
export const fullAnalysis = (questionnaire: string): AnalysisResult => {
  const combinedText = `${questionnaire}`;

  // Handle empty input
  if (!combinedText.trim()) {
    return {
      type: "UNKNOWN",
      confidence: 0,
      breakdown: {
        "E/I": { score: 0, indicators: [] },
        "S/N": { score: 0, indicators: [] },
        "T/F": { score: 0, indicators: [] },
        "J/P": { score: 0, indicators: [] },
      },
      bestMatch: "UNKNOWN",
    };
  }

  const features = extractFeatures(combinedText);

  const rawScores = {
    "E/I":
      analyzeDimension(
        combinedText,
        ["team", "social", "we", "group"],
        ["alone", "individual", "quiet"],
        2,
        2,
      ) +
      (features.socialTerms - features.solitaryTerms) * 0.8,
    "S/N":
      analyzeDimension(
        combinedText,
        ["fact", "detail", "practical"],
        ["theory", "future", "idea"],
        3,
        2,
      ) +
      (features.abstractThinking - features.futurePlanning) * 0.8,
    "T/F":
      analyzeDimension(
        combinedText,
        ["logic", "objective", "analysis"],
        ["feel", "value", "harmony"],
        2,
        1.5,
      ) +
      (features.logicalTerms - features.emotionTerms) * 0.6,
    "J/P":
      analyzeDimension(
        combinedText,
        ["plan", "organize", "deadline"],
        ["flexible", "spontaneous", "adapt"],
        2,
        1.5,
      ) +
      (features.structuredTerms - features.flexibleTerms) * 0.6,
  };

  console.log("🔍 Raw Dimension Scores:", rawScores);

  // Convert scores into the expected breakdown format
  const dimensionScores: Record<
    DimensionPair,
    { score: number; indicators: string[] }
  > = {
    "E/I": {
      score: rawScores["E/I"],
      indicators: [
        `Social terms: ${features.socialTerms}, Solitary: ${features.solitaryTerms}`,
      ],
    },
    "S/N": {
      score: rawScores["S/N"],
      indicators: [
        `Concrete: ${features.concreteTerms}, Abstract: ${features.abstractTerms}`,
      ],
    },
    "T/F": {
      score: rawScores["T/F"],
      indicators: [
        `Logical: ${features.logicalTerms}, Emotional: ${features.emotionTerms}`,
      ],
    },
    "J/P": {
      score: rawScores["J/P"],
      indicators: [
        `Structured: ${features.structuredTerms}, Flexible: ${features.flexibleTerms}`,
      ],
    },
  };

  const type = [
    rawScores["E/I"] > 0 ? "E" : "I",
    rawScores["S/N"] > 0 ? "S" : "N",
    rawScores["T/F"] > 0 ? "T" : "F",
    rawScores["J/P"] > 0 ? "J" : "P",
  ].join("") as MBTIType;

  const confidence = calculateConfidence(rawScores, type);

  console.log(`⚡ Calculated MBTI: ${type}, Confidence: ${confidence}`);

  if (!isValidMBTIType(type) || confidence < CONFIDENCE_THRESHOLD) {
    const bestMatch = Object.keys(mbtiDictionary).reduce(
      (best, mbti) => {
        const scoreDiff = Object.keys(rawScores).reduce((sum, dim) => {
          return (
            sum +
            Math.abs(
              rawScores[dim as DimensionPair] -
                (mbtiDictionary[mbti as MBTIType].analysisCriteria[
                  dim as DimensionPair
                ]?.expectedScore || 0),
            )
          );
        }, 0);

        return scoreDiff < best.score
          ? { type: mbti as MBTIType, score: scoreDiff }
          : best;
      },
      { type: "UNKNOWN", score: Infinity },
    ).type;

    console.log(`🔍 Best alternative MBTI: ${bestMatch}`);

    return {
      type: bestMatch as MBTIType,
      confidence,
      breakdown: dimensionScores,
      bestMatch: bestMatch as MBTIType,
    };
  }

  return {
    type,
    confidence,
    breakdown: dimensionScores,
    bestMatch: type,
  };
};
