'use client';

import { useState } from 'react';
import { StatCard } from "@/components/ui/stat-card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Target, TrendingUp } from 'lucide-react';
import { useAnalytics } from "@/hooks/use-analytics";
import { PermissionGuard } from "@/components/permissions/PermissionGuard";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function AnalyticsDashboardV2() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data, isLoading } = useAnalytics(timeRange);

  if (isLoading || !data) {
    return <div>Loading analytics...</div>;
  }

  return (
    <PermissionGuard permission="analytics:read">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Analytics</h2>
          <div className="flex items-center gap-4">
            <Tabs defaultValue={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
            <DatePickerWithRange
              date={{
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                to: new Date(),
              }}
              onDateChange={() => {}}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={data?.totalUsers ?? 0}
            trend={{ value: 12.5, isUpward: true }}
            icon={<Users className="w-4 h-4" />}
            variant="purple"
          />
          <StatCard
            title="Conversations"
            value={data?.conversations ?? 0}
            trend={{ value: 8.2, isUpward: true }}
            icon={<MessageSquare className="w-4 h-4" />}
            variant="blue"
          />
          <StatCard
            title="Conversion Rate"
            value={`${data?.conversionRate ?? 0}%`}
            trend={{ value: 3.1, isUpward: true }}
            icon={<Target className="w-4 h-4" />}
            variant="green"
          />
          <StatCard
            title="Revenue"
            value={`$${data?.revenue ?? 0}`}
            trend={{ value: 15.3, isUpward: true }}
            icon={<TrendingUp className="w-4 h-4" />}
            variant="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Metrics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.conversionMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8884d8" />
                  <Bar dataKey="conversions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}