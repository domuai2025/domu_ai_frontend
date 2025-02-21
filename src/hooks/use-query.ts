import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';

export function useCustomQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options = {}
) {
  return useQuery({
    queryKey,
    queryFn,
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    },
    ...options
  });
} 