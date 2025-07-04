"use client";

import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface BudgetProgressData {
  category: string;
  budget: number;
  actual: number;
}

interface BudgetProgressBarsProps {
  data: BudgetProgressData[];
}

export default function BudgetProgressBars({ data }: BudgetProgressBarsProps) {
  // Filter out categories with 0% usage (no expenses)
  const filteredData = data.filter(item => {
    const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
    return percentage > 0;
  });

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-muted-foreground">No spending data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredData.map((item) => {
        const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
        const isOverBudget = item.actual > item.budget;
        const remaining = item.budget - item.actual;
        
        return (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.category}</span>
              <span className={`text-sm ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
              </span>
            </div>
            
            <Progress 
              value={Math.min(percentage, 100)} 
              className={`h-2 ${isOverBudget ? 'bg-destructive/20' : ''}`}
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{percentage.toFixed(1)}% used</span>
              <span className={isOverBudget ? 'text-destructive' : 'text-green-600'}>
                {isOverBudget ? 'Over by' : 'Remaining'}: {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}