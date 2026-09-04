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
};

export function KpiCard({ label, value, sub, trend, accent = "#64c6c3", icon }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-ring/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
            <div style={{ color: accent }}>{icon}</div>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-destructive")}>
          {trend.positive ? <MoveUp className="size-3.5" /> : <MoveDown className="size-3.5" />}
          <span>{trend.value} vs yesterday</span>
        </div>
      )}
    </div>
  );
}