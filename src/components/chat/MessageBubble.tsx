"use client";

import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bot, Loader2 } from "lucide-react";
import type { Channel, Message } from "@/lib/api/messaging-types";
import { getAvatarDataUri } from "@/lib/avatar-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AI_AVATAR_SRC = "/sophi.png";

interface MessageBubbleProps {
  message: Message;
  channel?: Channel;
}

function getInitials(phone: string, name?: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  const digits = phone.replace(/\D/g, "").slice(-2);
  return digits || "?";
}

export function MessageBubble({ message, channel = "whatsapp" }: MessageBubbleProps) {
  const isClient = message.sender === "client";
  const isPending = message.status === "pending_approval";
  const isSending = message.status === "sending";
  const speakerLabel =
    channel === "llamadas"
      ? message.sender === "client"
        ? "Cliente"
        : message.sender === "agent"
          ? "Agente"
          : "IA"
      : null;

  if (channel === "instagram") {
    return (
      <div className="flex w-full gap-2">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={getAvatarDataUri(
              `instagram-${message.sender}-${message.id}`,
              64
            )}
            alt=""
          />
          <AvatarFallback className="bg-pink-100 text-xs text-pink-700">
            {message.sender === "client" ? "U" : "B"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-wrap break-words text-sm text-foreground">
            {message.content}
          </p>
          <span className="text-xs text-muted-foreground">
            {format(message.timestamp, "h:mm a", { locale: es })}
          </span>
        </div>
      </div>
    );
  }

  if (channel === "google") {
    return (
      <div
        className={cn(
          "flex w-full",
          isClient ? "justify-start" : "justify-end"
        )}
      >
        <div
          className={cn(
            "max-w-[85%] rounded-lg border border-border bg-card px-4 py-3",
            isClient ? "bg-muted/50" : "bg-[#DBFF95]"
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm text-foreground">
            {message.content}
          </p>
          <span className="mt-1 block text-xs text-muted-foreground">
            {format(message.timestamp, "h:mm a", { locale: es })}
          </span>
        </div>
      </div>
    );
  }

  if (channel === "llamadas") {
    return (
      <div className="flex w-full flex-col gap-0.5">
        <span className="text-xs font-medium text-muted-foreground">
          {speakerLabel}:
        </span>
        <p className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
          {message.content}
        </p>
        <span className="text-xs text-muted-foreground">
          {format(message.timestamp, "h:mm:ss a", { locale: es })}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full",
        isClient ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isClient ? "items-start" : "items-end"
        )}
      >
        {!isClient && message.sender === "ai" && (
          <div className="flex items-center gap-3 py-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-[#DBFF95] ring-offset-2 ring-offset-transparent">
              <Image
                src={AI_AVATAR_SRC}
                alt="Sophi"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              He pensado en esta respuesta
            </span>
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isClient
              ? "rounded-tl-sm bg-muted text-foreground"
              : isPending
                ? "rounded-tr-sm bg-white border border-[#BEFF50] italic"
                : isSending
                  ? "rounded-tr-sm bg-[#DBFF95]/70 text-foreground opacity-80"
                  : "rounded-tr-sm bg-[#DBFF95] text-foreground"
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {!isClient && message.sender === "agent" && (
            <Bot className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isPending
              ? (
                <>
                  <span className="rounded-full bg-[#DBFF95] px-2 py-0.5 text-xs font-medium text-foreground">
                    Borrador
                  </span>
                  <span>• Justo ahora</span>
                </>
              )
              : isSending
                ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Enviando...</span>
                  </>
                )
                : message.sender === "agent"
                ? (
                  <>
                    Enviado por <Bot className="h-3 w-3" /> • {format(message.timestamp, "h:mm a", { locale: es })}
                  </>
                )
                : format(message.timestamp, "h:mm a", { locale: es })}
          </span>
        </div>
      </div>
    </div>
  );
}
