"use client";

import { Check } from "lucide-react";
import type { CommunicationStyle } from "@/lib/api/messaging-types";
import { cn } from "@/lib/utils";

const STYLE_OPTIONS: {
  value: CommunicationStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "profesional",
    label: "Profesional",
    description: "Formal, claro y confiable",
  },
  {
    value: "elegante",
    label: "Elegante",
    description: "Cercano, cálido y accesible",
  },
  {
    value: "alegre",
    label: "Alegre",
    description: "Optimista, dinámico y positivo",
  },
];

interface CommunicationStyleSectionProps {
  value: CommunicationStyle;
  onChange: (value: CommunicationStyle) => void;
}

export function CommunicationStyleSection({
  value,
  onChange,
}: CommunicationStyleSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Elige mi estilo de comunicación</h3>
      <div className="space-y-2">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50",
                isSelected && "border-[#BEFF50] bg-[#BEFF50]/10"
              )}
            >
              <div>
                <p className="font-semibold text-foreground">{opt.label}</p>
                <p className="text-sm text-muted-foreground">
                  {opt.description}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  isSelected
                    ? "border-[#BEFF50] bg-[#BEFF50] text-black"
                    : "border-muted-foreground/30 bg-transparent"
                )}
              >
                {isSelected ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
