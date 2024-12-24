"use client";

export const dynamic = "force-dynamic";

import styles from "./avatar.module.scss";

const AvatarPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customize your avatar</h1>
      <p className={styles.description}>
        Create a personalized avatar to enhance your chatbot experience.
      </p>
      <div className={styles.iframeContainer}>
        <iframe
          src="https://avaturn.com/embed"
          title="Avatar customization"
        ></iframe>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.nextButton}
          onClick={() => (window.location.href = "/new-chat")}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AvatarPage;
