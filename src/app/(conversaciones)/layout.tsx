import { Suspense } from "react";
import { ChatLayoutWrapper } from "@/components/chat-layout-wrapper";
import { ChannelFromUrlSync } from "@/components/ChannelFromUrlSync";

export default function ConversacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ChannelFromUrlSync />
      </Suspense>
      <ChatLayoutWrapper>{children}</ChatLayoutWrapper>
    </>
  );
}
