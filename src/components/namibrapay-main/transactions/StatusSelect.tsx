"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TransactionStatus, TransactionChannel } from "@/lib/mock-data/transactions";

export interface StatusFilterState {
  status: TransactionStatus | "all";
  channel: TransactionChannel | "all";
  amount: string;
  receiptNumber: string;
  customerEmail: string;
  paymentPage: string;
  terminalId: string;
}

export const DEFAULT_STATUS_FILTER: StatusFilterState = {
  status: "all",
  channel: "all",
  amount: "",
  receiptNumber: "",
  customerEmail: "",
  paymentPage: "",
  terminalId: "",
};

function isFilterActive(f: StatusFilterState): boolean {
  return (
    f.status !== "all" ||
    f.channel !== "all" ||
    f.amount.trim() !== "" ||
    f.receiptNumber.trim() !== "" ||
    f.customerEmail.trim() !== "" ||
    f.paymentPage.trim() !== "" ||
    f.terminalId.trim() !== ""
  );
}

const STATUS_OPTIONS: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "abandoned", label: "Abandoned" },
];

const CHANNEL_OPTIONS: { value: TransactionChannel | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "card", label: "Card" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "ussd", label: "USSD" },
];

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
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
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

interface StatusSelectProps {
  value: StatusFilterState;
  onChange: (value: StatusFilterState) => void;
}

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<StatusFilterState>(value);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = isFilterActive(value);

  function handleOpen() {
    setDraft(value);
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

  function updateDraft<K extends keyof StatusFilterState>(key: K, val: StatusFilterState[K]) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  function handleFilter() {
    onChange(draft);
    setOpen(false);
  }

  function handleReset() {
    setDraft(DEFAULT_STATUS_FILTER);
    onChange(DEFAULT_STATUS_FILTER);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors select-none whitespace-nowrap",
          isActive
            ? "bg-brand-teal text-white border-brand-teal hover:bg-brand-teal/90"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        )}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Filtered by status</span>
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
            className="absolute left-0 top-full mt-1.5 z-30 w-80 bg-white border border-gray-200 rounded-xl shadow-xl"
          >
            <div className="p-4 space-y-3">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </label>
                <InlineSelect
                  options={STATUS_OPTIONS}
                  value={draft.status}
                  onChange={(v) => updateDraft("status", v)}
                />
              </div>

              {/* Channel */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Channel
                </label>
                <InlineSelect
                  options={CHANNEL_OPTIONS}
                  value={draft.channel}
                  onChange={(v) => updateDraft("channel", v)}
                />
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Amount
                </label>
                <input
                  type="text"
                  value={draft.amount}
                  onChange={(e) => updateDraft("amount", e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                />
              </div>

              {/* Receipt Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Receipt number
                </label>
                <input
                  type="text"
                  value={draft.receiptNumber}
                  onChange={(e) => updateDraft("receiptNumber", e.target.value)}
                  placeholder="Enter receipt number"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                />
              </div>

              {/* Customer email / ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Customer ID / Email
                </label>
                <input
                  type="text"
                  value={draft.customerEmail}
                  onChange={(e) => updateDraft("customerEmail", e.target.value)}
                  placeholder="Enter customer ID or email"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                />
              </div>

              {/* Payment Page */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Payment Page
                </label>
                <input
                  type="text"
                  value={draft.paymentPage}
                  onChange={(e) => updateDraft("paymentPage", e.target.value)}
                  placeholder="Enter payment page"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                />
              </div>

              {/* Terminal ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Terminal ID
                </label>
                <input
                  type="text"
                  value={draft.terminalId}
                  onChange={(e) => updateDraft("terminalId", e.target.value)}
                  placeholder="Enter terminal ID"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 placeholder:text-gray-300"
                />
              </div>

              {/* Save as default */}
              <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-brand-teal accent-brand-teal"
                />
                <span className="text-sm text-gray-600">Save as default filter</span>
              </label>
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
