"use client";

import styles from "./home.module.scss";
import { Home } from "../components/home";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Home />
    </div>
  );
}
