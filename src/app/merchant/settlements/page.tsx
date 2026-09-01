'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Download, Calendar } from "lucide-react";
import { formatGHS, formatDate } from "@/lib/constants";
import { mockSettlements, mockPayouts } from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { cn } from "@/lib/utils";

const payoutStatusConfig = {
  pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  processing: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400" },
  completed: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  failed: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-400" },
};

type Tab = "summary" | "payouts" | "reconcile";

export default function SettlementsPage() {
  const { can } = useMerchantRole();
  const [tab, setTab] = useState<Tab>("summary");

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Settlements & Payouts</h1>
        <p className="text-sm text-muted-foreground mt-1">Track what you've collected, what's been settled, and what's been paid out.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
        {([
          { key: "summary", label: "Summary" },
          { key: "payouts", label: "Payout History" },
          ...(can("settlements.reconcile") ? [{ key: "reconcile" as const, label: "Reconciliation" }] : []),
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      {/* Summary Tab */}
      {tab === "summary" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockSettlements.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.periodLabel}</p>
                  {can("settlements.export") && (
                    <button className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                      <Download className="size-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>{formatGHS(s.collected)}</p>
                <div className="space-y-2">
                  {[
                    { label: "Gross collected", val: s.collected, color: "text-foreground" },
                    { label: "Fees deducted", val: s.fees, color: "text-destructive", prefix: "-" },
                    { label: "Net settled", val: s.netSettled, color: "text-emerald-600" },
                    { label: "Paid out", val: s.paidOut, color: "text-foreground" },
                    { label: "Pending payout", val: s.pendingPayout, color: "text-amber-600" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={cn("font-medium", row.color)}>
                        {row.prefix ?? ""}{formatGHS(row.val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Payout History Tab */}
      {tab === "payouts" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Date", "Amount", "Destination", "Transactions", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockPayouts.map((p) => {
                  const sc = payoutStatusConfig[p.status];
                  return (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{formatDate(p.date)}</td>
                      <td className="px-4 py-3 font-semibold text-sm">{formatGHS(p.amount)}</td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-medium">{p.destinationBank}</p>
                        <p className="text-muted-foreground font-mono">{p.destinationAccount}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-center">{p.txnCount}</td>
                      <td className="px-4 py-3">
                        <span className={cn("flex items-center gap-1.5 w-fit px-2 py-1 rounded-full border text-[11px] font-medium", sc.badge)}>
                          <div className={cn("size-1.5 rounded-full", sc.dot)} />
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Reconciliation Tab */}
      {tab === "reconcile" && can("settlements.reconcile") && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl text-sm">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Aug 2026</span>
            </div>
            {can("settlements.export") && (
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm hover:bg-muted/50 transition-all">
                <Download className="size-3.5" />
                Export CSV
              </button>
            )}
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Period", "Collected", "Fees", "Net", "Paid Out", "Variance"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockSettlements.map((s) => {
                    const variance = s.netSettled - s.paidOut - s.pendingPayout;
                    return (
                      <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-xs">{s.periodLabel}</td>
                        <td className="px-4 py-3 text-xs">{formatGHS(s.collected)}</td>
                        <td className="px-4 py-3 text-xs text-destructive">-{formatGHS(s.fees)}</td>
                        <td className="px-4 py-3 text-xs text-emerald-600 font-medium">{formatGHS(s.netSettled)}</td>
                        <td className="px-4 py-3 text-xs">{formatGHS(s.paidOut)}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className={cn("font-semibold", variance === 0 ? "text-emerald-600" : "text-amber-600")}>
                            {variance === 0 ? "Balanced" : formatGHS(Math.abs(variance))}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
