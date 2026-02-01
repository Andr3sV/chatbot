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
- **Modo simulación**: Panel para simular mensajes como cliente de Luis (barbería). Envía mensajes como si fueras Carlos, María o Pedro; la IA sugiere respuestas contextuales (reservas, precios, horarios)

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Probar la simulación Plinng-Luis

1. Entra a una conversación (ej. Carlos, María o Pedro - clientes de Luis)
2. Usa el panel "Modo prueba - Simular como cliente" debajo del header
3. Escribe un mensaje o usa los botones rápidos (disponibilidad, precio, horario)
4. Pulsa "Enviar como cliente" - el mensaje aparece como burbuja gris
5. Tras ~1.5s la IA sugiere una respuesta contextual
6. Como Luis: Edita, Envía o Descarta la sugerencia

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
