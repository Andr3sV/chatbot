"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarCollapsed =
    pathname === "/conversaciones" || pathname.startsWith("/conversaciones/");

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-screen pb-20 lg:pb-0 transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        {children}
      </main>
      <BottomNav />
    </>
  );
}
