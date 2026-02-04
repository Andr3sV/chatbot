"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  LayoutDashboard,
  Grid3X3,
  User,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/conversaciones", label: "Conversaciones", icon: MessageCircle },
  { href: "/posts", label: "Posts", icon: Grid3X3 },
  { href: "/messages", label: "Mensajes", icon: Mail },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom",
        "border-t border-[hsl(var(--sidebar-border))] rounded-t-2xl",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.06)]",
        "bg-[hsl(var(--sidebar-background))]"
      )}
    >
      <div className="flex justify-around h-16 px-2 items-center">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[48px] h-12 rounded-xl transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
