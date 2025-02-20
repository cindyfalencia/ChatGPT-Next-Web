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

  const { data, error } = await supabase
    .from("avatars")
    .select("glb_url")
    .eq("user_id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: "User GLB not found" }, { status: 404 });
  }

  return NextResponse.json({ glb_url: data.glb_url }, { status: 200 });
}
