import { SupabaseClient } from '@supabase/supabase-js';

interface AgentStatus {
  id: string;
  status: 'active' | 'idle' | 'error';
  lastPing: string;
  metrics: {
    cpu: number;
    memory: number;
    activeConnections: number;
  };
}

export class AgentService {
  private supabase: SupabaseClient;
  private statusChannel?: ReturnType<SupabaseClient['channel']>;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    this.statusChannel = this.supabase.channel('default-channel');
  }

  async startAgent(agentId: string) {
    const { error } = await this.supabase
      .from('agent_status')
      .update({
        status: 'active',
        lastPing: new Date().toISOString()
      })
      .eq('id', agentId);

    if (error) throw error;
  }

  async stopAgent(agentId: string) {
    const { error } = await this.supabase
      .from('agent_status')
      .update({
        status: 'idle',
        lastPing: new Date().toISOString()
      })
      .eq('id', agentId);

    if (error) throw error;
  }

  subscribeToAgentStatus(agentId: string, callback: (status: AgentStatus) => void) {
    this.statusChannel = this.supabase
      .channel(`agent-${agentId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_status',
          filter: `id=eq.${agentId}`
        },
        (payload) => {
          callback(payload.new as AgentStatus);
        }
      )
      .subscribe();

    return () => {
      if (this.statusChannel) {
        this.supabase.removeChannel(this.statusChannel);
      }
    };
  }

  async updateAgentMetrics(agentId: string, metrics: AgentStatus['metrics']) {
    const { error } = await this.supabase
      .from('agent_metrics')
      .insert({
        agent_id: agentId,
        ...metrics,
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
  }
}