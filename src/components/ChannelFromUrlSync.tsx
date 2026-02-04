"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useChannel } from "@/contexts/channel-context";
import type { Channel } from "@/lib/api/messaging-types";

const VALID_CHANNELS: (Channel | "all")[] = [
  "all",
  "whatsapp",
  "instagram",
  "google",
  "llamadas",
];

export function ChannelFromUrlSync() {
  const searchParams = useSearchParams();
  const { setSelectedChannel } = useChannel();

  useEffect(() => {
    const channelParam = searchParams.get("channel");
    if (channelParam && VALID_CHANNELS.includes(channelParam as Channel | "all")) {
      setSelectedChannel(channelParam as Channel | "all");
    }
  }, [searchParams, setSelectedChannel]);

  return null;
}
