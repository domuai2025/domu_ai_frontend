'use client';

import { useOptimizedQuery } from './use-optimized-query';
import { useSupabase } from '@/components/supabase/provider';

interface AnalyticsData {
  totalUsers: number;
  conversations: number;
  conversionRate: number;
  revenue: number;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
  conversionMetrics: Array<{
    date: string;
    leads: number;
    conversions: number;
  }>;
}

export function useAnalytics(timeRange: 'daily' | 'weekly' | 'monthly') {
  const { supabase } = useSupabase();

  return useOptimizedQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('time_range', timeRange)
        .single();

      if (error) throw error;

      return data as AnalyticsData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}