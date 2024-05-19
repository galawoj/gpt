import { type MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";

export type MessageType = {
    message: string;
    sender: "ChatGPT" | "user";
    direction: MessageDirection;
    position: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
  };