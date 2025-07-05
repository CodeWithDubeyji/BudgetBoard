import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
        <div className="flex items-center justify-center h-full py-8">
            <p className="text-muted-foreground">No transactions this month.</p>
        </div>
    );
  }

  const truncateDescription = (description: string, maxLength: number = 20) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-3 py-2">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="flex items-center py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Avatar className="h-9 w-9">
            {/* First letter of the category */}
            <AvatarFallback>{transaction.category.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <p 
              className="text-sm font-medium leading-none" 
              title={transaction.description}
            >
              {truncateDescription(transaction.description)}
            </p>
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