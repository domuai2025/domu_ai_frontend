import React, { useState } from 'react';

interface ReportConfig {
  metrics: string[];
  dateRange: { start: Date; end: Date };
  format: 'pdf' | 'csv' | 'excel';
  visualizations: ('bar' | 'line' | 'pie')[];
}

export function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    metrics: [],
    dateRange: { start: new Date(), end: new Date() },
    format: 'pdf',
    visualizations: ['bar']
  });

  const updateFormat = (newFormat: ReportConfig['format']) => {
    setConfig({ ...config, format: newFormat });
  };

  return (
    <div>
      <h2>Report Configuration</h2>
      <button onClick={() => updateFormat('csv')}>Change Format</button>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
}