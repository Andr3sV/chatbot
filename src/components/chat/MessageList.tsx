"use client";

import { useRef, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { MessageBubble } from "./MessageBubble";
import type { Channel, Message } from "@/lib/api/messaging-types";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  hasFloatingTopAlert?: boolean;
  channel?: Channel;
  conversationId?: string;
  onEditSuggestion?: () => void;
}

function getDateLabel(date: Date): string {
  if (isToday(date)) return "HOY";
  if (isYesterday(date)) return "AYER";
  return format(date, "d 'de' MMMM", { locale: es });
}

export function MessageList({
  messages,
  isLoading,
  hasFloatingTopAlert = false,
  channel = "whatsapp",
  conversationId,
  onEditSuggestion,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Cargando mensajes...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No hay mensajes en esta conversación
        </p>
      </div>
    );
  }

  const groupedByDate = messages.reduce<Record<string, Message[]>>(
    (acc, msg) => {
      const key = format(msg.timestamp, "yyyy-MM-dd");
      if (!acc[key]) acc[key] = [];
      acc[key].push(msg);
      return acc;
    },
    {}
  );

  const dates = Object.keys(groupedByDate).sort();

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex-1 overflow-y-auto pb-44",
        hasFloatingTopAlert && "pt-20"
      )}
    >
      <div className="flex flex-col gap-4 px-4 py-4">
        {dates.map((dateKey) => {
          const msgs = groupedByDate[dateKey];
          const label = getDateLabel(msgs[0].timestamp);
          return (
            <div key={dateKey} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="flex flex-col gap-2">
                {msgs.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    channel={channel}
                    conversationId={conversationId}
                    onEditSuggestion={
                      msg.status === "pending_approval"
                        ? onEditSuggestion
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
