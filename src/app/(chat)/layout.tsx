import { ChatLayoutWrapper } from "@/components/chat-layout-wrapper";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutWrapper>{children}</ChatLayoutWrapper>;
}
