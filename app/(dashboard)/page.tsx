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
    <div className="space-y-4 md:space-y-6">
      {/* Page Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="block sm:hidden">Dashboard</span>
          <span className="hidden sm:block">
            Dashboard ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})
          </span>
        </h1>
      </div>
     
      {/* Summary Cards - Responsive Grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Total spending for this month</span>
              <span className="sm:hidden">This month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Budget</CardTitle>
            <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Total budget for this month</span>
              <span className="sm:hidden">Budget</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              <span className="hidden sm:inline">Budget Remaining</span>
              <span className="sm:hidden">Remaining</span>
            </CardTitle>
            {isOverBudget ? (
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-lg md:text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(budgetRemaining)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? 'Over budget' : 'Remaining'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              <span className="hidden sm:inline">Budget Usage</span>
              <span className="sm:hidden">Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {budgetUsagePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">{overBudgetCategories.length} categories over budget</span>
              <span className="sm:hidden">{overBudgetCategories.length} over</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 - Budget vs Actual and Category Breakdown */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Budget vs Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetVsActualChart data={budgetVsActual} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={budgetVsActual} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Trends and Progress */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Spending Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3 md:p-6">
              <SpendingTrendsChart />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Category Budget Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] md:h-[390px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent hover:scrollbar-thumb-accent/80 p-3 md:p-6">
              <BudgetProgressBars data={budgetVsActual} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 - Monthly Overview and Recent Transactions Side by Side */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Monthly Expenses Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyExpensesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}