import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { chatHistory, questionnaire } = await req.json();

    if (!chatHistory && !questionnaire) {
      return NextResponse.json(
        { error: "Both chatHistory and questionnaire are missing." },
        { status: 400 },
      );
    }

    console.log("Received chat history:", chatHistory || "None provided");
    console.log("Received questionnaire:", questionnaire || "None provided");

    // Respond with success
    return NextResponse.json({
      success: true,
      message: "Data received successfully.",
    });
  } catch (error) {
    console.error("Error during upload:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
