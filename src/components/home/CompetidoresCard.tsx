"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_SCORING = [
  { name: "Tu marca", score: 85, isMarca: true },
  { name: "Competidor A", score: 72, isMarca: false },
  { name: "Competidor B", score: 90, isMarca: false },
  { name: "Competidor C", score: 78, isMarca: false },
];

const MAX_SCORE = 100;

function ScoreBar({ name, score, isMarca }: { name: string; score: number; isMarca: boolean }) {
  const width = (score / MAX_SCORE) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 truncate text-xs font-medium text-foreground">
        {name}
      </span>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden min-w-0">
        <div
          className={`h-full rounded-full min-w-[4px] transition-all ${
            isMarca ? "bg-primary" : "bg-muted-foreground/40"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
        {score}
      </span>
    </div>
  );
}

export function CompetidoresCard() {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Users className="h-5 w-5 text-muted-foreground" />
        Competidores
      </h2>
      <Link href="/competidores" className="mt-6 block">
        <Card
          className="border border-border bg-white rounded-xl transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
        >
          <CardContent className="p-4">
            <p className="text-base font-semibold text-foreground mb-3">
              Scoring vs competidores
            </p>
            <div className="space-y-2.5">
              {MOCK_SCORING.map((item) => (
                <ScoreBar
                  key={item.name}
                  name={item.name}
                  score={item.score}
                  isMarca={item.isMarca}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Analiza cómo te posicionas frente a la competencia
            </p>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
}
