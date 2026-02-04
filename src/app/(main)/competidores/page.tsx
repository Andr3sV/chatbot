"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BENCHMARKS = [
  {
    label: "Reseñas Google",
    tuValor: 80,
    sectorValor: 100,
  },
  {
    label: "Tiempo de respuesta",
    tuValor: 90,
    sectorValor: 80,
  },
  {
    label: "Respuesta a mensajes",
    tuValor: 75,
    sectorValor: 85,
  },
  {
    label: "Valoración media",
    tuValor: 92,
    sectorValor: 88,
  },
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
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${tuValor}%` }}
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

export default function CompetidoresPage() {
  return (
    <div className="min-h-screen bg-[#F5F5EB]">
      <header className="sticky top-0 z-30 bg-[#F5F5EB] px-4 py-4 lg:px-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/5 transition-colors"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Competidores</h1>
        </div>
      </header>

      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-2xl mx-auto pb-24">
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
