"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  conversationId: string;
}

export function ChatHeader({ conversationId }: ChatHeaderProps) {
  const client = getMessagingClient();

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => client.getConversations(),
  });

  const conversation = conversations.find((c) => c.id === conversationId);
  const contact = conversation?.contact ?? {
    phone: "Desconocido",
    status: "offline" as const,
  };
  const displayName = contact.name ?? contact.phone;

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col">
        <h1 className="text-lg font-semibold">{displayName}</h1>
        <span className="text-sm text-muted-foreground">
          {contact.status === "online" ? "Online" : "Desconectado"}
        </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Más opciones">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
          <DropdownMenuItem>Silenciar</DropdownMenuItem>
          <DropdownMenuItem>Archivar chat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
