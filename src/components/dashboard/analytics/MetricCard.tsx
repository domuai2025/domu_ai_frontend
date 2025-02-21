'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendDirection?: 'up' | 'down';
}

export function MetricCard({ title, value, trend, trendDirection = 'up' }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={cn(
          "flex items-center text-sm mt-2",
          trendDirection === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {trendDirection === 'up' ? (
            <ArrowUp className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1" />
          )}
          {trend}
        </div>
      </CardContent>
    </Card>
  );
} 