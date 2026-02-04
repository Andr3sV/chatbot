"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Settings, Briefcase, Image, Palette, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { href: "/servicios", label: "Mis servicios", icon: Briefcase },
  { href: "/galeria", label: "Galería", icon: Image },
  { href: "/identidad", label: "Mi identidad", icon: Palette },
  { href: "/cambios-web", label: "Cambios web", icon: Globe },
  { href: "/conversaciones/settings", label: "Ajustes", icon: Settings },
];

interface HomeMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeMenuDrawer({ isOpen, onClose }: HomeMenuDrawerProps) {
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
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Panel - se desliza desde la izquierda */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-[#FBFBF7] shadow-xl transition-transform duration-300 ease-out lg:hidden",
          "flex flex-col border-r border-border",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Menú</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-black/5"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
