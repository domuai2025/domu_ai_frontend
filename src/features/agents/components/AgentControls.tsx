import type { Agent } from '../types';

interface AgentControlsProps {
  agents: Agent[];
  onToggle: (agentId: string, action: 'start' | 'stop') => Promise<void>;
}

export function AgentControls({ agents, onToggle }: AgentControlsProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Agent Controls</h3>
      {agents.map(agent => (
        <div key={agent.id} className="mt-2">
          <span>{agent.name}</span>
          <button onClick={() => onToggle(agent.id, agent.status === 'stopped' ? 'start' : 'stop')}>
            {agent.status === 'stopped' ? 'Start' : 'Stop'}
          </button>
        </div>
      ))}
    </div>
  );
}