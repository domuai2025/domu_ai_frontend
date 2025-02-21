'use client';

import { RealTimeChart } from '@/components/ui/real-time-chart';
import { useRealTimeData } from '@/hooks/use-real-time-data';
import { Grid } from '@/components/ui/grid';

interface MetricData {
  id: string;
  timestamp: number;
  value: number;
  metric_type: string;
}

export function LiveMetrics() {
  const { data: cpuData } = useRealTimeData<MetricData>({
    table: 'metrics',
    filter: { metric_type: 'cpu_usage' },
    orderBy: { column: 'timestamp', ascending: false },
    limit: 100,
  });

  const { data: memoryData } = useRealTimeData<MetricData>({
    table: 'metrics',
    filter: { metric_type: 'memory_usage' },
    orderBy: { column: 'timestamp', ascending: false },
    limit: 100,
  });

  return (
    <Grid className="gap-4 md:grid-cols-2">
      <RealTimeChart
        title="CPU Usage"
        data={cpuData}
        yAxisLabel="CPU %"
        color="#8884d8"
        maxPoints={100}
      />
      <RealTimeChart
        title="Memory Usage"
        data={memoryData}
        yAxisLabel="Memory (MB)"
        color="#82ca9d"
        maxPoints={100}

      />
    </Grid>
  );
}