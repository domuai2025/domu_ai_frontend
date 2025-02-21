import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}

interface CreateConversationData {
  workspaceId: string;
  participantId: string;
}

export const useCreateOrGetConversation = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, participantId }: CreateConversationData): Promise<Conversation> => {
      const { data } = await axios.post(`/api/workspaces/${workspaceId}/conversations`, {
        participantId,
      });
      return data;
    },
  });
}; 