import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { fullAnalysis } from "@/app/utils/mbtiAnalysis";
import { mbtiDictionary, MBTIType } from "../mbti-dictionary/mbtiDictionary";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { questionnaire } = await req.json();

    if (!questionnaire) {
      return NextResponse.json(
        { error: "Questionnaire is required." },
        { status: 400 },
      );
    }

    const analysis = fullAnalysis(questionnaire || "");

    // Determine the MBTI type (use best match if confidence is too low)
    let mbtiType: MBTIType =
      isValidMBTIType(analysis.type) && analysis.confidence >= 0.65
        ? analysis.type
        : analysis.bestMatch;

    console.log(`Final MBTI: ${mbtiType}, Confidence: ${analysis.confidence}`);

    const { data, error } = await supabase
      .from("UserData")
      .insert([
        {
          questionnaire,
          mbti: mbtiType,
          analysis_metadata: {
            confidence: analysis.confidence,
            breakdown: analysis.breakdown,
            timestamp: new Date().toISOString(),
          },
        },
      ])
      .select("*");

    console.log("Insert response:", data, error);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Database insert failed: ${error.message}` }, // Log actual error message
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        mbti: mbtiType,
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
