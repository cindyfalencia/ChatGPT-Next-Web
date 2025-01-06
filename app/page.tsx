"use client";

export const dynamic = "force-dynamic";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { Home } from "./components/home";
import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default async function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  return (
    <>
      <Home />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
