"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock: mismo dato que en la lista (en real vendría de API)
const getPropuestaById = (id: string) => {
  const data: Record<string, { title: string; caption: string; scheduledAt: string; imagePlaceholder: string }> = {
    p1: {
      title: "¿Quieres un hogar fresco... sin químicos ni aromas artificiales?",
      caption: "Descubre cómo mantener tu casa limpia y fresca con productos naturales. #HogarSano #EcoTucci",
      scheduledAt: "18 Feb 2025, 10:00",
      imagePlaceholder: "bg-gradient-to-br from-amber-100 to-green-100",
    },
    p2: {
      title: "Fabricamos limpio desde la raíz",
      caption: "Cada producto está pensado para cuidar de ti y del planeta. #Sostenibilidad #LimpiezaNatural",
      scheduledAt: "20 Feb 2025, 12:00",
      imagePlaceholder: "bg-gradient-to-br from-green-50 to-emerald-100",
    },
    p3: {
      title: "Nuevos productos para tu día a día sostenible",
      caption: "Pequeños cambios que marcan la diferencia. #VidaSostenible #EcoTucci",
      scheduledAt: "22 Feb 2025, 09:00",
      imagePlaceholder: "bg-gradient-to-br from-teal-50 to-cyan-100",
    },
  };
  return data[id] ?? data.p1;
};

export default function PostPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [toast, setToast] = React.useState(false);
  const propuesta = getPropuestaById(id);

  const handleAceptar = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleSolicitarCambios = () => {
    router.push("/messages?from=maya");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5EB]">
      <header className="sticky top-0 z-30 bg-[#F5F5EB] px-4 py-4 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/posts"
            className="flex items-center justify-center w-10 h-10 rounded-full text-black hover:bg-accent/20 transition-colors shrink-0"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">
              Preview
            </h1>
            <p className="text-sm text-foreground/70">
              Así se verá en Instagram
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-md mx-auto w-full">
        {/* Preview tipo Instagram */}
        <div className="rounded-xl overflow-hidden border border-border bg-white shadow-sm">
          {/* Header fake IG */}
          <div className="flex items-center gap-3 p-3 border-b border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
              PT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">ecotucci</p>
              <p className="text-xs text-foreground/60">Eco Tucci</p>
            </div>
          </div>
          {/* Imagen */}
          <div
            className={cn(
              "aspect-square w-full min-h-[280px]",
              propuesta.imagePlaceholder
            )}
          />
          {/* Caption */}
          <div className="p-3 space-y-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold mr-1">ecotucci</span>
              {propuesta.caption}
            </p>
          </div>
        </div>

        {/* Fecha de publicación */}
        <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
          <Calendar className="h-4 w-4" />
          <span>Se publicará el {propuesta.scheduledAt}</span>
        </div>

        {/* Botones */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleSolicitarCambios}
          >
            <Send className="h-4 w-4" />
            Solicitar cambios
          </Button>
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            onClick={handleAceptar}
          >
            <Check className="h-4 w-4" />
            Aceptar propuesta
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-4 right-4 z-50 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-center text-sm font-medium shadow-lg"
          role="status"
        >
          Gracias por aprobar
        </div>
      )}
    </div>
  );
}
