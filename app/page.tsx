"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { Home } from "./components/home";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (!session) {
        // User is not logged in, redirect to auth page
        router.push("/auth");
      } else {
        // Check if the user is new or returning
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_new")
          .single();

        if (profile?.is_new) {
          router.push("/introduction");
        } else {
          router.push("/home");
        }
      }
    };

    checkAuthStatus();
  }, [router]);

  return (
    <>
      <Home />
      <Analytics />
    </>
  );
}
