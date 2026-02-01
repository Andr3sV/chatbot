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
import { Send, Smile } from "lucide-react";

const EmojiPicker = dynamic(
  () => import("emoji-picker-react").then((mod) => mod.default),
  { ssr: false }
);

interface ChatInputProps {
  conversationId: string;
}

const MIN_HEIGHT = 24;
const MAX_HEIGHT = 150;

export function ChatInput({ conversationId }: ChatInputProps) {
  const [text, setText] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const client = getMessagingClient();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const newHeight = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
  }, [text]);

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

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
    >
      <div className="flex flex-1 items-center gap-2 rounded-3xl border border-border bg-white px-4 py-2 shadow-lg">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={sendMutation.isPending}
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
          placeholder="Escribe un mensaje..."
          rows={1}
          className="min-h-[24px] max-h-[150px] min-w-0 flex-1 resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent py-2 text-sm shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
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
