"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ConversationList() {
  const pathname = usePathname();
  const client = getMessagingClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => client.getConversations(),
  });

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold">Conversaciones</h2>
        <Link
          href="/conversaciones/settings"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Configuración"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">
                Cargando conversaciones...
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = pathname === `/conversaciones/chat/${conv.id}`;
              const displayName = conv.contact.name ?? conv.contact.phone;
              const lastMsg = conv.lastMessage;
              const lastPreview = lastMsg
                ? lastMsg.content.replace(/^\[Borrador\]\s*/, "").slice(0, 40)
                : "Sin mensajes";

              return (
                <Link
                  key={conv.id}
                  href={`/conversaciones/chat/${conv.id}`}
                  className={cn(
                    "flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/50",
                    isActive && "bg-accent"
                  )}
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="bg-muted text-sm">
                      {getInitials(conv.contact.phone, conv.contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{displayName}</span>
                      {lastMsg && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {format(lastMsg.timestamp, "HH:mm", { locale: es })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-muted-foreground">
                        {lastPreview}
                        {lastPreview.length >= 40 ? "..." : ""}
                      </span>
                      {conv.unreadCount > 0 && (
                        <Badge
                          variant="default"
                          className="h-5 min-w-5 shrink-0 px-1.5 text-xs"
                        >
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
