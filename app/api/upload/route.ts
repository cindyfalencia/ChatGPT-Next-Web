import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function determineMBTI(chatHistory: string, questionnaire: string): string {
  if (questionnaire.includes("imaginative")) return "INFP";
  if (chatHistory.includes("practical")) return "ISTJ";
  return "INTJ"; // Default fallback
}

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

    console.log("Received chat history:", chatHistory || "None provided");
    console.log("Received questionnaire:", questionnaire || "None provided");

    const mbtiType = determineMBTI(chatHistory || "", questionnaire || "");

    const { data, error } = await supabase
      .from("UserData")
      .insert([{ chat_history: chatHistory, questionnaire, mbti: mbtiType }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save data to the database." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data received successfully.",
        data,
        mbti: mbtiType,
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
