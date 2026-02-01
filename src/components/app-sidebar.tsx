"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { getAvatarDataUri } from "@/lib/avatar-utils";
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
        "flex h-screen w-full shrink-0 flex-col md:w-72",
        "border-r border-[hsl(var(--sidebar-border))]",
        "bg-[hsl(var(--sidebar-background))]"
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 border-b border-[hsl(var(--sidebar-border))] px-4 md:h-14">
        <Image
          src="/Plinng.png"
          alt="Plinng"
          width={48}
          height={48}
          className="h-8 w-auto max-w-full object-contain md:h-5"
        />
        <Link
          href="/settings"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors md:h-9 md:w-9",
            "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
          )}
          aria-label="Configuración"
        >
          <Settings className="h-5 w-5 md:h-4 md:w-4" />
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollArea className="min-h-0 min-w-0 flex-1 overflow-hidden px-3 pt-2 pr-2">
          <div className="min-w-0 max-w-full space-y-1 pb-4 md:space-y-0.5">
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
                      "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-[hsl(var(--sidebar-border))] px-3 py-4 transition-colors last:border-b-0 md:border-b-0 md:py-2.5",
                      "hover:bg-[hsl(var(--sidebar-accent))]",
                      isActive && "bg-[hsl(var(--sidebar-accent))] font-medium"
                    )}
                  >
                    <Avatar className="h-11 w-11 shrink-0 md:h-9 md:w-9">
                      <AvatarImage
                        src={getAvatarDataUri(
                          conv.contact.name ?? conv.contact.phone,
                          88
                        )}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-[#BEFF50] text-sm font-medium text-black md:text-xs">
                        {getInitials(conv.contact.phone, conv.contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate text-[14px] font-medium md:text-sm">
                          {displayName}
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[14px] text-muted-foreground md:text-xs">
                            {lastPreview}
                            {lastPreview.length >= 35 ? "..." : ""}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge
                              className="h-5 min-w-5 shrink-0 bg-[#BEFF50] px-1.5 text-[12px] text-black md:h-4 md:min-w-4 md:px-1 md:text-[10px]"
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
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 md:h-6 md:w-6"
                          aria-label="Requiere intervención humana"
                          title="Requiere intervención humana"
                        >
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {lastMsg && (
                        <span className="text-[14px] text-muted-foreground md:text-xs">
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
      </div>
    </aside>
  );
}
