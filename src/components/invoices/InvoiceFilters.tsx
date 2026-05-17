"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { INVOICE_STATUS_OPTIONS, INVOICE_TYPE_OPTIONS } from "@/lib/mock-data/invoices";
import { CustomSelect } from "@/components/settings/SettingSection";
import DateRangePicker from "@/components/refunds/DateRangePicker";

export interface InvoiceFilterState {
  status: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_INVOICE_FILTERS: InvoiceFilterState = {
  status: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
};

export default function InvoiceFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: {
  filters: InvoiceFilterState;
  onChange: (f: InvoiceFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.type !== "all" ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  return (
    <div className="relative">
      {open && createPortal(
        <div className="fixed inset-0 z-25" onMouseDown={() => setOpen(false)} />,
        document.body,
      )}

      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
          activeCount > 0
            ? "border-brand-teal text-brand-teal bg-brand-teal/5"
            : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-teal text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-30 w-68 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Filters</p>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
              <CustomSelect
                value={filters.status}
                onChange={(v) => onChange({ ...filters, status: v })}
                options={INVOICE_STATUS_OPTIONS}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</p>
              <CustomSelect
                value={filters.type}
                onChange={(v) => onChange({ ...filters, type: v })}
                options={INVOICE_TYPE_OPTIONS}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date Range</p>
              <DateRangePicker
                startDate={filters.dateFrom}
                endDate={filters.dateTo}
                onChange={(start, end) => onChange({ ...filters, dateFrom: start, dateTo: end })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={() => { onReset(); setOpen(false); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => { onApply(); setOpen(false); }}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
