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
import { AccountSelector } from "@/components/home/AccountSelector";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/posts", label: "Visibilidad", icon: Eye },
  { href: "/conversaciones", label: "Comunicación", icon: MessageCircle },
  { href: "/reputacion", label: "Reputación", icon: Award },
  { href: "/competidores", label: "Competidores", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed =
    pathname === "/conversaciones" || pathname.startsWith("/conversaciones/");

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 transition-all duration-300 ease-out",
        isCollapsed ? "lg:w-20" : "lg:w-72",
        "border-r",
        isCollapsed ? "border-gray-100" : "border-[hsl(var(--sidebar-border))]",
        "bg-[hsl(var(--sidebar-background))]"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1 p-4 transition-all duration-300",
          isCollapsed ? "items-center px-2" : ""
        )}
      >
        <div
          className={cn(
            "mb-3 flex shrink-0",
            isCollapsed ? "justify-center w-10" : "px-3"
          )}
        >
          {isCollapsed ? (
            <div className="h-8 w-8 rounded-lg bg-foreground/10 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">P</span>
            </div>
          ) : (
            <Image
              src="/Plinng.png"
              alt="Plinng"
              width={120}
              height={40}
              className="h-8 w-auto object-contain object-left"
            />
          )}
        </div>
        {!isCollapsed && (
          <div className="mb-4 px-1">
            <AccountSelector />
          </div>
        )}
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg font-medium transition-colors",
                isCollapsed
                  ? "justify-center p-2.5"
                  : "gap-3 px-3 py-2.5 text-[16px] lg:text-[14px]",
                isActive
                  ? "bg-black text-white"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
