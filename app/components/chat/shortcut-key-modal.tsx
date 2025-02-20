import React from "react";
import styles from "./chat.module.scss";
import { Modal } from "../ui-lib";
import ConfirmIcon from "../icons/confirm.svg";

// Define prop types
interface ShortcutKeyModalProps {
  onClose: () => void;
}

const ShortcutKeyModal: React.FC<ShortcutKeyModalProps> = ({ onClose }) => {
  const shortcuts = [
    { title: "New Chat", keys: ["Ctrl", "Shift", "O"] },
    { title: "Focus Input", keys: ["Shift", "Esc"] },
    { title: "Copy Last Message", keys: ["Ctrl", "Shift", "C"] },
  ];

  return (
    <Modal title="Shortcut Keys" onClose={onClose}>
      <div className={styles["shortcut-key-grid"]} role="list">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className={styles["shortcut-key-item"]}
            role="listitem"
          >
            <div className={styles["shortcut-key-title"]}>{shortcut.title}</div>
            <div className={styles["shortcut-key-keys"]}>
              {shortcut.keys.map((key, i) => (
                <div key={i} className={styles["shortcut-key"]}>
                  {key}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Ensure ConfirmIcon behaves like a button */}
      <div
        className={styles["shortcut-close-button"]}
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      >
        <ConfirmIcon />
      </div>
    </Modal>
  );
};

export default ShortcutKeyModal;
