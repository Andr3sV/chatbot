import type { IMessagingClient } from "./messaging-client";
import type {
  Conversation,
  Message,
  CopilotConfig,
} from "./messaging-types";
import { generateBarbershopSuggestion } from "./ai-suggestion-generator";

const CONFIG_STORAGE_KEY = "chatbot_copilot_config";
const MESSAGES_STORAGE_KEY = "chatbot_mock_messages";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function loadConfig(): CopilotConfig {
  if (typeof window === "undefined") {
    return {
      blacklist: [],
      waitTimeMinutes: 5,
      enableAIForNewContacts: true,
    };
  }
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        blacklist: parsed.blacklist ?? [],
        waitTimeMinutes: parsed.waitTimeMinutes ?? 5,
        enableAIForNewContacts: parsed.enableAIForNewContacts ?? true,
      };
    }
  } catch {
    // ignore
  }
  return {
    blacklist: [],
    waitTimeMinutes: 5,
    enableAIForNewContacts: true,
  };
}

function saveConfig(config: CopilotConfig) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
}

function loadMessages(): Record<string, Message[]> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const result: Record<string, Message[]> = {};
      for (const [convId, msgs] of Object.entries(parsed) as [
        string,
        Message[]
      ][]) {
        result[convId] = msgs.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
      return result;
    }
  } catch {
    // ignore
  }
  return {};
}

function saveMessages(messages: Record<string, Message[]>) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }
}

function createSeedMessages(): Record<string, Message[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ten45 = new Date(today);
  ten45.setHours(10, 45, 0, 0);
  const ten46 = new Date(today);
  ten46.setHours(10, 46, 0, 0);

  const conv1Messages: Message[] = [
    {
      id: "m1",
      conversationId: "conv1",
      content: "¿Tienen disponibilidad mañana?",
      sender: "client",
      timestamp: ten45,
      status: "delivered",
    },
    {
      id: "m2",
      conversationId: "conv1",
      content:
        "[Borrador] ¡Hola! Sí, tenemos espacios disponibles. ¿Te gustaría reservar para mañana? Tenemos 10:00 AM y 4:00 PM disponibles.",
      sender: "ai",
      timestamp: ten46,
      status: "pending_approval",
      aiSuggestion:
        "¡Hola! Sí, tenemos espacios disponibles. ¿Te gustaría reservar para mañana? Tenemos 10:00 AM y 4:00 PM disponibles.",
    },
  ];

  const conv2Messages: Message[] = [
    {
      id: "m3",
      conversationId: "conv2",
      content: "Hola, buenos días",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 86400000),
      status: "delivered",
    },
    {
      id: "m4",
      conversationId: "conv2",
      content: "¡Hola! Bienvenido a Barbería Luis. ¿En qué puedo ayudarte?",
      sender: "ai",
      timestamp: new Date(ten46.getTime() - 86400000),
      status: "sent",
    },
  ];

  const conv3Messages: Message[] = [
    {
      id: "m5",
      conversationId: "conv3",
      content: "¿Cuál es el horario de atención?",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 3600000),
      status: "delivered",
    },
    {
      id: "m6",
      conversationId: "conv3",
      content: "Estamos abiertos lunes a sábado de 9:00 AM a 7:00 PM. Domingos cerrado.",
      sender: "ai",
      timestamp: new Date(ten46.getTime() - 3600000),
      status: "sent",
    },
  ];

  return {
    conv1: conv1Messages,
    conv2: conv2Messages,
    conv3: conv3Messages,
  };
}

const seedConversations: Conversation[] = [
  {
    id: "conv1",
    contact: {
      phone: "+52 1 55 1234 5678",
      name: "Carlos",
      status: "online",
    },
    unreadCount: 0,
  },
  {
    id: "conv2",
    contact: {
      phone: "+55 11 99999-9999",
      name: "María",
      status: "offline",
    },
    unreadCount: 1,
  },
  {
    id: "conv3",
    contact: {
      phone: "+1 555-0199",
      name: "Pedro",
      status: "online",
    },
    unreadCount: 0,
  },
];

export function createMockMessagingClient(): IMessagingClient {
  let messages = loadMessages();
  const hasStored = Object.keys(messages).length > 0;
  if (!hasStored) {
    messages = createSeedMessages();
    saveMessages(messages);
  }
  _messages = messages;

  return {
    async getConversations(): Promise<Conversation[]> {
      await delay(200);
      const convs = [...seedConversations];
      for (const conv of convs) {
        const msgs = messages[conv.id] ?? [];
        const last = msgs[msgs.length - 1];
        if (last) {
          conv.lastMessage = last;
        }
      }
      return convs;
    },

    async getMessages(conversationId: string): Promise<Message[]> {
      await delay(150);
      return messages[conversationId] ?? [];
    },

    async sendMessage(
      conversationId: string,
      content: string
    ): Promise<Message> {
      await delay(300);
      const msgs = messages[conversationId] ?? [];
      const newMsg: Message = {
        id: `m${Date.now()}`,
        conversationId,
        content,
        sender: "agent",
        timestamp: new Date(),
        status: "sent",
      };
      msgs.push(newMsg);
      messages[conversationId] = msgs;
      saveMessages(messages);
      return newMsg;
    },

    async approveAISuggestion(
      conversationId: string,
      messageId: string,
      content?: string
    ): Promise<Message> {
      await delay(300);
      const msgs = messages[conversationId] ?? [];
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx === -1) {
        throw new Error("Message not found");
      }
      const msg = msgs[idx];
      const finalContent =
        content ?? msg.aiSuggestion ?? msg.content.replace(/^\[Borrador\]\s*/, "");
      const updated: Message = {
        ...msg,
        content: finalContent,
        sender: "agent",
        status: "sent",
        aiSuggestion: undefined,
      };
      msgs[idx] = updated;
      messages[conversationId] = msgs;
      saveMessages(messages);
      return updated;
    },

    async discardAISuggestion(
      conversationId: string,
      messageId: string
    ): Promise<void> {
      await delay(200);
      const msgs = messages[conversationId] ?? [];
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx !== -1) {
        msgs.splice(idx, 1);
        messages[conversationId] = msgs;
        saveMessages(messages);
      }
    },

    async getConfig(): Promise<CopilotConfig> {
      await delay(100);
      return loadConfig();
    },

    async saveConfig(config: CopilotConfig): Promise<void> {
      await delay(200);
      saveConfig(config);
    },
  };
}

let _client: IMessagingClient | null = null;
let _messages: Record<string, Message[]> | null = null;

export function getMessagingClient(): IMessagingClient {
  const apiUrl = process.env.NEXT_PUBLIC_MESSAGING_API_URL;
  if (apiUrl) {
    // TODO: return new RealMessagingClient(apiUrl) when implemented
  }
  if (!_client) {
    _client = createMockMessagingClient();
  }
  return _client;
}

export function simulateWebSocketMessage(
  conversationId: string,
  message: Omit<Message, "id" | "conversationId" | "timestamp">
): void {
  const messages = _messages ?? loadMessages();
  const msgs = messages[conversationId] ?? [];
  const newMsg: Message = {
    ...message,
    id: `m${Date.now()}`,
    conversationId,
    timestamp: new Date(),
  };
  msgs.push(newMsg);
  messages[conversationId] = msgs;
  _messages = messages;
  saveMessages(messages);
}

/**
 * Simula que un cliente envía un mensaje a Luis.
 * Añade el mensaje con sender "client" y status "delivered".
 */
export function simulateCustomerMessage(
  conversationId: string,
  content: string
): void {
  const messages = _messages ?? loadMessages();
  const msgs = messages[conversationId] ?? [];
  const newMsg: Message = {
    id: `m${Date.now()}`,
    conversationId,
    content,
    sender: "client",
    timestamp: new Date(),
    status: "delivered",
  };
  msgs.push(newMsg);
  messages[conversationId] = msgs;
  _messages = messages;
  saveMessages(messages);
}

/**
 * Simula que la IA genera una sugerencia de respuesta tras el mensaje del cliente.
 * Añade mensaje con sender "ai", status "pending_approval" y aiSuggestion.
 */
export function simulateAISuggestion(
  conversationId: string,
  clientMessageContent: string
): void {
  const messages = _messages ?? loadMessages();
  const msgs = messages[conversationId] ?? [];
  const suggestion = generateBarbershopSuggestion(clientMessageContent);
  const newMsg: Message = {
    id: `m${Date.now()}`,
    conversationId,
    content: `[Borrador] ${suggestion}`,
    sender: "ai",
    timestamp: new Date(),
    status: "pending_approval",
    aiSuggestion: suggestion,
  };
  msgs.push(newMsg);
  messages[conversationId] = msgs;
  _messages = messages;
  saveMessages(messages);
}
