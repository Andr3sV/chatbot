"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPropuestaById } from "@/lib/mock-posts";
import { cn } from "@/lib/utils";

const chatBg = "bg-[hsl(var(--chat-background))]";

export default function PostPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [toast, setToast] = React.useState(false);
  const propuesta = getPropuestaById(id ?? "");

  const handleAceptar = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleSolicitarCambios = () => {
    router.push("/messages?from=maya");
  };

  return (
    <div className={`flex flex-col min-h-screen ${chatBg}`}>
      <header className={`sticky top-0 z-30 ${chatBg} px-4 py-4 lg:px-8`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/posts" className="flex items-center justify-center w-10 h-10 rounded-full text-black hover:bg-accent/20 transition-colors shrink-0" aria-label="Volver">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">Preview</h1>
            <p className="text-sm text-foreground/70">Así se verá en Instagram</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-md mx-auto w-full">
        <div className="rounded-xl overflow-hidden border border-border bg-white shadow-sm">
          <div className="flex items-center gap-3 p-3 border-b border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">VB</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">vinobar</p>
              <p className="text-xs text-foreground/60">Bar de Vinos</p>
            </div>
          </div>
          <div className="relative aspect-square w-full min-h-[280px] overflow-hidden">
            {propuesta.image ? (
              <Image src={propuesta.image} alt="" fill className="object-cover" sizes="400px" />
            ) : (
              <div className={cn("w-full h-full", propuesta.imagePlaceholder)} />
            )}
          </div>
          <div className="p-3 space-y-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold mr-1">vinobar</span>
              {propuesta.caption}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
          <Calendar className="h-4 w-4" />
          <span>Se publicará el {propuesta.scheduledAt}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button variant="outline" className="w-full gap-2" onClick={handleSolicitarCambios}>
            <Send className="h-4 w-4" />
            Solicitar cambios
          </Button>
          <Button className="w-full gap-2 bg-primary hover:bg-primary/90" onClick={handleAceptar}>
            <Check className="h-4 w-4" />
            Aceptar propuesta
          </Button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-center text-sm font-medium shadow-lg" role="status">
          Gracias por aprobar
        </div>
      )}
    </div>
  );
}
