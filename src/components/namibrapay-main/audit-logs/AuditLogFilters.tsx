"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AUDIT_ACTIONS, MOCK_AUDIT_USERS } from "@/lib/mock-data/audit-logs";
import DateRangePicker from "@/components/namibrapay-main/refunds/DateRangePicker";

export interface AuditFilterState {
  user: string;
  action: string;
  startDate: string;
  endDate: string;
}

export const DEFAULT_AUDIT_FILTERS: AuditFilterState = {
  user: "",
  action: "",
  startDate: "",
  endDate: "",
};

interface AuditLogFiltersProps {
  filters: AuditFilterState;
  onChange: (f: AuditFilterState) => void;
}

function SearchableSelect({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  function select(opt: string) {
    onChange(opt === value ? "" : opt);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-xl transition-colors text-left",
          value
            ? "border-brand-teal bg-brand-teal/5 text-brand-teal"
            : "border-gray-200 text-gray-500 hover:border-gray-300"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 bg-transparent text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {value && (
                <button
                  type="button"
                  onClick={() => select("")}
                  className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <X className="w-3 h-3" /> Clear selection
                </button>
              )}
              {filtered.length === 0 && (
                <p className="px-3 py-3 text-xs text-gray-400 text-center">No results</p>
              )}
              {filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(opt)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors",
                    opt === value
                      ? "text-brand-teal bg-brand-teal/5 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuditLogFilters({ filters, onChange }: AuditLogFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AuditFilterState>(filters);
  const ref = useRef<HTMLDivElement>(null);

  const isActive =
    !!filters.user || !!filters.action || !!filters.startDate || !!filters.endDate;

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  function reset() {
    setDraft(DEFAULT_AUDIT_FILTERS);
    onChange(DEFAULT_AUDIT_FILTERS);
    setOpen(false);
  }

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
        onClick={() => { if (!open) setDraft(filters); setOpen((v) => !v); }}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all",
          isActive
            ? "bg-brand-teal text-white border-brand-teal shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
        )}
      >
        <Filter className="w-3.5 h-3.5" />
        Filters
        {isActive && (
          <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-bold">
            {[filters.user, filters.action, filters.startDate].filter(Boolean).length}
          </span>
        )}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-2 z-40 w-80 bg-white/96 backdrop-blur-xl border border-gray-200/70 rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.2)]"
          >
            <div className="px-4 pt-4 pb-3 space-y-4">
              {/* User */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  User
                </label>
                <SearchableSelect
                  value={draft.user}
                  options={MOCK_AUDIT_USERS}
                  placeholder="All users"
                  onChange={(v) => setDraft((d) => ({ ...d, user: v }))}
                />
              </div>

              {/* Action */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Action
                </label>
                <SearchableSelect
                  value={draft.action}
                  options={AUDIT_ACTIONS}
                  placeholder="All actions"
                  onChange={(v) => setDraft((d) => ({ ...d, action: v }))}
                />
              </div>

              {/* Date range */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Date range
                </label>
                <DateRangePicker
                  startDate={draft.startDate}
                  endDate={draft.endDate}
                  onChange={(s, e) => setDraft((d) => ({ ...d, startDate: s, endDate: e }))}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 rounded-b-2xl">
              <button
                type="button"
                onClick={reset}
                className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={apply}
                className="flex-1 py-2 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
