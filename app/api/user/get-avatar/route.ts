import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Fetch avatar URL from UserData table
  const { data, error } = await supabase
    .from("UserData")
    .select("avatar")
    .eq("id", userId)
    .single();

  if (error || !data?.avatar) {
    return NextResponse.json(
      { error: "No avatar found for this user" },
      { status: 404 },
    );
  }

  return NextResponse.json({ glb_url: data.avatar }, { status: 200 });
}
