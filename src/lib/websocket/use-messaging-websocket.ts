"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  simulateWebSocketMessage,
} from "@/lib/api/mock-messaging";
import type { Message } from "@/lib/api/messaging-types";

export type WebSocketEvent =
  | { type: "new_message"; payload: Message }
  | { type: "message_updated"; payload: Message }
  | { type: "ai_suggestion"; payload: Message }
  | { type: "conversation_updated"; payload: { conversationId: string } };

type EventHandler = (event: WebSocketEvent) => void;

const MOCK_WS_ENABLED = process.env.NEXT_PUBLIC_MOCK_WEBSOCKET === "true";

function createMockWebSocket(handler: EventHandler): () => void {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const cleanup = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  if (typeof window === "undefined") return cleanup;

  intervalId = setInterval(() => {
    const conversations = ["conv1", "conv2", "conv3"];
    const convId =
      conversations[Math.floor(Math.random() * conversations.length)];

    simulateWebSocketMessage(convId, {
      content: "Mensaje simulado desde WebSocket mock",
      sender: "client",
      status: "delivered",
    });

    handler({
      type: "new_message",
      payload: {
        id: `m${Date.now()}`,
        conversationId: convId,
        content: "Mensaje simulado desde WebSocket mock",
        sender: "client",
        timestamp: new Date(),
        status: "delivered",
      },
    });
  }, 15000);

  return cleanup;
}

export function useMessagingWebSocket(url?: string) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const handlerRef = useRef<EventHandler | null>(null);

  const handleEvent = useCallback<EventHandler>(
    (event) => {
      switch (event.type) {
        case "new_message":
        case "message_updated":
          queryClient.invalidateQueries({
            queryKey: ["messages", event.payload.conversationId],
          });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          break;
        case "ai_suggestion":
          queryClient.invalidateQueries({
            queryKey: ["messages", event.payload.conversationId],
          });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          break;
        case "conversation_updated":
          queryClient.invalidateQueries({
            queryKey: ["conversations"],
          });
          break;
      }
    },
    [queryClient]
  );

  useEffect(() => {
    handlerRef.current = handleEvent;
  }, [handleEvent]);

  useEffect(() => {
    const wsUrl = url ?? process.env.NEXT_PUBLIC_WS_URL;

    if (wsUrl) {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data) as WebSocketEvent;
            handlerRef.current?.(data);
          } catch {
            // ignore invalid messages
          }
        };

        ws.onerror = () => {
          // Could add toast/notification
        };

        return () => {
          ws.close();
          wsRef.current = null;
        };
      } catch {
        // Fall through to mock
      }
    }

    if (MOCK_WS_ENABLED) {
      return createMockWebSocket((ev) => handlerRef.current?.(ev));
    }

    return () => {};
  }, [url]);

  return { connected: !!wsRef.current };
}
