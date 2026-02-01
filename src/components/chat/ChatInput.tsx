"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { Send } from "lucide-react";

interface ChatInputProps {
  conversationId: string;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const client = getMessagingClient();

  const sendMutation = useMutation({
    mutationFn: (content: string) => client.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border bg-card p-4"
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1"
        disabled={sendMutation.isPending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!text.trim() || sendMutation.isPending}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Enviar</span>
      </Button>
    </form>
  );
}
