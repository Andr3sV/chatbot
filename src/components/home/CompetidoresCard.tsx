"use client";

import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_COMPETIDORES = {
  titulo: "Comparativa con tu sector",
  descripcion: "Analiza cómo te posicionas frente a la competencia",
};

export function CompetidoresCard() {
  const { titulo, descripcion } = MOCK_COMPETIDORES;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Users className="h-5 w-5 text-muted-foreground" />
        Competidores
      </h2>
      <Card className="border border-border bg-[#FBFBF7] rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">{titulo}</p>
              <p className="mt-1 text-sm text-foreground/70">{descripcion}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
