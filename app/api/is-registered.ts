import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  // query supabase to check user
  const { data, error } = await supabase
    .from("profiles")
    .select("is_new")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error checking user", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }

  if (!data) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ isRegistered: true, isNew: !data.is_new });
}
