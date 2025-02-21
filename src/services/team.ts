import { SupabaseClient } from '@supabase/supabase-js';

export interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export class TeamService {
  constructor(private supabase: SupabaseClient) {}

  async inviteMember(email: string, role: string): Promise<void> {
    const { error } = await this.supabase
      .from('team_invitations')
      .insert({
        email,
        role,
        status: 'pending',
        invited_by: (await this.supabase.auth.getUser()).data.user?.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });

    if (error) throw error;
  }

  async acceptInvitation(invitationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('team_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId);

    if (error) throw error;
  }

  async getPendingInvitations(): Promise<TeamInvitation[]> {
    const { data, error } = await this.supabase
      .from('team_invitations')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;
    return data;
  }
}