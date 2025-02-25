"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../avatar.module.scss";

const AvatarUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert(
        "Error: No user ID found. Please complete the questionnaire first.",
      );
      router.push("/introduction"); // Redirect back if no userId found
    }
  }, [router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file || !userId) return alert("Error: Missing file or user ID.");
    setUploading(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("file", file);

    try {
      console.log("🔹 Sending request to API...");
      const response = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Upload result:", result);

      if (!response.ok) {
        throw new Error(`Upload failed: ${result.error || "Unknown error"}`);
      }

      alert("Avatar uploaded successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Upload Your Avatar</h1>
      <p className={styles.description}>
        Upload the .glb file you downloaded from Avaturn.
      </p>
      <input
        type="file"
        accept=".glb"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <button
        onClick={uploadFile}
        disabled={uploading}
        className={styles.nextButton}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default AvatarUpload;
