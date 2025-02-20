import React, { useState } from "react";
import { useChatStore } from "@/app/store";
import { Modal } from "../ui-lib";
import { IconButton } from "../button";
import ConfirmIcon from "../icons/confirm.svg";
import CancelIcon from "../icons/cancel.svg";
import styles from "./chat.module.scss";

// Define prop types
interface EditMessageModalProps {
  onClose: () => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({ onClose }) => {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const [messages, setMessages] = useState([...session.messages]);

  // Function to handle input change
  const handleInputChange = (index: number, value: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, content: value } : msg,
      ),
    );
  };

  return (
    <Modal title="Edit Messages" onClose={onClose}>
      <div className={styles["edit-message-container"]}>
        {messages.map((msg, index) => (
          <div key={msg.id} className={styles["edit-message-item"]}>
            <input
              type="text"
              value={typeof msg.content === "string" ? msg.content : ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className={styles["edit-message-actions"]}>
        <IconButton icon={<CancelIcon />} text="Cancel" onClick={onClose} />
        <IconButton
          icon={<ConfirmIcon />}
          text="Save"
          type="primary"
          onClick={() => {
            chatStore.updateTargetSession(session, (s) => {
              s.messages = [...messages]; // Ensure we create a new reference
            });
            onClose();
          }}
        />
      </div>
    </Modal>
  );
};

export default EditMessageModal;
