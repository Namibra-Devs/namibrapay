"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import TransactionFilters from "@/components/namibrapay-main/transactions/TransactionFilters";
import TransactionTable from "@/components/namibrapay-main/transactions/TransactionTable";
import { mockTransactions } from "@/lib/mock-data/transactions";
import type { TransactionFilterState } from "@/components/namibrapay-main/transactions/TransactionFilters";
import { DEFAULT_STATUS_FILTER } from "@/components/namibrapay-main/transactions/TransactionFilters";

const INITIAL_FILTERS: TransactionFilterState = {
  account: "all",
  dateRange: "this_month",
  statusFilter: DEFAULT_STATUS_FILTER,
  search: "",
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function matchesDateRange(dateStr: string, range: TransactionFilterState["dateRange"]): boolean {
  const txDate = new Date(dateStr);
  const now = new Date();

  switch (range) {
    case "today":
      return startOfDay(txDate).getTime() === startOfDay(now).getTime();
    case "last_7": {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 6);
      return txDate >= startOfDay(cutoff);
    }
    case "this_month":
      return txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth();
    case "last_month": {
      const y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const m = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      return txDate.getFullYear() === y && txDate.getMonth() === m;
    }
    case "all_time":
    case "custom":
      return true;
  }
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
      // Account
      if (filters.account !== "all" && filters.account !== "main") return false;

      // Date range
      if (!matchesDateRange(tx.date, filters.dateRange)) return false;

      // Status filter panel
      const sf = filters.statusFilter;
      if (sf.status !== "all" && tx.status !== sf.status) return false;
      if (sf.channel !== "all" && tx.channel !== sf.channel) return false;
      if (sf.amount.trim()) {
        const num = parseFloat(sf.amount.replace(/,/g, ""));
        if (!isNaN(num) && tx.amount !== num) return false;
      }
      if (sf.receiptNumber.trim()) {
        if (!tx.reference.toLowerCase().includes(sf.receiptNumber.trim().toLowerCase())) return false;
      }
      if (sf.customerEmail.trim()) {
        const q = sf.customerEmail.trim().toLowerCase();
        if (
          !tx.email.toLowerCase().includes(q) &&
          !tx.customer.toLowerCase().includes(q)
        )
          return false;
      }

      // Search
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

  const sf = filters.statusFilter;
  const hasFilters =
    filters.account !== "all" ||
    filters.dateRange !== "this_month" ||
    sf.status !== "all" ||
    sf.channel !== "all" ||
    sf.amount.trim() !== "" ||
    sf.receiptNumber.trim() !== "" ||
    sf.customerEmail.trim() !== "" ||
    sf.paymentPage.trim() !== "" ||
    sf.terminalId.trim() !== "" ||
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
