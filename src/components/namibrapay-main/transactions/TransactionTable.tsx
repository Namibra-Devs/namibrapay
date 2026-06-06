"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TransactionEmptyState from "./TransactionEmptyState";
import type { Transaction, TransactionStatus } from "@/lib/mock-data/transactions";

const PAGE_SIZE = 10;

const statusConfig: Record<TransactionStatus, { label: string; className: string }> = {
  success: { label: "Success", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border border-red-200" },
  abandoned: { label: "Abandoned", className: "bg-gray-100 text-gray-600 border border-gray-200" },
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

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}

interface TransactionTableProps {
  transactions: Transaction[];
  hasFilters: boolean;
}

export default function TransactionTable({ transactions, hasFilters }: TransactionTableProps) {
  const [page, setPage] = useState(1);
  const [prevTransactions, setPrevTransactions] = useState(transactions);

  // React-recommended pattern for resetting derived state when a prop changes:
  // calling setState during render (guarded by a condition) re-renders synchronously
  // before paint, avoiding the double-render that useEffect would cause.
  if (prevTransactions !== transactions) {
    setPrevTransactions(transactions);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = transactions.slice(start, start + PAGE_SIZE);

  const from = transactions.length === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, transactions.length);

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
      {transactions.length === 0 ? (
        <TransactionEmptyState hasFilters={hasFilters} />
      ) : (
        <>
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
                  <th className="text-right pl-3 pr-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left pl-6 pr-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
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
                {pageRows.map((tx) => {
                  const status = statusConfig[tx.status];
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors duration-150 group cursor-pointer"
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
                          <p className="text-[11px] text-gray-400 hidden sm:block">{tx.email}</p>
                        </div>
                      </td>
                      <td className="pl-3 pr-6 py-3.5 text-right">
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            tx.status === "failed" ? "text-red-500" : "text-gray-900"
                          )}
                        >
                          {formatAmount(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="pl-6 pr-3 py-3.5 hidden sm:table-cell">
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
                        <span className="text-xs text-gray-400">{formatDate(tx.date)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-gray-100 flex-wrap">
            {/* Row count */}
            <p className="text-xs text-gray-400 shrink-0">
              Showing <span className="font-medium text-gray-600">{from}–{to}</span> of{" "}
              <span className="font-medium text-gray-600">{transactions.length}</span> transactions
            </p>

            {/* Page controls */}
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {getPageNumbers(safePage, totalPages).map((p, i) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="flex items-center justify-center w-8 h-8 text-xs text-gray-400 select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                      safePage === p
                        ? "bg-brand-teal text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                    aria-current={safePage === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
