"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import type { Conversation } from "@/lib/api/messaging-types";
import { getAvatarColor } from "@/lib/avatar-colors";
import { getAvatarDataUri } from "@/lib/avatar-utils";
import { ArrowLeft, Phone, Star, TestTube2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  conversation?: Conversation | null;
  hasPendingApproval?: boolean;
}

export function ChatHeader({
  conversationId,
  conversation: conversationProp,
  hasPendingApproval = false,
}: ChatHeaderProps) {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const client = getMessagingClient();

  const { data: allConversations = [] } = useQuery({
    queryKey: ["conversations", "all"],
    queryFn: () => client.getConversations("all"),
    enabled: !conversationProp,
  });

  const conversation =
    conversationProp ?? allConversations.find((c) => c.id === conversationId);
  const contact = conversation?.contact ?? {
    phone: "Desconocido",
    status: "offline" as const,
  };
  const displayName = contact.name ?? contact.phone;
  const channel = conversation?.channel ?? "whatsapp";
  const meta = conversation?.meta;
  const showSimulator = channel === "whatsapp";
  const avatarColor = getAvatarColor((contact.name ?? contact.phone) || "user");

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href="/"
          className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          aria-label="Volver a conversaciones"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div
          className={cn(
            "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-200",
            avatarColor.frame
          )}
        >
          <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <AvatarImage
              src={getAvatarDataUri((contact.name ?? contact.phone) || "user", 80)}
              alt={displayName}
            />
            <AvatarFallback
              className={cn("text-[16px] md:text-[14px] font-medium", avatarColor.bg)}
            >
              {getInitials(contact.phone, contact.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[18px] md:text-[14px] font-semibold">{displayName}</h1>
          {channel === "instagram" && meta?.postCaption && (
            <p className="truncate text-[16px] md:text-[14px] text-muted-foreground">
              {meta.postCaption}
            </p>
          )}
          {channel === "google" && meta?.businessName && (
            <p className="flex items-center gap-1 text-[16px] md:text-[14px] text-muted-foreground">
              {meta.rating != null && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {meta.rating}
                </span>
              )}
              <span>• {meta.businessName}</span>
            </p>
          )}
          {channel === "llamadas" && meta?.duration != null && (
            <p className="flex items-center gap-1 text-[16px] md:text-[14px] text-muted-foreground">
              <Phone className="h-3 w-3" />
              {Math.floor(meta.duration / 60)}:{String(meta.duration % 60).padStart(2, "0")} min
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {showSimulator && (
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
        )}
      </div>
    </header>
  );
}
