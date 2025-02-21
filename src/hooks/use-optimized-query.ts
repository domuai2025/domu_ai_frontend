import { useCallback, useEffect, useRef, useState } from 'react';
import { AppError, handleError } from '@/lib/error-handling';

interface UseOptimizedQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type QueryCache = Map<string, CacheEntry<unknown>>;

// Create a singleton cache instance
const queryCache: QueryCache = new Map();

export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  staleTime = 1000 * 60 * 5, // 5 minutes
  cacheTime = 1000 * 60 * 30, // 30 minutes
  enabled = true,
  onSuccess,
  onError,
}: UseOptimizedQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cacheKey = queryKey.join('-');

  const fetchData = useCallback(async (signal: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedEntry = queryCache.get(cacheKey);
      if (cachedEntry && Date.now() - cachedEntry.timestamp < staleTime) {
        setData(cachedEntry.data as T);
        onSuccess?.(cachedEntry.data as T);
        return;
      }

      const result = await queryFn();

      if (signal.aborted) return;

      // Update cache
      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      if (signal.aborted) return;

      const error = handleError(err);
      setError(error);
      onError?.(error);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [queryKey, queryFn, staleTime, onSuccess, onError, cacheKey]);

  useEffect(() => {
    // Clean up old cache entries
    const now = Date.now();
    Array.from(queryCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > cacheTime) {
        queryCache.delete(key);
      }
    });
  }, [cacheTime]);

  useEffect(() => {
    if (!enabled) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    fetchData(abortController.signal);

    return () => {
      abortController.abort();
      abortControllerRef.current = null;
    };
  }, [enabled, fetchData]);

  const refetch = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    await fetchData(abortController.signal);
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}