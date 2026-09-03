"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
  className?: string;
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  disabled = false,
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
      {/* Trigger - matches Input styling exactly */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none transition-all",
          disabled
            ? "opacity-50 cursor-not-allowed border-border"
            : open
            ? "border-border ring-2 ring-brand-teal/20"
            : "border-border hover:border-gray-300",
          "text-left"
        )}
      >
        <span className={cn("flex-1 truncate", selected ? "text-foreground" : "text-gray-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-gray-400 transition-transform duration-200 shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown - matches role switcher styling */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
            >
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                        isSelected
                          ? "bg-brand-mint/20 text-[#1a7a5e]"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <Check className="size-4 text-[#1a7a5e]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
