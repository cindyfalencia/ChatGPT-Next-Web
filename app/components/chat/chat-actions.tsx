import React, { useState } from "react";
import styles from "./chat.module.scss";
import StopIcon from "../icons/pause.svg";
import BottomIcon from "../icons/bottom.svg";
import SettingsIcon from "../icons/chat-settings.svg";
import ImageIcon from "../icons/image.svg";
import { IconButton } from "../button";
import { showToast } from "../ui-lib";
import { useAppConfig, Theme } from "@/app/store";

// Define the type for the props
interface ChatActionsProps {
  uploadImage: () => void;
  scrollToBottom: () => void;
  hitBottom: boolean;
  uploading: boolean;
  showPromptHints: () => void;
  setShowShortcutKeyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Apply the type to the component
const ChatActions: React.FC<ChatActionsProps> = ({
  uploadImage,
  scrollToBottom,
  hitBottom,
  uploading,
  showPromptHints,
  setShowShortcutKeyModal,
}) => {
  const config = useAppConfig();
  const [theme, setTheme] = useState<Theme>(config.theme);

  const nextTheme = () => {
    const themes: Theme[] = [Theme.Auto, Theme.Light, Theme.Dark];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
    config.update((c) => {
      c.theme = themes[nextIndex];
    });
  };

  return (
    <div className={styles["chat-input-actions"]}>
      <IconButton
        icon={<StopIcon />}
        text="Stop"
        onClick={() => showToast("Stopping...")}
      />
      {!hitBottom && (
        <IconButton
          icon={<BottomIcon />}
          text="Scroll Down"
          onClick={scrollToBottom}
        />
      )}
      <IconButton
        icon={<SettingsIcon />}
        text="Settings"
        onClick={() => setShowShortcutKeyModal(true)}
      />
      <IconButton
        icon={<ImageIcon />}
        text="Upload Image"
        onClick={uploadImage}
        disabled={uploading}
      />
      <IconButton text="Theme" onClick={nextTheme} />
    </div>
  );
};

export default ChatActions;
