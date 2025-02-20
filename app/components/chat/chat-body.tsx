import React, { RefObject, Fragment } from "react";
import styles from "./chat.module.scss";
import { useChatStore, useAppConfig } from "@/app/store";
import AvatarContainer from "./avatar/avatar-container";
import LoadingIcon from "../icons/three-dots.svg";
import { IconButton } from "../button";
import EditIcon from "../icons/rename.svg";
import CopyIcon from "../icons/copy.svg";
import DeleteIcon from "../icons/clear.svg";
import PinIcon from "../icons/pin.svg";
import {
  copyToClipboard,
  getMessageTextContent,
  getMessageImages,
} from "@/app/utils";

import dynamic from "next/dynamic";

interface ChatBodyProps {
  scrollRef: RefObject<HTMLDivElement>;
}

const Markdown = dynamic(async () => (await import("../markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});

const ChatBody: React.FC<ChatBodyProps> = ({ scrollRef }) => {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const config = useAppConfig();
  const messages = session.messages;

  return (
    <div className={styles["chat-body-container"]}>
      <div className={styles["chat-body"]} ref={scrollRef}>
        {/* Avatar Container */}
        <div className={styles["chat-body-avatar-container"]}>
          <AvatarContainer userId={session.id} />
        </div>

        {/* Chat Messages */}
        <div className={styles["chat-messages-wrapper"]}>
          {messages.map((message, i) => {
            const isUser = message.role === "user";
            const showActions = i > 0 && message.content.length > 0;

            return (
              <Fragment key={message.id}>
                <div
                  className={
                    isUser
                      ? styles["chat-message-user"]
                      : styles["chat-message"]
                  }
                >
                  <div className={styles["chat-message-container"]}>
                    <div className={styles["chat-message-header"]}>
                      {/* Avatar */}
                      <div className={styles["chat-message-avatar"]}>
                        {isUser ? (
                          <AvatarContainer userId={session.id} />
                        ) : (
                          <AvatarContainer userId="assistant" />
                        )}
                      </div>

                      {/* Actions */}
                      {showActions && (
                        <div className={styles["chat-message-actions"]}>
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Edit"
                            onClick={() => {
                              const newContent = prompt(
                                "Edit message:",
                                getMessageTextContent(message),
                              );
                              if (newContent) {
                                chatStore.updateTargetSession(session, (s) => {
                                  const msg = s.messages.find(
                                    (m) => m.id === message.id,
                                  );
                                  if (msg) msg.content = newContent;
                                });
                              }
                            }}
                          />
                          <IconButton
                            icon={<CopyIcon />}
                            aria-label="Copy"
                            onClick={() =>
                              copyToClipboard(getMessageTextContent(message))
                            }
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete"
                            onClick={() =>
                              chatStore.updateTargetSession(session, (s) => {
                                s.messages = s.messages.filter(
                                  (m) => m.id !== message.id,
                                );
                              })
                            }
                          />
                          <IconButton
                            icon={<PinIcon />}
                            aria-label="Pin"
                            onClick={() => console.log("Pinned message")}
                          />
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={styles["chat-message-item"]}>
                      <Markdown content={getMessageTextContent(message)} />
                      {getMessageImages(message).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="Message Image"
                          className={styles["chat-message-item-image"]}
                        />
                      ))}
                    </div>

                    {/* Timestamp */}
                    <div className={styles["chat-message-action-date"]}>
                      {new Date(message.date).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
