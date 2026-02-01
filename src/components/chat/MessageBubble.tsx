"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bot } from "lucide-react";
import type { Message } from "@/lib/api/messaging-types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isClient = message.sender === "client";
  const isPending = message.status === "pending_approval";

  return (
    <div
      className={cn(
        "flex w-full",
        isClient ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-0.5",
          isClient ? "items-start" : "items-end"
        )}
      >
        {!isClient && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {message.sender === "ai" && (
              <>
                <Bot className="h-3 w-3" />
                Plinng AI
              </>
            )}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isClient
              ? "rounded-tl-sm bg-muted text-foreground"
              : "rounded-tr-sm bg-[#DBFF95] text-foreground",
            isPending && "border border-[#c4e87a] italic"
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {!isClient && message.sender === "ai" && (
            <Bot className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {isPending
              ? "Borrador • Justo ahora"
              : format(message.timestamp, "h:mm a", { locale: es })}
          </span>
        </div>
      </div>
    </div>
  );
}
