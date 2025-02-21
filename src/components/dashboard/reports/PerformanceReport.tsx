'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from '@/components/supabase/provider';
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { addDays, format } from 'date-fns';
import { DateRange } from "react-day-picker";

interface AgentMetric {
  timestamp: string;
  leads_generated: number;
  messages_processed: number;
  tasks_completed: number;
  success_rate: number;
}

interface PerformanceData {
  date: string;
  leadsGenerated: number;
  messagesProcessed: number;
  tasksCompleted: number;
  successRate: number;
}

export function PerformanceReport() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .gte('timestamp', dateRange.from.toISOString())
        .lte('timestamp', dateRange.to.toISOString())
        .order('timestamp', { ascending: true })
        .returns<AgentMetric[]>();

      if (error) {
        console.error('Error fetching performance data:', error);
        return;
      }

      // Process and aggregate data by date
      const aggregatedData = data.reduce((acc: Record<string, PerformanceData>, curr) => {
        const date = format(new Date(curr.timestamp), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = {
            date,
            leadsGenerated: 0,
            messagesProcessed: 0,
            tasksCompleted: 0,
            successRate: 0,
          };
        }

        acc[date].leadsGenerated += curr.leads_generated;
        acc[date].messagesProcessed += curr.messages_processed;
        acc[date].tasksCompleted += curr.tasks_completed;
        acc[date].successRate = (curr.success_rate + acc[date].successRate) / 2;

        return acc;
      }, {});

      setPerformanceData(Object.values(aggregatedData));
    };

    fetchPerformanceData();
  }, [supabase, dateRange]);

  const handleExportReport = async () => {
    // Convert data to CSV
    const csvContent = [
      ['Date', 'Leads Generated', 'Messages Processed', 'Tasks Completed', 'Success Rate'],
      ...performanceData.map(row => [
        row.date,
        row.leadsGenerated,
        row.messagesProcessed,
        row.tasksCompleted,
        `${row.successRate.toFixed(2)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDateChange = (date: DateRange | undefined) => {
    if (date?.from && date?.to) {
      setDateRange({ from: date.from, to: date.to });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Report</h2>
        <div className="flex items-center gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={handleDateChange}
          />
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.reduce((sum, data) => sum + data.leadsGenerated, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leadsGenerated" fill="#8884d8" name="Leads" />
                <Bar dataKey="messagesProcessed" fill="#82ca9d" name="Messages" />
                <Bar dataKey="tasksCompleted" fill="#ffc658" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}