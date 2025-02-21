import type { Lead } from '@/types/lead';

export async function fetchLeads(): Promise<Lead[]> {
  // Replace with actual API call
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'new',
      source: 'Website',
      createdAt: new Date().toISOString(),
    },
    // Add more mock leads
  ];

  return mockLeads;
}

export async function exportLeads(): Promise<void> {
  // Implement lead export functionality
} 