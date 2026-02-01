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
  status: "sent" | "delivered" | "draft" | "pending_approval";
  aiSuggestion?: string;
}

export interface Conversation {
  id: string;
  contact: Contact;
  lastMessage?: Message;
  unreadCount: number;
  hasPendingApproval?: boolean;
}

export interface CopilotConfig {
  blacklist: string[];
  waitTimeMinutes: number;
  enableAIForNewContacts: boolean;
}
