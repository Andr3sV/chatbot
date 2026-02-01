"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface EnableAIToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function EnableAIToggle({ enabled, onChange }: EnableAIToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <h3 className="font-semibold">Enable AI for new contacts</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Automatically start Copilot for unknown leads
        </p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
