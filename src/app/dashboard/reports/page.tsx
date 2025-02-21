'use client';

import { AnalyticsDashboard } from '@/components/dashboard/analytics/AnalyticsDashboard';

export default function ReportsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      <AnalyticsDashboard />
    </div>
  );
} 