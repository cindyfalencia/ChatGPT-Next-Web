import { useChatStore } from "@/app/store";

// Define the command mapping type
type ChatCommand = "/new" | "/clear" | "/prev" | "/next" | "/delete" | "/fork";

export const useChatCommand = () => {
  const chatStore = useChatStore();

  // Define the commands with proper types
  const commands: Record<ChatCommand, () => void> = {
    "/new": () => chatStore.newSession(),
    "/clear": () =>
      chatStore.updateTargetSession(
        chatStore.currentSession(),
        (s) => (s.messages = []),
      ),
    "/prev": () => chatStore.nextSession(-1),
    "/next": () => chatStore.nextSession(1),
    "/delete": () => chatStore.deleteSession(chatStore.currentSessionIndex),
    "/fork": () => chatStore.forkSession(),
  };

  return {
    match: (input: string) => {
      const commandFunction = commands[input as ChatCommand];
      return {
        matched: Boolean(commandFunction),
        invoke: () => commandFunction?.(),
      };
    },

    search: (input: string) => {
      return Object.keys(commands)
        .filter((cmd) => cmd.includes(input))
        .map((cmd) => ({ title: `Command: ${cmd}`, content: cmd }));
    },
  };
};
