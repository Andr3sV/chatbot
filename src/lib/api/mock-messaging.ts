import type { IMessagingClient } from "./messaging-client";
import type {
  Channel,
  Conversation,
  ConversationMeta,
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

  const insta1Messages: Message[] = [
    {
      id: "mi1",
      conversationId: "insta1",
      content: "¡Qué bonito! ¿Cuánto cuesta el corte?",
      sender: "client",
      timestamp: ten45,
      status: "delivered",
    },
    {
      id: "mi2",
      conversationId: "insta1",
      content: "Gracias! El corte está en $250. ¿Te gustaría agendar?",
      sender: "agent",
      timestamp: ten46,
      status: "sent",
    },
  ];

  const insta2Messages: Message[] = [
    {
      id: "mi3",
      conversationId: "insta2",
      content: "¿Tienen servicio a domicilio?",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 7200000),
      status: "delivered",
    },
  ];

  const insta3Messages: Message[] = [
    {
      id: "mi4",
      conversationId: "insta3",
      content: "Hermoso trabajo, los sigo desde hace tiempo",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 86400000),
      status: "delivered",
    },
    {
      id: "mi5",
      conversationId: "insta3",
      content: "¡Muchas gracias por tu apoyo! Nos encanta tenerte.",
      sender: "agent",
      timestamp: new Date(ten46.getTime() - 86400000),
      status: "sent",
    },
  ];

  const google1Messages: Message[] = [
    {
      id: "mg1",
      conversationId: "google1",
      content: "Excelente servicio, muy recomendado. 5 estrellas.",
      sender: "client",
      timestamp: ten45,
      status: "delivered",
    },
    {
      id: "mg2",
      conversationId: "google1",
      content: "Gracias por tu reseña! Nos alegra que hayas tenido una buena experiencia.",
      sender: "agent",
      timestamp: ten46,
      status: "sent",
    },
  ];

  const google2Messages: Message[] = [
    {
      id: "mg3",
      conversationId: "google2",
      content: "Buen lugar pero la espera fue larga. 3 estrellas.",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 3600000),
      status: "delivered",
    },
  ];

  const google3Messages: Message[] = [
    {
      id: "mg4",
      conversationId: "google3",
      content: "Los mejores cortes de la zona. Siempre puntuales.",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 172800000),
      status: "delivered",
    },
  ];

  const call1Messages: Message[] = [
    {
      id: "mc1",
      conversationId: "call1",
      content: "Buenos días, Barbería Luis, ¿en qué puedo ayudarle?",
      sender: "agent",
      timestamp: ten45,
      status: "delivered",
    },
    {
      id: "mc2",
      conversationId: "call1",
      content: "Hola, quisiera agendar una cita para mañana por la tarde.",
      sender: "client",
      timestamp: new Date(ten45.getTime() + 5000),
      status: "delivered",
    },
    {
      id: "mc3",
      conversationId: "call1",
      content: "Claro, tenemos disponibilidad a las 4pm y 5pm. ¿Cuál prefiere?",
      sender: "agent",
      timestamp: new Date(ten45.getTime() + 12000),
      status: "delivered",
    },
    {
      id: "mc4",
      conversationId: "call1",
      content: "Las 4pm perfecto, gracias.",
      sender: "client",
      timestamp: new Date(ten45.getTime() + 18000),
      status: "delivered",
    },
  ];

  const call2Messages: Message[] = [
    {
      id: "mc5",
      conversationId: "call2",
      content: "Barbería Luis, buenas tardes.",
      sender: "agent",
      timestamp: new Date(ten45.getTime() - 3600000),
      status: "delivered",
    },
    {
      id: "mc6",
      conversationId: "call2",
      content: "Hola, ¿cuál es el horario de atención?",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 3600000 + 3000),
      status: "delivered",
    },
    {
      id: "mc7",
      conversationId: "call2",
      content: "Lunes a sábado de 9am a 7pm. Domingos cerrado.",
      sender: "agent",
      timestamp: new Date(ten45.getTime() - 3600000 + 8000),
      status: "delivered",
    },
  ];

  const call3Messages: Message[] = [
    {
      id: "mc8",
      conversationId: "call3",
      content: "Hola, llamo por el corte que reservé a nombre de Roberto.",
      sender: "client",
      timestamp: new Date(ten45.getTime() - 7200000),
      status: "delivered",
    },
    {
      id: "mc9",
      conversationId: "call3",
      content: "Déjeme verificar... Sí, tiene cita hoy a las 3pm. ¿Necesita cambiar algo?",
      sender: "agent",
      timestamp: new Date(ten45.getTime() - 7200000 + 5000),
      status: "delivered",
    },
  ];

  return {
    conv1: conv1Messages,
    conv2: conv2Messages,
    conv3: conv3Messages,
    insta1: insta1Messages,
    insta2: insta2Messages,
    insta3: insta3Messages,
    google1: google1Messages,
    google2: google2Messages,
    google3: google3Messages,
    call1: call1Messages,
    call2: call2Messages,
    call3: call3Messages,
  };
}

const seedConversations: Conversation[] = [
  {
    id: "conv1",
    channel: "whatsapp",
    contact: {
      phone: "+52 1 55 1234 5678",
      name: "Carlos",
      status: "online",
    },
    unreadCount: 0,
  },
  {
    id: "conv2",
    channel: "whatsapp",
    contact: {
      phone: "+55 11 99999-9999",
      name: "María",
      status: "offline",
    },
    unreadCount: 1,
  },
  {
    id: "conv3",
    channel: "whatsapp",
    contact: {
      phone: "+1 555-0199",
      name: "Pedro",
      status: "online",
    },
    unreadCount: 0,
  },
  {
    id: "insta1",
    channel: "instagram",
    contact: {
      phone: "",
      name: "@maria_foto",
      status: "offline",
    },
    unreadCount: 0,
    meta: {
      postCaption: "Nuevo corte de la semana 🔥 #barberia #estilo",
      postUrl: "https://instagram.com/p/example",
    },
  },
  {
    id: "insta2",
    channel: "instagram",
    contact: {
      phone: "",
      name: "@carlos_design",
      status: "offline",
    },
    unreadCount: 1,
    meta: {
      postCaption: "Promo especial este mes",
      postUrl: "https://instagram.com/p/example2",
    },
  },
  {
    id: "insta3",
    channel: "instagram",
    contact: {
      phone: "",
      name: "@laura_style",
      status: "offline",
    },
    unreadCount: 0,
    meta: {
      postCaption: "Antes y después ✂️",
      postUrl: "https://instagram.com/p/example3",
    },
  },
  {
    id: "google1",
    channel: "google",
    contact: {
      phone: "",
      name: "Ana García",
      status: "offline",
    },
    unreadCount: 0,
    meta: {
      rating: 5,
      businessName: "Barbería Luis",
    },
  },
  {
    id: "google2",
    channel: "google",
    contact: {
      phone: "",
      name: "Pedro Martínez",
      status: "offline",
    },
    unreadCount: 1,
    meta: {
      rating: 3,
      businessName: "Barbería Luis",
    },
  },
  {
    id: "google3",
    channel: "google",
    contact: {
      phone: "",
      name: "Luis Fernández",
      status: "offline",
    },
    unreadCount: 0,
    meta: {
      rating: 5,
      businessName: "Barbería Luis",
    },
  },
  {
    id: "call1",
    channel: "llamadas",
    contact: {
      phone: "+52 1 55 1111 2222",
      name: "Roberto",
      status: "offline",
    },
    unreadCount: 0,
    meta: {
      duration: 45,
      businessName: "Barbería Luis",
    },
  },
  {
    id: "call2",
    channel: "llamadas",
    contact: {
      phone: "+52 1 55 3333 4444",
      name: "Desconocido",
      status: "offline",
    },
    unreadCount: 0,
    meta: {
      duration: 25,
      businessName: "Barbería Luis",
    },
  },
  {
    id: "call3",
    channel: "llamadas",
    contact: {
      phone: "+52 1 55 5555 6666",
      name: "Roberto",
      status: "offline",
    },
    unreadCount: 1,
    meta: {
      duration: 35,
      businessName: "Barbería Luis",
    },
  },
];

export function createMockMessagingClient(): IMessagingClient {
  const seedMessages = createSeedMessages();
  let messages = loadMessages();
  const hasStored = Object.keys(messages).length > 0;
  if (!hasStored) {
    messages = seedMessages;
    saveMessages(messages);
  } else {
    for (const [convId, msgs] of Object.entries(seedMessages)) {
      if (!messages[convId] || messages[convId].length === 0) {
        messages[convId] = msgs;
      }
    }
    saveMessages(messages);
  }
  _messages = messages;

  return {
    async getConversations(
      channel?: Channel | "all"
    ): Promise<Conversation[]> {
      await delay(200);
      const currentMessages = _messages ?? loadMessages();
      let convs = seedConversations.map((c) => ({ ...c }));
      if (channel && channel !== "all") {
        convs = convs.filter((c) => c.channel === channel);
      }
      for (const conv of convs) {
        const msgs = currentMessages[conv.id] ?? [];
        const last = msgs[msgs.length - 1];
        if (last) {
          conv.lastMessage = last;
        }
        conv.hasPendingApproval = msgs.some(
          (m) => m.status === "pending_approval"
        );
      }
      return convs;
    },

    async getMessages(conversationId: string): Promise<Message[]> {
      await delay(150);
      const currentMessages = _messages ?? loadMessages();
      return currentMessages[conversationId] ?? [];
    },

    async sendMessage(
      conversationId: string,
      content: string
    ): Promise<Message> {
      await delay(300);
      const currentMessages = _messages ?? loadMessages();
      const msgs = currentMessages[conversationId] ?? [];
      const newMsg: Message = {
        id: `m${Date.now()}`,
        conversationId,
        content,
        sender: "agent",
        timestamp: new Date(),
        status: "sent",
      };
      msgs.push(newMsg);
      currentMessages[conversationId] = msgs;
      _messages = currentMessages;
      saveMessages(currentMessages);
      return newMsg;
    },

    async approveAISuggestion(
      conversationId: string,
      messageId: string,
      content?: string
    ): Promise<Message> {
      await delay(300);
      const currentMessages = _messages ?? loadMessages();
      const msgs = currentMessages[conversationId] ?? [];
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
      currentMessages[conversationId] = msgs;
      _messages = currentMessages;
      saveMessages(currentMessages);
      return updated;
    },

    async discardAISuggestion(
      conversationId: string,
      messageId: string
    ): Promise<void> {
      await delay(200);
      const currentMessages = _messages ?? loadMessages();
      const msgs = currentMessages[conversationId] ?? [];
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx !== -1) {
        msgs.splice(idx, 1);
        currentMessages[conversationId] = msgs;
        _messages = currentMessages;
        saveMessages(currentMessages);
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
