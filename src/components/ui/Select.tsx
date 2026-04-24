"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Extra classes on the root container div */
  className?: string;
  /** Extra classes applied directly on the trigger button */
  triggerClassName?: string;
  /** Compact mode: no border/ring on trigger — designed to nest inside a field group */
  compact?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  triggerClassName,
  compact = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center w-full text-left cursor-pointer transition-colors select-none",
          compact
            ? // Inline / grouped variant
              "h-full bg-gray-50 pl-3 pr-8 py-3 text-sm text-gray-700 border-r border-gray-200"
            : // Standalone field variant
              cn(
                "gap-2 border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none",
                open
                  ? "border-brand-teal ring-2 ring-brand-teal/30"
                  : "border-gray-200 hover:border-gray-300"
              ),
          triggerClassName
        )}
      >
        <span className="flex-1 truncate">
          {selected ? (
            selected.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>

        {/* Chevron — absolute in compact so it doesn't shift text */}
        <ChevronDown
          size={compact ? 13 : 15}
          className={cn(
            "shrink-0 text-gray-400 transition-transform duration-200",
            compact
              ? "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              : "ml-auto",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-1.5 max-h-60 overflow-y-auto",
              "bg-white border border-gray-200 rounded-xl shadow-xl py-1",
              // Compact: auto-width so it isn't constrained to the narrow trigger
              compact ? "w-auto min-w-20" : "w-full"
            )}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors",
                    isSelected
                      ? "bg-brand-teal/5 text-brand-navy font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="text-brand-teal shrink-0 ml-3"
                    />
                  )}
                </button>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
