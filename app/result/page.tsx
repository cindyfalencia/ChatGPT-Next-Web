"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./result.module.scss";
import { mbtiDictionary } from "@/app/api/mbti-dictionary/mbtiDictionary";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mbti = searchParams?.get("mbti");

  useEffect(() => {
    if (!mbti) {
      router.push("/introduction");
    }
  }, [mbti, router]);

  const handleProceed = () => {
    router.push("/avatar");
  };

  if (!mbti) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your MBTI Result: {mbti}</h1>
      <p className={styles.description}>
        {mbtiDictionary[mbti] || "We couldn't determine your MBTI type."}
      </p>
      <button className={styles.proceedButton} onClick={handleProceed}>
        Proceed to Avatar Customization
      </button>
    </div>
  );
};

export default ResultPage;
