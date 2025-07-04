"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface BudgetVsActualData {
  category: string;
  budget: number;
  actual: number;
}

interface BudgetVsActualChartProps {
  data: BudgetVsActualData[];
}

export default function BudgetVsActualChart({ data }: BudgetVsActualChartProps) {
  // Transform data for recharts
  const chartData = data.map(item => ({
    category: item.category,
    Budget: item.budget,
    Actual: item.actual,
    // Calculate if over budget for color coding
    isOverBudget: item.actual > item.budget
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budget = payload.find((p: any) => p.dataKey === 'Budget')?.value || 0;
      const actual = payload.find((p: any) => p.dataKey === 'Actual')?.value || 0;
      const difference = actual - budget;
      const percentage = budget > 0 ? ((actual / budget) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Budget: {formatCurrency(budget)}
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Actual: {formatCurrency(actual)}
            </p>
            <p className={`text-sm font-medium ${difference > 0 ? 'text-destructive' : 'text-green-600'}`}>
              {difference > 0 ? 'Over' : 'Under'} by: {formatCurrency(Math.abs(difference))} ({percentage}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="category" 
          className="text-sm"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          className="text-sm"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="Budget" 
          fill="#3b82f6" 
          name="Budget"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="Actual" 
          fill="#10b981" 
          name="Actual"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}