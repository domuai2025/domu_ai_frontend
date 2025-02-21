import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentProps {
  name: string;
  status: 'active' | 'idle';
}

const Agent = ({ name, status }: AgentProps) => (
  <div className="flex items-center justify-between py-2">
    <span className="font-medium text-[#5E2C5F]">{name}</span>
    <Badge 
      variant={status === 'active' ? 'success' : 'default'}
      className={status === 'active' ? 'bg-emerald-500' : 'bg-gray-200'}
    >
      {status}
    </Badge>
  </div>
);

export function AgentStatus() {
  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-[#2D1437]">AI Agent Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Agent name="Appointment Bot" status="active" />
        <Agent name="Social Media Bot" status="active" />
        <Agent name="Lead Re-Engage" status="idle" />
      </CardContent>
    </Card>
  );
}