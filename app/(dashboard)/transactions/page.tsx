import { Transaction } from "@/types";
import TransactionsTable from "@/components/features/transactions/TransactionsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

async function getTransactions(): Promise<Transaction[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, { cache: 'no-store' });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  if (transactions.length === 0) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">All Transactions</h2>
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>No Transactions Found</AlertTitle>
                <AlertDescription>
                You haven't added any transactions yet. Click the "Add Transaction" button to get started.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Transactions</h2>
      <TransactionsTable data={transactions} />
    </div>
  );
}