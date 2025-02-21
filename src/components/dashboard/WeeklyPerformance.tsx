"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", leads: 40, conversions: 24 },
  { name: "Tue", leads: 30, conversions: 18 },
  { name: "Wed", leads: 50, conversions: 30 },
  { name: "Thu", leads: 45, conversions: 27 },
  { name: "Fri", leads: 60, conversions: 36 },
  { name: "Sat", leads: 55, conversions: 33 },
  { name: "Sun", leads: 35, conversions: 21 },
];

export function WeeklyPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="leads" fill="#2563eb" />
            <Bar dataKey="conversions" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 