"use client";

import { ChevronRight, Plus, Trash2 } from "lucide-react";
import type { ServiceProduct } from "@/lib/api/messaging-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPrice(service: ServiceProduct): string {
  if (service.priceMax != null && service.priceMax !== service.priceMin) {
    return `${service.priceMin.toFixed(2)}€ - ${service.priceMax.toFixed(2)}€`;
  }
  return `${service.priceMin.toFixed(2)}€`;
}

function formatDuration(minutes?: number): string {
  if (minutes == null) return "";
  return `${minutes} min`;
}

interface ServicesSectionProps {
  services: ServiceProduct[];
  onChange: (services: ServiceProduct[]) => void;
}

export function ServicesSection({ services, onChange }: ServicesSectionProps) {
  const handleDelete = (id: string) => {
    onChange(services.filter((s) => s.id !== id));
  };

  const handleAdd = () => {
    const newId = `s${Date.now()}`;
    onChange([
      ...services,
      {
        id: newId,
        name: "Nuevo servicio",
        priceMin: 0,
      },
    ]);
  };

  const handleSelect = (id: string) => {
    // TODO: navegar a detalle/edición del servicio
    console.log("Editar servicio:", id);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Añade un Servicio/Producto</h3>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
          >
            <button
              type="button"
              onClick={() => handleDelete(service.id)}
              className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Eliminar ${service.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{service.name}</p>
              {service.durationMinutes != null && (
                <p className="text-sm text-muted-foreground">
                  {formatDuration(service.durationMinutes)}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-medium text-foreground">
                {formatPrice(service)}
              </span>
              <button
                type="button"
                onClick={() => handleSelect(service.id)}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={`Ver detalles de ${service.name}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted/50",
            "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-muted-foreground/30">
            <Plus className="h-4 w-4" />
          </div>
          <span className="font-medium">Añadir nuevo</span>
        </button>
      </div>
    </div>
  );
}
