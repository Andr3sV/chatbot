"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { AccountSelector } from "@/components/home/AccountSelector";
import { MayaInsightsBlock } from "@/components/home/MayaInsightsBlock";
import { PropuestasCarousel } from "@/components/home/PropuestasCarousel";
import { ChannelMetricCard } from "@/components/home/ChannelMetricCard";
import { ReputacionCard } from "@/components/home/ReputacionCard";

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
      {/* Header: selector cuenta + ajustes */}
      <header className="flex h-16 items-center bg-[#F5F5EB] px-4 lg:h-14 lg:px-8 rounded-b-2xl lg:rounded-b-none">
        <div className="flex w-full max-w-6xl items-center justify-between mx-auto">
          <div className="lg:hidden">
            <AccountSelector />
          </div>
          <div className="hidden lg:block lg:flex-1" aria-hidden />
          <Link
            href="/conversaciones/settings"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 md:h-9 md:w-9"
            aria-label="Ajustes"
          >
            <Settings className="h-7 w-7 md:h-4 md:w-4" />
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-6xl mx-auto w-full">
        {/* 1. Maya insights */}
        <MayaInsightsBlock />

        {/* 2. Visibilidad: Mis propuestas */}
        <section className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold text-foreground">
            Visibilidad
          </h2>
          <PropuestasCarousel />
        </section>

        {/* 3. Comunicación: WhatsApp, Instagram y Llamadas */}
        <section className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold text-foreground">
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
      </div>
    </div>
  );
}
