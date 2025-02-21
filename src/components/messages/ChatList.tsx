'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Chat {
  id: string;
  title: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string | null) => void;
  onNewChat?: () => void;
  isLoading: boolean;
  error: string | null;
}

export function ChatList({
  chats,
  selectedChat,
  onSelectChat,
  onNewChat,
  isLoading,
  error
}: ChatListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button
            size="sm"
            onClick={onNewChat}
            className="rounded-full"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No chats yet</div>
        ) : (
          chats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${
                selectedChat === chat.id ? 'bg-slate-100' : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.last_message}
                  </p>
                </div>
                {chat.unread_count > 0 && (
                  <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {chat.unread_count}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}