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

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/avatar"); // Redirect to Avatar Page after successful upload
      } else {
        const errorData = await response.json();
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
        Upload your data to create a custom avatar and personality
      </p>
      <form
        className={styles.form}
        onSubmit={handleUpload}
        encType="multipart/form-data"
      >
        <label>
          Chat History:
          <textarea
            name="chatHistory"
            rows={4}
            cols={50}
            placeholder="Paste your chat history here"
          ></textarea>
        </label>
        <label>
          Upload photos or videos:
          <input type="file" name="media" accept="image/*,video/*" multiple />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Submit and Generate Avatar"}
        </button>
      </form>
    </div>
  );
};

export default IntroductionPage;
