"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CustomerFilterState {
  accountNumber: string;
  searchEmail: string;
}

export const DEFAULT_CUSTOMER_FILTERS: CustomerFilterState = {
  accountNumber: "",
  searchEmail: "",
};

interface CustomerFiltersProps {
  filters: CustomerFilterState;
  onChange: (filters: CustomerFilterState) => void;
}

export default function CustomerFilters({ filters, onChange }: CustomerFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters.accountNumber);
  const ref = useRef<HTMLDivElement>(null);

  const isFiltered = filters.accountNumber.trim() !== "";

  function handleOpen() {
    setDraft(filters.accountNumber);
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

  function handleFilter() {
    onChange({ ...filters, accountNumber: draft });
    setOpen(false);
  }

  function handleReset() {
    setDraft("");
    onChange({ ...filters, accountNumber: "" });
    setOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Filters dropdown */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={open ? () => setOpen(false) : handleOpen}
          className={cn(
            "flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors select-none whitespace-nowrap",
            isFiltered
              ? "bg-brand-teal text-white border-brand-teal hover:bg-brand-teal/90"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          )}
        >
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
              className="absolute left-0 top-full mt-1.5 z-30 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="0002345554"
                    onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/80">
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

      {/* Search Email */}
      <div className="relative flex items-center sm:w-56">
        <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={filters.searchEmail}
          onChange={(e) => onChange({ ...filters, searchEmail: e.target.value })}
          placeholder="Search Email"
          className="h-9 w-full pl-8 pr-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
        />
        {filters.searchEmail && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, searchEmail: "" })}
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
