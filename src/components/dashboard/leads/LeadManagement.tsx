'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Phone, Clock, Eye } from 'lucide-react';
import { useSupabase } from '@/components/supabase/provider';
import { DataTable } from '@/components/ui/data-table';
import { LeadForm } from './LeadForm';
import { LeadDetails } from './LeadDetails';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { Lead } from '@/types';

type Column = {
  key: keyof Lead;
  title: string;
  render?: (value: string | undefined, row: Lead) => React.ReactNode;
}

export function LeadManagement() {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { supabase } = useSupabase();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return;
      }

      setLeads(data || []);
    };

    fetchLeads();
  }, [supabase]);

  const handleAddLead = async (data: Omit<Lead, 'id' | 'createdAt'>) => {
    try {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([
          {
            ...data,
            createdAt: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setLeads([newLead, ...leads]);
      setIsAddingLead(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleFollowUp = async (lead: Lead, type: 'email' | 'phone') => {
    if (type === 'email') {
      window.location.href = `mailto:${lead.email}`;
    } else {
      window.location.href = `tel:${lead.phone}`;
    }

    // Update last contacted date
    const { error } = await supabase
      .from('leads')
      .update({ lastContactedAt: new Date().toISOString() })
      .eq('id', lead.id);

    if (error) {
      console.error('Error updating lead:', error);
      return;
    }

    // Update local state
    setLeads(leads.map(l =>
      l.id === lead.id
        ? { ...l, lastContactedAt: new Date().toISOString() }
        : l
    ));
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead =>
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const columns: Column[] = [
    {
      key: 'name',
      title: 'Name',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <span>{value}</span>
          <div className="flex space-x-1">
            <Tooltip content="View Details">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLead(row)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Send Email">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFollowUp(row, 'email')}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Call">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFollowUp(row, 'phone')}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      )
    },
    { key: 'email', title: 'Email' },
    { key: 'source', title: 'Source' },
    {
      key: 'status',
      title: 'Status',
      render: (value, row) => (
        <Badge variant={
          row.status === 'converted' ? 'success' :
          row.status === 'qualified' ? 'info' :
          row.status === 'contacted' ? 'warning' :
          'default'
        }>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'lastContactedAt',
      title: 'Last Contacted',
      render: (value: string | undefined) => value ? (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ) : '-'
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value: string | undefined) => value ? new Date(value).toLocaleDateString() : '-'
    },
  ];

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search leads..."
          className="px-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => setIsAddingLead(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        searchable
        pagination
      />

      {isAddingLead && (
        <LeadForm
          isOpen={isAddingLead}
          onClose={() => setIsAddingLead(false)}
          onSubmit={handleAddLead}
        />
      )}

      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
        />
      )}
    </div>
  );
}