'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    status: 'active' | 'idle' | 'error';
    type: string;
    metrics: {
      leadsGenerated: number;
      appointmentsScheduled: number;
      postsScheduled: number;
    };
  };
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onConfigClick: () => void;
}

export function AgentCard({ agent, onStart, onStop, onConfigClick }: AgentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <Badge variant={agent.status === 'active' ? 'success' : 'default'}>
          {agent.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatCard title="Leads" value={agent.metrics.leadsGenerated} />
          <StatCard title="Appointments" value={agent.metrics.appointmentsScheduled} />
          <StatCard title="Posts" value={agent.metrics.postsScheduled} />
          <div className="flex gap-2">
            {agent.status === 'idle' ? (
              <Button onClick={() => onStart(agent.id)}>Start Agent</Button>
            ) : (
              <Button onClick={() => onStop(agent.id)}>Stop Agent</Button>
            )}
            <Button variant="outline" onClick={onConfigClick}>
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
