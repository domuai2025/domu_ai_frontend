'use client';

import { useState, useEffect } from 'react';
import { AgentCard } from '@/components/dashboard/agents/AgentCard';
import { AgentConfigurationPanel } from '@/components/dashboard/agents/AgentConfigurationPanel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { Agent } from '@/types/agent';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch agents from your API
    const fetchAgents = async () => {
      // Replace with actual API call
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'Content Creator Agent',
          status: 'active',
          type: 'Content Generation',
          metrics: {
            leadsGenerated: 15,
            appointmentsScheduled: 0,
            postsScheduled: 25,
          },
        },
        {
          id: '2',
          name: 'Social Media Posting Agent',
          status: 'idle',
          type: 'Social Media',
          metrics: {
            leadsGenerated: 30,
            appointmentsScheduled: 0,
            postsScheduled: 45,
          },
        },
        // Add more mock agents
      ];
      setAgents(mockAgents);
    };

    fetchAgents();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <p className="text-gray-500">Manage and monitor your AI agents</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onStart={(id: string) => {
              const updatedAgents = agents.map(agent =>
                agent.id === id ? { ...agent, status: 'active' as const } : agent
              );
              setAgents(updatedAgents);
              console.log('Started agent:', id);
            }}
            onStop={(id: string) => {
              const updatedAgents = agents.map(agent =>
                agent.id === id ? { ...agent, status: 'idle' as const } : agent
              );
              setAgents(updatedAgents);
              console.log('Stopped agent:', id);
            }}
            onConfigClick={() => {
              setSelectedAgentId(agent.id);
            }}
          />
        ))}
      </div>

      <Dialog 
        open={!!selectedAgentId} 
        onOpenChange={() => setSelectedAgentId(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedAgentId && (
            <AgentConfigurationPanel agentId={selectedAgentId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}