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

    const chatHistory = e.currentTarget.chatHistory.value;
    const questionnaire = e.currentTarget.questionnaire.value;

    try {
      console.log("Submitting data:", { chatHistory, questionnaire });

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatHistory, questionnaire }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("API success response:", result);
        router.push("/avatar");
      } else {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        alert(`Upload failed: ${errorData.error || "Unknown error"}`);
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
        Help us understand your personality by providing data below:
      </p>
      <form className={styles.form} onSubmit={handleUpload}>
        <label className={styles.label}>
          Chat History (optional):
          <textarea
            name="chatHistory"
            rows={4}
            cols={50}
            placeholder="Paste your chat history here"
            className={styles.textarea}
          ></textarea>
        </label>
        <label className={styles.label}>
          Personality Questionnaire:
          <textarea
            name="questionnaire"
            rows={6}
            cols={50}
            placeholder="E.g., Describe your ideal weekend, your favorite activities, etc."
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