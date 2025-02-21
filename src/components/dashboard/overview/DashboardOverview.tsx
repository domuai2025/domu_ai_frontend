'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Target, Activity, ArrowUp, ArrowDown, Calendar, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentActivity } from './RecentActivity';
import type { DashboardStats } from '@/types/index';
import { ErrorBoundary } from '@/components/error-boundary';

const STAT_CARD_VARIANTS = {
  leads: {
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
    hoverBorder: "hover:border-blue-500/50"
  },
  newLeads: {
    gradient: "from-green-500/10 to-green-500/5",
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
    hoverBorder: "hover:border-green-500/50"
  },
  conversion: {
    gradient: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
    hoverBorder: "hover:border-purple-500/50"
  },
  active: {
    gradient: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100",
    hoverBorder: "hover:border-orange-500/50"
  }
};

const StatCard = ({ title, value, icon: Icon, metric, metricValue, description, variant }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  metric?: string;
  metricValue?: number;
  description?: string;
  variant: keyof typeof STAT_CARD_VARIANTS;
}) => {
  const styles = STAT_CARD_VARIANTS[variant];

  return (
    <Card className={cn(
      "bg-gradient-to-br transition-all duration-200",
      styles.gradient,
      styles.hoverBorder,
      "hover:shadow-lg hover:shadow-primary/10"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", styles.iconBg)}>
            <Icon className={cn("h-4 w-4", styles.iconColor)} />
          </div>
          {title}
        </CardTitle>
        {description && (
          <span className="text-xs text-muted-foreground/60 bg-background/50 px-2 py-1 rounded-full">
            {description}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {metric && metricValue !== undefined && (
          <div className="flex items-center text-xs mt-2">
            <div className={cn(
              "flex items-center rounded-full px-2 py-1",
              metricValue > 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            )}>
              {metricValue > 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(metricValue).toFixed(1)}%</span>
            </div>
            <span className="ml-2 text-muted-foreground">{metric}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function DashboardOverview() {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeadsToday: 0,
    conversionRate: 0,
    activeConversations: 0,
    weeklyGrowth: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      today.setHours(0, 0, 0, 0);
      lastWeek.setHours(0, 0, 0, 0);

      const responses = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact' }),
        supabase.from('leads').select('*', { count: 'exact' }).gte('createdAt', today.toISOString()),
        supabase.from('leads').select('*', { count: 'exact' }).eq('status', 'converted'),
        supabase.from('leads').select('*', { count: 'exact' }).lte('createdAt', lastWeek.toISOString())
      ]);

      const [totalLeads, newLeadsToday, convertedLeads, lastWeekLeads] = responses.map(r => r.count ?? 0);
      const weeklyGrowth = lastWeekLeads ? ((totalLeads - lastWeekLeads) / lastWeekLeads) * 100 : 0;

      setStats({
        totalLeads: totalLeads || 0,
        newLeadsToday: newLeadsToday || 0,
        conversionRate: totalLeads ? ((convertedLeads || 0) / totalLeads) * 100 : 0,
        activeConversations: 0,
        weeklyGrowth
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchStats();
  }, [supabase, fetchStats]);

  const refreshStats = () => {
    void fetchStats();
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-8">
                <Skeleton className="h-4 w-[140px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[100px] mb-2" />
                <Skeleton className="h-4 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshStats}
          className="gap-2 hover:bg-primary hover:text-primary-foreground"
          disabled={isLoading}
        >
          <RefreshCw className={cn(
            "h-4 w-4",
            isLoading && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
          metric="this week"
          metricValue={stats.weeklyGrowth}
          description="All time"
          variant="leads"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeadsToday}
          icon={Activity}
          metric="vs. yesterday"
          metricValue={15}
          description="Today"
          variant="newLeads"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={Target}
          metric="vs. last week"
          metricValue={5.2}
          description="Overall"
          variant="conversion"
        />
        <StatCard
          title="Active Conversations"
          value={stats.activeConversations}
          icon={TrendingUp}
          description="Real-time"
          variant="active"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ErrorBoundary>
          <RecentActivity />
        </ErrorBoundary>
      </div>
    </div>
  );
}