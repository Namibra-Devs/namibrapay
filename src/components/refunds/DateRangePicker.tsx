"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(dateStr: string): string {
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
  origin.setDate(1 - first.getDay()); // rewind to the Sunday before
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(origin);
    d.setDate(origin.getDate() + i);
    return d;
  });
}

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState<"start" | "end">("start");
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const ref = useRef<HTMLDivElement>(null);
  const todayStr = toStr(now);

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

  function openFor(which: "start" | "end") {
    setPicking(which);
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
    const str = toStr(day);
    if (picking === "start") {
      // If new start is after existing end, clear end
      onChange(str, endDate && str > endDate ? "" : endDate);
      setPicking("end");
    } else {
      // If end is before start, swap
      if (startDate && str < startDate) {
        onChange(str, startDate);
      } else {
        onChange(startDate, str);
      }
      setOpen(false);
    }
  }

  const grid = buildGrid(viewYear, viewMonth);

  return (
    <div ref={ref} className="relative">
      {/* Two inputs row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openFor("start")}
          className={cn(
            "flex-1 min-w-0 text-left px-3 py-2 text-sm border rounded-lg transition-colors",
            open && picking === "start"
              ? "border-brand-teal ring-1 ring-brand-teal/20"
              : "border-gray-200 hover:border-gray-300",
            startDate ? "text-gray-700" : "text-gray-400"
          )}
        >
          {startDate ? formatDisplay(startDate) : "Start Date"}
        </button>

        <button
          type="button"
          onClick={() => openFor("end")}
          className={cn(
            "flex-1 min-w-0 text-left px-3 py-2 text-sm border rounded-lg transition-colors",
            open && picking === "end"
              ? "border-brand-teal ring-1 ring-brand-teal/20"
              : "border-gray-200 hover:border-gray-300",
            endDate ? "text-gray-700" : "text-gray-400"
          )}
        >
          {endDate ? formatDisplay(endDate) : "End Date"}
        </button>
      </div>

      {/* Calendar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 z-50 w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl p-3"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button
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
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_HEADERS.map((h) => (
                <div
                  key={h}
                  className="text-center text-[9px] font-semibold text-gray-400 py-1"
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {grid.map((day, i) => {
                const str = toStr(day);
                const inMonth = day.getMonth() === viewMonth;
                const isStart = str === startDate;
                const isEnd = str === endDate;
                const isSelected = isStart || isEnd;
                const inRange =
                  startDate && endDate && str > startDate && str < endDate;
                const isToday = str === todayStr;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDay(day)}
                    className={cn(
                      "flex items-center justify-center h-8 w-8 mx-auto text-xs font-medium rounded-full transition-colors",
                      !inMonth && "text-gray-300 cursor-default",
                      inMonth && !isSelected && !inRange && "text-gray-700 hover:bg-gray-100",
                      inRange && "bg-brand-teal/10 text-brand-teal rounded-none",
                      isSelected && "bg-brand-teal text-white hover:bg-brand-teal/90",
                      isToday && !isSelected && "font-bold text-brand-teal",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Clear link */}
            {(startDate || endDate) && (
              <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => { onChange("", ""); setOpen(false); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear dates
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
