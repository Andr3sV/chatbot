import { ChatLayoutWrapper } from "@/components/chat-layout-wrapper";

export default function ConversacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutWrapper>{children}</ChatLayoutWrapper>;
}
