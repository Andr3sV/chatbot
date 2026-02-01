# Chatbot - Webchat con Agente IA

Interfaz de webchat estilo WhatsApp Web con agente IA que responde automáticamente, derivación a humanos y sugerencias de respuesta editables.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** (Radix UI + Tailwind)
- **TanStack Query** (React Query)
- **Zustand** (estado global)
- **date-fns** (formateo de fechas)

## Características

- **Lista de conversaciones**: Sidebar con conversaciones, último mensaje y badge de no leídos
- **Vista chat**: Header con contacto, mensajes con burbujas diferenciadas, separadores por fecha
- **Derivación a humano**: Alert cuando hay mensaje pendiente de aprobación de la IA
- **Panel de sugerencia IA**: Editar, enviar o descartar la sugerencia de respuesta
- **Configuración Copilot**: Blacklist, tiempo de espera, activar IA para nuevos contactos
- **WebSocket mock**: Simula eventos en tiempo real (nuevos mensajes cada 15s)
- **Cliente mock**: Datos de prueba persistentes en localStorage

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Estructura

```
src/
├── app/
│   ├── page.tsx              # Lista conversaciones + placeholder
│   ├── chat/[id]/page.tsx     # Vista chat individual
│   └── settings/page.tsx      # Configuración Copilot
├── components/
│   ├── chat/                  # ChatHeader, MessageList, MessageBubble, etc.
│   ├── conversations/        # ConversationList
│   ├── settings/              # BlacklistSection, WaitTimeSection, EnableAIToggle
│   └── ui/                    # Shadcn components
└── lib/
    ├── api/                   # messaging-client, mock-messaging, types
    └── websocket/             # use-messaging-websocket
```

## Integración con API real

Configura las variables de entorno:

- `NEXT_PUBLIC_MESSAGING_API_URL`: URL de la API de mensajería
- `NEXT_PUBLIC_WS_URL`: URL del WebSocket para tiempo real

Si no están definidas, se usa el cliente mock y el WebSocket simulado.

Para desactivar el mock de WebSocket: `NEXT_PUBLIC_MOCK_WEBSOCKET=false`
