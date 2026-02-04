"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  LayoutDashboard,
  Grid3X3,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/posts", label: "Posts", icon: Grid3X3 },
  { href: "/messages", label: "Mensajes", icon: MessageCircle },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:border-r lg:border-border lg:bg-white lg:z-40">
      <div className="flex flex-col gap-1 p-4">
        <div className="mb-6 px-3">
          <span className="text-xl font-semibold text-primary">Plinng</span>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
