"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelFilterDropdown } from "@/components/channel-filter-dropdown";
import { useChannel } from "@/contexts/channel-context";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { getAvatarDataUri } from "@/lib/avatar-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  Camera,
  MessageCircle,
  Phone,
  Settings,
  Star,
  User,
} from "lucide-react";
import type { Channel } from "@/lib/api/messaging-types";
import { getAvatarColor } from "@/lib/avatar-colors";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS: Record<
  Channel,
  { Icon: typeof MessageCircle; className: string }
> = {
  whatsapp: { Icon: MessageCircle, className: "text-[#25D366]" },
  instagram: { Icon: Camera, className: "text-pink-500" },
  google: { Icon: Star, className: "text-amber-500" },
  llamadas: { Icon: Phone, className: "text-blue-500" },
};

type ConversationFilterValue =
  | "all"
  | "pendientes"
  | "requiere_humano"
  | "respondidos"
  | "transferidas"
  | "sin_transferir";

const WHATSAPP_FILTER_TAGS: { value: ConversationFilterValue; label: string }[] =
  [
    { value: "all", label: "Todos" },
    { value: "pendientes", label: "Pendientes" },
    { value: "requiere_humano", label: "Requiere humano" },
    { value: "respondidos", label: "Respondidos" },
  ];

const INSTAGRAM_GOOGLE_FILTER_TAGS: {
  value: ConversationFilterValue;
  label: string;
}[] = [
  { value: "all", label: "Todos" },
  { value: "pendientes", label: "Pendientes" },
  { value: "respondidos", label: "Respondidos" },
];

const LLAMADAS_FILTER_TAGS: { value: ConversationFilterValue; label: string }[] =
  [
    { value: "all", label: "Todos" },
    { value: "transferidas", label: "Transferidas" },
    { value: "sin_transferir", label: "Sin transferir" },
  ];

function getFilterTags(channel: Channel | "all") {
  switch (channel) {
    case "whatsapp":
      return WHATSAPP_FILTER_TAGS;
    case "instagram":
    case "google":
      return INSTAGRAM_GOOGLE_FILTER_TAGS;
    case "llamadas":
      return LLAMADAS_FILTER_TAGS;
    default:
      return [];
  }
}

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

function matchesFilter(
  conv: { unreadCount: number; hasPendingApproval?: boolean; lastMessage?: { status: string }; meta?: { transferred?: boolean }; channel: Channel },
  filter: ConversationFilterValue,
  channel: Channel
): boolean {
  if (filter === "all") return true;

  const hasPendingApproval =
    conv.hasPendingApproval ?? conv.lastMessage?.status === "pending_approval";
  const isPendiente = conv.unreadCount > 0;
  const isRespondido = !isPendiente && !hasPendingApproval;

  if (channel === "llamadas") {
    if (filter === "transferidas") return conv.meta?.transferred === true;
    if (filter === "sin_transferir")
      return conv.meta?.transferred === false || conv.meta?.transferred == null;
    return true;
  }

  if (filter === "pendientes") return isPendiente;
  if (filter === "requiere_humano") return hasPendingApproval;
  if (filter === "respondidos") return isRespondido;
  return true;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { selectedChannel } = useChannel();
  const [conversationFilter, setConversationFilter] =
    useState<ConversationFilterValue>("all");
  const client = getMessagingClient();

  useEffect(() => {
    setConversationFilter("all");
  }, [selectedChannel]);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", selectedChannel],
    queryFn: () => client.getConversations(selectedChannel),
  });

  const filteredConversations =
    selectedChannel !== "all"
      ? conversations.filter((conv) =>
          matchesFilter(conv, conversationFilter, selectedChannel)
        )
      : conversations;

  const filterTags = getFilterTags(selectedChannel);

  return (
    <aside
      className={cn(
        "flex h-screen w-full shrink-0 flex-col md:w-72",
        "border-r border-[hsl(var(--sidebar-border))]",
        "bg-[hsl(var(--sidebar-background))]"
      )}
    >
      <div className="relative flex h-16 items-center justify-between gap-2 px-4 md:h-14">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-muted-foreground md:hidden"
          aria-hidden
        >
          <ArrowLeft className="h-7 w-7" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 md:flex-1 md:min-w-0">
          <ChannelFilterDropdown />
        </div>
        <Link
          href="/settings"
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors md:h-9 md:w-9",
            "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
          )}
          aria-label="Configuración"
        >
          <Settings className="h-7 w-7 md:h-4 md:w-4" />
        </Link>
      </div>
      {selectedChannel !== "all" && filterTags.length > 0 && (
        <div className="shrink-0 overflow-x-auto overflow-y-hidden px-3 pb-2">
          <div className="flex gap-1.5">
            {filterTags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => setConversationFilter(tag.value)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[16px] font-medium transition-colors md:py-1",
                  conversationFilter === tag.value
                    ? "bg-black text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollArea className="min-h-0 min-w-0 flex-1 overflow-hidden px-3 pt-2 pr-2">
          <div className="min-w-0 max-w-full space-y-1 pb-4 md:space-y-0.5">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-[16px] text-muted-foreground">
                  Cargando conversaciones...
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
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
                    href={`/chat/${conv.id}?channel=${conv.channel}`}
                    className={cn(
                      "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-[hsl(var(--sidebar-border))] px-3 py-4 transition-colors last:border-b-0 md:border-b-0 md:py-2.5",
                      "hover:bg-[hsl(var(--sidebar-accent))]",
                      isActive && "bg-[hsl(var(--sidebar-accent))] font-medium"
                    )}
                  >
                    <div
                      className={cn(
                        "relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gray-200 md:h-14 md:w-14",
                        getAvatarColor(
                          conv.contact.name ?? conv.contact.phone ?? conv.id
                        ).frame
                      )}
                    >
                      <Avatar className="h-12 w-12 shrink-0 overflow-hidden rounded-full md:h-10 md:w-10">
                        <AvatarImage
                          src={getAvatarDataUri(
                            conv.contact.name ?? conv.contact.phone,
                            88
                          )}
                          alt={displayName}
                        />
                        <AvatarFallback
                          className={cn(
                            "text-[16px] font-medium",
                            getAvatarColor(
                              conv.contact.name ?? conv.contact.phone ?? conv.id
                            ).bg
                          )}
                        >
                          {getInitials(conv.contact.phone, conv.contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      {(() => {
                        const { Icon, className } =
                          CHANNEL_ICONS[conv.channel];
                        return (
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm md:h-5 md:w-5",
                              "ring-1 ring-border"
                            )}
                            aria-hidden
                          >
                            <Icon
                              className={cn(
                                "h-3.5 w-3.5 md:h-3 md:w-3",
                                className
                              )}
                            />
                          </span>
                        );
                      })()}
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate text-[16px] font-medium">
                          {displayName}
                        </span>
                        <span className="truncate text-[16px] text-muted-foreground">
                          {lastPreview}
                          {lastPreview.length >= 35 ? "..." : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {lastMsg && (
                        <span className="text-[16px] text-muted-foreground">
                          {format(lastMsg.timestamp, "HH:mm", { locale: es })}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        {hasPendingApproval && (
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 md:h-6 md:w-6"
                            aria-label="Requiere intervención humana"
                            title="Requiere intervención humana"
                          >
                            <User className="h-3.5 w-3.5" />
                          </div>
                        )}
                        {conv.unreadCount > 0 && (
                          <Badge
                            className="h-5 min-w-5 shrink-0 bg-[#BEFF50] px-1.5 text-[16px] text-black md:h-4 md:min-w-4 md:px-1"
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
    </aside>
  );
}
