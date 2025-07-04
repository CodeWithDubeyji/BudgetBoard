import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils";
import { DashboardSummaryData } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import CategoryPieChart from "@/components/features/dashboard/CategoryPieChart";
import RecentTransactions from "@/components/features/dashboard/RecentTransactions";
import MonthlyExpensesChart from "@/components/features/dashboard/MonthlyExpensesChart";
import BudgetVsActualChart from "@/components/features/dashboard/BudgetVsActualChart";
import SpendingTrendsChart from "@/components/features/dashboard/SpendingTrendsChart";
import BudgetProgressBars from "@/components/features/dashboard/BudgetProgressBars";

async function getDashboardSummary(month: string): Promise<DashboardSummaryData | null> {
  // Use your actual deployment URL or localhost for fetching
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
 
  try {
    const response = await fetch(`${baseUrl}/api/dashboard-summary?month=${month}`, {
      cache: 'no-store', // Ensures fresh data on every request
    });
   
    if (!response.ok) {
      console.error("Failed to fetch dashboard data:", await response.text());
      return null;
    }
   
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const data = await getDashboardSummary(currentMonth);
  
  if (!data) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const { totalExpenses, totalBudget, budgetVsActual, recentTransactions } = data;
  
  // Calculate additional metrics
  const budgetRemaining = totalBudget - totalExpenses;
  const budgetUsagePercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const isOverBudget = totalExpenses > totalBudget;
  
  // Get categories that are over budget
  const overBudgetCategories = budgetVsActual.filter(category => 
    category.actual > category.budget
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})
        </h2>
      </div>
     
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              Total spending for this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              Total budget for this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            {isOverBudget ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(budgetRemaining)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? 'Over budget' : 'Remaining budget'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {budgetUsagePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {overBudgetCategories.length} categories over budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 - Budget vs Actual and Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Budget vs Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetVsActualChart data={budgetVsActual} />
          </CardContent>
        </Card>
        
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={budgetVsActual} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Trends and Progress */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Spending Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingTrendsChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Category Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetProgressBars data={budgetVsActual} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 - Monthly Overview */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyExpensesChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTransactions transactions={recentTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
