"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { Pencil, Send, Trash2 } from "lucide-react";

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
  const queryClient = useQueryClient();
  const client = getMessagingClient();

  const approveMutation = useMutation({
    mutationFn: (content?: string) =>
      client.approveAISuggestion(conversationId, messageId, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const discardMutation = useMutation({
    mutationFn: () => client.discardAISuggestion(conversationId, messageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
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

  const isDisabled =
    approveMutation.isPending || discardMutation.isPending;

  return (
    <div className="bg-transparent p-4">
      <div className="flex items-center gap-2 rounded-3xl border border-border bg-white px-4 py-2 shadow-sm">
        <div className="flex min-h-10 flex-1 items-center">
          {isEditing ? (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[40px] flex-1 resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
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
