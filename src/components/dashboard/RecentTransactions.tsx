import Link from "next/link";
import { ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionStatus } from "@/lib/mock-data/transactions";
import EmptyState from "./EmptyState";

const statusConfig: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  success: {
    label: "Success",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
  abandoned: {
    label: "Abandoned",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
};

const channelLabel: Record<string, string> = {
  card: "Card",
  mobile_money: "Mobile Money",
  bank_transfer: "Bank Transfer",
  ussd: "USSD",
};

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Transactions
          </h2>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
        >
          View all
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<ArrowLeftRight className="w-8 h-8" />}
          title="No transactions yet"
          description="Your transactions will appear here once you start accepting payments."
          action={{ label: "View documentation", href: "#" }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Reference
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Customer
                </th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Amount
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Channel
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => {
                const status = statusConfig[tx.status];
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/50 transition-colors duration-150 group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                        {tx.reference}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div>
                        <p className="font-medium text-gray-900 text-xs leading-snug">
                          {tx.customer}
                        </p>
                        <p className="text-[11px] text-gray-400 hidden sm:block">
                          {tx.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          tx.status === "failed"
                            ? "text-red-500"
                            : "text-gray-900"
                        )}
                      >
                        {formatAmount(tx.amount, tx.currency)}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">
                        {channelLabel[tx.channel] ?? tx.channel}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell">
                      <span className="text-xs text-gray-400">
                        {formatDate(tx.date)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
