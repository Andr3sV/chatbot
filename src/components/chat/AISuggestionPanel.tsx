"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { Pencil, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const discardMutation = useMutation({
    mutationFn: () => client.discardAISuggestion(conversationId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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

  return (
    <div className="border-t border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        SUGERENCIA DE RESPUESTA DEL AI
      </h3>
      <div className="mb-3 rounded-lg bg-muted/50 p-3">
        {isEditing ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[80px] resize-none border-0 bg-transparent focus-visible:ring-0"
            placeholder="Edita el mensaje..."
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm">{suggestedText}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsEditing(!isEditing);
            if (isEditing) setEditedText(suggestedText);
          }}
          disabled={approveMutation.isPending || discardMutation.isPending}
        >
          <Pencil className="mr-2 h-4 w-4" />
          {isEditing ? "Ver original" : "Editar"}
        </Button>
        <Button
          size="sm"
          onClick={handleSend}
          disabled={
            approveMutation.isPending ||
            discardMutation.isPending ||
            (isEditing && !editedText.trim())
          }
        >
          <Send className="mr-2 h-4 w-4" />
          Enviar
        </Button>
      </div>
      <button
        type="button"
        onClick={handleDiscard}
        disabled={approveMutation.isPending || discardMutation.isPending}
        className={cn(
          "mt-2 text-sm text-muted-foreground underline-offset-4",
          "hover:text-foreground hover:underline",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        Descartar sugerencia
      </button>
    </div>
  );
}
