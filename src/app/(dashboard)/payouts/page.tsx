"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import PayoutFilters from "@/components/namibrapay-main/payouts/PayoutFilters";
import PayoutTable from "@/components/namibrapay-main/payouts/PayoutTable";
import PendingPayoutPanel from "@/components/namibrapay-main/payouts/PendingPayoutPanel";
import { mockPayouts } from "@/lib/mock-data/payouts";
import type { PayoutFilterState } from "@/components/namibrapay-main/payouts/PayoutFilters";
import { DEFAULT_PAYOUT_FILTERS } from "@/components/namibrapay-main/payouts/PayoutFilters";

export default function PayoutsPage() {
  const [filters, setFilters] = useState<PayoutFilterState>(DEFAULT_PAYOUT_FILTERS);

  const filtered = useMemo(() => {
    return mockPayouts.filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;

      if (filters.startDate) {
        if (new Date(p.createdAt) < new Date(filters.startDate)) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(p.createdAt) > end) return false;
      }

      return true;
    });
  }, [filters]);

  const pendingAmount = useMemo(
    () =>
      mockPayouts
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0),
    []
  );

  const hasFilters =
    filters.status !== "all" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Payouts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor settlements and payouts to your bank account.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <PayoutFilters filters={filters} onChange={setFilters} />

          {/* Results count */}
          {hasFilters && filtered.length > 0 && (
            <p className="text-xs text-gray-400">
              {filtered.length} payout{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Table card */}
          <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
            <PayoutTable payouts={filtered} hasFilters={hasFilters} />
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <PendingPayoutPanel amount={pendingAmount} currency="GHS" />
        </div>
      </div>
    </div>
  );
}
