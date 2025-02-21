import React from 'react';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

export interface MessageListProps {
  variant: 'channel' | 'conversation';
  data: Message[];
  loadMore: () => Promise<void>;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  variant,
  data: messages,
  loadMore,
  isLoadingMore,
  canLoadMore
}) => {
  if (isLoadingMore) {
    return <div>Loading more messages...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold">{message.sender.name}</span>
            <span className="text-sm text-gray-500">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1">{message.content}</p>
        </div>
      ))}
    </div>
  );
}; 