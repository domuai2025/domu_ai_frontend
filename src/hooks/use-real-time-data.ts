import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/supabase/provider';

interface UseRealTimeDataOptions<T> {
  table: string;
  initialData?: T[];
  filter?: Record<string, string | number | boolean>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  onDataUpdate?: (data: T[]) => void;
}

export function useRealTimeData<T extends { id: string }>({
  table,
  initialData = [],
  filter,
  orderBy,
  limit,
  onDataUpdate,
}: UseRealTimeDataOptions<T>) {
  const { supabase } = useSupabase();
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let query = supabase
      .from(table)
      .select('*');

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending ?? false,
      });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const fetchData = async () => {
      try {
        const { data: initialData, error } = await query;
        if (error) throw error;
        setData(initialData as T[]);
        onDataUpdate?.(initialData as T[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
      }, (payload) => {
        setData((currentData) => {
          let newData = [...currentData];

          switch (payload.eventType) {
            case 'INSERT':
              newData = [payload.new as T, ...newData];
              break;
            case 'UPDATE':
              newData = newData.map((item) =>
                item.id === payload.new.id ? (payload.new as T) : item
              );
              break;
            case 'DELETE':
              newData = newData.filter((item) => item.id !== payload.old.id);
              break;
          }

          if (limit) {
            newData = newData.slice(0, limit);
          }

          onDataUpdate?.(newData);
          return newData;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    table,
    filter,
    orderBy,
    limit,
    onDataUpdate,
    supabase
  ]);

  return { data, error, isLoading };
}