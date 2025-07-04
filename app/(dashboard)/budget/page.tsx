"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function BudgetPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Record<string, number | string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const response = await fetch(`/api/budgets?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        const budgetMap = data.reduce((acc: Record<string, number>, budget: any) => {
          acc[budget.category] = budget.amount;
          return acc;
        }, {});
        setBudgets(budgetMap);
      }
      setIsLoading(false);
    };
    fetchBudgets();
  }, []);

  const handleBudgetChange = (category: string, value: string) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSaveBudgets = async () => {
    setIsSaving(true);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const promises = Object.entries(budgets).map(([category, amount]) => {
      const numericAmount = parseFloat(String(amount));
      if (isNaN(numericAmount) || numericAmount < 0) return Promise.resolve(); // Skip invalid

      return fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount: numericAmount, month: currentMonth }),
      });
    });

    try {
        await Promise.all(promises);
        toast.success("Success!", {
          description: "Budgets saved successfully.",
          richColors: true,
          icon: "💰",
        });
        router.refresh();
    } catch (error) {
        toast.error("Error", {
          description: "Could not save budgets.",
          richColors: true,
          icon: "⚠️",
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading budgets...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-3 sm:space-y-4 overflow-hidden">
      {/* Page Title - Compact and responsive */}
      <div className="flex-shrink-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Set Monthly Budgets</h2>
      </div>
      
      {/* Main Card - Fills remaining space */}
      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="flex-shrink-0 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg lg:text-xl">
            Budgets for {new Date().toLocaleString('default', { month: 'long' })}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col min-h-0 p-3 sm:p-4 lg:p-6">
          {/* Budget Categories - Scrollable if needed but optimized to fit */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {CATEGORIES.map((category) => (
                <div 
                  key={category} 
                  className="flex flex-col gap-1.5 p-2.5 sm:p-3 bg-muted/30 rounded-lg border h-fit"
                >
                  {/* Category Label - Compact */}
                  <label 
                    htmlFor={category} 
                    className="font-medium text-xs sm:text-sm lg:text-base truncate"
                    title={category}
                  >
                    {category}
                  </label>
                  
                  {/* Input Section - Compact and aligned */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm text-muted-foreground">$</span>
                    <Input
                      id={category}
                      type="number"
                      placeholder="0.00"
                      value={budgets[category] || ""}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                      className="h-8 sm:h-9 text-xs sm:text-sm flex-1"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Save Button - Fixed at bottom */}
          <div className="flex-shrink-0 pt-3 sm:pt-4">
            <Button 
              onClick={handleSaveBudgets} 
              disabled={isSaving} 
              className="w-full sm:w-auto sm:min-w-[180px] h-8 sm:h-9 lg:h-10 text-xs sm:text-sm font-medium mx-auto block"
            >
              {isSaving ? 'Saving...' : 'Save Budgets'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}