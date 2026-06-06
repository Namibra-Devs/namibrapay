"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import RefundFilters from "@/components/namibrapay-main/refunds/RefundFilters";
import RefundTable from "@/components/namibrapay-main/refunds/RefundTable";
import { mockRefunds } from "@/lib/mock-data/refunds";
import type { RefundFilterState } from "@/components/namibrapay-main/refunds/RefundFilters";
import { DEFAULT_REFUND_FILTERS } from "@/components/namibrapay-main/refunds/RefundFilters";

export default function RefundsPage() {
  const [filters, setFilters] = useState<RefundFilterState>(DEFAULT_REFUND_FILTERS);

  const filtered = useMemo(() => {
    return mockRefunds.filter((r) => {
      // Status
      if (filters.status !== "all" && r.status !== filters.status) return false;

      // Amount
      if (filters.amount.trim()) {
        const num = parseFloat(filters.amount);
        if (!isNaN(num)) {
          if (filters.amountComparator === "more_than" && r.amount <= num) return false;
          if (filters.amountComparator === "less_than" && r.amount >= num) return false;
          if (filters.amountComparator === "equal_to" && r.amount !== num) return false;
        }
      }

      // Date range
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (new Date(r.createdAt) < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(r.createdAt) > end) return false;
      }

      // Search by refund id or bank reference
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const hit =
          r.refundId.toLowerCase().includes(q) ||
          r.bankReference.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q);
        if (!hit) return false;
      }

      return true;
    });
  }, [filters]);

  const hasFilters =
    filters.status !== "all" ||
    filters.amount.trim() !== "" ||
    filters.startDate !== "" ||
    filters.endDate !== "" ||
    filters.search.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Refunds</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage refund requests for your transactions.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <RefundFilters filters={filters} onChange={setFilters} />

      {/* Results count */}
      {hasFilters && filtered.length > 0 && (
        <p className="text-xs text-gray-400">
          {filtered.length} refund{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Table card */}
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
        <RefundTable refunds={filtered} hasFilters={hasFilters} />
      </div>
    </div>
  );
}
