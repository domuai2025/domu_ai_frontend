import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import type { Agent, AgentLog } from './types';
import { AgentLogs } from './components/AgentLogs';
import { AgentControls } from './components/AgentControls';
import { AgentConfig } from './components/AgentConfig';

export const AgentControlPanel = () => {
  const ws = useWebSocket();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Fetch initial agents
    const fetchAgents = async () => {
      // Implement agent fetching logic
    };

    fetchAgents();

    // Subscribe to agent logs
    ws.subscribe('agent_logs', (log: AgentLog) => {
      // Update agent status based on logs
      setAgents(prev => prev.map(agent =>
        log.agentId === agent.id
          ? { ...agent, status: log.status }
          : agent
      ));
    });

    return () => ws.unsubscribe('agent_logs');
  }, [ws]);

  // Start/Stop Agent
  const toggleAgent = async (agentId: string, action: 'start' | 'stop') => {
    await ws.send({
      type: 'agent_control',
      action,
      agentId
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AgentControls agents={agents} onToggle={toggleAgent} />
      <AgentLogs />
      <AgentConfig />
    </div>
  );
};