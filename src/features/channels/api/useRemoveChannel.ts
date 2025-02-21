import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface RemoveChannelData {
  id: string;
}

export const useRemoveChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: RemoveChannelData) => {
      await axios.delete(`/api/channels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
}; 