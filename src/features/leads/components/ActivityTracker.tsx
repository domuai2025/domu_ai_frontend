import type { Activity } from '../types';

interface ActivityTrackerProps {
  onLogActivity: (leadId: string, activity: Activity) => Promise<void>;
}

export function ActivityTracker({ onLogActivity }: ActivityTrackerProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Activity Tracking</h3>
      {/* Add activity tracking UI */}
    </div>
  );
} 