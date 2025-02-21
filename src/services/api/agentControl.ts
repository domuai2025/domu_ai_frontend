import { SupabaseClient } from '@supabase/supabase-js';

export interface AgentCommand {
  agentId: string;
  command: 'start' | 'stop' | 'pause' | 'resume';
  parameters?: Record<string, unknown>;
}

export interface AgentCommandResult {
  id: string;
  agent_id: string;
  command: string;
  status: 'pending' | 'completed' | 'failed';
  result?: Record<string, unknown>;
  timestamp: string;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: AgentCommandResult;
}

export class AgentControlAPI {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async sendCommand(command: AgentCommand): Promise<AgentResponse> {
    try {
      const { data, error } = await this.supabase
        .from('agent_commands')
        .insert({
          agent_id: command.agentId,
          command: command.command,
          parameters: command.parameters,
          status: 'pending',
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: `Command ${command.command} sent successfully`,
        data,
      };
    } catch (error) {
      console.error('Error sending command:', error);
      return {
        success: false,
        message: 'Failed to send command',
      };
    }
  }

  async getAgentStatus(agentId: string) {
    try {
      const { data, error } = await this.supabase
        .from('agent_status')
        .select('*')
        .eq('agent_id', agentId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error fetching agent status:', error);
      return {
        success: false,
        message: 'Failed to fetch agent status',

      };
    }
  }


  subscribeToCommandResults(agentId: string, callback: (result: AgentCommandResult) => void) {
    const channel = this.supabase
      .channel(`agent-commands-${agentId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_commands',

        filter: `agent_id=eq.${agentId}`,
      }, payload => {
        if (payload.new.status !== 'pending') {
          callback(payload.new as AgentCommandResult);
        }
      })
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }
}