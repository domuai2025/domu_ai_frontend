"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend: number;
}

const MetricCard = ({ title, value, icon, description, trend }: MetricCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="bg-white shadow-sm border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-1">
          <div className="text-[#5E2C5F]">{icon}</div>
          <span className={cn(
            "text-sm font-medium",
            trend > 0 ? "text-emerald-600" : "text-rose-600"
          )}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-[#2D1437]">{value}</p>
          <p className="text-sm font-medium text-[#5E2C5F]">{title}</p>
          <p className="text-xs text-[#5E2C5F]/70">{description}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Leads"
        value="1,234"
        icon={<Users className="h-6 w-6" />}
        description="Total leads this month"
        trend={12}
      />
      <MetricCard
        title="New Messages"
        value="42"
        icon={<MessageSquare className="h-6 w-6" />}
        description="Messages in last 24 hours"
        trend={-5}
      />
      <MetricCard
        title="Appointments"
        value="8"
        icon={<Calendar className="h-6 w-6" />}
        description="Scheduled for today"
        trend={20}
      />
      <MetricCard
        title="Conversion Rate"
        value="12%"
        icon={<TrendingUp className="h-6 w-6" />}
        description="Compared to last month"
        trend={8}
      />
    </div>
  );
}