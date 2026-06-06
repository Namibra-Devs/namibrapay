"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check, ChevronDown } from "lucide-react";
import type { ProductStatus } from "@/lib/mock-data/products";

export interface ProductFilterState {
  status: "all" | ProductStatus;
  stockType: "all" | "unlimited" | "limited";
}

const STATUS_OPTIONS: { value: ProductFilterState["status"]; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

const STOCK_OPTIONS: { value: ProductFilterState["stockType"]; label: string }[] = [
  { value: "all", label: "Show all" },
  { value: "unlimited", label: "Unlimited" },
  { value: "limited", label: "Limited" },
];

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {opt.label}
          {value === opt.value && <Check className="w-3.5 h-3.5 text-brand-teal" />}
        </button>
      ))}
    </div>
  );
}

export default function ProductFilters({
  filters,
  onChange,
}: {
  filters: ProductFilterState;
  onChange: (f: ProductFilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount =
    (filters.status !== "all" ? 1 : 0) + (filters.stockType !== "all" ? 1 : 0);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
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
        <div className="absolute left-0 top-full mt-1.5 z-20 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          <RadioGroup
            label="Status"
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => onChange({ ...filters, status: v })}
          />
          <div className="my-1 border-t border-gray-100" />
          <RadioGroup
            label="Stock"
            options={STOCK_OPTIONS}
            value={filters.stockType}
            onChange={(v) => onChange({ ...filters, stockType: v })}
          />
          {activeCount > 0 && (
            <div className="px-3 pt-2 pb-1 border-t border-gray-100 mt-1">
              <button
                type="button"
                onClick={() => onChange({ status: "all", stockType: "all" })}
                className="text-xs text-brand-teal font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
