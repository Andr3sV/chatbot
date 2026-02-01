"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Settings, User } from "lucide-react";
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

export function AppSidebar() {
  const pathname = usePathname();
  const client = getMessagingClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => client.getConversations(),
  });

  return (
    <aside
      className={cn(
        "flex h-screen w-72 shrink-0 flex-col",
        "border-r border-[hsl(var(--sidebar-border))]",
        "bg-[hsl(var(--sidebar-background))]"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-[hsl(var(--sidebar-border))] px-4">
        <Image
          src="/Plinng.png"
          alt="Plinng"
          width={32}
          height={32}
          className="h-5 w-auto max-w-full object-contain"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollArea className="min-h-0 min-w-0 flex-1 overflow-hidden px-2 pt-2 pr-1">
          <div className="min-w-0 max-w-full space-y-0.5 pb-4 pr-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  Cargando conversaciones...
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = pathname === `/chat/${conv.id}`;
                const displayName = conv.contact.name ?? conv.contact.phone;
                const lastMsg = conv.lastMessage;
                const hasPendingApproval =
                  conv.hasPendingApproval ??
                  lastMsg?.status === "pending_approval";
                const lastPreview = lastMsg
                  ? lastMsg.content.replace(/^\[Borrador\]\s*/, "").slice(0, 35)
                  : "Sin mensajes";

                return (
                  <Link
                    key={conv.id}
                    href={`/chat/${conv.id}`}
                    className={cn(
                      "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-3 py-2.5 transition-colors",
                      "hover:bg-[hsl(var(--sidebar-accent))]",
                      isActive && "bg-[hsl(var(--sidebar-accent))] font-medium"
                    )}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                        {getInitials(conv.contact.phone, conv.contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate text-sm font-medium">
                          {displayName}
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-muted-foreground">
                            {lastPreview}
                            {lastPreview.length >= 35 ? "..." : ""}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge
                              className="h-4 min-w-4 shrink-0 bg-[#BEFF50] px-1 text-[10px] text-black"
                            >
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 justify-self-end">
                      {hasPendingApproval && (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600"
                          aria-label="Requiere intervención humana"
                          title="Requiere intervención humana"
                        >
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {lastMsg && (
                        <span className="text-xs text-muted-foreground">
                          {format(lastMsg.timestamp, "HH:mm", { locale: es })}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>
        <div className="border-t border-[hsl(var(--sidebar-border))] p-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
              "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Configuración</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
