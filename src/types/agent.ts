export interface AgentConfig {
  responseTemplates: string[];
  postingSchedule: string;
  customSettings: Record<string, string | number | boolean>;
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  type: string;
  metrics: {
    leadsGenerated: number;
    appointmentsScheduled: number;
    postsScheduled: number;
  };
  config?: AgentConfig;
} 