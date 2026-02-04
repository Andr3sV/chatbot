"use client";

import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen lg:pl-72 pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
