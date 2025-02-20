import React, { useEffect, useRef, useState } from "react";
import styles from "./chat.module.scss";
import clsx from "clsx";

// Define the props type
interface Prompt {
  title: string;
  content: string;
}

interface PromptHintsProps {
  prompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
}

// Apply type to the component
const PromptHints: React.FC<PromptHintsProps> = ({
  prompts,
  onPromptSelect,
}) => {
  const noPrompts = prompts.length === 0;
  const [selectIndex, setSelectIndex] = useState(0);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Reset index when prompts change
  useEffect(() => {
    setSelectIndex(0);
  }, [prompts.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (noPrompts || e.metaKey || e.altKey || e.ctrlKey) return;

      setSelectIndex((prevIndex) => {
        let newIndex = prevIndex;
        if (e.key === "ArrowUp") newIndex = Math.max(0, prevIndex - 1);
        if (e.key === "ArrowDown")
          newIndex = Math.min(prompts.length - 1, prevIndex + 1);
        return newIndex;
      });

      if (e.key === "Enter") {
        e.preventDefault();
        onPromptSelect(prompts[selectIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prompts, selectIndex, onPromptSelect]);

  if (noPrompts) return null;

  return (
    <div className={styles["prompt-hints"]} role="list">
      {prompts.map((prompt, i) => (
        <div
          key={i}
          ref={i === selectIndex ? selectedRef : null}
          role="button"
          tabIndex={0}
          className={clsx(styles["prompt-hint"], {
            [styles["selected"]]: i === selectIndex,
          })}
          onClick={() => onPromptSelect(prompt)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPromptSelect(prompt);
            }
          }}
        >
          <div className={styles["hint-title"]}>{prompt.title}</div>
          <div className={styles["hint-content"]}>{prompt.content}</div>
        </div>
      ))}
    </div>
  );
};

export default PromptHints;
