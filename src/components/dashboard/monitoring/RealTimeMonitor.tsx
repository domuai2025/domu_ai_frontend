'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from '@/components/supabase/provider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { useVirtualizer } from '@tanstack/react-virtual';
import { VirtualList } from '@/components/ui/virtual-list';

interface AgentMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  activeConnections: number;
  queueSize: number;
}

interface MonitoringData {
  agentId: string;
  metrics: AgentMetrics[];
  status: 'active' | 'idle' | 'error';
  lastError?: string;
}

export function RealTimeMonitor() {
  const [monitoringData, setMonitoringData] = useState<Record<string, MonitoringData>>({});
  const { supabase } = useSupabase();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Object.keys(monitoringData).length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Height estimate for each card
  });

  useEffect(() => {
    // Subscribe to real-time metrics
    const channel = supabase
      .channel('agent-metrics')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_metrics',
      }, (payload) => {
        setMonitoringData(current => {
          const agentId = payload.new.agent_id;
          const newMetric: AgentMetrics = {
            timestamp: new Date(payload.new.timestamp).getTime(),
            cpu: payload.new.cpu_usage,
            memory: payload.new.memory_usage,
            activeConnections: payload.new.active_connections,
            queueSize: payload.new.queue_size,
          };

          const currentMetrics = current[agentId]?.metrics || [];
          return {
            ...current,
            [agentId]: {
              ...current[agentId],
              metrics: [...currentMetrics, newMetric].slice(-60), // Keep last 60 data points
            },
          };
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Real-Time Monitoring</h2>
      <VirtualList
        items={Object.keys(monitoringData)}
        height={800}
        itemHeight={300}
        className="w-full"
        renderItem={(agentId) => {
          const data = monitoringData[agentId];
          return (
            <Card className="m-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Agent {agentId}</CardTitle>
                <Badge variant={data.status === 'active' ? 'success' : 'warning'}>
                  {data.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                      />
                      <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU" />
                      <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm font-medium">Active Connections</div>
                    <div className="text-2xl">{data.metrics[data.metrics.length - 1]?.activeConnections}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Queue Size</div>
                    <div className="text-2xl">{data.metrics[data.metrics.length - 1]?.queueSize}</div>
                  </div>
                </div>

                {data.lastError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                    {data.lastError}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        }}
      />
    </div>
  );
}