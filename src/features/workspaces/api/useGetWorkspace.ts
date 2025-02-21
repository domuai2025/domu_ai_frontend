import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Workspace {
  id: string;
  name: string;
  // Add other workspace properties as needed
}

export const useGetWorkspace = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async (): Promise<Workspace> => {
      const { data } = await axios.get(`/api/workspaces/${workspaceId}`);
      return data;
    },
    enabled: !!workspaceId,
  });
}; 