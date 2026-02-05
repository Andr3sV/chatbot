"use client";

import Link from "next/link";
import { ArrowLeft, Camera, MessageCircle, Search, MapPin, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const SCORE_BAR_COLOR = "#6B8E23"; // olivedrab

const SCORE_ITEMS = [
  { id: "propuesta", label: "Propuesta de valor", score: 68, icon: Zap, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { id: "instagram", label: "Instagram", score: 82, icon: Camera, iconBg: "bg-pink-500/15", iconColor: "text-pink-500" },
  { id: "seo", label: "SEO", score: 75, icon: Search, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { id: "canal", label: "Canal de contacto", score: 51, icon: MessageCircle, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { id: "maps", label: "Google Maps", score: 93, icon: MapPin, iconBg: "bg-red-100", iconColor: "text-red-500" },
  { id: "competidores", label: "Competidores", score: 65, icon: BarChart3, iconBg: "bg-violet-100", iconColor: "text-violet-600", showChart: true },
];

const CHART_HEIGHTS = [37, 76, 64, 46, 83, 64, 79, 76, 83];
const HIGHLIGHT_INDEX = 3;

function ScoreCard({
  label,
  score,
  Icon,
  iconBg,
  iconColor,
  showChart,
}: {
  label: string;
  score: number;
  Icon: typeof Camera;
  iconBg: string;
  iconColor: string;
  showChart?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className="rounded-2xl bg-white border border-border p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        {showChart && (
          <div className="flex items-end gap-1 h-9">
            {CHART_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full min-h-[8px]"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === HIGHLIGHT_INDEX ? SCORE_BAR_COLOR : "#E8E4EC",
                }}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-2xl font-bold tabular-nums text-foreground">{score}/100</p>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: SCORE_BAR_COLOR }}
        />
      </div>
    </div>
  );
}

export default function ScorePage() {
  return (
    <div className="min-h-screen bg-[#FBFBF7]">
      <header className="sticky top-0 z-30 bg-[#FBFBF7] px-4 py-4 lg:px-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/5 transition-colors"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Score</h1>
        </div>
      </header>

      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-2xl mx-auto pb-24">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SCORE_ITEMS.map((item) => (
            <ScoreCard
              key={item.id}
              label={item.label}
              score={item.score}
              Icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              showChart={item.showChart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
