import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lead } from '@/types';
import { useState } from "react";
import { useSupabase } from "@/components/supabase/provider";

interface LeadDetailsProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

export function LeadDetails({ lead, isOpen, onClose, onUpdate }: LeadDetailsProps) {
  const { supabase } = useSupabase();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateLead = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status, notes })
        .eq('id', lead.id)
        .select()
        .single() as { data: Lead, error: null };

      if (error) throw error;
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Contact Information</h3>
            <p>Name: {lead.name}</p>
            <p>Email: {lead.email}</p>
            <p>Phone: {lead.phone || 'N/A'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Status</h3>
            <select
              aria-label="Lead status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Lead['status'])}
              className="w-full p-2 border rounded-md"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md h-24"
              placeholder="Add notes about this lead..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateLead}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}