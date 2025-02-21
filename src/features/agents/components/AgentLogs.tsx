import { useState } from 'react';
import type { AgentLog } from '../types';

export function AgentLogs() {
  const [logs] = useState<AgentLog[]>([]);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Agent Logs</h3>
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={`${log.agentId}-${log.timestamp}`} className="text-sm">
            <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`ml-2 ${log.level === 'error' ? 'text-red-500' : ''}`}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}