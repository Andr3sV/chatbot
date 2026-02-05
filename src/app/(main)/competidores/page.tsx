"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScoringLineChart, MOCK_SCORING_TREND } from "@/components/charts/ScoringLineChart";
import { CompetenciaMap } from "@/components/charts/CompetenciaMap";

const BRAND_COLOR = "#BEFF50";

const BENCHMARKS = [
  { label: "Reseñas Google", tuValor: 80, sectorValor: 100 },
  { label: "Tiempo de respuesta", tuValor: 90, sectorValor: 80 },
  { label: "Respuesta a mensajes", tuValor: 75, sectorValor: 85 },
  { label: "Valoración media", tuValor: 92, sectorValor: 88 },
];

function BenchmarkBar({
  label,
  tuValor,
  sectorValor,
}: {
  label: string;
  tuValor: number;
  sectorValor: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-24 shrink-0">
            Tu negocio
          </span>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${tuValor}%`, backgroundColor: BRAND_COLOR }}
            />
          </div>
          <span className="text-xs font-medium w-10 text-right">{tuValor}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-24 shrink-0">
            Sector
          </span>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-muted-foreground/40 rounded-full transition-all"
              style={{ width: `${sectorValor}%` }}
            />
          </div>
          <span className="text-xs font-medium w-10 text-right">
            {sectorValor}%
          </span>
        </div>
      </div>
    </div>
  );
}

const SCORE_CARDS = [
  { label: "Visibilidad web", score: 78, avgSector: 72 },
  { label: "Presencia en redes", score: 85, avgSector: 68 },
  { label: "Engagement", score: 62, avgSector: 75 },
];

function ScoreCard({
  label,
  score,
  avgSector,
}: {
  label: string;
  score: number;
  avgSector: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: BRAND_COLOR }}
        >
          {score}
        </span>
        <span className="text-xs text-muted-foreground">
          vs {avgSector} sector
        </span>
      </div>
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundColor: BRAND_COLOR,
          }}
        />
      </div>
    </div>
  );
}

export default function CompetidoresPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF7]">
      <header className="sticky top-0 z-30 bg-[#FBFBF7] px-4 py-4 lg:px-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/5 transition-colors"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">
            Competidores
          </h1>
        </div>
      </header>

      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-2xl mx-auto pb-24 space-y-6">
        {/* Gráfico de tendencia */}
        <div className="rounded-xl border border-border bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Evolución del posicionamiento digital
          </h2>
          <ScoringLineChart data={MOCK_SCORING_TREND} height={180} showLegend />
        </div>

        {/* Mapa de competencia */}
        <div className="rounded-xl border border-border bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Mapa de competencia
          </h2>
          <CompetenciaMap />
        </div>

        {/* Scores por dimensión */}
        <div className="rounded-xl border border-border bg-white shadow-sm p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Scoring por dimensión
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {SCORE_CARDS.map((s) => (
              <ScoreCard
                key={s.label}
                label={s.label}
                score={s.score}
                avgSector={s.avgSector}
              />
            ))}
          </div>
        </div>

        {/* Comparativa con sector */}
        <div className="rounded-xl border border-border bg-white shadow-sm p-5 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Comparativa con tu sector
          </h2>
          <div className="space-y-6">
            {BENCHMARKS.map((b) => (
              <BenchmarkBar
                key={b.label}
                label={b.label}
                tuValor={b.tuValor}
                sectorValor={b.sectorValor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
