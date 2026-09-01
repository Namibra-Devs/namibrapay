'use client';

"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TooltipProps } from "recharts";
import { formatGHS } from "@/lib/constants";
import { mockChartData } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ranges = ["7d", "14d", "30d", "Custom"] as const;
type Range = (typeof ranges)[number];

type ChartPayloadItem = {
  name?: string;
  value?: number;
  color?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps<number, string> & { payload?: ChartPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{p.name === "Volume" ? formatGHS(p.value ?? 0) : (p.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function TransactionChart() {
  const [range, setRange] = useState<Range>("7d");

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>
            Transaction Volume
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Successful vs failed transactions</p>
        </div>
        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                range === r
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSuccessful" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64c6c3" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#64c6c3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffb4b0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffb4b0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            wrapperStyle={{ paddingTop: "12px" }}
          />
          <Area
            type="monotone"
            dataKey="successful"
            name="Successful"
            stroke="#64c6c3"
            strokeWidth={2}
            fill="url(#gradSuccessful)"
            dot={false}
            activeDot={{ r: 4, fill: "#64c6c3" }}
          />
          <Area
            type="monotone"
            dataKey="failed"
            name="Failed"
            stroke="#ffb4b0"
            strokeWidth={2}
            fill="url(#gradFailed)"
            dot={false}
            activeDot={{ r: 4, fill: "#ffb4b0" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}