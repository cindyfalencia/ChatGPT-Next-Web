import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { chatHistory, questionnaire } = await req.json();

    if (!chatHistory || !questionnaire) {
      return NextResponse.json(
        { error: "Both chatHistory and questionnaire are required." },
        { status: 400 },
      );
    }

    console.log("Received chat history:", chatHistory);
    console.log("Received questionnaire:", questionnaire);

    const { data, error } = await supabase
      .from("UserData")
      .insert([{ chat_history: chatHistory, questionnaire }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save data to the database." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Data received successfully.", data },
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
