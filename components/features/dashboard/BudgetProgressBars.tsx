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
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">No spending data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pr-2">
      {filteredData.map((item) => {
        const percentage = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
        const isOverBudget = item.actual > item.budget;
        const remaining = item.budget - item.actual;
        
        return (
          <div key={item.category} className="space-y-3 p-4 rounded-lg border border-border/50 bg-gradient-to-r from-card/50 to-transparent hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{item.category}</span>
              <span className={`text-sm font-medium ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
              </span>
            </div>
            
            <div className="space-y-2">
              <Progress
                value={Math.min(percentage, 100)}
                className={`h-3 ${isOverBudget ? 'bg-destructive/20' : 'bg-muted/50'}`}
              />
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {percentage.toFixed(1)}% used
                </span>
                <span className={`font-medium ${isOverBudget ? 'text-destructive' : 'text-green-600'}`}>
                  {isOverBudget ? 'Over by' : 'Remaining'}: {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}