import { ArrowLeftRight } from "lucide-react";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { mockTransactions } from "@/lib/mock-data/transactions";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your payment transactions.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <ArrowLeftRight className="w-4 h-4" />
          Export
        </button>
      </div>

      <RecentTransactions transactions={mockTransactions} />
    </div>
  );
}
