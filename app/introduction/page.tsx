"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./introduction.module.scss";
import { v4 as uuidv4 } from "uuid";

const IntroductionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Generate or retrieve user ID from local storage
  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4(); // Generate a new unique ID
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
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
        const { mbti } = result;

        if (!mbti || mbti === "UNKNOWN") {
          alert(
            "Could not determine your MBTI with confidence. Try again with more details.",
          );
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
