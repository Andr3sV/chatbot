"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { cn } from "@/lib/utils";

export function ChatLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSecondaryViewOpen =
    pathname?.startsWith("/conversaciones/chat/") || pathname === "/conversaciones/settings";

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Sidebar - full width on mobile, fixed width on desktop */}
      <div
        className={cn(
          "flex h-full shrink-0 flex-col transition-transform duration-300 ease-out md:relative md:translate-x-0",
          "w-full md:w-72",
          "border-r border-[hsl(var(--sidebar-border))]",
          "bg-[hsl(var(--sidebar-background))]",
          "z-10",
          isSecondaryViewOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <AppSidebar />
      </div>

      {/* Main - chat slides in from right on mobile; flex-1 para ajustarse al ancho en desktop */}
      <main
        className={cn(
          "absolute inset-0 flex flex-col overflow-hidden transition-transform duration-300 ease-out md:relative md:inset-auto md:flex-1 md:min-w-0",
          "border-l border-white bg-background",
          "z-20 md:z-auto",
          isSecondaryViewOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0 md:flex"
        )}
      >
        {children}
      </main>
    </div>
  );
}
