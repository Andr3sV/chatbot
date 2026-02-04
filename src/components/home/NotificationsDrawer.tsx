"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, MessageCircle, CheckCircle, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "message",
    title: "Sophia requiere tu aprobación",
    text: "Un mensaje pendiente de revisión en WhatsApp",
    time: "Hace 5 min",
    Icon: MessageCircle,
    iconClassName: "text-[#25D366]",
    href: "/conversaciones",
  },
  {
    id: "2",
    type: "post",
    title: "Propuesta lista para revisar",
    text: "Tienes 3 posts pendientes de aprobar",
    time: "Hace 1 h",
    Icon: Calendar,
    iconClassName: "text-primary",
    href: "/posts?filter=pendientes",
  },
  {
    id: "3",
    type: "review",
    title: "Nueva reseña en Google",
    text: "Un cliente dejó una valoración de 5 estrellas",
    time: "Hace 2 h",
    Icon: Star,
    iconClassName: "text-amber-500",
    href: "/reputacion",
  },
  {
    id: "4",
    type: "done",
    title: "Publicación programada",
    text: "Tu post se publicará el 18 de febrero a las 10:00",
    time: "Ayer",
    Icon: CheckCircle,
    iconClassName: "text-emerald-500",
    href: "/posts",
  },
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Panel - se desliza desde la derecha */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[320px] max-w-[90vw] bg-[#FBFBF7] shadow-xl transition-transform duration-300 ease-out",
          "flex flex-col border-l border-border",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Notificaciones"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5"
            aria-label="Cerrar notificaciones"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No tienes notificaciones
            </p>
          ) : (
            <ul className="space-y-2">
              {MOCK_NOTIFICATIONS.map((notif) => {
                const Icon = notif.Icon;
                const content = (
                  <div className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/5">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5",
                        notif.iconClassName
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notif.text}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={notif.id}>
                    {notif.href ? (
                      <Link href={notif.href} onClick={onClose}>
                        {content}
                      </Link>
                    ) : (
                      <div>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
