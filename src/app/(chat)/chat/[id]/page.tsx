"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { PendingApprovalAlert } from "@/components/chat/PendingApprovalAlert";
import { AISuggestionPanel } from "@/components/chat/AISuggestionPanel";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const client = getMessagingClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => client.getMessages(id),
    enabled: !!id,
  });

  const pendingMessage = messages.find((m) => m.status === "pending_approval");

  return (
    <div className="relative flex h-full flex-col border-l border-border chat-background-pattern">
      <ChatHeader
        conversationId={id}
        hasPendingApproval={!!pendingMessage}
      />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          hasFloatingTopAlert={!!pendingMessage}
        />
        {pendingMessage && (
          <div className="absolute left-0 right-0 top-0 z-10 px-4 pt-2">
            <PendingApprovalAlert show className="shadow-lg" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-2 px-4 pb-4 pt-2">
          {pendingMessage ? (
            <AISuggestionPanel
              conversationId={id}
              messageId={pendingMessage.id}
              suggestedText={pendingMessage.aiSuggestion ?? pendingMessage.content}
            />
          ) : (
            <ChatInput conversationId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
