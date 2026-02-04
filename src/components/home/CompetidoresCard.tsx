"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_BENCHMARKS = [
  { label: "Reseñas", tu: 80, sector: 100 },
  { label: "Valoración", tu: 92, sector: 88 },
];

function MiniBar({ label, tu, sector }: { label: string; tu: number; sector: number }) {
  const max = 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          Tú {tu} · Sector {sector}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full min-w-[2px] transition-all"
            style={{ width: `${tu}%` }}
          />
        </div>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-muted-foreground/50 rounded-full min-w-[2px] transition-all"
            style={{ width: `${sector}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function CompetidoresCard() {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Users className="h-5 w-5 text-muted-foreground" />
        Competidores
      </h2>
      <Link href="/competidores">
        <Card
          className="border border-border bg-[#FBFBF7] rounded-xl transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
        >
          <CardContent className="p-4">
            <p className="text-base font-semibold text-foreground mb-3">
              Comparativa con tu sector
            </p>
            <div className="space-y-3">
              {MOCK_BENCHMARKS.map((b) => (
                <MiniBar key={b.label} label={b.label} tu={b.tu} sector={b.sector} />
              ))}
            </div>
            <div className="mt-2 flex gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-sm bg-primary" />
                Tú
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-sm bg-muted-foreground/50" />
                Sector
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Analiza cómo te posicionas frente a la competencia
            </p>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
}
