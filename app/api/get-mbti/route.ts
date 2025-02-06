import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Valid User ID is required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("UserData")
      .select("mbti")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch MBTI from the database." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No MBTI data found for the provided user ID." },
        { status: 404 },
      );
    }

    return NextResponse.json({ mbti: data.mbti });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching MBTI." },
      { status: 500 },
    );
  }
}
