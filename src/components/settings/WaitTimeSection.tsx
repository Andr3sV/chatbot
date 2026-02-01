"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const WAIT_TIME_OPTIONS = [
  { value: 1, label: "1 min" },
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1h" },
  { value: 480, label: "8h" },
  { value: 720, label: "12h" },
  { value: 1440, label: "24h" },
];

interface WaitTimeSectionProps {
  waitTimeMinutes: number;
  onChange: (minutes: number) => void;
}

export function WaitTimeSection({
  waitTimeMinutes,
  onChange,
}: WaitTimeSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold">Tiempo de espera</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Set the minimum silence period before Copilot takes over the
        conversation.
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
        {WAIT_TIME_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={waitTimeMinutes === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(opt.value)}
            className={cn(
              waitTimeMinutes === opt.value &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
