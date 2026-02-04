"use client";

import { Award, ArrowUpRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MOCK_REPUTACION = {
  reviews: 346,
  rating: 4.6,
  sectorRating: 4.8,
  variacion: -10,
  variacionLabel: "Estás -10% por debajo de tu sector",
};

export function ReputacionCard() {
  const { reviews, rating, sectorRating, variacionLabel } = MOCK_REPUTACION;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Award className="h-5 w-5 text-primary" />
          Reputación
        </h2>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          aria-label="Ver reputación"
        >
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>
      <Card className="border border-border bg-[#FBFBF7] rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">Google</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {reviews} reviews
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {rating}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i <= Math.floor(rating)
                          ? "fill-foreground text-foreground"
                          : i === Math.ceil(rating) && rating % 1 > 0
                            ? "fill-foreground/50 text-foreground/50"
                            : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground/60">
                  / {sectorRating} tu sector
                </span>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold">
                    !
                  </span>
                  {variacionLabel}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
