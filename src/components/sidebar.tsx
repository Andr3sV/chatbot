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

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72",
        "border-r border-[hsl(var(--sidebar-border))]",
        "bg-[hsl(var(--sidebar-background))]"
      )}
    >
      <div className="flex flex-col gap-1 p-4">
        <div className="mb-3 px-3">
          <Image
            src="/Plinng.png"
            alt="Plinng"
            width={120}
            height={40}
            className="h-8 w-auto object-contain object-left"
          />
        </div>
        <div className="mb-4 px-1">
          <AccountSelector />
        </div>
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[16px] lg:text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-black text-white"
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
