"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScoringLineChart, MOCK_SCORING_TREND } from "@/components/charts/ScoringLineChart";
import { CompetenciaMap } from "@/components/charts/CompetenciaMap";

export function CompetidoresCard() {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Users className="h-5 w-5 text-muted-foreground" />
        Competidores
      </h2>
      <Link href="/competidores" className="mt-6 block">
        <Card
          className="border border-border bg-white rounded-xl transition-all hover:shadow-md hover:border-[#BEFF50]/50 cursor-pointer"
        >
          <CardContent className="p-4">
            <p className="text-base font-semibold text-foreground mb-4">
              Posicionamiento digital
            </p>
            <ScoringLineChart data={MOCK_SCORING_TREND} height={140} showLegend />
          </CardContent>
        </Card>
      </Link>
      <Link href="/competidores" className="mt-4 block">
        <Card
          className="border border-border bg-white rounded-xl transition-all hover:shadow-md hover:border-[#BEFF50]/50 cursor-pointer"
        >
          <CardContent className="p-4">
            <p className="text-base font-semibold text-foreground mb-4">
              Mapa de competencia
            </p>
            <CompetenciaMap />
          </CardContent>
        </Card>
      </Link>
    </section>
  );
}
