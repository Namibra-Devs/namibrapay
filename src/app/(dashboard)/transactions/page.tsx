"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionTable from "@/components/transactions/TransactionTable";
import { mockTransactions, dateRangeOptions } from "@/lib/mock-data/transactions";
import type { TransactionFilterState } from "@/components/transactions/TransactionFilters";

const INITIAL_FILTERS: TransactionFilterState = {
  account: "all",
  dateRange: "this_month",
  statuses: [],
  search: "",
};

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function isWithinDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilterState>(INITIAL_FILTERS);

  function handleChange<K extends keyof TransactionFilterState>(
    key: K,
    value: TransactionFilterState[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      // Account — sub-accounts have no mock transactions, so any non-"all"/non-"main" yields empty
      if (filters.account !== "all" && filters.account !== "main") return false;

      // Date range
      const range = dateRangeOptions.find((r) => r.value === filters.dateRange);
      if (range && filters.dateRange !== "all_time") {
        if (filters.dateRange === "this_month") {
          if (!isThisMonth(tx.date)) return false;
        } else if (range.days !== null) {
          if (!isWithinDays(tx.date, range.days)) return false;
        }
      }

      // Status
      if (filters.statuses.length > 0 && !filters.statuses.includes(tx.status)) return false;

      // Search — reference, customer, or email
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const hit =
          tx.reference.toLowerCase().includes(q) ||
          tx.customer.toLowerCase().includes(q) ||
          tx.email.toLowerCase().includes(q);
        if (!hit) return false;
      }

      return true;
    });
  }, [filters]);

  const hasFilters =
    filters.account !== "all" ||
    filters.dateRange !== "this_month" ||
    filters.statuses.length > 0 ||
    filters.search.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your payment transactions.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filter bar */}
      <TransactionFilters filters={filters} onChange={handleChange} />

      {/* Results count */}
      {hasFilters && (
        <p className="text-xs text-gray-400">
          {filtered.length === 0
            ? "No results"
            : `${filtered.length} transaction${filtered.length !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Table */}
      <TransactionTable transactions={filtered} hasFilters={hasFilters} />
    </div>
  );
}
