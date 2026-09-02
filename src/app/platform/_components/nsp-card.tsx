'use client';

import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/mock-data";
import { formatGHS, formatDate } from "@/lib/constants";

const nspColors = {
  healthy: { bar: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  warning: { bar: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  critical: { bar: "bg-red-400", text: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const providerStatusColors = {
  operational: { dot: "bg-emerald-400", label: "text-emerald-600", badge: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  degraded: { dot: "bg-amber-400", label: "text-amber-600", badge: "bg-amber-50 border-amber-200 text-amber-700" },
  down: { dot: "bg-red-400 animate-pulse", label: "text-red-600", badge: "bg-red-50 border-red-200 text-red-700" },
};

type Props = { provider: Provider };

export function NspBalanceCard({ provider }: Props) {
  const nsp = nspColors[provider.nspStatus];
  const status = providerStatusColors[provider.status];
  const balancePct = Math.min(100, (provider.nspBalance / (provider.nspThreshold * 8)) * 100);

  return (
    <div className={cn("rounded-2xl border p-5 flex flex-col gap-4 transition-all hover:shadow-md", nsp.bg)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{provider.name}</p>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 inline-block", status.badge)}>
            {provider.status}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn("size-2 rounded-full", status.dot)} />
          <span className={cn("text-xs font-semibold", status.label)}>{provider.uptime}%</span>
        </div>
      </div>

      {/* NSP Balance */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className={cn("text-xl font-bold", nsp.text)} style={{ fontFamily: "var(--font-heading)" }}>
            {formatGHS(provider.nspBalance)}
          </p>
          <p className="text-xs text-muted-foreground">
            min {formatGHS(provider.nspThreshold)}
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", nsp.bar)}
            style={{ width: `${balancePct}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Latency: <strong>{provider.avgLatencyMs > 0 ? `${provider.avgLatencyMs}ms` : "—"}</strong></span>
        <span suppressHydrationWarning>Last OK: <strong>{formatDate(provider.lastSuccessful).split(",")[1]?.trim() ?? "—"}</strong></span>
      </div>
    </div>
  );
}