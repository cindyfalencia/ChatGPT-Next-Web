"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./introduction.module.scss";
import { v4 as uuidv4 } from "uuid";

const IntroductionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === "#/auth") return;

    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    console.log("Current hash:", window.location.hash);
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userId) {
      alert("Error: Unable to generate user ID.");
      setIsLoading(false);
      return;
    }

    const questionnaire = e.currentTarget.questionnaire.value.trim();
    if (!questionnaire) {
      alert("Please provide a response to the questionnaire.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("questionnaire", questionnaire);
      formData.append("userId", userId);

      console.log("Sending payload:", { questionnaire, userId });

      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        localStorage.setItem(
          "mbtiResult",
          JSON.stringify({
            type: result.type,
            confidence: result.confidence,
            breakdown: result.breakdown,
            dictionaryMatch: result.dictionaryMatch,
          }),
        );

        router.push(`/result?type=${result.type}`);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Personalized Chatbot</h1>
      <p className={styles.description}>
        Help us understand your personality by answering the question below:
      </p>
      <form className={styles.form} onSubmit={handleUpload}>
        <label className={styles.label}>
          Tell me about yourself:
          <textarea
            name="questionnaire"
            rows={6}
            cols={50}
            placeholder="What are your core values, motivations, and interests? What kind of things excite you or make you feel fulfilled? Feel free to include anything about your lifestyle, work, relationships, or passions—whatever feels important to you."
            className={styles.textarea}
          ></textarea>
        </label>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Get My Results"}
        </button>
      </form>
    </div>
  );
};

export default IntroductionPage;
