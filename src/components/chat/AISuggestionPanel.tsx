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
import type { Message } from "@/lib/api/messaging-types";
import { Pencil, Send, Smile, Trash2 } from "lucide-react";

const EmojiPicker = dynamic(
  () => import("emoji-picker-react").then((mod) => mod.default),
  { ssr: false }
);

interface AISuggestionPanelProps {
  conversationId: string;
  messageId: string;
  suggestedText: string;
}

export function AISuggestionPanel({
  conversationId,
  messageId,
  suggestedText,
}: AISuggestionPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestedText);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const newHeight = Math.min(Math.max(el.scrollHeight, 40), 150);
    el.style.height = `${newHeight}px`;
  }, [editedText, isEditing]);
  const queryClient = useQueryClient();
  const client = getMessagingClient();

  const approveMutation = useMutation({
    mutationFn: (content?: string) =>
      client.approveAISuggestion(conversationId, messageId, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      const optimisticUpdate: Message = {
        id: messageId,
        conversationId,
        content: content ?? suggestedText,
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

  const discardMutation = useMutation({
    mutationFn: () => client.discardAISuggestion(conversationId, messageId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", conversationId]);
      queryClient.setQueryData<Message[]>(["messages", conversationId], (old) =>
        old?.filter((m) => m.id !== messageId) ?? []
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

  const handleSend = () => {
    const textToSend = isEditing ? editedText : suggestedText;
    if (textToSend.trim()) {
      approveMutation.mutate(textToSend);
    }
  };

  const handleDiscard = () => {
    discardMutation.mutate();
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    if (!isEditing) {
      setEditedText(suggestedText + emojiData.emoji);
      setIsEditing(true);
    } else {
      setEditedText((prev) => prev + emojiData.emoji);
    }
  };

  const isDisabled =
    approveMutation.isPending || discardMutation.isPending;

  return (
    <div>
      <div className="flex items-center gap-2 rounded-3xl border border-border bg-white px-4 py-2 shadow-lg">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              aria-label="Elegir emoji"
              className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
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
        <div className="flex min-h-10 min-w-0 flex-1 items-center">
          {isEditing ? (
            <Textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[40px] max-h-[150px] min-w-0 flex-1 resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
              placeholder="Edita el mensaje..."
            />
          ) : (
            <p className="flex-1 whitespace-pre-wrap text-sm text-foreground">
              {suggestedText}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) setEditedText(suggestedText);
            }}
            disabled={isDisabled}
            aria-label={isEditing ? "Ver original" : "Editar"}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDiscard}
            disabled={isDisabled}
            aria-label="Descartar sugerencia"
            className="h-9 w-9 rounded-full text-red-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isDisabled || (isEditing && !editedText.trim())}
            aria-label="Enviar"
            className="h-9 w-9 shrink-0 rounded-full bg-black text-white hover:bg-black/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
