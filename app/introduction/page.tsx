"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./introduction.module.scss";

const IntroductionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const questionnaire = e.currentTarget.questionnaire.value;

    try {
      const payload = { questionnaire };
      console.log("Sending payload:", payload);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        const { mbti } = result;

        if (!mbti || mbti === "UNKNOWN") {
          alert("Could not determine MBTI. Please provide more details.");
          return;
        }

        router.push(`/result?mbti=${mbti}`);
      } else {
        alert(`Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      alert("An error occurred during the upload. Please try again.");
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
          {isLoading ? "Uploading..." : "Submit and Proceed"}
        </button>
      </form>
    </div>
  );
};

export default IntroductionPage;
