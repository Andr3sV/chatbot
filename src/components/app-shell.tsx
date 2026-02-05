"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

const HIDE_NAV_PATTERNS = [
  /^\/conversaciones\/chat\/[^/]+$/,
  /^\/posts\/[^/]+\/preview$/,
];

function shouldHideNav(pathname: string) {
  return HIDE_NAV_PATTERNS.some((p) => p.test(pathname));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarCollapsed =
    pathname === "/conversaciones" || pathname.startsWith("/conversaciones/");
  const hideNav = shouldHideNav(pathname);

  return (
    <>
      {!hideNav && <Sidebar />}
      <main
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          hideNav ? "pb-0 lg:pl-0" : "pb-20 lg:pb-0",
          !hideNav && (sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")
        )}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </>
  );
}
