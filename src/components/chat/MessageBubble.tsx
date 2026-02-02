"use client";

import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, Loader2, Pencil, Send, X } from "lucide-react";
import type { Channel, Message } from "@/lib/api/messaging-types";
import { getAvatarDataUri } from "@/lib/avatar-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { cn } from "@/lib/utils";

const AI_AVATAR_SRC = "/sophi.png";

interface MessageBubbleProps {
  message: Message;
  channel?: Channel;
  conversationId?: string;
  onEditSuggestion?: () => void;
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

export function MessageBubble({
  message,
  channel = "whatsapp",
  conversationId,
  onEditSuggestion,
}: MessageBubbleProps) {
  const isClient = message.sender === "client";
  const isPending = message.status === "pending_approval";
  const isSending = message.status === "sending";
  const queryClient = useQueryClient();
  const client = getMessagingClient();

  const approveMutation = useMutation({
    mutationFn: (content?: string) =>
      client.approveAISuggestion(conversationId!, message.id, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      const optimisticUpdate: Message = {
        id: message.id,
        conversationId: message.conversationId,
        content: content ?? message.aiSuggestion ?? message.content,
        sender: "agent",
        timestamp: new Date(),
        status: "sent",
      };
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.map((m) => (m.id === message.id ? optimisticUpdate : m)) ?? [optimisticUpdate]
      );
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      return { previous };
    },
    onSuccess: (serverMessage) => {
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.map((m) => (m.id === message.id ? serverMessage : m)) ?? [serverMessage]
      );
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (_err, _content, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(["messages", conversationId], context.previous);
      }
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const discardMutation = useMutation({
    mutationFn: () => client.discardAISuggestion(conversationId!, message.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.filter((m) => m.id !== message.id) ?? []
      );
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      return { previous };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (_err, _content, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(["messages", conversationId], context.previous);
      }
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const isButtonsDisabled = approveMutation.isPending || discardMutation.isPending;
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
          <p className="whitespace-pre-wrap break-words text-[15px] text-foreground">
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
          <p className="whitespace-pre-wrap break-words text-[15px] text-foreground">
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
        <p className="whitespace-pre-wrap break-words font-mono text-[15px] text-foreground">
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
          <p className="whitespace-pre-wrap break-words text-[15px]">
            {(message.aiSuggestion ?? message.content).replace(
              /^\[Borrador\]\s*/,
              ""
            )}
          </p>
          {isPending && conversationId && onEditSuggestion && (
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Button
                size="sm"
                onClick={() =>
                  approveMutation.mutate(
                    message.aiSuggestion ?? message.content
                  )
                }
                disabled={isButtonsDisabled || !(message.aiSuggestion ?? message.content).trim()}
                aria-label="Enviar"
                className="h-10 w-full justify-center gap-1.5 rounded-lg bg-black text-sm text-white hover:bg-black/90"
              >
                <Send className="h-4 w-4" />
                Enviar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditSuggestion}
                disabled={isButtonsDisabled}
                aria-label="Editar"
                className="h-10 w-full justify-center gap-1.5 rounded-lg border-border text-sm font-normal"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => discardMutation.mutate()}
                disabled={isButtonsDisabled}
                aria-label="Cancelar"
                className="h-10 w-full justify-center gap-1.5 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}
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
