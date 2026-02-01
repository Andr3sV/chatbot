# Especificación de API - Servicio de Mensajería Copilot

Este documento describe el contrato de API que el servicio backend debe implementar para integrar la UI del chatbot. El frontend ya está preparado y consume estos endpoints vía `IMessagingClient` y WebSocket.

---

## 1. Variables de entorno

El frontend usa las siguientes variables para conectarse al backend:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_MESSAGING_API_URL` | URL base de la API REST | `https://api.plinng.com/v1` |
| `NEXT_PUBLIC_WS_URL` | URL del WebSocket para tiempo real | `wss://api.plinng.com/ws` |

Si no están definidas, el frontend usa el cliente mock y datos locales.

---

## 2. Tipos de datos

### Contact

```json
{
  "phone": "string",
  "name": "string | null",
  "status": "online" | "offline"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| phone | string | Sí | Número de teléfono del contacto |
| name | string | No | Nombre del contacto |
| status | "online" \| "offline" | Sí | Estado de conexión |

---

### Message

```json
{
  "id": "string",
  "conversationId": "string",
  "content": "string",
  "sender": "client" | "agent" | "ai",
  "timestamp": "string",
  "status": "sent" | "delivered" | "draft" | "pending_approval",
  "aiSuggestion": "string | null"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | string | Sí | Identificador único del mensaje |
| conversationId | string | Sí | ID de la conversación |
| content | string | Sí | Contenido del mensaje |
| sender | "client" \| "agent" \| "ai" | Sí | Quién envió: cliente, agente humano o IA |
| timestamp | string | Sí | ISO 8601 (ej. `2025-02-01T10:45:00.000Z`) |
| status | string | Sí | Estado del mensaje |
| aiSuggestion | string | No | Solo cuando `status === "pending_approval"`. Texto sugerido por la IA antes de edición |

**Estados de mensaje:**
- `sent`: Enviado
- `delivered`: Entregado
- `draft`: Borrador
- `pending_approval`: Sugerencia de IA pendiente de aprobación humana

---

### Conversation

```json
{
  "id": "string",
  "contact": { /* Contact */ },
  "lastMessage": { /* Message */ } | null,
  "unreadCount": "number",
  "hasPendingApproval": "boolean"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | string | Sí | Identificador único de la conversación |
| contact | Contact | Sí | Datos del contacto |
| lastMessage | Message | No | Último mensaje de la conversación |
| unreadCount | number | Sí | Cantidad de mensajes no leídos |
| hasPendingApproval | boolean | No | Si hay alguna sugerencia IA pendiente de aprobación |

---

### CopilotConfig

```json
{
  "blacklist": ["string"],
  "waitTimeMinutes": "number",
  "enableAIForNewContacts": "boolean"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| blacklist | string[] | Números de teléfono excluidos de la IA |
| waitTimeMinutes | number | Tiempo mínimo de silencio (minutos) antes de que la IA tome control |
| enableAIForNewContacts | boolean | Activar IA para nuevos contactos |

---

## 3. Endpoints REST

**Base URL:** `{NEXT_PUBLIC_MESSAGING_API_URL}`

**Content-Type:** `application/json`

---

### 3.1 Listar conversaciones

| Método | Ruta |
|--------|------|
| GET | `/conversations` |

**Response 200**

```json
[
  {
    "id": "conv1",
    "contact": {
      "phone": "+52 1 55 1234 5678",
      "name": "Carlos",
      "status": "online"
    },
    "lastMessage": {
      "id": "m2",
      "conversationId": "conv1",
      "content": "[Borrador] ¡Hola! Sí, tenemos espacios...",
      "sender": "ai",
      "timestamp": "2025-02-01T10:46:00.000Z",
      "status": "pending_approval",
      "aiSuggestion": "¡Hola! Sí, tenemos espacios disponibles..."
    },
    "unreadCount": 0,
    "hasPendingApproval": true
  }
]
```

---

### 3.2 Obtener mensajes de una conversación

| Método | Ruta |
|--------|------|
| GET | `/conversations/:conversationId/messages` |

**Parámetros de ruta**
- `conversationId` (string): ID de la conversación

**Response 200**

```json
[
  {
    "id": "m1",
    "conversationId": "conv1",
    "content": "¿Tienen disponibilidad mañana?",
    "sender": "client",
    "timestamp": "2025-02-01T10:45:00.000Z",
    "status": "delivered"
  },
  {
    "id": "m2",
    "conversationId": "conv1",
    "content": "[Borrador] ¡Hola! Sí, tenemos espacios disponibles...",
    "sender": "ai",
    "timestamp": "2025-02-01T10:46:00.000Z",
    "status": "pending_approval",
    "aiSuggestion": "¡Hola! Sí, tenemos espacios disponibles. ¿Te gustaría reservar para mañana?"
  }
]
```

**Errores**
- 404: Conversación no encontrada

---

### 3.3 Enviar mensaje (humano)

| Método | Ruta |
|--------|------|
| POST | `/conversations/:conversationId/messages` |

**Parámetros de ruta**
- `conversationId` (string): ID de la conversación

**Request body**

```json
{
  "content": "string"
}
```

**Response 201**

```json
{
  "id": "m123",
  "conversationId": "conv1",
  "content": "¡Hola! Sí, tenemos espacios disponibles.",
  "sender": "agent",
  "timestamp": "2025-02-01T11:00:00.000Z",
  "status": "sent"
}
```

**Errores**
- 400: Contenido vacío o inválido
- 404: Conversación no encontrada

---

### 3.4 Aprobar sugerencia de IA

| Método | Ruta |
|--------|------|
| POST | `/conversations/:conversationId/messages/:messageId/approve` |

**Parámetros de ruta**
- `conversationId` (string): ID de la conversación
- `messageId` (string): ID del mensaje con `status: "pending_approval"`

**Request body** (opcional)

```json
{
  "content": "string"
}
```

Si se envía `content`, se usa ese texto (el humano editó la sugerencia). Si no se envía, el backend debe usar `aiSuggestion` o el `content` original del mensaje.

**Response 200**

```json
{
  "id": "m2",
  "conversationId": "conv1",
  "content": "¡Hola! Sí, tenemos espacios disponibles. ¿Te gustaría reservar?",
  "sender": "agent",
  "timestamp": "2025-02-01T10:46:00.000Z",
  "status": "sent"
}
```

**Errores**
- 400: Mensaje no está en estado `pending_approval`
- 404: Conversación o mensaje no encontrado

---

### 3.5 Descartar sugerencia de IA

| Método | Ruta |
|--------|------|
| DELETE | `/conversations/:conversationId/messages/:messageId` |

**Parámetros de ruta**
- `conversationId` (string): ID de la conversación
- `messageId` (string): ID del mensaje a descartar

**Response 204**

Sin contenido.

**Errores**
- 404: Conversación o mensaje no encontrado

---

### 3.6 Obtener configuración Copilot

| Método | Ruta |
|--------|------|
| GET | `/config` |

**Response 200**

```json
{
  "blacklist": ["+1 555-0000"],
  "waitTimeMinutes": 5,
  "enableAIForNewContacts": true
}
```

---

### 3.7 Guardar configuración Copilot

| Método | Ruta |
|--------|------|
| PUT | `/config` |

**Request body**

```json
{
  "blacklist": ["string"],
  "waitTimeMinutes": 5,
  "enableAIForNewContacts": true
}
```

**Response 200** o **204**

Puede devolver el objeto actualizado o no contenido.

**Errores**
- 400: Datos inválidos (ej. `waitTimeMinutes` negativo)

---

## 4. WebSocket

**URL:** `{NEXT_PUBLIC_WS_URL}` (ej. `wss://api.plinng.com/ws`)

El frontend se conecta al WebSocket y espera mensajes en formato JSON:

```json
{
  "type": "string",
  "payload": { /* objeto según el tipo */ }
}
```

### Eventos esperados

| type | payload | Descripción |
|------|---------|-------------|
| `new_message` | Message | Nuevo mensaje (cliente, canal, etc.) |
| `message_updated` | Message | Mensaje actualizado (ej. tras aprobar sugerencia) |
| `ai_suggestion` | Message | Nueva sugerencia de IA (`status: "pending_approval"`) |
| `conversation_updated` | `{ conversationId: string }` | Cambios en conversación (lastMessage, unreadCount, hasPendingApproval) |

El frontend usa estos eventos para invalidar cachés de TanStack Query y refrescar la UI.

---

## 5. Panel de simulación (opcional)

El frontend incluye un `SimulationPanel` para pruebas. Actualmente usa mocks locales. Para que funcione con el backend real, el servicio podría exponer endpoints de desarrollo:

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/conversations/:id/simulate/customer-message` | Simular mensaje entrante del cliente |
| POST | `/conversations/:id/simulate/ai-suggestion` | Simular que la IA genera una sugerencia |

**Request body (customer-message):**
```json
{ "content": "string" }
```

**Request body (ai-suggestion):**
```json
{ "clientMessageContent": "string" }
```

Estos endpoints son **opcionales** y pueden estar deshabilitados en producción.

---

## 6. Manejo de errores

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 | OK (GET, PUT, POST approve) |
| 201 | Created (POST mensaje) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (datos inválidos) |
| 404 | Not Found (recurso no existe) |
| 500 | Internal Server Error |

### Formato de error sugerido

```json
{
  "error": "string",
  "message": "string",
  "code": "string"
}
```

---

## 7. Autenticación

El frontend **no envía headers de autenticación** actualmente. El backend puede:

- Requerir `Authorization: Bearer <token>` u otro mecanismo
- Usar cookies de sesión
- Validar por API key en header

Si se añade autenticación, el frontend deberá actualizarse para incluir los headers correspondientes.

---

## 8. Checklist para el backend

- [ ] `GET /conversations` — Lista conversaciones
- [ ] `GET /conversations/:id/messages` — Mensajes de conversación
- [ ] `POST /conversations/:id/messages` — Enviar mensaje humano
- [ ] `POST /conversations/:id/messages/:msgId/approve` — Aprobar sugerencia IA
- [ ] `DELETE /conversations/:id/messages/:msgId` — Descartar sugerencia IA
- [ ] `GET /config` — Obtener configuración Copilot
- [ ] `PUT /config` — Guardar configuración Copilot
- [ ] WebSocket en `NEXT_PUBLIC_WS_URL` con eventos: `new_message`, `message_updated`, `ai_suggestion`, `conversation_updated`
- [ ] (Opcional) Endpoints de simulación para pruebas

---

## Referencias en el código frontend

- Tipos: `src/lib/api/messaging-types.ts`
- Interfaz cliente: `src/lib/api/messaging-client.ts`
- Mock: `src/lib/api/mock-messaging.ts`
- WebSocket: `src/lib/websocket/use-messaging-websocket.ts`
