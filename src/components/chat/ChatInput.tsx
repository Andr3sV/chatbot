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
      void queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
      className="flex items-center gap-2 bg-transparent p-4"
    >
      <div className="flex flex-1 items-center gap-2 rounded-3xl border border-border bg-white px-4 py-2 shadow-sm">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          disabled={sendMutation.isPending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!text.trim() || sendMutation.isPending}
          className="h-9 w-9 shrink-0 rounded-full bg-black text-white hover:bg-black/90"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </form>
  );
}
