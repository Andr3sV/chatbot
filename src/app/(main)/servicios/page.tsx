"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServiciosPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Mis servicios</h1>
        </div>
      </header>
      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-2xl mx-auto pb-24">
        <p className="text-foreground/70">Contenido en construcción.</p>
      </div>
    </div>
  );
}
