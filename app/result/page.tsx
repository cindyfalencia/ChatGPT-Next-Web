"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./result.module.scss";
import { mbtiDictionary } from "@/app/api/mbti-dictionary/mbtiDictionary";
import { useRouter } from "next/navigation";

function Result() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mbti = searchParams.get("mbti");

  if (!mbti || mbti === "UNKNOWN") {
    return <h1>MBTI could not be determined. Please try again.</h1>;
  }

  const handleProceed = () => {
    router.push("/avatar");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your MBTI Result: {mbti}</h1>
      <p className={styles.description}>
        {mbtiDictionary[mbti].description ||
          "We couldn't determine your MBTI type."}
      </p>
      <button className={styles.proceedButton} onClick={handleProceed}>
        Proceed to Avatar Customization
      </button>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Result />
    </Suspense>
  );
}
