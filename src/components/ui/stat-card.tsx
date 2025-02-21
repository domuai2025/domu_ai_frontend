'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'purple' | 'blue' | 'green' | 'yellow';
}

const variantStyles = {
  default: 'bg-white',
  purple: 'bg-purple-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  yellow: 'bg-yellow-50',
};

export function StatCard({
  title,
  value,
  trend,
  icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <Card className={cn('p-6', variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold">{value}</h3>
        {trend && (
          <div
            className={cn(
              'flex items-center text-sm',
              trend.isUpward ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isUpward ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
} 