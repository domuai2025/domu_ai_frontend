'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Settings } from 'lucide-react';
import { AgentConfigModal } from './AgentConfigModal';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ComponentProps } from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  lastActive: string;
  type: string;
  metrics: {
    leadsGenerated: number;
    messagesProcessed: number;
    successRate: number;
  };
}

interface AgentConfig {
  responseTemplates: string[];
  postingSchedule: string;
  customSettings: Record<string, string | number | boolean>;
}

export function AgentControlPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*') as { data: Agent[], error: null };

      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }

      setAgents(data || []);
    };

    fetchAgents();
  }, [supabase]);

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop') => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update({
          status: action === 'start' ? 'active' : 'idle',
          lastActive: new Date().toISOString()
        })
        .eq('id', agentId)
        .select()
        .single() as { data: Agent, error: null };

      if (error) throw error;

      setAgents(agents.map(agent =>
        agent.id === agentId ? data : agent
      ));
    } catch (error) {
      console.error(`Error ${action}ing agent:`, error);
    }
  };

  const getStatusVariant = (status: Agent['status']): ComponentProps<typeof StatusIndicator>['variant'] => {
    switch (status) {
      case 'active': return 'online';
      case 'idle': return 'idle';
      case 'error': return 'offline';
      default: return 'idle';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">{agent.name}</CardTitle>
              <StatusIndicator variant={getStatusVariant(agent.status)}>
                {agent.status}
              </StatusIndicator>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Leads Generated</p>
                    <p className="text-2xl font-bold">{agent.metrics.leadsGenerated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{agent.metrics.successRate}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={agent.status === 'active' ? 'destructive' : 'default'}
                    onClick={() => handleAgentAction(agent.id, agent.status === 'active' ? 'stop' : 'start')}
                    className="flex-1"
                  >
                    {agent.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAgent(agent.id);
                      setIsConfigOpen(true);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAgent && (
        <AgentConfigModal
          isOpen={isConfigOpen}
          onClose={() => {
            setIsConfigOpen(false);
            setSelectedAgent(null);
          }}
          onSave={async (config: AgentConfig) => {
            const { error } = await supabase
              .from('agent_configs')
              .upsert({
                agent_id: selectedAgent,
                ...config
              });

            if (error) throw error;
            setIsConfigOpen(false);
            setSelectedAgent(null);
          }}
        />
      )}
    </div>
  );
}