"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import type { Message } from "@/lib/api/messaging-types";
import { Pencil, Send, X } from "lucide-react";

interface AISuggestionPanelProps {
  conversationId: string;
  messageId: string;
  suggestedText: string;
  onEdit: () => void;
}

export function AISuggestionPanel({
  conversationId,
  messageId,
  suggestedText,
  onEdit,
}: AISuggestionPanelProps) {
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
    if (suggestedText.trim()) {
      approveMutation.mutate(suggestedText);
    }
  };

  const handleDiscard = () => {
    discardMutation.mutate();
  };

  const isDisabled =
    approveMutation.isPending || discardMutation.isPending;

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl rounded-tr-sm border border-[#BEFF50] bg-white px-4 py-3 shadow-sm">
        <p className="whitespace-pre-wrap text-[16px] text-foreground">
          {suggestedText}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            disabled={isDisabled}
            aria-label="Editar"
            className="h-9 gap-1.5 rounded-full border-border px-4 text-[16px] font-normal"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={isDisabled}
            aria-label="Cancelar"
            className="h-9 gap-1.5 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isDisabled || !suggestedText.trim()}
            aria-label="Enviar"
            className="h-9 gap-1.5 rounded-full bg-black px-4 text-[16px] text-white hover:bg-black/90"
          >
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
