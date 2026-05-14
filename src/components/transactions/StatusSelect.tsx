"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/lib/mock-data/transactions";

const STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "abandoned", label: "Abandoned" },
];

interface StatusSelectProps {
  values: TransactionStatus[];
  onChange: (values: TransactionStatus[]) => void;
}

export default function StatusSelect({ values, onChange }: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isFiltered = values.length > 0;

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

  function toggle(status: TransactionStatus) {
    if (values.includes(status)) {
      onChange(values.filter((v) => v !== status));
    } else {
      onChange([...values, status]);
    }
  }

  function clearAll() {
    onChange([]);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 h-9 px-3 rounded-xl border text-sm font-medium transition-colors select-none whitespace-nowrap",
          isFiltered
            ? "bg-brand-teal/10 border-brand-teal/40 text-brand-teal hover:bg-brand-teal/15"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        )}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>{isFiltered ? "Filtered by status" : "All statuses"}</span>
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
            className="absolute left-0 top-full mt-1.5 z-30 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Options */}
            <ul className="py-1">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = values.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "bg-brand-teal/5 text-brand-navy font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className="text-brand-teal shrink-0 ml-4"
                      />
                    )}
                  </button>
                );
              })}
            </ul>

            {/* Footer: clear */}
            {isFiltered && (
              <div className="border-t border-gray-100 px-4 py-2.5">
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
