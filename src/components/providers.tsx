"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AccountProvider } from "@/contexts/account-context";
import { ChannelProvider } from "@/contexts/channel-context";
import { WebSocketSubscriber } from "./websocket-subscriber";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AccountProvider>
        <ChannelProvider>
        {children}
        <WebSocketSubscriber />
      </ChannelProvider>
      </AccountProvider>
    </QueryClientProvider>
  );
}
