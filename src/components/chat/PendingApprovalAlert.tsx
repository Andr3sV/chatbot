"use client";

import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingApprovalAlertProps {
  show: boolean;
  className?: string;
}

export function PendingApprovalAlert({ show, className }: PendingApprovalAlertProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg bg-[#d4f5e0] px-4 py-3 text-foreground",
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#23B25D]/20 text-[#23B25D]">
        <Bot className="h-4 w-4" />
      </div>
      <div>
        <p className="font-semibold">Mensaje pendiente de respuesta</p>
        <p className="text-sm text-muted-foreground">
          La IA requiere tu aprobación antes de enviar.
        </p>
      </div>
    </div>
  );
}
