"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type DateRangeValue = "today" | "last_7" | "this_month" | "last_month" | "all_time" | "custom";

interface DateRangeOption {
  value: DateRangeValue;
  label: string;
}

const OPTIONS: DateRangeOption[] = [
  { value: "today", label: "Today" },
  { value: "last_7", label: "Last 7 days" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "all_time", label: "All time" },
  { value: "custom", label: "Custom" },
];

function getDateLabel(value: DateRangeValue): string {
  const now = new Date();
  const day = now.getDate();
  const monthShort = now.toLocaleDateString("en-GB", { month: "short" });

  switch (value) {
    case "today":
      return `${day} ${monthShort}`;
    case "last_7": {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      const startDay = start.getDate();
      const startMonth = start.toLocaleDateString("en-GB", { month: "short" });
      return `${startDay} ${startMonth} – ${day} ${monthShort}`;
    }
    case "this_month":
      return monthShort;
    case "last_month": {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return last.toLocaleDateString("en-GB", { month: "short" });
    }
    case "all_time":
    case "custom":
      return "";
  }
}

interface DateRangeSelectProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
}

export default function DateRangeSelect({ value, onChange, className }: DateRangeSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[2];

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

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors select-none whitespace-nowrap"
      >
        <span>{selected.label}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
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
            className="absolute left-0 top-full mt-1.5 z-30 min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <ul className="py-1">
              {OPTIONS.map((opt) => {
                const isSelected = opt.value === value;
                const dateLabel = getDateLabel(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {dateLabel && (
                      <span
                        className={cn(
                          "text-xs ml-8 shrink-0",
                          isSelected ? "text-gray-500" : "text-gray-400"
                        )}
                      >
                        {dateLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
