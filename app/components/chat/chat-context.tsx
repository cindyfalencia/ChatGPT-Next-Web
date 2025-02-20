import { useChatStore, BOT_HELLO, useAccessStore } from "@/app/store";

export const useChatContext = () => {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const accessStore = useAccessStore();

  const context = session.mask.hideContext ? [] : session.mask.context.slice();

  if (
    context.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content
  ) {
    const copiedHello = { ...BOT_HELLO };
    if (!accessStore.isAuthorized()) {
      copiedHello.content = "You are not authorized to chat.";
    }
    context.push(copiedHello);
  }

  return context;
};
