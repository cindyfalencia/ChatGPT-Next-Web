"use client";

import styles from "./avatar.module.scss";

const AvatarPage = () => {
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
            height: "800px",
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
