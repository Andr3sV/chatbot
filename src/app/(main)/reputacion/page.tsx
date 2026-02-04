"use client";

import Link from "next/link";
import { ArrowLeft, Star, Plus, Check, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const cardBase =
  "shadow-[0px_2px_16px_rgba(220,220,203,0.4)] rounded-xl bg-white flex flex-col";

export default function ReputacionPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Reputación</h1>
        </div>
      </header>

      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-2xl mx-auto space-y-3 pb-24">
        {/* Tu reputación */}
        <div className={cn(cardBase, "p-5 gap-4")}>
          <h2 className="text-lg font-semibold text-foreground">
            Tu reputación
          </h2>
          <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">Google</span>
              <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                346 reviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-medium text-foreground">4.6</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i <= 4 ? "fill-foreground text-foreground" : "fill-foreground/30 text-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                / 4.8 tu sector
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold">
                !
              </span>
              <span>
                <b>-10%</b> por debajo de tu sector
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-black py-2.5 px-6 flex items-center justify-center gap-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Generar más reseñas
          </button>
        </div>

        {/* Tus reviews */}
        <div className={cn(cardBase, "p-5 gap-4")}>
          <h2 className="text-lg font-semibold text-foreground">
            Tus reviews
          </h2>
          <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 space-y-3">
            <p className="text-xs uppercase text-muted-foreground font-medium">
              Rating promedio mensual
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-medium text-foreground">
                <span className="font-semibold">24</span>
                <span className="text-sm"> este mes</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">
                <span>12 </span>
                <span className="font-medium">tu sector</span>
              </span>
            </div>
            <div className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-sm font-medium text-green-800">
              <b>+8%</b> por encima de tu sector
            </div>
          </div>
        </div>

        {/* Análisis de sentimiento en Google */}
        <div className={cn(cardBase, "p-5 gap-4")}>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-1.5">
            Análisis de sentimiento en{" "}
            <span className="text-base font-bold">Google</span>
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 flex flex-col items-center gap-2">
              <span className="text-xs uppercase text-muted-foreground">
                satisfactorio
              </span>
              <div className="w-20 h-20 rounded-full bg-emerald-400/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-800">40%</span>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 flex flex-col items-center gap-2">
              <span className="text-xs uppercase text-muted-foreground">
                medio
              </span>
              <div className="w-20 h-20 rounded-full bg-amber-400/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-800">40%</span>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 flex flex-col items-center gap-2">
              <span className="text-xs uppercase text-muted-foreground">malo</span>
              <div className="w-20 h-20 rounded-full bg-red-400/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-800">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mejoras según tus clientes */}
        <div className={cn(cardBase, "p-5 gap-4")}>
          <h2 className="text-lg font-semibold text-foreground">
            Mejoras según tus clientes
          </h2>
          <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 space-y-3">
            <p className="text-xs uppercase font-medium text-muted-foreground">
              Lo que haces bien
            </p>
            <ul className="space-y-2 text-sm text-foreground/90">
              {["Hamburguesa muy buena", "Servicio al cliente", "Muy buena limpieza"].map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="rounded-2xl bg-gray-100 border border-amber-100 p-4 space-y-3">
            <p className="text-xs uppercase font-medium text-muted-foreground">
              Lo que puedes mejorar
            </p>
            <ul className="space-y-2 text-sm text-foreground/90">
              {[
                "Inconsistencia de horarios",
                "No informar de los días festivos",
                "Demorarse en el desayuno",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ir a comentarios y reseñas */}
        <Link
          href="#"
          className={cn(
            cardBase,
            "p-4 flex-row items-center justify-between hover:bg-gray-50 transition-colors"
          )}
        >
          <span className="text-base font-medium text-foreground">
            Ir a comentarios y reseñas
          </span>
          <ChevronRight className="h-7 w-7 shrink-0 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
