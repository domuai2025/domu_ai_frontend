import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationProps {
  message: string;
  time: string;
  type: 'lead' | 'appointment' | 'social';
}

const Notification = ({ message, time, type }: NotificationProps) => (
  <div className="flex items-start space-x-4 py-2">
    <div className={`rounded-full p-2 ${
      type === 'lead' ? 'bg-blue-100 text-blue-600' :
      type === 'appointment' ? 'bg-green-100 text-green-600' :
      'bg-purple-100 text-purple-600'
    }`}>
      <Bell className="h-4 w-4" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>

  </div>
);

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Notification
          message="New lead assigned: John Doe"
          time="5 minutes ago"
          type="lead"
        />
        <Notification
          message="Appointment scheduled: 2:00 PM"
          time="10 minutes ago"
          type="appointment"
        />
        <Notification
          message="Social media post published"
          time="15 minutes ago"
          type="social"
        />
      </CardContent>
    </Card>
  );
}