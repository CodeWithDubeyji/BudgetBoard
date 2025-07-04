"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BudgetVsActual } from '@/types';
import { useMemo } from 'react';

// Define a consistent color palette
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'
];

interface CategoryPieChartProps {
  data: BudgetVsActual[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  // Filter out categories with no spending and format for the chart
  const chartData = useMemo(() => {
    return data
      .filter(item => item.actual > 0)
      .map(item => ({
        name: item.category,
        value: item.actual,
      }));
  }, [data]);
  
  if (chartData.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <p className="text-muted-foreground">No spending data for this month.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}