"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const origin = new Date(first);
  origin.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(origin);
    d.setDate(origin.getDate() + i);
    return d;
  });
}

export default function SingleDatePicker({
  value,
  onChange,
  placeholder = "Select date",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [calPos, setCalPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const todayStr = toStr(now);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !calendarRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
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

  function openPicker() {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCalPos({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen(true);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function handleDay(day: Date) {
    onChange(toStr(day));
    setOpen(false);
  }

  const grid = buildGrid(viewYear, viewMonth);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm border rounded-xl transition-colors",
          open
            ? "border-brand-teal ring-2 ring-brand-teal/20"
            : "border-gray-200 hover:border-gray-300",
          value ? "text-gray-700" : "text-gray-400",
        )}
      >
        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="flex-1 text-left">{value ? formatDisplay(value) : placeholder}</span>
        {value && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && calPos && (
            <div
              ref={calendarRef}
              style={{ top: calPos.top, left: calPos.left }}
              className="fixed z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.13, ease: "easeOut" }}
                className="w-65 bg-white border border-gray-200 rounded-xl shadow-xl p-3"
              >
                {/* Month nav */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    title="previous"
                    type="button"
                    onClick={prevMonth}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-gray-900">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </span>
                  <button
                    title="next"
                    type="button"
                    onClick={nextMonth}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_HEADERS.map((h) => (
                    <div key={h} className="text-center text-[9px] font-semibold text-gray-400 py-1">
                      {h}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                  {grid.map((day, i) => {
                    const str = toStr(day);
                    const inMonth = day.getMonth() === viewMonth;
                    const isSelected = str === value;
                    const isToday = str === todayStr;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleDay(day)}
                        className={cn(
                          "flex items-center justify-center h-8 w-8 mx-auto text-xs font-medium rounded-full transition-colors",
                          !inMonth && "text-gray-300 cursor-default",
                          inMonth && !isSelected && "text-gray-700 hover:bg-gray-100",
                          isSelected && "bg-brand-teal text-white hover:bg-brand-teal/90",
                          isToday && !isSelected && "font-bold text-brand-teal",
                        )}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
