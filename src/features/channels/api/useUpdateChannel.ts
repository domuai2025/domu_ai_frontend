import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UpdateChannelData {
  id: string;
  name?: string;
  description?: string;
}

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateChannelData) => {
      const response = await axios.patch(`/api/channels/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['channel', id] });
    },
  });
};