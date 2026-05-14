"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RefundStatus } from "@/lib/mock-data/refunds";
import DateRangePicker from "./DateRangePicker";

export type AmountComparator = "more_than" | "less_than" | "equal_to";

export interface RefundFilterState {
  status: RefundStatus | "all";
  amountComparator: AmountComparator;
  amount: string;
  startDate: string;
  endDate: string;
  search: string;
}

export const DEFAULT_REFUND_FILTERS: RefundFilterState = {
  status: "all",
  amountComparator: "more_than",
  amount: "",
  startDate: "",
  endDate: "",
  search: "",
};

const STATUS_OPTIONS: { value: RefundStatus | "all"; label: string }[] = [
  { value: "all", label: "Show All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "processed", label: "Processed" },
  { value: "failed", label: "Failed" },
];

const COMPARATOR_OPTIONS: { value: AmountComparator; label: string }[] = [
  { value: "more_than", label: "More Than" },
  { value: "less_than", label: "Less Than" },
  { value: "equal_to", label: "Equal To" },
];

function isFilterActive(f: RefundFilterState) {
  return (
    f.status !== "all" ||
    f.amount.trim() !== "" ||
    f.startDate !== "" ||
    f.endDate !== ""
  );
}

function InlineSelect<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
      >
        <span>{selected.label}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute left-0 top-full mt-1 z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  opt.value === value
                    ? "bg-brand-teal/5 text-brand-teal font-medium"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RefundFiltersProps {
  filters: RefundFilterState;
  onChange: (filters: RefundFilterState) => void;
}

export default function RefundFilters({
  filters,
  onChange,
}: RefundFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RefundFilterState>(filters);
  const ref = useRef<HTMLDivElement>(null);

  const active = isFilterActive(filters);

  function handleOpen() {
    setDraft(filters);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function update<K extends keyof RefundFilterState>(
    key: K,
    val: RefundFilterState[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  function handleFilter() {
    onChange({ ...draft });
    setOpen(false);
  }

  function handleReset() {
    const reset = { ...DEFAULT_REFUND_FILTERS, search: filters.search };
    setDraft(reset);
    onChange(reset);
    setOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Filters panel trigger */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={open ? () => setOpen(false) : handleOpen}
          className={cn(
            "flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors select-none whitespace-nowrap",
            active
              ? "bg-brand-teal text-white border-brand-teal hover:bg-brand-teal/90"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
          )}
        >
          <span>Filters</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200 opacity-70",
              open && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.13, ease: "easeOut" }}
              className="absolute left-0 top-full mt-1.5 z-30 w-72 bg-white border border-gray-200 rounded-xl shadow-xl"
            >
              <div className="p-4 space-y-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <InlineSelect
                    options={STATUS_OPTIONS}
                    value={draft.status}
                    onChange={(v) => update("status", v)}
                  />
                </div>

                {/* Refund Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Refund Amount
                  </label>
                  <div className="flex gap-2 min-w-0">
                    <InlineSelect
                      options={COMPARATOR_OPTIONS}
                      value={draft.amountComparator}
                      onChange={(v) => update("amountComparator", v)}
                      className="w-36 shrink-0"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={draft.amount}
                      onChange={(e) =>
                        update("amount", e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      placeholder="Amount"
                      className="min-w-0 flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </label>
                  <DateRangePicker
                    startDate={draft.startDate}
                    endDate={draft.endDate}
                    onChange={(start, end) => {
                      update("startDate", start);
                      update("endDate", end);
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/80 rounded-b-xl">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleFilter}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-lg hover:bg-brand-teal/90 transition-colors"
                >
                  Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="relative flex items-center sm:w-72">
        <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search bank reference or refund id"
          className="h-9 w-full pl-8 pr-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-2.5 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
