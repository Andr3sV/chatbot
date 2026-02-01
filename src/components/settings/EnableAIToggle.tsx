"use client";

import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";

interface EnableAIToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function EnableAIToggle({ enabled, onChange }: EnableAIToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#BEFF50]">
          <Bot className="h-4 w-4 text-black" />
        </div>
        <div>
        <h3 className="font-semibold">Enable AI for new contacts</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Automatically start Copilot for unknown leads
        </p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
