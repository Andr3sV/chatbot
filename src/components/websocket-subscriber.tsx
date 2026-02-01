"use client";

import { useEffect, useState } from "react";
import { useMessagingWebSocket } from "@/lib/websocket/use-messaging-websocket";

export function WebSocketSubscriber() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <WebSocketHook />;
}

function WebSocketHook() {
  useMessagingWebSocket();
  return null;
}
