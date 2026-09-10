'use client';

import { cn } from "@/lib/utils";
import { MoveUp, MoveDown } from "lucide-react";
import type { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
  accent?: string;
  icon?: ReactNode;
  gradient?: boolean; // New prop for gradient styling
};

export function KpiCard({ label, value, sub, trend, accent = "#64c6c3", icon, gradient = false }: KpiCardProps) {
  return (
    <div className={cn(
      "rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300",
      gradient 
        ? "bg-linear-to-br from-brand-teal via-[#4db5b2] to-[#2d9a97] text-white border-0 hover:shadow-lg" 
        : "bg-card border border-border hover:border-ring/40"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium uppercase tracking-wider",
          gradient ? "text-white/90" : "text-muted-foreground"
        )}>{label}</span>
        {icon && (
          <div className={cn(
            "size-8 rounded-lg flex items-center justify-center",
            gradient ? "bg-white/20 backdrop-blur-sm" : ""
          )} style={!gradient ? { background: `${accent}18` } : {}}>
            <div style={{ color: gradient ? "white" : accent }}>{icon}</div>
          </div>
        )}
      </div>
      <div>
        <p className={cn(
          "text-2xl font-bold tracking-tight",
          gradient ? "text-white" : ""
        )} style={{ fontFamily: "var(--font-heading)" }}>
          {value}
        </p>
        {sub && <p className={cn(
          "text-xs mt-0.5",
          gradient ? "text-white/80" : "text-muted-foreground"
        )}>{sub}</p>}
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium", 
          gradient ? "text-white/90" : (trend.positive ? "text-emerald-600" : "text-destructive")
        )}>
          {trend.positive ? <MoveUp className="size-3.5" /> : <MoveDown className="size-3.5" />}
          <span>{trend.value} vs yesterday</span>
        </div>
      )}
    </div>
  );
}