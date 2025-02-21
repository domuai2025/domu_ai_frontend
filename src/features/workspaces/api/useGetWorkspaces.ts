import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Workspace {
  id: string;
  name: string;
  // Add other workspace properties as needed
}

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async (): Promise<Workspace[]> => {
      const { data } = await axios.get('/api/workspaces');
      return data;
    },
  });
}; 