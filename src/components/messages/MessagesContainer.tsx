'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { motion } from 'framer-motion';

interface Chat {
  id: string;
  title: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  chat_id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export function MessagesContainer() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error: apiError } = await supabase
          .from('chats')
          .select('*')
          .order('last_message_at', { ascending: false });

        if (apiError) throw apiError;
        setChats((data as unknown as Chat[]) || []);
      } catch (err) {
        setError('Failed to load chats');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchChats();

    // Subscribe to new chats
    const channel = supabase
      .channel('chats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats' },
        (payload) => {
          setChats(current => [payload.new as Chat, ...current]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedChat)
        .order('created_at', { ascending: true });

      setMessages((data as unknown as Message[]) || []);
    };

    void fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${selectedChat}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [selectedChat, supabase]);

  const createNewChat = async (title: string) => {
    const { data: chat, error } = await supabase
      .from('chats')
      .insert({
        title,
        last_message: '',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat:', error);
      return;
    }

    setChats(current => [(chat as unknown as Chat), ...current]);
    setSelectedChat((chat as { id: string }).id);
  };

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 border-r"
      >
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onNewChat={() => {
            const title = prompt('Enter chat title:');
            if (title) void createNewChat(title);
          }}
          isLoading={isLoading}
          error={error}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1"
      >
        {selectedChat ? (
          <ChatWindow
            chatId={selectedChat}
            messages={messages}
            onSendMessage={async (content: string) => {
              const { data: message } = await supabase
                .from('messages')
                .insert({
                  chat_id: selectedChat,
                  content,
                  sender_id: (await supabase.auth.getUser()).data.user?.id,
                })
                .select()
                .single();


              if (message) {
                await supabase
                  .from('chats')
                  .update({
                    last_message: content,
                    last_message_at: new Date().toISOString(),
                  })
                  .eq('id', selectedChat);
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </motion.div>
    </div>
  );
}