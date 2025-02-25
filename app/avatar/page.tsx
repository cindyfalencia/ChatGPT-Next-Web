"use client";

import { useEffect, useState } from "react";
import styles from "./avatar.module.scss";

const AvatarPage = () => {
  const [iframeHeight, setIframeHeight] = useState("75vh");

  useEffect(() => {
    const updateHeight = () => {
      setIframeHeight(`${window.innerHeight * 0.75}px`);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleNext = () => {
    // Redirect to the home page after customization
    window.location.href = "/home";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customize your Avatar</h1>
      <p className={styles.description}>
        Create your personalized avatar to enhance the chatbot experience.
      </p>
      <div className={styles.iframeContainer}>
        <iframe
          src="https://hub.avaturn.me/create/upload"
          title="Avatar Customization"
          style={{
            width: "100%",
            height: iframeHeight,
            border: "none",
          }}
        ></iframe>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AvatarPage;
