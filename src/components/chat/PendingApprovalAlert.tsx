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
        "flex items-center gap-3 rounded-lg bg-primary/20 px-4 py-3 text-primary-foreground",
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/30">
        <Bot className="h-4 w-4" />
      </div>
      <div>
        <p className="font-semibold">Mensaje pendiente de respuesta</p>
        <p className="text-sm opacity-90">
          La IA requiere tu aprobación antes de enviar.
        </p>
      </div>
    </div>
  );
}
