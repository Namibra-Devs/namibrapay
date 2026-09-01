'use client';

import { useRole } from "@/hooks/use-role";
import { ROLES, ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const roles = Object.values(ROLES) as Role[];

const roleAccents: Record<Role, string> = {
  super_admin: "text-[#c0392b]",
  finance: "text-[#d35400]",
  compliance: "text-[#5c3d9e]",
  support: "text-[#1a7a5e]",
  platform_engineer: "text-[#1a6e6c]",
};

const roleDots: Record<Role, string> = {
  super_admin: "bg-[#ffb4b0]",
  finance: "bg-[#fedfb8]",
  compliance: "bg-[#bcbbee]",
  support: "bg-[#a3ffe2]",
  platform_engineer: "bg-[#64c6c3]",
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
          "bg-card border-border hover:border-ring/50 shadow-sm"
        )}
      >
        <div className={cn("size-2 rounded-full", roleDots[role])} />
        <span className="text-muted-foreground">Role:</span>
        <span className={cn("font-semibold", roleAccents[role])}>{ROLE_LABELS[role]}</span>
        <ChevronDown className={cn("size-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden">
          <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Dev: Switch Role
          </p>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors hover:bg-muted/50",
                role === r && "bg-muted"
              )}
            >
              <div className={cn("size-2 rounded-full shrink-0", roleDots[r])} />
              <span className={cn("font-medium text-xs", role === r ? roleAccents[r] : "text-foreground")}>
                {ROLE_LABELS[r]}
              </span>
              {role === r && <span className="ml-auto text-[10px] text-muted-foreground">active</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
