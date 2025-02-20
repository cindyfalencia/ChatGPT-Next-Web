import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("UserData")
      .select("mbti")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "No MBTI data found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ mbti: data.mbti }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching MBTI." },
      { status: 500 },
    );
  }
}
