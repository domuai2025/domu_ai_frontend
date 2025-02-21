interface Metric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface MetricsDisplayProps {
  data: any;  // Type this properly based on your metrics structure
}

export const MetricsDisplay = ({ data }: MetricsDisplayProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Display metrics */}
    </div>
  );
};

MetricsDisplay.displayName = 'MetricsDisplay';