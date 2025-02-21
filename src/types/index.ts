export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  activeConversations: number;
  weeklyGrowth: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
  /**
   *
   */
  assignedTo?: string;
}

export type ActivityType = 'new_lead' | 'status_change' | 'note_added' | 'contact_made';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  workspaceId: string;
  channelId?: string;
  message?: string;
  createdAt: string;
  description: string;
  leadId: string;
}