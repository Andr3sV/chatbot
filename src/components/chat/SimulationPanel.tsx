"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  simulateCustomerMessage,
  simulateAISuggestion,
} from "@/lib/api/mock-messaging";
import { Send } from "lucide-react";

const AI_SUGGESTION_DELAY_MS = 1500;

const QUICK_ACTIONS = [
  "¿Tienen disponibilidad mañana?",
  "¿Cuánto cuesta un corte?",
  "¿Cuál es el horario?",
  "Hola, buenos días",
];

interface SimulationPanelProps {
  conversationId: string;
  hasPendingApproval?: boolean;
}

export function SimulationPanel({
  conversationId,
  hasPendingApproval = false,
}: SimulationPanelProps) {
  const [message, setMessage] = useState("");
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const queryClient = useQueryClient();

  const refetchMessages = () => {
    void queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    void queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };

  const sendAsCustomerMutation = useMutation({
    mutationFn: async (content: string) => {
      simulateCustomerMessage(conversationId, content);
      refetchMessages();
      setIsWaitingForAI(true);
      await new Promise((resolve) => setTimeout(resolve, AI_SUGGESTION_DELAY_MS));
      simulateAISuggestion(conversationId, content);
      refetchMessages();
      setIsWaitingForAI(false);
    },
  });

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sendAsCustomerMutation.isPending || isWaitingForAI) return;
    sendAsCustomerMutation.mutate(trimmed);
    setMessage("");
  };

  const handleQuickAction = (text: string) => {
    setMessage(text);
  };

  const isDisabled =
    sendAsCustomerMutation.isPending || isWaitingForAI || hasPendingApproval;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Simula que un cliente de Luis te escribe. Tras enviar, la IA sugerirá
        una respuesta en ~1.5s.
      </p>
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe como si fueras el cliente..."
          className="flex-1"
          disabled={isDisabled}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isDisabled}
          aria-label="Enviar como cliente"
          className="bg-black text-white hover:bg-black/90"
        >
          <Send className="mr-2 h-4 w-4" />
          Enviar como cliente
        </Button>
      </form>
      {isWaitingForAI && (
        <p className="text-xs text-primary">
          La IA está generando la sugerencia...
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {QUICK_ACTIONS.map((text) => (
          <Button
            key={text}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => handleQuickAction(text)}
            disabled={isDisabled}
          >
            {text.length > 30 ? `${text.slice(0, 28)}...` : text}
          </Button>
        ))}
      </div>
    </div>
  );
}
