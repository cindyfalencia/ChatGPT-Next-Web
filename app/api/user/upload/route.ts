import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
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
    const file = formData.get("file") as File | null;

    if (!questionnaire || !userId) {
      return NextResponse.json(
        { error: "Missing questionnaire or userId" },
        { status: 400 },
      );
    }

    console.log("✅ Received Data:", { questionnaire, userId });

    // Step 1: Process MBTI Analysis
    const analysis = fullAnalysis(questionnaire);
    let mbtiType: MBTIType =
      isValidMBTIType(analysis.type) && analysis.confidence >= 0.65
        ? analysis.type
        : analysis.bestMatch;

    console.log(`Final MBTI: ${mbtiType}, Confidence: ${analysis.confidence}`);

    // Step 2: Handle Avatar Upload (if file exists)
    let avatarUrl = null;
    if (file) {
      const filePath = `avatars/${userId}.glb`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          contentType: "model/gltf-binary",
          upsert: true,
        });

      if (uploadError) {
        console.error("Avatar Upload Error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 },
        );
      }

      // Get the public URL
      avatarUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // Step 3: Store MBTI Result & Avatar URL in Database
    console.log("🔥 Upserting UserData:");
    const { error: dbError } = await supabase
      .from("UserData")
      .upsert({
        id: userId,
        questionnaire,
        mbti: mbtiType,
        avatar: avatarUrl,
        analysis_metadata: JSON.stringify({
          confidence: analysis.confidence,
          breakdown: analysis.breakdown,
          timestamp: new Date().toISOString(),
        }),
      })
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
        mbti: mbtiType,
        confidence: analysis.confidence,
        avatarUrl, // Return avatar URL if uploaded
        breakdown: analysis.breakdown,
        dictionaryMatch: mbtiDictionary[mbtiType] ?? null,
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
function isValidMBTIType(type: string): type is MBTIType {
  return Object.keys(mbtiDictionary).includes(type);
}
