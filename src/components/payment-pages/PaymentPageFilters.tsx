"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import type { PageStatus } from "@/lib/mock-data/payment-pages";

type StatusFilter = "all" | PageStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function PaymentPageFilters({
  status,
  onChange,
}: {
  status: StatusFilter;
  onChange: (s: StatusFilter) => void;
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

  const activeCount = status !== "all" ? 1 : 0;

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
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-20 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
          <p className="px-3 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</p>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {opt.label}
              {status === opt.value && <Check className="w-3.5 h-3.5 text-brand-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
