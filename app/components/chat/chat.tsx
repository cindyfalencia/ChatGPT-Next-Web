import React, { useState, useRef } from "react";
import { useChatStore } from "@/app/store";
import styles from "./chat.module.scss";
import ChatHeader from "./chat-header";
import ChatBody from "./chat-body";
import ChatInputPanel from "./chat-input-panel";
import ExportMessageModal from "./export-message-modal";
import EditMessageModal from "./edit-message-modal";
import ShortcutKeyModal from "./shortcut-key-modal";

function _Chat() {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showExport, setShowExport] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [showShortcutKeyModal, setShowShortcutKeyModal] = useState(false);

  return (
    <>
      <div className={styles.chat} key={session.id}>
        <ChatHeader
          session={session}
          setIsEditingMessage={setIsEditingMessage}
          setShowExport={setShowExport}
        />

        <div className={styles["chat-main"]}>
          <ChatBody scrollRef={scrollRef} />
          <ChatInputPanel
            scrollRef={scrollRef}
            setShowShortcutKeyModal={setShowShortcutKeyModal}
          />
        </div>
      </div>

      {showExport && (
        <ExportMessageModal onClose={() => setShowExport(false)} />
      )}
      {isEditingMessage && (
        <EditMessageModal onClose={() => setIsEditingMessage(false)} />
      )}
      {showShortcutKeyModal && (
        <ShortcutKeyModal onClose={() => setShowShortcutKeyModal(false)} />
      )}
    </>
  );
}

export function Chat() {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  return <_Chat key={session.id} />;
}
