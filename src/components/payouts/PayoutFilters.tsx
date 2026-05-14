"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PayoutStatus } from "@/lib/mock-data/payouts";
import DateRangePicker from "@/components/refunds/DateRangePicker";

export interface PayoutFilterState {
  status: PayoutStatus | "all";
  startDate: string;
  endDate: string;
}

export const DEFAULT_PAYOUT_FILTERS: PayoutFilterState = {
  status: "all",
  startDate: "",
  endDate: "",
};

const STATUS_OPTIONS: { value: PayoutStatus | "all"; label: string }[] = [
  { value: "all", label: "Show All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
];

function isFilterActive(f: PayoutFilterState) {
  return f.status !== "all" || f.startDate !== "" || f.endDate !== "";
}

function InlineSelect<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 transition-colors"
      >
        <span>{selected.label}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-150",
            open && "rotate-180"
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
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  opt.value === value
                    ? "bg-brand-teal/5 text-brand-teal font-medium"
                    : "text-gray-700 hover:bg-gray-50"
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

interface PayoutFiltersProps {
  filters: PayoutFilterState;
  onChange: (filters: PayoutFilterState) => void;
}

export default function PayoutFilters({ filters, onChange }: PayoutFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PayoutFilterState>(filters);
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

  function update<K extends keyof PayoutFilterState>(key: K, val: PayoutFilterState[K]) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  function handleFilter() {
    onChange({ ...draft });
    setOpen(false);
  }

  function handleReset() {
    setDraft(DEFAULT_PAYOUT_FILTERS);
    onChange(DEFAULT_PAYOUT_FILTERS);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors select-none whitespace-nowrap",
          active
            ? "bg-brand-teal text-white border-brand-teal hover:bg-brand-teal/90"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        )}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Filters</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200 opacity-70",
            open && "rotate-180"
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

              {/* Time range */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Time range
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
  );
}
