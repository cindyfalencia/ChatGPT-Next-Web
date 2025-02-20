import React, { useState, useRef, RefObject } from "react";
import styles from "./chat.module.scss";
import { IconButton } from "../button";
import SendWhiteIcon from "../icons/send-white.svg";
import ChatActions from "./chat-actions";
import PromptHints from "./promp-hints";

// Define props interface
interface ChatInputPanelProps {
  scrollRef: RefObject<HTMLDivElement>;
  setShowShortcutKeyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Apply type to the component
const ChatInputPanel: React.FC<ChatInputPanelProps> = ({
  scrollRef,
  setShowShortcutKeyModal,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    console.log("Send Message:", userInput);
    setUserInput("");
  };

  // Mock prompt data
  const prompts = [
    { title: "Hello", content: "Hello, how can I help you?" },
    { title: "Goodbye", content: "Goodbye! Have a nice day." },
  ];

  // Handle selecting a prompt
  const handlePromptSelect = (prompt: { title: string; content: string }) => {
    setUserInput(prompt.content);
  };

  return (
    <div className={styles["chat-input-panel"]}>
      <PromptHints prompts={prompts} onPromptSelect={handlePromptSelect} />
      <ChatActions
        uploadImage={() => console.log("Upload Image")}
        scrollToBottom={() => console.log("Scroll to Bottom")}
        hitBottom={false} // Mocked value, replace with actual state
        uploading={false} // Mocked value, replace with actual state
        showPromptHints={() => console.log("Show Prompt Hints")}
        setShowShortcutKeyModal={setShowShortcutKeyModal}
      />

      <label className={styles["chat-input-panel-inner"]}>
        <textarea
          ref={inputRef}
          className={styles["chat-input"]}
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <IconButton
          icon={<SendWhiteIcon />}
          text="Send"
          onClick={handleSubmit}
        />
      </label>
    </div>
  );
};

export default ChatInputPanel;
