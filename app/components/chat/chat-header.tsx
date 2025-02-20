import React from "react";
import styles from "./chat.module.scss";
import ReloadIcon from "../icons/reload.svg";
import RenameIcon from "../icons/rename.svg";
import ExportIcon from "../icons/share.svg";
import { IconButton } from "../button";
import { showToast } from "../ui-lib";
import Locale from "@/app/locales";
import { useChatStore, ChatSession } from "@/app/store";

const ChatHeader: React.FC<{
  session: ChatSession;
  setIsEditingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setShowExport: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ session, setIsEditingMessage, setShowExport }) => {
  const chatStore = useChatStore();

  return (
    <div className="window-header">
      <div className={styles["chat-body-title"]}>
        <h2>{session.topic || "New Chat"}</h2>
      </div>

      <div className="window-actions">
        <IconButton
          icon={<ReloadIcon />}
          title={Locale.Chat.Actions.RefreshTitle}
          onClick={() => {
            showToast(Locale.Chat.Actions.RefreshToast);
            chatStore.summarizeSession(true, session);
          }}
        />
        <IconButton
          icon={<RenameIcon />}
          title={Locale.Chat.EditMessage.Title}
          onClick={() => setIsEditingMessage(true)}
        />
        <IconButton
          icon={<ExportIcon />}
          title={Locale.Chat.Actions.Export}
          onClick={() => setShowExport(true)}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
