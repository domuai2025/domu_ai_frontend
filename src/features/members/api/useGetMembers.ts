import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Member {
  id: string;
  name: string;
  email: string;
  // Add other member properties as needed
}

export const useGetMembers = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async (): Promise<Member[]> => {
      const { data } = await axios.get(`/api/workspaces/${workspaceId}/members`);
      return data;
    },
    enabled: !!workspaceId,
  });
};