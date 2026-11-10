"use client";

import { useEffect, useState, useCallback } from "react";
import type { ChatMessageItem } from "@/lib/validations/chat";

export function useChat(userId?: string) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchChat = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = userId ? `/api/chat?userId=${userId}` : "/api/chat";
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal memuat pesan");

      setMessages(data.messages || []);
      if (data.conversation) {
        setConversationId(data.conversation.id);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        await fetchChat();
      } catch {
        // error sudah ditangani di dalam fetchChat
      }
    }

    if (isMounted) {
      void loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchChat]);

  async function sendMessage(content: string, currentUserId: string) {
    try {
      setSending(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          conversation_id: conversationId || undefined,
          content,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        return {
          success: false,
          error: result.error || "Gagal mengirim pesan",
          fieldErrors: result.fieldErrors,
        };
      }

      await fetchChat();
      return { success: true };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim pesan";
      return { success: false, error: message };
    } finally {
      setSending(false);
    }
  }

  return {
    messages,
    conversationId,
    loading,
    error,
    sending,
    sendMessage,
    refetch: fetchChat,
  };
}
