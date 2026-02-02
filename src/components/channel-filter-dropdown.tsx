"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useChannel } from "@/contexts/channel-context";
import type { Channel } from "@/lib/api/messaging-types";
import {
  Camera,
  ChevronDown,
  Layers,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SelectedChannel = Channel | "all";

const CHANNEL_OPTIONS: {
  value: SelectedChannel;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}[] = [
  { value: "all", label: "Todos los canales", icon: Layers },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    iconClassName: "text-[#25D366]",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: Camera,
    iconClassName: "text-pink-500",
  },
  {
    value: "google",
    label: "Google",
    icon: Star,
    iconClassName: "text-amber-500",
  },
  {
    value: "llamadas",
    label: "Llamadas",
    icon: Phone,
    iconClassName: "text-blue-500",
  },
];

export function ChannelFilterDropdown() {
  const { selectedChannel, setSelectedChannel } = useChannel();
  const currentOption = CHANNEL_OPTIONS.find((o) => o.value === selectedChannel);
  const CurrentIcon = currentOption?.icon ?? Layers;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-12 gap-2 rounded-full border-border px-4 font-normal md:h-9 md:gap-1.5 md:px-3",
            "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <CurrentIcon
            className={cn(
              "h-5 w-5 shrink-0 md:h-4 md:w-4",
              currentOption?.iconClassName ?? "text-muted-foreground"
            )}
          />
          <span className="truncate text-base md:text-sm">
            {currentOption?.label ?? "Todos los canales"}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground md:h-4 md:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 text-base">
        <DropdownMenuRadioGroup
          value={selectedChannel}
          onValueChange={(v) => setSelectedChannel(v as SelectedChannel)}
        >
          {CHANNEL_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                className="py-2.5 text-base"
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 shrink-0",
                    opt.iconClassName ?? "text-muted-foreground"
                  )}
                />
                {opt.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
