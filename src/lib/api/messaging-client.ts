import type {
  Channel,
  Conversation,
  Message,
  CopilotConfig,
} from "./messaging-types";

export interface IMessagingClient {
  getConversations(channel?: Channel | "all"): Promise<Conversation[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, content: string): Promise<Message>;
  approveAISuggestion(
    conversationId: string,
    messageId: string,
    content?: string
  ): Promise<Message>;
  discardAISuggestion(
    conversationId: string,
    messageId: string
  ): Promise<void>;
  getConfig(): Promise<CopilotConfig>;
  saveConfig(config: CopilotConfig): Promise<void>;
}
