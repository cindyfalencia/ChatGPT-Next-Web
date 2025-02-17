import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { mbtiDictionary, MBTIType } from "../mbti-dictionary/mbtiDictionary";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced analysis types
type DimensionPair = "E/I" | "S/N" | "T/F" | "J/P";
function isDimensionPair(dim: string): dim is DimensionPair {
  return ["E/I", "S/N", "T/F", "J/P"].includes(dim);
}

type AnalysisResult = {
  type: MBTIType | "UNKNOWN";
  confidence: number;
  breakdown: Record<
    DimensionPair,
    {
      score: number;
      indicators: string[];
    }
  >;
};

// Configuration
const ANALYSIS_WEIGHTS = {
  chatHistory: 0.7,
  questionnaire: 0.3,
};
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

const fullAnalysis = (
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
        ["team", "social", "we", "group"],
        ["alone", "individual", "I", "solo"],
        0.7,
      ) +
      (socialFeatures.weCount / (socialFeatures.iCount + 1)) * 0.3,
    "S/N":
      analyzeDimension(
        combinedText,
        ["fact", "detail", "practical", "now"],
        ["theory", "future", "possibility", "vision"],
        0.8,
      ) +
      (cognitiveFeatures.concreteTerms - cognitiveFeatures.abstractTerms) * 0.2,
    "T/F":
      analyzeDimension(
        combinedText,
        ["logic", "objective", "analysis", "critique"],
        ["feel", "value", "harmony", "empathy"],
        0.9,
      ) +
      (cognitiveFeatures.logicalTerms - cognitiveFeatures.emotionTerms) * 0.1,
    "J/P": analyzeDimension(
      combinedText,
      ["plan", "organize", "deadline", "structure"],
      ["flexible", "spontaneous", "adapt", "open"],
      0.85,
    ),
  };

  const type = [
    dimensionScores["E/I"] > 0 ? "E" : "I",
    dimensionScores["S/N"] > 0 ? "S" : "N",
    dimensionScores["T/F"] > 0 ? "T" : "F",
    dimensionScores["J/P"] > 0 ? "J" : "P",
  ].join("") as MBTIType;

  const confidence =
    Object.values(dimensionScores).reduce(
      (sum, score) => sum + Math.abs(score),
      0,
    ) /
    (Object.keys(dimensionScores).length * 10);

  // Cross-validate with dictionary
  const dictValidation = isValidMBTIType(type)
    ? Object.entries(mbtiDictionary[type].analysisCriteria).reduce(
        (sum, [dim, criteria]) => {
          const scoreMatch =
            1 -
            Math.abs(
              dimensionScores[dim as DimensionPair] - criteria.expectedScore,
            );
          return sum + scoreMatch;
        },
        0,
      ) / Object.keys(mbtiDictionary[type].analysisCriteria).length
    : 0;

  const finalConfidence = confidence * 0.6 + dictValidation * 0.4;

  return {
    type: finalConfidence >= CONFIDENCE_THRESHOLD ? type : "UNKNOWN",
    confidence: finalConfidence,
    breakdown: {
      "E/I": {
        score: dimensionScores["E/I"],
        indicators: [
          `Social references: ${socialFeatures.socialTerms}`,
          `We/I ratio: ${socialFeatures.weCount}/${socialFeatures.iCount}`,
        ],
      },
      "S/N": {
        score: dimensionScores["S/N"],
        indicators: [
          `Concrete terms: ${cognitiveFeatures.concreteTerms}`,
          `Abstract terms: ${cognitiveFeatures.abstractTerms}`,
        ],
      },
      "T/F": {
        score: dimensionScores["T/F"],
        indicators: [
          `Logical terms: ${cognitiveFeatures.logicalTerms}`,
          `Emotion terms: ${cognitiveFeatures.emotionTerms}`,
        ],
      },
      "J/P": {
        score: dimensionScores["J/P"],
        indicators: [
          `Planning terms: ${countOccurrences(combinedText, [
            "plan",
            "organize",
          ])}`,
          `Flexibility terms: ${countOccurrences(combinedText, [
            "flexible",
            "spontaneous",
          ])}`,
        ],
      },
    },
  };
};

const createResponseHeaders = () => {
  return new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
};

export async function POST(req: NextRequest) {
  const headers = createResponseHeaders();

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    const { chatHistory, questionnaire } = await req.json();

    if (!chatHistory || !questionnaire) {
      return NextResponse.json(
        { error: "At least one of chatHistory or questionnaire is required." },
        { status: 400 },
      );
    }

    const analysis = fullAnalysis(chatHistory || "", questionnaire || "");

    const { data, error } = await supabase
      .from("UserData")
      .insert([
        {
          chat_history: chatHistory,
          questionnaire,
          mbti: analysis.type,
          analysis_metadata: {
            confidence: analysis.confidence,
            breakdown: analysis.breakdown,
            timestamp: new Date().toISOString(),
          },
        },
      ])
      .select("*"); // Added this to fetch and log inserted data

    console.log("Insert response:", data, error);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Database insert failed: ${error.message}` }, // Log actual error message
        { status: 500 },
      );
    }

    // const { error } = await supabase.from("UserData").insert([
    //   {
    //     chat_history: chatHistory,
    //     questionnaire,
    //     mbti: analysis.type,
    //     analysis_metadata: {
    //       confidence: analysis.confidence,
    //       breakdown: analysis.breakdown,
    //       timestamp: new Date().toISOString(),
    //     },
    //   },
    // ]);

    // if (error) {
    //   console.error("Supabase insert error:", error);
    //   return NextResponse.json(
    //     { error: "Failed to save data to the database." },
    //     { status: 500 },
    //   );
    // }

    return NextResponse.json(
      {
        success: true,
        mbti: analysis.type,
        confidence: analysis.confidence,
        breakdown: analysis.breakdown,
        dictionaryMatch: isValidMBTIType(analysis.type)
          ? mbtiDictionary[analysis.type]
          : null,
      },
      { status: 200, headers },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

// Helper function to validate MBTI type
function isValidMBTIType(type: string): type is MBTIType {
  return type in mbtiDictionary;
}
