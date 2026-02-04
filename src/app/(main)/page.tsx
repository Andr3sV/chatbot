"use client";

import Link from "next/link";
import { Menu, Bell, MessageCircle, Eye } from "lucide-react";
import { AccountSelector } from "@/components/home/AccountSelector";
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EB]">
      {/* Header: menu + selector cuenta centrado + ajustes (estilo como lista conversaciones) */}
      <header className="flex h-16 items-center justify-between gap-2 bg-[#F5F5EB] px-4 pt-3 md:h-14 md:pt-0 lg:px-8 rounded-b-2xl lg:rounded-b-none">
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 md:h-9 md:w-9 lg:hidden"
          aria-label="Menú"
        >
          <Menu className="h-7 w-7 md:h-4 md:w-4" />
        </button>
        <div className="flex flex-1 min-w-0 justify-center px-2 lg:hidden">
          <AccountSelector />
        </div>
        <div className="hidden lg:flex flex-1" aria-hidden />
        <Link
          href="#"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 md:h-9 md:w-9"
          aria-label="Notificaciones"
        >
          <Bell className="h-7 w-7 md:h-4 md:w-4" />
        </Link>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-6xl mx-auto w-full">
        {/* 1. Maya insights */}
        <MayaInsightsBlock />

        {/* 2. Visibilidad: Mis propuestas */}
        <section className="space-y-3 mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Eye className="h-5 w-5 text-muted-foreground" />
            Visibilidad
          </h2>
          <PropuestasCarousel />
        </section>

        {/* 3. Comunicación: WhatsApp, Instagram y Llamadas */}
        <section className="space-y-3 mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            Comunicación
          </h2>
          <div className="space-y-3">
            <ChannelMetricCard
              channel="llamadas"
              metrics={{
                primary: `${MOCK_LLAMADAS.recibidas} llamadas recibidas`,
                secondary: `${MOCK_LLAMADAS.minutosAhorrados} min ahorrados`,
              }}
              href="/conversaciones?channel=llamadas"
            />
            <ChannelMetricCard
              channel="whatsapp"
              metrics={{
                primary: `${MOCK_WHATSAPP.respondidos} mensajes respondidos`,
                secondary: `${MOCK_WHATSAPP.pendientesHumano} pendiente${MOCK_WHATSAPP.pendientesHumano !== 1 ? "s" : ""} que requiere${MOCK_WHATSAPP.pendientesHumano !== 1 ? "n" : ""} humano`,
                tertiary: `~${MOCK_WHATSAPP.tiempoAhorrado} ahorrados`,
              }}
              href="/conversaciones?channel=whatsapp"
            />
            <ChannelMetricCard
              channel="instagram"
              metrics={{
                primary: "Conversaciones de Instagram",
              }}
              href="/conversaciones?channel=instagram"
            />
          </div>
        </section>

        {/* 4. Reputación */}
        <ReputacionCard />

        {/* 5. Competidores */}
        <CompetidoresCard />
      </div>
    </div>
  );
}
