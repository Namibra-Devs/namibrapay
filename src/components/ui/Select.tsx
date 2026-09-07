"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  triggerClassName?: string;
  disabled?: boolean;
  compact?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  triggerClassName,
  disabled = false,
  compact = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position when opened
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 264; // max-h-64 = 16rem = 256px + padding
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Check if there's enough space below
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setOpenUpward(shouldOpenUpward);
      setDropdownPos({
        top: shouldOpenUpward 
          ? rect.top + window.scrollY - dropdownHeight - 8 
          : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
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
          "flex items-center gap-2 bg-card border text-sm focus:outline-none transition-all",
          compact ? "px-3 py-3" : "w-full px-3 py-2 rounded-lg",
          disabled
            ? "opacity-50 cursor-not-allowed border-border"
            : open
            ? "border-border ring-2 ring-brand-teal/20"
            : "border-border hover:border-gray-300",
          "text-left",
          triggerClassName
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

      {/* Dropdown - Portal with high z-index */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Invisible backdrop to catch clicks */}
                <div
                  className="fixed inset-0 z-9998"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  style={{
                    position: "fixed",
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                  }}
                  className="bg-card border border-border rounded-xl shadow-lg overflow-hidden z-9999"
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
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
