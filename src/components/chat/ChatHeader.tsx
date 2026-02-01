"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { TestTube2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationPanel } from "./SimulationPanel";

function getInitials(phone: string, name?: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  const digits = phone.replace(/\D/g, "").slice(-2);
  return digits || "?";
}

interface ChatHeaderProps {
  conversationId: string;
  hasPendingApproval?: boolean;
}

export function ChatHeader({
  conversationId,
  hasPendingApproval = false,
}: ChatHeaderProps) {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
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
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
            {getInitials(contact.phone, contact.name)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-semibold">{displayName}</h1>
      </div>
      <div className="flex items-center gap-1">
        <Dialog open={simulatorOpen} onOpenChange={setSimulatorOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Simular mensaje de cliente"
              className="text-muted-foreground hover:text-foreground"
            >
              <TestTube2 className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modo prueba - Simular como cliente</DialogTitle>
            </DialogHeader>
            <SimulationPanel
              conversationId={conversationId}
              hasPendingApproval={hasPendingApproval}
            />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
