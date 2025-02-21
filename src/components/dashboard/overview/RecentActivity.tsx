'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, UserPlus, CheckCircle, Clock, Bell, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from 'react';
import { Activity, ActivityType } from '@/types';
import { useRouter } from 'next/navigation';

const LoadingSkeleton = React.memo(() => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />

        </div>
      </div>
    ))}
  </div>
));
LoadingSkeleton.displayName = 'LoadingSkeleton';

const EmptyState = React.memo(({
  hasActivities,
  hasFilters,
  onClearFilters
}: {
  hasActivities: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
}) => (
  <div className="text-center text-muted-foreground text-sm py-8">
    <p className="mb-2">
      {hasActivities ? 'No matching activities' : 'No recent activity'}
    </p>
    {hasActivities && hasFilters && (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearFilters}
      >
        Clear filters
      </Button>
    )}
  </div>
));
EmptyState.displayName = 'EmptyState';

export function RecentActivity() {
  const { supabase } = useSupabase();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const activityTypes = React.useMemo(() => [
    { value: 'new_lead' as ActivityType, label: 'New Leads', icon: UserPlus },
    { value: 'status_change' as ActivityType, label: 'Status Changes', icon: CheckCircle },
    { value: 'note_added' as ActivityType, label: 'Notes', icon: MessageSquare },
    { value: 'contact_made' as ActivityType, label: 'Contacts', icon: Clock },
  ], []);

  const sortedActivities = React.useMemo(() =>
    [...activities].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [activities]
  );

  const filteredActivities = React.useMemo(() =>
    sortedActivities.filter(activity =>
      selectedTypes.length === 0 || selectedTypes.includes(activity.type)
    ),
    [sortedActivities, selectedTypes]
  );

  const handleFilter = React.useCallback((checked: boolean, value: ActivityType) => {
    console.log('Filter changed:', { type: value, checked });
    setSelectedTypes(current =>
      checked
        ? [...current, value]
        : current.filter(t => t !== value)
    );
  }, []);

  const getActivityIcon = React.useCallback((type: ActivityType) => {
    const icons = {
      'new_lead': <UserPlus className="h-4 w-4" />,
      'status_change': <CheckCircle className="h-4 w-4" />,
      'note_added': <MessageSquare className="h-4 w-4" />,
      'contact_made': <Clock className="h-4 w-4" />
    };
    return icons[type] || null;
  }, []);

  const getActivityColor = React.useCallback((type: ActivityType) => {
    const colors = {
      'new_lead': 'text-blue-500 bg-blue-50',
      'status_change': 'text-green-500 bg-green-50',
      'note_added': 'text-purple-500 bg-purple-50',
      'contact_made': 'text-orange-500 bg-orange-50'
    };
    return colors[type] || 'text-gray-500 bg-gray-50';
  }, []);

  const fetchMoreActivities = useCallback(async () => {
    try {
      const lastActivity = activities[activities.length - 1];
      if (!lastActivity) return;

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('createdAt', { ascending: false })
        .lt('createdAt', lastActivity.createdAt)
        .limit(10);

      if (error) throw error;
      if (data) {
        setActivities(current => [...current, ...(data as unknown as Activity[])]);
      }
    } catch (err) {
      console.error('Error fetching more activities:', err);
    }
  }, [activities, supabase]);

  const observerRef = React.useRef<IntersectionObserver>();
  const lastActivityRef = React.useCallback((node: HTMLDivElement) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isLoading && activities.length >= 10) {
        void fetchMoreActivities(
        );
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, activities, fetchMoreActivities]);

  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const setupRealtimeSubscription = React.useCallback(() => {
    const channel = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
        },
        (payload) => {
          console.log('New activity received:', payload);
          const newActivity = payload.new as Activity;
          setActivities(current => [newActivity, ...current]);
          setHasNewActivity(true);
        }

      )
      .subscribe();

    return channel;
  }, [supabase]);

  const ActivityItem = React.memo(({ activity }: { activity: Activity }) => {
    const icon = getActivityIcon(activity.type);
    const colorClass = getActivityColor(activity.type);

    return (
      <div className="flex items-start gap-4 p-2">
        <div className={cn("p-2 rounded-lg", colorClass)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{activity.description}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    );
  });
  ActivityItem.displayName = 'ActivityItem';

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data as Activity[]);
      setIsInitialized(true);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const handleRefresh = useCallback(() => {
    void fetchActivities();
    setHasNewActivity(false);
  }, [fetchActivities]);

  const ActivityHeader = React.memo(({
    selectedTypes,
    onFilter,
    hasNewActivity,
    onRefresh,
    activityTypes
  }: {
    selectedTypes: ActivityType[];
    onFilter: (checked: boolean, value: ActivityType) => void;
    hasNewActivity: boolean;
    onRefresh: () => void;
    activityTypes: { value: ActivityType; label: string; icon: React.ElementType }[];
  }) => (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Filter activities"
            >
              <Filter className="h-4 w-4" />
              {selectedTypes.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center">
                  {selectedTypes.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {activityTypes.map(type => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={(checked) => onFilter(checked, type.value)}

              >
                <span className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {hasNewActivity && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="text-xs text-blue-500 hover:text-blue-600"
        >
          <Bell className="h-3 w-3 mr-1 animate-pulse" />
          New Activity
        </Button>
      )}
    </CardHeader>
  ));
  ActivityHeader.displayName = 'ActivityHeader';

  useEffect(() => {
    console.log('Setting up component...');
    void fetchActivities();
    const channel = setupRealtimeSubscription();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, setupRealtimeSubscription, fetchActivities]);

  // Add real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription...');
    const channel = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
        },
        (payload) => {
          console.log('New activity received:', payload);
          const newActivity = payload.new as Activity;
          setActivities(current => [newActivity, ...current]);
          setHasNewActivity(true);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Add click handler for lead names
  const handleLeadClick = useCallback((leadId: string) => {
    router.push(`/dashboard/leads/${leadId}`);
  }, [router]);

  if (!isInitialized || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Rendering error state:', error); // Debug log
    return (
      <Card>
        <ActivityHeader
          selectedTypes={selectedTypes}
          onFilter={handleFilter}
          hasNewActivity={hasNewActivity}
          onRefresh={handleRefresh}
          activityTypes={activityTypes}
        />
        <CardContent className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <LoadingSkeleton />
          <div className="text-center text-red-500 py-4">
            <p>{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void fetchActivities()}
              className="mt-2"
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ActivityHeader
        selectedTypes={selectedTypes}
        onFilter={handleFilter}
        hasNewActivity={hasNewActivity}
        onRefresh={handleRefresh}
        activityTypes={activityTypes}
      />
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredActivities.length === 0 ? (
          <EmptyState
            hasActivities={activities.length > 0}
            hasFilters={selectedTypes.length > 0}
            onClearFilters={() => setSelectedTypes([])}
          />
        ) : (
          filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              ref={index === filteredActivities.length - 1 ? lastActivityRef : null}
              className="cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
              onClick={() => handleLeadClick(activity.leadId)}
            >
              <ActivityItem activity={activity} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}