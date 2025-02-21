'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from '@/components/supabase/provider';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  cpu_usage: number;
  memory_usage: number;
  last_activity: string;
  tasks_completed: number;
  tasks_failed: number;
}

export function AgentMonitoring() {
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchAgentStatuses = async () => {
      const { data, error } = await supabase
        .from('agent_status')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching agent statuses:', error);
        return;
      }

      setAgentStatuses(data as unknown as AgentStatus[]);
    };

    fetchAgentStatuses();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('agent_status_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'agent_status' },
        (payload) => {
          setAgentStatuses(current =>
            current.map(status =>
              status.id === (payload.new as AgentStatus).id ? (payload.new as AgentStatus) : status
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Agent Monitoring</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agentStatuses.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                {agent.name}
              </CardTitle>
              <Badge
                variant={
                  agent.status === 'active' ? 'success' :
                  agent.status === 'error' ? 'warning' : 'default'
                }
              >
                {agent.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>{agent.cpu_usage}%</span>
                  </div>
                  <Progress value={agent.cpu_usage} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{agent.memory_usage}%</span>
                  </div>
                  <Progress value={agent.memory_usage} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Tasks Completed</div>
                    <div className="font-medium">{agent.tasks_completed}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Tasks Failed</div>
                    <div className="font-medium">{agent.tasks_failed}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Activity: {new Date(agent.last_activity).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}