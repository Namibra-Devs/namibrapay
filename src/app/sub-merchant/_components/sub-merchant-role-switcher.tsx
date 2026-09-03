'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Shield, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";
import { SUB_MERCHANT_ROLES, SUB_MERCHANT_ROLE_LABELS, type SubMerchantRole } from "@/lib/sub-merchant-constants";

const roleIcons = {
  sub_admin: Shield,
  sub_viewer: Eye,
};

export default function SubMerchantRoleSwitcher() {
  const { role, setRole } = useSubMerchantRole();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const CurrentIcon = roleIcons[role];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-xs font-medium"
      >
        <CurrentIcon className="size-3.5" />
        <span>{SUB_MERCHANT_ROLE_LABELS[role]}</span>
        <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {Object.values(SUB_MERCHANT_ROLES).map((r) => {
              const Icon = roleIcons[r];
              return (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                    role === r
                      ? "bg-brand-mint/20 text-[#1a7a5e]"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Icon className="size-4" />
                    <span className="flex-1">{SUB_MERCHANT_ROLE_LABELS[r]}</span>
                    {role === r && (
                      <div className="size-1.5 rounded-full bg-[#1a7a5e]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
      )}
    </div>
  );
}
