"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default function App() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/introduction");
    }
  }, [pathname, router]);

  return (
    <>
      {/* Render analytics only when running on Vercel */}
      {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
