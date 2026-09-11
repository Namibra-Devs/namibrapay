"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  onChange: (startDate: string, endDate: string) => void;
  onCancel?: () => void;
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

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  onCancel,
  placeholder = "Select date range",
  className,
  disabled = false,
  min,
  max,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [openUpward, setOpenUpward] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Calendar state
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const [selectingStart, setSelectingStart] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        handleCancel();
      }
    };
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Calculate position when opening
  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 640; // sm breakpoint
      const calendarHeight = 450;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const shouldOpenUpward = spaceBelow < calendarHeight && spaceAbove > spaceBelow;

      setOpenUpward(shouldOpenUpward);
      
      // On mobile, center the picker with some padding
      if (isMobile) {
        setPos({ 
          top: shouldOpenUpward 
            ? rect.top + window.scrollY - calendarHeight - 8
            : rect.bottom + window.scrollY + 8, 
          left: 16, // 16px padding from left
          width: viewportWidth - 32 // 16px padding on each side
        });
      } else {
        setPos({ 
          top: shouldOpenUpward 
            ? rect.top + window.scrollY - calendarHeight - 8
            : rect.bottom + window.scrollY + 8, 
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
      
      setTempStart(startDate);
      setTempEnd(endDate);
      setSelectingStart(true);
    }
    setOpen((v) => !v);
  };

  const handleCancel = () => {
    setOpen(false);
    setTempStart(startDate);
    setTempEnd(endDate);
    onCancel?.();
  };

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange(tempStart, tempEnd);
      setOpen(false);
    }
  };

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

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    const dateStr = selected.toISOString().split("T")[0];
    
    if (min && dateStr < min) return;
    if (max && dateStr > max) return;
    
    if (selectingStart) {
      setTempStart(dateStr);
      setTempEnd(""); // Reset end date
      setSelectingStart(false);
    } else {
      if (dateStr < tempStart) {
        // If end date is before start date, swap them
        setTempEnd(tempStart);
        setTempStart(dateStr);
      } else {
        setTempEnd(dateStr);
      }
    }
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

  const isInRange = (day: number) => {
    if (!tempStart || !tempEnd) return false;
    const date = new Date(viewYear, viewMonth, day);
    const dateStr = date.toISOString().split("T")[0];
    return dateStr >= tempStart && dateStr <= tempEnd;
  };

  const isRangeStart = (day: number) => {
    if (!tempStart) return false;
    const date = new Date(viewYear, viewMonth, day);
    const dateStr = date.toISOString().split("T")[0];
    return dateStr === tempStart;
  };

  const isRangeEnd = (day: number) => {
    if (!tempEnd) return false;
    const date = new Date(viewYear, viewMonth, day);
    const dateStr = date.toISOString().split("T")[0];
    return dateStr === tempEnd;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
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

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    
    setTempStart(startStr);
    setTempEnd(endStr);
  };

  const calendarDays = generateCalendar();

  return (
    <div className={cn("relative", className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && handleOpen()}
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
        <span className={cn("flex-1 truncate", startDate && endDate ? "text-foreground" : "text-gray-400")}>
          {startDate && endDate 
            ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}` 
            : placeholder}
        </span>
        {startDate && endDate && !disabled && (
          <X 
            className="size-3.5 text-gray-400 hover:text-foreground shrink-0" 
            onClick={(e) => {
              e.stopPropagation();
              onChange("", "");
            }}
          />
        )}
      </button>

      {/* Dropdown Calendar - Use Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Invisible backdrop */}
              <div
                className="fixed inset-0 z-9998"
                onClick={handleCancel}
              />
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.97 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                style={{ 
                  position: "fixed", 
                  top: pos.top, 
                  left: pos.left,
                  width: Math.max(pos.width, 280),
                  maxWidth: "calc(100vw - 32px)" // Prevent overflow on mobile
                }}
                className="bg-card border border-border rounded-xl shadow-xl p-3 sm:p-4 z-9999 max-h-[85vh] overflow-y-auto"
              >
                {/* Header with instructions */}
                <div className="mb-3 pb-3 border-b border-border">
                  <p className="text-xs font-medium text-foreground">
                    {selectingStart ? "Select start date" : "Select end date"}
                  </p>
                  {tempStart && !tempEnd && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Start: {formatDisplayDate(tempStart)}
                    </p>
                  )}
                  {tempStart && tempEnd && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      {formatDisplayDate(tempStart)} - {formatDisplayDate(tempEnd)}
                    </p>
                  )}
                </div>

                {/* Quick Select Buttons */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(7)}
                    className="px-1.5 sm:px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    Last 7d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(14)}
                    className="px-1.5 sm:px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    Last 14d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(30)}
                    className="px-1.5 sm:px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    Last 30d
                  </button>
                </div>

                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 sm:p-1.5 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ChevronLeft className="size-4 text-muted-foreground" />
                  </button>
                  
                  <div className="text-xs sm:text-sm font-semibold text-foreground">
                    {MONTHS[viewMonth]} {viewYear}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 sm:p-1.5 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] font-medium text-muted-foreground py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-3">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} />;
                    }

                    const disabled = isDateDisabled(day);
                    const inRange = isInRange(day);
                    const rangeStart = isRangeStart(day);
                    const rangeEnd = isRangeEnd(day);
                    const todayDate = isToday(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => !disabled && handleDateSelect(day)}
                        disabled={disabled}
                        className={cn(
                          "aspect-square flex items-center justify-center text-[11px] sm:text-xs rounded-md sm:rounded-lg transition-all min-h-8 sm:min-h-0",
                          disabled
                            ? "text-gray-300 cursor-not-allowed"
                            : rangeStart || rangeEnd
                            ? "bg-[#1a7a5e] text-white font-semibold shadow-sm"
                            : inRange
                            ? "bg-brand-mint/30 text-[#1a7a5e] font-medium"
                            : todayDate
                            ? "bg-brand-mint/10 text-[#1a7a5e] font-medium hover:bg-brand-mint/20"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={!tempStart || !tempEnd}
                    className={cn(
                      "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                      tempStart && tempEnd
                        ? "bg-[#1a7a5e] text-white hover:bg-[#155a47]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
