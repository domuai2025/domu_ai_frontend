'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from '@/components/ui/status-indicator';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface RealTimeChartProps {
  title: string;
  data: DataPoint[];
  maxPoints?: number;
  yAxisLabel?: string;
  color?: string;
  isLive?: boolean;
  onDataUpdate?: (data: DataPoint[]) => void;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload?.[0]?.value !== undefined) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">
          {new Date(label).toLocaleTimeString()}
        </p>
        <p className="text-sm text-muted-foreground">
          Value: {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function RealTimeChart({
  title,
  data,
  maxPoints = 100,
  yAxisLabel,
  color = "#8884d8",
  isLive = true,
  onDataUpdate,
}: RealTimeChartProps) {
  const [chartData, setChartData] = useState<DataPoint[]>(data);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setChartData((currentData) => {
        const newData = [...currentData, {
          timestamp: Date.now(),
          value: currentData[currentData.length - 1].value + (Math.random() - 0.5) * 10,
        }].slice(-maxPoints);

        onDataUpdate?.(newData);
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, maxPoints, onDataUpdate]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">
          {title}
        </CardTitle>
        {isLive && (
          <StatusIndicator variant="online">Live</StatusIndicator>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis label={yAxisLabel && { value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 