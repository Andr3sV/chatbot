"use client";

import { useEffect, useState } from "react";

const BRAND_COLOR = "#BEFF50";
const COMPETITOR_COLOR = "#9CA3AF";

type Marker = { id: string; label: string; lat: number; lng: number; isMarca: boolean };

const MOCK_MARKERS: Marker[] = [
  { id: "marca", label: "Tu marca", lat: 40.4185, lng: -3.7026, isMarca: true },
  { id: "c1", label: "Competidor A", lat: 40.415, lng: -3.708, isMarca: false },
  { id: "c2", label: "Competidor B", lat: 40.422, lng: -3.698, isMarca: false },
  { id: "c3", label: "Competidor C", lat: 40.412, lng: -3.695, isMarca: false },
  { id: "c4", label: "Competidor D", lat: 40.425, lng: -3.705, isMarca: false },
];

export function CompetenciaMap() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{ markers: Marker[] }> | null>(null);

  useEffect(() => {
    import("./CompetenciaMapInner").then((mod) => setMapComponent(() => mod.CompetenciaMapInner));
  }, []);

  if (!MapComponent) {
    return (
      <div className="aspect-[4/3] max-h-[220px] rounded-xl bg-muted/30 animate-pulse flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MapComponent markers={MOCK_MARKERS} />
      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border border-black/30"
            style={{ backgroundColor: BRAND_COLOR }}
          />
          Tu marca
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: COMPETITOR_COLOR }}
          />
          Competencia
        </span>
      </div>
    </div>
  );
}
