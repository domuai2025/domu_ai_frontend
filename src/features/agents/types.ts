export interface Agent {
    id: string;
    name: string;
    status: 'active' | 'idle' | 'stopped';
    type: string;
    config?: Record<string, unknown>;
}

export interface AgentLog {
    agentId: string;
    status: Agent['status'];
    message: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error';
}