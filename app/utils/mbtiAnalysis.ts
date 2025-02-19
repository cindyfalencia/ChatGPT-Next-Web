import {
  mbtiDictionary,
  MBTIType,
} from "../api/mbti-dictionary/mbtiDictionary";

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
const CONFIDENCE_THRESHOLD = 0.65;

// Text processing utilities
const cleanText = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, "");
const countOccurrences = (text: string, terms: string[]) =>
  terms.filter((term) => cleanText(text).includes(term)).length;

// Linguistic feature extractors
const extractSocialFeatures = (text: string) => ({
  weCount: (text.match(/\bwe\b/g) || []).length,
  iCount: (text.match(/\bI\b/g) || []).length,
  socialTerms: countOccurrences(text, ["team", "friend", "party", "social"]),
  solitaryTerms: countOccurrences(text, [
    "alone",
    "read",
    "individual",
    "quiet",
  ]),
});

const extractCognitiveFeatures = (text: string) => ({
  concreteTerms: countOccurrences(text, ["fact", "practical", "now", "detail"]),
  abstractTerms: countOccurrences(text, [
    "theory",
    "future",
    "possibility",
    "idea",
  ]),
  logicalTerms: countOccurrences(text, [
    "logic",
    "objective",
    "analysis",
    "critique",
  ]),
  emotionTerms: countOccurrences(text, ["feel", "value", "harmony", "empathy"]),
});

// Dimension analysis
const analyzeDimension = (
  text: string,
  positiveTerms: string[],
  negativeTerms: string[],
  baseWeight: number,
) => {
  const positiveScore = countOccurrences(text, positiveTerms);
  const negativeScore = countOccurrences(text, negativeTerms);
  return (positiveScore - negativeScore) * baseWeight;
};

export const fullAnalysis = (
  chatHistory: string,
  questionnaire: string,
): AnalysisResult => {
  const combinedText = `${chatHistory} ${questionnaire}`;
  const socialFeatures = extractSocialFeatures(combinedText);
  const cognitiveFeatures = extractCognitiveFeatures(combinedText);

  const dimensionScores = {
    "E/I":
      analyzeDimension(
        combinedText,
        ["team", "social", "we", "group", "talk", "debate", "discussion"],
        ["alone", "individual", "I", "solo", "quiet", "reserved"],
        1.5,
      ) +
      (socialFeatures.weCount / (socialFeatures.iCount + 1)) * 0.5,
    "S/N":
      analyzeDimension(
        combinedText,
        ["fact", "detail", "practical", "now"],
        ["theory", "future", "possibility", "vision", "innovation", "idea"],
        1.8,
      ) +
      (cognitiveFeatures.concreteTerms - cognitiveFeatures.abstractTerms) * 0.2,
    "T/F":
      analyzeDimension(
        combinedText,
        ["logic", "objective", "analysis", "critique"],
        ["feel", "value", "harmony", "empathy"],
        1.6,
      ) +
      (cognitiveFeatures.logicalTerms - cognitiveFeatures.emotionTerms) * 0.1,
    "J/P": analyzeDimension(
      combinedText,
      ["plan", "organize", "deadline", "structure"],
      ["flexible", "spontaneous", "adapt", "open", "go with the flow"],
      1.5,
    ),
  };

  const type = [
    dimensionScores["E/I"] > 0 ? "E" : "I",
    dimensionScores["S/N"] > 0 ? "S" : "N",
    dimensionScores["T/F"] > 0 ? "T" : "F",
    dimensionScores["J/P"] > 0 ? "J" : "P",
  ].join("") as MBTIType;

  const bestMatch = Object.entries(mbtiDictionary).reduce(
    (best, [mbti, traits]) => {
      const matchScore = Object.keys(traits.analysisCriteria).reduce(
        (sum, dim) => {
          return (
            sum +
            Math.abs(
              dimensionScores[dim as DimensionPair] -
                (traits.analysisCriteria[dim as DimensionPair]?.expectedScore ||
                  0),
            )
          );
        },
        0,
      );

      return matchScore < best.score
        ? { type: mbti as MBTIType, score: matchScore }
        : best;
    },
    { type: "UNKNOWN", score: Infinity },
  ).type;

  const confidence =
    Object.values(dimensionScores).reduce(
      (sum, score) => sum + Math.abs(score),
      0,
    ) /
    (Object.keys(dimensionScores).length * 3.5);

  return {
    type: confidence >= CONFIDENCE_THRESHOLD ? type : "UNKNOWN",
    confidence,
    breakdown: {
      "E/I": {
        score: dimensionScores["E/I"],
        indicators: [
          `We/I ratio: ${socialFeatures.weCount}/${socialFeatures.iCount}`,
        ],
      },
      "S/N": {
        score: dimensionScores["S/N"],
        indicators: [`Concrete terms: ${cognitiveFeatures.concreteTerms}`],
      },
      "T/F": {
        score: dimensionScores["T/F"],
        indicators: [`Logical terms: ${cognitiveFeatures.logicalTerms}`],
      },
      "J/P": {
        score: dimensionScores["J/P"],
        indicators: [
          `Planning terms: ${countOccurrences(combinedText, [
            "plan",
            "organize",
          ])}`,
        ],
      },
    },
    bestMatch,
  };
};
