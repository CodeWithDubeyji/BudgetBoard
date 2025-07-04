export interface Transaction {
  _id: string;
  amount: number;
  date: string; // Keeping as string to match API JSON response
  description: string;
  category: string;
}

export interface BudgetVsActual {
  category: string;
  budget: number;
  actual: number;
}

export interface DashboardSummaryData {
  totalExpenses: number;
  totalBudget: number;
  budgetVsActual: BudgetVsActual[];
  recentTransactions: Transaction[];
}