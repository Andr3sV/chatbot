"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { propuestasPendientes } from "@/lib/mock-posts";

function buildInsights(
  pendingApprovalCount: number,
  pendingPostsCount: number
): string[] {
  const lines: string[] = [];
  if (pendingApprovalCount > 0) {
    lines.push(
      `Sophia requiere tu aprobación en ${pendingApprovalCount} mensaje${pendingApprovalCount > 1 ? "s" : ""}.`
    );
  }
  if (pendingPostsCount > 0) {
    lines.push(
      `Tienes ${pendingPostsCount} post${pendingPostsCount > 1 ? "s" : ""} pendiente${pendingPostsCount > 1 ? "s" : ""} de aprobar.`
    );
  }
  if (lines.length === 0) {
    lines.push("Todo al día. Ayer respondiste varias conversaciones.");
  }
  return lines;
}

export function MayaMessageBlock({ message }: { message: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded-full ring-[0.1px] ring-[#B988F8] ring-offset-2 ring-offset-transparent">
        <Image
          src="/maya.png"
          alt="Maya"
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="relative rounded-2xl rounded-bl-md bg-[#BEFF50] px-4 py-3 shadow-sm">
          <div
            className="absolute left-0 top-6 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: "12px solid #BEFF50",
            }}
          />
          <p className="text-sm font-semibold text-foreground">Maya</p>
          <p className="mt-1 text-sm text-foreground/80">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function MayaInsightsBlock() {
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", "all"],
    queryFn: () => getMessagingClient().getConversations("all"),
  });

  const pendingApprovalCount = conversations.filter(
    (c) =>
      c.hasPendingApproval ?? c.lastMessage?.status === "pending_approval"
  ).length;
  const pendingPostsCount = propuestasPendientes.length;
  const insights = buildInsights(pendingApprovalCount, pendingPostsCount);

  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded-full ring-[0.1px] ring-[#B988F8] ring-offset-2 ring-offset-transparent">
        <Image
          src="/maya.png"
          alt="Maya"
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Burbuja de diálogo con cola apuntando a Maya */}
      <div className="relative min-w-0 flex-1">
        <div className="relative rounded-2xl rounded-bl-md bg-[#BEFF50] px-4 py-3 shadow-sm">
          {/* Cola de la burbuja */}
          <div
            className="absolute left-0 top-6 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: "12px solid #BEFF50",
            }}
          />
          <p className="text-sm font-semibold text-foreground">Maya</p>
          <div className="mt-1 space-y-0.5">
            {insights.map((line, i) => (
              <p key={i} className="text-sm text-foreground/80">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
