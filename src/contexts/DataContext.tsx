import { createContext, useContext, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store/ui-store';

interface DataContextValue {
  fetchData: <T>(key: string, fetcher: () => Promise<T>) => Promise<T>;
  queryClient: ReturnType<typeof useQueryClient>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const setLoading = useUIStore((state) => state.setLoading);
  const setError = useUIStore((state) => state.setError);

  const fetchData = useCallback(async <T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
    setLoading(key, true);
    try {
      const data = await fetcher();
      return data;
    } catch (error) {
      setError(key, error as Error);
      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading, setError]);

  const value = useMemo(() => ({
    fetchData,
    queryClient,
  }), [fetchData, queryClient]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};