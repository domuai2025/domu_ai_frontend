import { useState } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { useToast } from '@/components/ui/toast';

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  variables?: TVariables;
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables, supabase: ReturnType<typeof useSupabase>['supabase']) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
) {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mutationFn(variables, supabase);

      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      options.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);

      if (options.errorMessage) {
        toast.error(options.errorMessage);
      }

      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
}