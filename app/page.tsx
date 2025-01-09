"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push("/introduction");
  }, [router]);

  return (
    <>
      {/* Render analytics only when running on Vercel */}
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
