import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return NextResponse.json(null, { status: 200, headers });
  }

  try {
    const { chatHistory, questionnaire } = await req.json();

    if (!chatHistory && !questionnaire) {
      return NextResponse.json(
        { error: "Both chatHistory and questionnaire are missing." },
        { status: 400 },
      );
    }

    console.log("Received chat history:", chatHistory || "None provided");
    console.log("Received questionnaire:", questionnaire || "None provided");

    return NextResponse.json(
      { success: true, message: "Data received successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during upload:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

export const config = { runtime: "edge" }; // Remove this to use default Node.js runtime
