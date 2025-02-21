"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from '@/components/ui/bar-chart';
import { Users, MessageSquare, Calendar, TrendingUp, Download } from 'lucide-react';
import { MetricsOverview } from "@/components/dashboard/metrics/MetricsOverview";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

function MetricCard({ title, value, icon, className }: MetricCardProps) {
  return (
    <Card className={`transition-all duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg">{icon}</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Leads',
        data: [40, 30, 50, 45, 60, 55, 35],
        backgroundColor: '#3B82F6',
      },
      {
        label: 'Conversions',
        data: [25, 20, 30, 28, 35, 32, 22],
        backgroundColor: '#10B981',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Add MetricsOverview component here */}
          <MetricsOverview />

          {/* Metrics Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Leads"
              value="1,234"
              icon={<Users className="w-6 h-6 text-blue-500" />}
              className="bg-blue-50 shadow-sm hover:shadow-md transition-shadow"
            />
            <MetricCard
              title="New Messages"
              value="42"
              icon={<MessageSquare className="w-6 h-6 text-green-500" />}
              className="bg-green-50 shadow-sm hover:shadow-md transition-shadow"
            />
            <MetricCard
              title="Appointments"
              value="8"
              icon={<Calendar className="w-6 h-6 text-yellow-500" />}
              className="bg-yellow-50 shadow-sm hover:shadow-md transition-shadow"
            />
            <MetricCard
              title="Conversion Rate"
              value="12%"
              icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
              className="bg-purple-50 shadow-sm hover:shadow-md transition-shadow"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Status Card - Takes up 1/3 width */}
            <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>AI Agent Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Appointment Bot', status: 'active', color: 'bg-green-500' },
                  { name: 'Social Media Bot', status: 'active', color: 'bg-green-500' },
                  { name: 'Lead Re-Engage', status: 'idle', color: 'bg-gray-300' },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${agent.color}`} />
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'success' : 'default'}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Chart - Takes up 2/3 width */}
            <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <BarChart data={weeklyData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications Section */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { color: 'bg-yellow-500', text: 'New lead assigned: John Doe' },
                  { color: 'bg-blue-500', text: 'Appointment scheduled: 2:00 PM' },
                  { color: 'bg-green-500', text: 'Social media post published' },
                ].map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-2 h-2 rounded-full ${notification.color}`} />
                    <span className="text-sm font-medium">{notification.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}