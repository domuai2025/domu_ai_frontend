import { useState, useCallback } from 'react';
import { AppError, handleError } from '@/lib/error-handling';
import { toast } from 'sonner';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      options.onSuccess?.(result);

      if (options.showSuccessToast) {
        toast.success(options.successMessage || "Operation completed successfully");
      }

      return result;
    } catch (err) {
      const error = handleError(err);
      setError(error);
      options.onError?.(error);

      if (options.showErrorToast) {
        toast.error(error.message);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, options]);

  return {
    execute,
    loading,
    error,
    data,
    setData,
  };
}