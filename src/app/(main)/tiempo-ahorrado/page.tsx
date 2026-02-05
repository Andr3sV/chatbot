"use client";

import Link from "next/link";
import { ArrowLeft, Eye, MessageCircle, Camera, Phone, Star } from "lucide-react";

const MOCK_TIEMPO = {
  total: "~14h",
  visibilidad: "12h",
  comunicacion: {
    instagram: "~1h",
    whatsapp: "2h",
    llamadas: "45 min",
  },
  reputacion: "~30 min",
};

export default function TiempoAhorradoPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Tiempo ahorrado</h1>
        </div>
      </header>

      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Total */}
        <div className="rounded-2xl bg-white border border-border p-6 text-center shadow-sm">
          <p className="text-[11px] font-medium text-foreground/70 uppercase tracking-wide">Total</p>
          <p className="text-4xl font-bold tabular-nums text-foreground mt-1">{MOCK_TIEMPO.total}</p>
        </div>

        {/* Visibilidad */}
        <div className="rounded-xl bg-white border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Visibilidad</h2>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/80">Webs y contenido</span>
            <span className="text-lg font-bold tabular-nums text-foreground">{MOCK_TIEMPO.visibilidad}</span>
          </div>
        </div>

        {/* Comunicación */}
        <div className="rounded-xl bg-white border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Comunicación</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/15">
                <Camera className="h-4 w-4 text-pink-500" />
              </div>
              <span className="flex-1 text-sm text-foreground">Instagram</span>
              <span className="text-base font-semibold tabular-nums text-foreground">{MOCK_TIEMPO.comunicacion.instagram}</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
              </div>
              <span className="flex-1 text-sm text-foreground">WhatsApp</span>
              <span className="text-base font-semibold tabular-nums text-foreground">{MOCK_TIEMPO.comunicacion.whatsapp}</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                <Phone className="h-4 w-4 text-blue-500" />
              </div>
              <span className="flex-1 text-sm text-foreground">Llamadas</span>
              <span className="text-base font-semibold tabular-nums text-foreground">{MOCK_TIEMPO.comunicacion.llamadas}</span>
            </div>
          </div>
        </div>

        {/* Reputación */}
        <div className="rounded-xl bg-white border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Reputación</h2>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/80">Gestión de reseñas</span>
            <span className="text-lg font-bold tabular-nums text-foreground">{MOCK_TIEMPO.reputacion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
