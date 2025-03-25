"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styles from "./result.module.scss";
import { useRouter } from "next/navigation";

type ResultData = {
  type: string;
  confidence: number;
  breakdown: any;
  dictionaryMatch: any;
};

function Result() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("mbtiResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  const type = searchParams.get("type");
  const confidence = parseFloat(searchParams.get("confidence") || "0");

  if (!result) {
    return <div className={styles.container}>Loading results...</div>;
  }

  const handleRetry = () => {
    router.push("/");
  };

  const handleProceed = () => {
    router.push("/avatar");
  };

  return (
    <div className={styles.container}>
      {result.type === "UNKNOWN" ? (
        <>
          <div className={styles.content}>
            <h1 className={styles.title} data-type={result.type}>
              {result.type === "UNKNOWN"
                ? "Unable to Determine Personality Type"
                : `Your Personality Type: ${result.type}`}
            </h1>
            <p className={styles.description}>
              We couldn&apos;t confidently determine your MBTI type...
            </p>
            <div className={styles.breakdown}>
              <h3>Analysis Details:</h3>
              <pre className={styles.breakdownData}>
                {JSON.stringify(result.breakdown, null, 2)}
              </pre>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.retryButton} onClick={handleRetry}>
              Try Again with More Details
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Your Personality Type: {result.type}
            </h1>
            <p
              className={styles.confidence}
              data-confidence={result.confidence < 0.5 ? "low" : "high"}
            >
              Confidence Level: {(result.confidence * 100).toFixed(1)}%
            </p>
            {result.dictionaryMatch && (
              <div className={styles.description}>
                <h3>About {result.type}s:</h3>
                <p>{result.dictionaryMatch.description}</p>
              </div>
            )}
            <div className={styles.breakdown}>
              <h3>Analysis Breakdown:</h3>
              <pre className={styles.breakdownData}>
                {JSON.stringify(result.breakdown, null, 2)}
              </pre>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.retryButton} onClick={handleRetry}>
              Try Again
            </button>
            <button className={styles.proceedButton} onClick={handleProceed}>
              Proceed to Avatar Customization
            </button>
          </div>
        </>
      )}
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
