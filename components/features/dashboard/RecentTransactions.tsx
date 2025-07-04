import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No transactions this month.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            {/* First letter of the category */}
            <AvatarFallback>{transaction.category.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
          </div>
          <div className="ml-auto font-medium text-red-600">
            -{formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}