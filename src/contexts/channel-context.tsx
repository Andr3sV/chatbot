"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Channel } from "@/lib/api/messaging-types";

export type SelectedChannel = Channel | "all";

interface ChannelContextValue {
  selectedChannel: SelectedChannel;
  setSelectedChannel: (channel: SelectedChannel) => void;
}

const ChannelContext = createContext<ChannelContextValue | null>(null);

export function ChannelProvider({ children }: { children: ReactNode }) {
  const [selectedChannel, setSelectedChannelState] =
    useState<SelectedChannel>("all");

  const setSelectedChannel = useCallback((channel: SelectedChannel) => {
    setSelectedChannelState(channel);
  }, []);

  return (
    <ChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannel() {
  const ctx = useContext(ChannelContext);
  if (!ctx) {
    throw new Error("useChannel must be used within ChannelProvider");
  }
  return ctx;
}
