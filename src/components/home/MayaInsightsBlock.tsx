"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { propuestasPendientes } from "@/lib/mock-posts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className="mb-6 border-0 bg-[#EEFFC7] overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-[0.1px] ring-[#B988F8] ring-offset-2 ring-offset-transparent">
            <Image
              src="/maya.png"
              alt="Maya"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground">Maya</p>
            {insights.map((line, i) => (
              <p key={i} className="text-sm text-foreground/80">
                {line}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
