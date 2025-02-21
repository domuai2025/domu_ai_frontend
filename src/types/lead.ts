export interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  source: string;
  createdAt: string;
}