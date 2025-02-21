"use client";

import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase/provider";
import { MessageList } from "@/components/MessageList";
import { useChannelId } from "@/hooks/useChannelId";
import { ChatInput } from "./ChatInput";
import { Header } from "./Header";

interface Message {
  id: string;
  body: string;
  image_url?: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

const ChannelPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const channelId = useChannelId();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          image_url,
          created_at,
          user:user_id (
            id,
            name,
            image
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data as unknown as Message[]);
      setIsLoading(false);
    };

    void fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`channel:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [channelId, supabase]);

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={`Channel #${channelId}`} />
      <MessageList
        variant="channel"
        data={messages}
        loadMore={async () => {
          // Implement load more logic here
        }}
        isLoadingMore={false}
        canLoadMore={false}
      />
      <ChatInput placeholder="Send a message" />
    </div>
  );
};

export default ChannelPage;
