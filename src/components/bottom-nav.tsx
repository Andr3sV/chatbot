"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Eye,
  MessageCircle,
  Award,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home },
  { href: "/posts", icon: Eye },
  { href: "/conversaciones", icon: MessageCircle },
  { href: "/reputacion", icon: Award },
  { href: "/competidores", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom flex items-end justify-between px-3 pb-[10px] gap-2">
      {/* Contenedor iconos: solo este tiene fondo sidebar */}
      <div
        className={cn(
          "flex flex-1 justify-around items-center min-w-0 h-[72px] px-4 rounded-[30px]",
          "shadow-[0_-4px_20px_rgba(0,0,0,0.06)]",
          "border-t border-x border-[hsl(var(--sidebar-border))]",
          "bg-[hsl(var(--sidebar-background))]"
        )}
      >
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center min-w-[48px] h-12 rounded-xl transition-colors shrink-0",
                  isActive
                    ? "bg-black text-white"
                    : "text-foreground/70 hover:text-foreground"
                )}
                aria-label={item.href === "/" ? "Home" : item.href === "/posts" ? "Visibilidad" : item.href === "/conversaciones" ? "Comunicación" : item.href === "/reputacion" ? "Reputación" : "Competidores"}
              >
                <Icon className="h-6 w-6 shrink-0" />
              </Link>
            );
          })}
      </div>
      {/* Maya: fuera del contenedor con fondo, sin fondo propio */}
      <Link
        href="/"
        className="flex shrink-0 items-center justify-center w-16 h-16 min-w-[64px]"
        aria-label="Maya, agente IA"
      >
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-[0.1px] ring-[#B988F8] ring-offset-2 ring-offset-transparent">
            <Image
              src="/maya.png"
              alt="Maya"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
    </nav>
  );
}
