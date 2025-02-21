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