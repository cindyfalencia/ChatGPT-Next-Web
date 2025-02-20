export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

export const autoGrowTextArea = (element: HTMLTextAreaElement): void => {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

export const scrollToBottom = (element: HTMLElement): void => {
  if (!element) return;
  element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
};

// Define a type for the expected structure of a message
interface ChatMessage {
  content: string | object;
}

export const getMessageTextContent = (message: ChatMessage): string => {
  return typeof message.content === "string"
    ? message.content
    : JSON.stringify(message.content);
};
