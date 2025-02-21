import { useCallback } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { LeadAssignment } from './components/LeadAssignment';
import { FollowUpReminders } from './components/FollowUpReminders';
import { ActivityTracker } from './components/ActivityTracker';
import { BulkActions } from './components/BulkActions';

// Import Activity type
import type { Activity } from './types';

export const AdvancedLeadManagement = () => {
  const { supabase } = useSupabase();

  // Lead Assignment
  const assignLead = useCallback(async (leadId: string, userId: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ assigned_to: userId })
      .eq('id', leadId);

    if (error) throw error;
  }, [supabase]);

  // Follow-up Reminders
  const scheduleReminder = useCallback(async (leadId: string, date: Date) => {
    const { error } = await supabase
      .from('reminders')
      .insert({
        lead_id: leadId,
        scheduled_for: date.toISOString(),
        type: 'follow_up'
      });

    if (error) throw error;
  }, [supabase]);

  // Activity Tracking
  const logActivity = useCallback(async (leadId: string, activity: Activity) => {
    const { error } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        ...activity
      });

    if (error) throw error;
  }, [supabase]);

  return (
    <div className="space-y-6">
      <LeadAssignment onAssign={assignLead} />
      <FollowUpReminders onSchedule={scheduleReminder} />
      <ActivityTracker onLogActivity={logActivity} />
      <BulkActions />
    </div>
  );
};