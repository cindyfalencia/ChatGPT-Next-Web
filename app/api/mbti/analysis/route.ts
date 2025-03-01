import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch MBTI analysis" },
        { status: response.status },
      );
    }

    const result = await response.json();
    console.log("FastAPI MBTI Result:", result);

    return NextResponse.json({
      type: result.mbti || "UNKNOWN",
      confidence: result.confidence || 0,
      bestMatch: result.mbti || "UNKNOWN",
      breakdown: {}, // Optional if FastAPI provides additional insights
    });
  } catch (error) {
    console.error("Error fetching MBTI analysis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
