"use client";

import Link from "next/link";
import { Camera, MessageCircle, Phone } from "lucide-react";
import type { Channel } from "@/lib/api/messaging-types";
import { cn } from "@/lib/utils";

const CHANNEL_CONFIG: Record<
  Channel,
  { label: string; Icon: typeof MessageCircle; iconClassName: string }
> = {
  whatsapp: {
    label: "WhatsApp",
    Icon: MessageCircle,
    iconClassName: "text-[#25D366]",
  },
  instagram: {
    label: "Instagram",
    Icon: Camera,
    iconClassName: "text-pink-500",
  },
  google: {
    label: "Google",
    Icon: MessageCircle,
    iconClassName: "text-amber-500",
  },
  llamadas: {
    label: "Llamadas",
    Icon: Phone,
    iconClassName: "text-blue-500",
  },
};

type MetricItem = string | { value: string; label: string };

interface ChannelMetricCardProps {
  channel: Channel;
  metrics?: {
    primary?: MetricItem;
    secondary?: MetricItem;
    tertiary?: MetricItem;
  };
  href: string;
}

function MiniMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-white/60 px-3 py-2">
      <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-[11px] text-foreground/60 truncate">{label}</p>
    </div>
  );
}

export function ChannelMetricCard({
  channel,
  metrics,
  href,
}: ChannelMetricCardProps) {
  const config = CHANNEL_CONFIG[channel];
  const Icon = config.Icon;

  const metricItems: { value: string; label: string }[] = [];
  if (metrics?.primary) {
    if (typeof metrics.primary === "object") {
      metricItems.push({
        value: metrics.primary.value,
        label: metrics.primary.label,
      });
    }
  }
  if (metrics?.secondary && typeof metrics.secondary === "object") {
    metricItems.push({
      value: metrics.secondary.value,
      label: metrics.secondary.label,
    });
  }
  if (metrics?.tertiary && typeof metrics.tertiary === "object") {
    metricItems.push({
      value: metrics.tertiary.value,
      label: metrics.tertiary.label,
    });
  }

  const primaryString =
    metrics?.primary && typeof metrics.primary === "string"
      ? metrics.primary
      : null;

  return (
    <Link href={href} className="block group">
      <div
        className={cn(
          "cursor-pointer rounded-xl border border-border bg-[#FBFBF7] p-4 transition-all duration-200",
          "hover:shadow-md hover:border-primary/30 hover:ring-2 hover:ring-primary/10",
          "active:scale-[0.99]"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              channel === "whatsapp" && "bg-[#25D366]/15",
              channel === "instagram" && "bg-pink-500/15",
              channel === "llamadas" && "bg-blue-500/15"
            )}
          >
            <Icon className={cn("h-5 w-5", config.iconClassName)} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {config.label}
            </h3>
            {metricItems.length > 0 ? (
              <div className="mt-2 flex gap-2">
                {metricItems.map((m, i) => (
                  <MiniMetric key={i} value={m.value} label={m.label} />
                ))}
              </div>
            ) : primaryString ? (
              <p className="mt-1 text-sm text-foreground/80">
                {primaryString}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
