"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./result.module.scss";
import { mbtiDictionary } from "@/app/api/mbti-dictionary/mbtiDictionary";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mbti = searchParams.get("mbti");

  useEffect(() => {
    if (!mbti) {
      router.push("/introduction"); // Redirect if no MBTI result is found
    }
  }, [mbti, router]);

  const handleProceed = () => {
    router.push("/avatar"); // Navigate to avatar page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your MBTI Result: {mbti}</h1>
      <p className={styles.description}>
        {mbti ? mbtiDictionary[mbti] : "Unable to determine MBTI."}
      </p>
      <button className={styles.proceedButton} onClick={handleProceed}>
        Proceed to Avatar Customization
      </button>
    </div>
  );
};

export default ResultPage;
