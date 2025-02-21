'use client';

import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLoadingState, useError } from '@/store/selectors';
import { useUIStore } from '@/store/ui-store';

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
}

const MetricCard = memo(({ title, value, change }: MetricCardProps) => {
  const trend = useMemo(() => {
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  }, [change]);

  return (
    <div className={`metric-card ${trend}`}>
      <h3>{title}</h3>
      <p>{value}</p>
      <span>{change}%</span>
    </div>
  );
});
MetricCard.displayName = 'MetricCard';

export const MetricsPanel = memo(() => {
  const setLoading = useUIStore((state) => state.setLoading);
  const setError = useUIStore((state) => state.setError);
  const isLoading = useLoadingState('metrics');
  const error = useError('metrics');

  const { data } = useQuery({
    queryKey: ['metrics'],
    queryFn: async (): Promise<MetricsData> => {
      setLoading('metrics', true);
      try {
        // Fetch metrics
        const metricsData: MetricsData = {
          users: 100,
          userChange: 5,
          revenue: 50000,
          revenueChange: 2.5
        };
        setError('metrics', null);
        return metricsData;
      } catch (err) {
        setError('metrics', err as Error);
        throw err;
      } finally {
        setLoading('metrics', false);
      }
    }
  });

  const metrics = useMemo(() => {
    if (!data) return [];
    return [
      { title: 'Total Users', value: data.users, change: data.userChange },
      { title: 'Revenue', value: data.revenue, change: data.revenueChange },
      // More metrics...
    ];
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="metrics-grid">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
});

MetricsPanel.displayName = 'MetricsPanel';

interface MetricsData {
  users: number;
  userChange: number;
  revenue: number;
  revenueChange: number;
}