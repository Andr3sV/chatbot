"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { PendingApprovalAlert } from "@/components/chat/PendingApprovalAlert";
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

  const { data: allConversations = [] } = useQuery({
    queryKey: ["conversations", "all"],
    queryFn: () => client.getConversations("all"),
    enabled: !!id,
  });

  const conversation = allConversations.find((c) => c.id === id);
  const channel = conversation?.channel ?? "whatsapp";
  const pendingMessage = messages.find((m) => m.status === "pending_approval");
  const showAISuggestion = channel === "whatsapp" && !!pendingMessage;
  const showChatInput =
    channel === "whatsapp" ||
    channel === "instagram" ||
    channel === "google";

  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);

  useEffect(() => {
    if (!showAISuggestion) {
      setIsEditingSuggestion(false);
    }
  }, [showAISuggestion]);

  return (
    <div className="relative flex h-full flex-col border-l border-border chat-background-pattern">
      <ChatHeader
        conversationId={id}
        conversation={conversation}
        hasPendingApproval={!!pendingMessage}
      />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          hasFloatingTopAlert={showAISuggestion}
          channel={channel}
          conversationId={id}
          onEditSuggestion={() => setIsEditingSuggestion(true)}
        />
        {showAISuggestion && (
          <div className="absolute left-0 right-0 top-0 z-10 px-4 pt-2">
            <PendingApprovalAlert show className="shadow-lg" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-2 px-2 pb-4 pt-2 md:px-3">
          {showChatInput && (
            <ChatInput
              conversationId={id}
              channel={channel}
              disabled={showAISuggestion && !isEditingSuggestion}
              initialText={
                isEditingSuggestion
                  ? pendingMessage?.aiSuggestion ?? pendingMessage?.content ?? ""
                  : undefined
              }
              isEditMode={isEditingSuggestion}
              messageId={pendingMessage?.id}
              onCancelEdit={() => setIsEditingSuggestion(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
