"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import type { Channel, Message } from "@/lib/api/messaging-types";
import { Send, Smile, X } from "lucide-react";

const EmojiPicker = dynamic(
  () => import("emoji-picker-react").then((mod) => mod.default),
  { ssr: false }
);

interface ChatInputProps {
  conversationId: string;
  channel?: Channel;
  disabled?: boolean;
  initialText?: string;
  isEditMode?: boolean;
  messageId?: string;
  onCancelEdit?: () => void;
}

const MIN_HEIGHT = 24;
const MAX_HEIGHT = 150;

function getPlaceholder(channel?: Channel): string {
  switch (channel) {
    case "instagram":
      return "Responder comentario...";
    case "google":
      return "Responder al review...";
    default:
      return "Escribe un mensaje...";
  }
}

export function ChatInput({
  conversationId,
  channel = "whatsapp",
  disabled = false,
  initialText,
  isEditMode = false,
  messageId,
  onCancelEdit,
}: ChatInputProps) {
  const [text, setText] = useState(initialText ?? "");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const client = getMessagingClient();

  useEffect(() => {
    if (initialText !== undefined) {
      setText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const newHeight = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
  }, [text]);

  const approveMutation = useMutation({
    mutationFn: (content: string) =>
      client.approveAISuggestion(conversationId, messageId!, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      const optimisticUpdate: Message = {
        id: messageId!,
        conversationId,
        content,
        sender: "agent",
        timestamp: new Date(),
        status: "sent",
      };
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.map((m) => (m.id === messageId ? optimisticUpdate : m)) ?? [optimisticUpdate]
      );
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      return { previous };
    },
    onSuccess: (serverMessage) => {
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.map((m) => (m.id === messageId ? serverMessage : m)) ?? [serverMessage]
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

  const sendMutation = useMutation({
    mutationFn: (content: string) => client.sendMessage(conversationId, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        conversationId,
        content,
        sender: "agent",
        timestamp: new Date(),
        status: "sending",
      };
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) => [
        ...(old ?? []),
        optimisticMessage,
      ]);
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      return { previous, tempId };
    },
    onSuccess: (serverMessage, _content, context) => {
      if (!context) return;
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.map((m) => (m.id === context.tempId ? serverMessage : m)) ?? [serverMessage]
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (isEditMode && messageId) {
      approveMutation.mutate(trimmed);
      setText("");
      return;
    }
    if (sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
    setText("");
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const isDisabled =
    disabled ||
    (isEditMode ? approveMutation.isPending : sendMutation.isPending);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-full items-center gap-1"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 rounded-3xl border border-border bg-white py-2 pl-1 pr-3 shadow-lg">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              aria-label="Elegir emoji"
              className="h-10 w-10 shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="top"
            className="w-auto border-0 p-0"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              searchPlaceholder="Buscar emoji..."
            />
          </PopoverContent>
        </Popover>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).form?.requestSubmit();
            }
          }}
          placeholder={disabled ? "Tienes una sugerencia pendiente" : getPlaceholder(channel)}
          rows={1}
          className="min-h-[24px] max-h-[150px] min-w-0 flex-1 resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent py-1.5 pl-1 pr-1 text-[16px] shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isDisabled}
        />
        {isEditMode && onCancelEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancelEdit}
            aria-label="Volver"
            className="h-10 w-10 shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
        <Button
          type="submit"
          size="icon"
          disabled={
          !text.trim() ||
          (isEditMode ? approveMutation.isPending : sendMutation.isPending)
        }
          className="h-8 w-8 shrink-0 rounded-full p-0 bg-black text-white hover:bg-black/90"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </form>
  );
}
