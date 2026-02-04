"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chatBg = "bg-[hsl(var(--chat-background))]";

export default function NuevaPropuestaPage() {
  const [image, setImage] = React.useState<File | null>(null);
  const [contexto, setContexto] = React.useState("");
  const [fecha, setFecha] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  return (
    <div className={`flex flex-col min-h-screen ${chatBg}`}>
      <header className={`sticky top-0 z-30 ${chatBg} px-4 py-4 lg:px-8`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/posts" className="flex items-center justify-center w-10 h-10 rounded-full text-black hover:bg-accent/20 transition-colors shrink-0" aria-label="Volver">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">Nueva propuesta</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-xl mx-auto w-full">
        <label className="block mb-4">
          <span className="text-sm font-medium text-foreground mb-2 block">Imagen</span>
          <div className={cn("border-2 border-dashed rounded-xl p-8 text-center transition-colors", image ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/10")}>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-foreground/60" />
              {image ? <span className="text-sm text-foreground">{image.name}</span> : <span className="text-sm text-foreground/70">Toca para adjuntar una imagen</span>}
            </label>
          </div>
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-foreground mb-2 block">Contexto</span>
          <textarea value={contexto} onChange={(e) => setContexto(e.target.value)} placeholder="Describe el contexto o ideas para esta propuesta..." className="w-full min-h-[120px] rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" rows={4} />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-foreground mb-2 block">Fecha de publicación</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" />
            <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </label>

        <Button className="w-full gap-2 rounded-full bg-black text-white hover:bg-black/90" size="lg">Guardar propuesta</Button>
      </div>
    </div>
  );
}
