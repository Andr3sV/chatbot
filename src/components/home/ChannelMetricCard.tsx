"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, MessageCircle, Phone } from "lucide-react";
import type { Channel } from "@/lib/api/messaging-types";
import { Card, CardContent } from "@/components/ui/card";
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

interface ChannelMetricCardProps {
  channel: Channel;
  metrics?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  href: string;
}

export function ChannelMetricCard({
  channel,
  metrics,
  href,
}: ChannelMetricCardProps) {
  const config = CHANNEL_CONFIG[channel];
  const Icon = config.Icon;

  return (
    <Link href={href} className="block group">
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 bg-[#FBFBF7]",
          "hover:shadow-md hover:border-primary/30 hover:ring-2 hover:ring-primary/10",
          "active:scale-[0.99]"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  channel === "whatsapp" && "bg-[#25D366]/20",
                  channel === "instagram" && "bg-pink-500/20",
                  channel === "llamadas" && "bg-blue-500/20"
                )}
              >
                <Icon className={cn("h-5 w-5", config.iconClassName)} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {config.label}
                </h3>
                {metrics && (
                  <div className="mt-0.5 space-y-0.5">
                    {metrics.primary && (
                      <p className="text-sm text-foreground/80">
                        {metrics.primary}
                      </p>
                    )}
                    {metrics.secondary && (
                      <p className="text-xs text-foreground/60">
                        {metrics.secondary}
                      </p>
                    )}
                    {metrics.tertiary && (
                      <p className="text-xs text-foreground/60">
                        {metrics.tertiary}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground group-hover:bg-accent/90 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
