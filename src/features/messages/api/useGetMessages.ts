import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

export const useGetMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      const { data } = await axios.get(`/api/conversations/${conversationId}/messages`);
      return data;
    },
    enabled: !!conversationId,
  });
}; 