"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SpendingTrendData {
  month: string;
  expenses: number;
  budget: number;
}

export default function SpendingTrendsChart() {
  const [data, setData] = useState<SpendingTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await fetch('/api/spending-trends');
        if (response.ok) {
          const trendData = await response.json();
          setData(trendData);
        }
      } catch (error) {
        console.error('Failed to fetch spending trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const budget = payload.find((p: any) => p.dataKey === 'budget')?.value || 0;
      
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
              Expenses: {formatCurrency(expenses)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">Loading trend data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">No trend data available</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-sm"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="budget" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Budget"
          dot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Expenses"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}