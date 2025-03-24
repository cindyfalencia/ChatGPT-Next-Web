import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
// import { fullAnalysis } from "@/app/utils/api";
import { fullAnalysis } from "@/app/api/mbti/analysis";
import { mbtiDictionary, MBTIType } from "@/app/api/mbti/dictionary";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const questionnaire = formData.get("questionnaire") as string;
    const userId = formData.get("userId") as string;

    if (!questionnaire || !userId) {
      return NextResponse.json(
        { error: "Missing questionnaire or userId" },
        { status: 400 },
      );
    }

    console.log("Received Data:", { questionnaire, userId });

    // Process MBTI Analysis
    const analysis = await fullAnalysis(questionnaire);

    // Determine the result type (strict UNKNOWN when confidence is low)
    const resultType =
      analysis.confidence >= 0.5 && isValidMBTIType(analysis.type)
        ? analysis.type
        : "UNKNOWN";

    console.log(
      `Analysis Result: ${resultType}, Confidence: ${analysis.confidence}`,
    );

    // Prepare data for Supabase
    const userData = {
      id: userId,
      questionnaire,
      mbti: resultType === "UNKNOWN" ? null : resultType, // Store NULL in DB for UNKNOWN
      avatar: null,
      analysis_metadata: JSON.stringify({
        confidence: analysis.confidence,
        breakdown: analysis.breakdown,
        timestamp: new Date().toISOString(),
      }),
    };

    const { error: dbError } = await supabase
      .from("UserData")
      .upsert(userData)
      .select("*");

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return NextResponse.json(
        { error: "Failed to save user data" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        type: resultType, // Always return the determined type (might be UNKNOWN)
        confidence: analysis.confidence,
        breakdown: analysis.breakdown,
        dictionaryMatch:
          resultType !== "UNKNOWN" ? mbtiDictionary[resultType] : null,
      },
      { status: 200 },
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
function isValidMBTIType(type: string | null | undefined): type is MBTIType {
  if (!type) return false;
  return Object.keys(mbtiDictionary).includes(type);
}
