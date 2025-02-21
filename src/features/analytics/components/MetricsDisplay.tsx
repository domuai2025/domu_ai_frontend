interface Metric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface MetricsDisplayProps {
  data: {
    metrics: Metric[];
    period: string;
    lastUpdated: string;
  };
}

export function MetricsDisplay({ data }: MetricsDisplayProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.metrics.map(metric => (
        <div key={metric.id} className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">{metric.value}</p>
            <p className={`ml-2 text-sm ${
              metric.trend === 'up' ? 'text-green-600' :
              metric.trend === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {metric.change}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

MetricsDisplay.displayName = 'MetricsDisplay';