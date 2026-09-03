"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string; // YYYY-MM-DD format
  max?: string; // YYYY-MM-DD format
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  min,
  max,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calendar state
  const today = new Date();
  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Generate calendar days
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(viewMonth, viewYear);
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    const dateStr = selected.toISOString().split("T")[0];
    
    // Check min/max constraints
    if (min && dateStr < min) return;
    if (max && dateStr > max) return;
    
    onChange(dateStr);
    setOpen(false);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const dateStr = date.toISOString().split("T")[0];
    
    if (min && dateStr < min) return true;
    if (max && dateStr > max) return true;
    
    return false;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const calendarDays = generateCalendar();

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none transition-all text-left",
          disabled
            ? "opacity-50 cursor-not-allowed border-border"
            : open
            ? "border-border ring-2 ring-brand-teal/20"
            : "border-border hover:border-gray-300"
        )}
      >
        <Calendar className="size-4 text-gray-400 shrink-0" />
        <span className={cn("flex-1", value ? "text-foreground" : "text-gray-400")}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
      </button>

      {/* Dropdown Calendar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute z-50 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-80"
          >
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="size-4 text-gray-600" />
              </button>
              
              <div className="text-sm font-semibold text-gray-900">
                {MONTHS[viewMonth]} {viewYear}
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="size-4 text-gray-600" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} />;
                }

                const disabled = isDateDisabled(day);
                const selected = isSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !disabled && handleDateSelect(day)}
                    disabled={disabled}
                    className={cn(
                      "aspect-square flex items-center justify-center text-sm rounded-lg transition-all",
                      disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : selected
                        ? "bg-[#1a7a5e] text-white font-semibold shadow-sm"
                        : today
                        ? "bg-brand-mint/20 text-[#1a7a5e] font-medium hover:bg-brand-mint/40"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const todayStr = today.toISOString().split("T")[0];
                  if ((!min || todayStr >= min) && (!max || todayStr <= max)) {
                    onChange(todayStr);
                    setOpen(false);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-[#1a7a5e] hover:bg-brand-mint/10 rounded-lg transition-colors"
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
