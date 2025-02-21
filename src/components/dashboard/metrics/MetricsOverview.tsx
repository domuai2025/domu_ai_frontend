'use client';

import { useEffect, useState, useMemo } from 'react';
import { MetricCard } from './MetricCard';
import { useSupabase } from '@/components/supabase/provider';
import { Users, MessageSquare, Target, TrendingUp } from 'lucide-react';

interface Metrics {
  totalLeads: number;
  activeAgents: number;
  messagesSent: number;
  conversionRate: number;
  weeklyGrowth: {
    leads: number;
    messages: number;
  };
}

export function MetricsOverview() {
  const { supabase } = useSupabase();
  const [metrics, setMetrics] = useState<Metrics>({
    totalLeads: 0,
    activeAgents: 0,
    messagesSent: 0,
    conversionRate: 0,
    weeklyGrowth: { leads: 0, messages: 0 },
  });

  // Memoize the fetch function
  const fetchMetrics = useMemo(() => async () => {
    // Use Promise.all for parallel requests
    const [agentsResult, leadsResult, messagesResult] = await Promise.all([
      supabase.from('agents').select('count').eq('status', 'active').single(),
      supabase.from('leads').select('count').single(),
      supabase.from('messages').select('count').single(),
    ]);

    setMetrics(current => ({
      ...current,
      totalLeads: leadsResult.count || 0,
      activeAgents: agentsResult.count || 0,
      messagesSent: messagesResult.count || 0,
    }));
  }, [supabase]);

  useEffect(() => {
    fetchMetrics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('metrics-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'agents'
      }, fetchMetrics)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMetrics, supabase]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Leads"
        value={metrics.totalLeads}
        icon={<Users className="h-4 w-4" />}
        trend={{ value: metrics.weeklyGrowth.leads, isPositive: true }}
      />
      <MetricCard
        title="Active Agents"
        value={metrics.activeAgents}
        icon={<Target className="h-4 w-4" />}
      />
      <MetricCard
        title="Messages Sent"
        value={metrics.messagesSent}
        icon={<MessageSquare className="h-4 w-4" />}
        trend={{ value: metrics.weeklyGrowth.messages, isPositive: true }}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description="Leads converted to customers"
      />
    </div>
  );
}