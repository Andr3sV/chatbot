export type Channel = "whatsapp" | "instagram" | "google" | "llamadas";

export interface Contact {
  phone: string;
  name?: string;
  status: "online" | "offline";
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: "client" | "agent" | "ai";
  timestamp: Date;
  status: "sent" | "delivered" | "draft" | "pending_approval" | "sending";
  aiSuggestion?: string;
}

export interface ConversationMeta {
  postUrl?: string;
  postCaption?: string;
  rating?: number;
  businessName?: string;
  duration?: number;
  /** Para llamadas: si la llamada fue transferida */
  transferred?: boolean;
}

export interface Conversation {
  id: string;
  channel: Channel;
  contact: Contact;
  lastMessage?: Message;
  unreadCount: number;
  hasPendingApproval?: boolean;
  meta?: ConversationMeta;
}

export interface CopilotConfig {
  blacklist: string[];
  waitTimeMinutes: number;
  enableAIForNewContacts: boolean;
}
