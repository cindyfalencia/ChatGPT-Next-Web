import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as File | null;

    if (!userId || !file) {
      return NextResponse.json(
        { error: "Missing userId or file" },
        { status: 400 },
      );
    }

    console.log(`✅ Uploading Avatar for User: ${userId}, File: ${file.name}`);

    // Upload Avatar to Supabase Storage
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
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    const avatarUrl = publicUrlData.publicUrl;
    console.log("✅ Avatar Uploaded Successfully:", avatarUrl);

    // Update UserData row with the new avatar URL
    const { error: dbError } = await supabase
      .from("UserData")
      .update({ avatar: avatarUrl })
      .eq("id", userId);

    if (dbError) {
      console.error("Database Update Error:", dbError);
      return NextResponse.json(
        { error: "Failed to update avatar in database" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, avatarUrl }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
