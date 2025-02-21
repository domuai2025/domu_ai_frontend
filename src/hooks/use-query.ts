import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export function useCustomQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'> = {}
) {
  const { toast } = useToast();

  return useQuery<T, Error>({
    ...options,
    queryKey,
    queryFn,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
}