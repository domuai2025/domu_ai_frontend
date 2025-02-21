'use client';

import { Button } from "@/components/ui/button";

export const ReportGenerator = () => {
  const generateReport = () => {
    // Implementation
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
      <Button onClick={generateReport}>Generate Report</Button>
    </div>
  );
}; 