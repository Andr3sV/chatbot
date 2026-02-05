"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Bell, MessageCircle, Eye, ExternalLink, FileText, Maximize2 } from "lucide-react";
import { AccountSelector } from "@/components/home/AccountSelector";
import { HomeMenuDrawer } from "@/components/home/HomeMenuDrawer";
import { NotificationsDrawer } from "@/components/home/NotificationsDrawer";
import { MayaInsightsBlock } from "@/components/home/MayaInsightsBlock";
import { PropuestasCarousel } from "@/components/home/PropuestasCarousel";
import { ChannelMetricCard } from "@/components/home/ChannelMetricCard";
import { ReputacionCard } from "@/components/home/ReputacionCard";
import { CompetidoresCard } from "@/components/home/CompetidoresCard";

const MOCK_LLAMADAS = {
  recibidas: 12,
  minutosAhorrados: 45,
};

const MOCK_WHATSAPP = {
  respondidos: 24,
  pendientesHumano: 1,
  tiempoAhorrado: "2h",
};

const MOCK_INSTAGRAM = {
  respondidos: 8,
  pendientes: 2,
};

const MOCK_WEBS = {
  contenidoGenerado: 24,
  tiempoAhorrado: "12h",
};

const MOCK_SCORE = 87;
const MOCK_TIEMPO_TOTAL = "~14h";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF7]">
      <HomeMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      {/* Header: menu + selector cuenta centrado + ajustes (estilo como lista conversaciones) */}
      <header className="flex h-16 items-center justify-between gap-2 bg-[#FBFBF7] px-4 pt-3 md:h-14 md:pt-0 lg:px-8 rounded-b-2xl lg:rounded-b-none">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 md:h-9 md:w-9 lg:hidden"
          aria-label="Menú"
        >
          <Menu className="h-7 w-7 md:h-4 md:w-4" />
        </button>
        <div className="flex flex-1 min-w-0 justify-center px-2 lg:hidden">
          <AccountSelector />
        </div>
        <div className="hidden lg:flex flex-1" aria-hidden />
        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 md:h-9 md:w-9"
          aria-label="Notificaciones"
        >
          <Bell className="h-7 w-7 md:h-4 md:w-4" />
        </button>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-6xl mx-auto w-full">
        {/* 1. Maya insights */}
        <MayaInsightsBlock />

        {/* 2. Score y Tiempo ahorrado */}
        <div className="flex gap-3 mb-8">
          <Link href="/score" className="flex-1 min-w-0 rounded-2xl p-4 relative overflow-hidden bg-white border border-border block transition-all hover:shadow-md hover:border-primary/20">
            <img
              src="/Vector%20(6).svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
              aria-hidden
            />
            <Maximize2 className="absolute top-4 right-4 h-3.5 w-3.5 text-foreground/60 z-10" aria-hidden />
            <p className="text-[11px] font-medium text-foreground/80 uppercase tracking-wide relative z-10">Score</p>
            <p className="text-3xl font-bold tabular-nums text-foreground mt-0.5 relative z-10">{MOCK_SCORE}</p>
          </Link>
          <Link href="/tiempo-ahorrado" className="flex-1 min-w-0 rounded-2xl p-4 relative overflow-hidden bg-white border border-border block transition-all hover:shadow-md hover:border-primary/20">
            <img
              src="/Vector%20(6).svg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
              aria-hidden
            />
            <Maximize2 className="absolute top-4 right-4 h-3.5 w-3.5 text-foreground/60 z-10" aria-hidden />
            <p className="text-[11px] font-medium text-foreground/80 uppercase tracking-wide relative z-10">Tiempo ahorrado</p>
            <p className="text-3xl font-bold tabular-nums text-foreground mt-0.5 relative z-10">{MOCK_TIEMPO_TOTAL}</p>
          </Link>
        </div>

        {/* 3. Visibilidad: Mis propuestas + Webs activas */}
        <section className="space-y-3 mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Eye className="h-5 w-5 text-muted-foreground" />
            Visibilidad
          </h2>
          <PropuestasCarousel />
          <div className="rounded-xl border border-border bg-white p-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Webs activas</h2>
            <div className="flex items-center justify-between gap-3">
              <a
                href="https://www.matiasbuenosdias.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground truncate min-w-0 hover:text-foreground/80 transition-colors"
              >
                <span className="truncate">www.matiasbuenosdias.com</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
              <span
                className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium text-foreground"
                style={{ backgroundColor: "#38ED82" }}
              >
                Velocidad excelente
              </span>
            </div>
          </div>
          <div
            className="rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38ED82]/20">
                <FileText className="h-5 w-5 text-[#38ED82]" />
              </div>
              <div className="min-w-0 flex-1 flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-white/60 px-3 py-2">
                  <p className="text-lg font-bold tabular-nums text-foreground">{MOCK_WEBS.contenidoGenerado}</p>
                  <p className="text-[11px] text-foreground/60 truncate">Contenido generado</p>
                </div>
                <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-white/60 px-3 py-2">
                  <p className="text-lg font-bold tabular-nums text-foreground">~{MOCK_WEBS.tiempoAhorrado}</p>
                  <p className="text-[11px] text-foreground/60 truncate">Tiempo ahorrado</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Comunicación: WhatsApp, Instagram y Llamadas */}
        <section className="space-y-3 mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            Comunicación
          </h2>
          <div className="space-y-3">
            <ChannelMetricCard
              channel="llamadas"
              metrics={{
                primary: {
                  value: String(MOCK_LLAMADAS.recibidas),
                  label: "Recibidas",
                },
                secondary: {
                  value: `${MOCK_LLAMADAS.minutosAhorrados} min`,
                  label: "Ahorrados",
                },
              }}
              href="/conversaciones?channel=llamadas"
            />
            <ChannelMetricCard
              channel="whatsapp"
              metrics={{
                primary: { value: String(MOCK_WHATSAPP.respondidos), label: "Respondidos" },
                secondary: { value: String(MOCK_WHATSAPP.pendientesHumano), label: "Pendientes" },
                tertiary: { value: `~${MOCK_WHATSAPP.tiempoAhorrado}`, label: "Ahorrados" },
              }}
              href="/conversaciones?channel=whatsapp"
            />
            <ChannelMetricCard
              channel="instagram"
              metrics={{
                primary: { value: String(MOCK_INSTAGRAM.respondidos), label: "Respondidos" },
                secondary: { value: String(MOCK_INSTAGRAM.pendientes), label: "Pendientes" },
              }}
              href="/conversaciones?channel=instagram"
            />
          </div>
        </section>

        {/* 5. Reputación */}
        <ReputacionCard />

        {/* 6. Competidores */}
        <CompetidoresCard />
      </div>
    </div>
  );
}
