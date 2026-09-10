'use client';

import { useState } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { smPayouts, smTransactions } from "@/lib/sub-merchant-mock-data";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function SubMerchantSettlementsPage() {
  const { can } = useSubMerchantRole();
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null);

  // Calculate settlement summary - SM-020
  const totalPayouts = smPayouts.reduce((sum, p) => sum + p.net, 0);
  const totalFees = smPayouts.reduce((sum, p) => sum + p.fee, 0);
  const availableBalance = smPayouts[0]?.net || 0;
  const nextPayoutDate = "Sep 04, 2026"; // Mock next payout date

  // Get transaction breakdown for each payout - SM-021
  const getPayoutTransactions = (payoutId: string) => {
    // Mock: associate transactions with payout based on index
    const payoutIndex = smPayouts.findIndex(p => p.id === payoutId);
    const startIdx = payoutIndex * 10;
    const endIdx = startIdx + 10;
    return smTransactions.slice(startIdx, endIdx).filter(t => t.type === "collection" && t.status === "success");
  };

  return (
    <div className="px-6 py-6 space-y-4 pb-24 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Settlements
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your settlement history and fee breakdown
        </p>
      </motion.div>

      {/* Settlement Summary - SM-020 */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Available Balance", 
            value: formatGHS(availableBalance), 
            sub: "Last payout received", 
            icon: <Wallet className="size-4" />, 
            accent: "#a3ffe2" 
          },
          { 
            label: "Total Payouts", 
            value: formatGHS(totalPayouts), 
            sub: `${smPayouts.length} settlements`, 
            icon: <TrendingUp className="size-4" />, 
            accent: "#bcbbee" 
          },
          { 
            label: "Total Fees Paid", 
            value: formatGHS(totalFees), 
            sub: "Platform + parent merchant", 
            icon: <TrendingUp className="size-4" />, 
            accent: "#fedfb8" 
          },
          { 
            label: "Next Payout", 
            value: nextPayoutDate, 
            sub: "Estimated date", 
            icon: <Calendar className="size-4" />, 
            accent: "#64c6c3" 
          },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={item}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</span>
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.accent}18` }}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fee Structure Info Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <Info className="size-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">Fee Structure</p>
          <p className="text-xs text-blue-600 mt-1">
            Your parent merchant (Kwame Organics) charges a 2.0% fee on your collections. Platform fees are 1.5%. Total effective rate: 3.5%.
          </p>
        </div>
      </motion.div>

      {/* Payout History - SM-020 & SM-021 */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Payout History
          </h2>
        </div>
        <div className="divide-y divide-border">
          {smPayouts.map((payout, i) => {
            const isExpanded = expandedPayout === payout.id;
            const transactions = getPayoutTransactions(payout.id);
            const platformFee = Math.round(payout.amount * 0.015 * 100) / 100;
            const parentMerchantFee = Math.round(payout.amount * 0.02 * 100) / 100;
            const totalFee = payout.fee;

            return (
              <div key={payout.id} className={cn(i % 2 === 0 ? "" : "bg-muted/10")}>
                {/* Payout summary row */}
                <div className="px-5 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Payout {payout.id.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(payout.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Gross Amount</p>
                      <p className="text-sm font-semibold">{formatGHS(payout.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total Fees</p>
                      <p className="text-sm text-muted-foreground">- {formatGHS(totalFee)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Net Payout</p>
                      <p className="text-sm font-bold text-emerald-600">{formatGHS(payout.net)}</p>
                    </div>
                    <button
                      onClick={() => setExpandedPayout(isExpanded ? null : payout.id)}
                      className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded fee breakdown - SM-021 */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 space-y-4"
                  >
                    {/* Fee breakdown summary */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fee Breakdown</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Platform Fee (1.5%)</p>
                          <p className="text-sm font-semibold">{formatGHS(platformFee)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Parent Merchant Fee (2.0%)</p>
                          <p className="text-sm font-semibold text-[#5c3d9e]">{formatGHS(parentMerchantFee)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Fees (3.5%)</p>
                          <p className="text-sm font-bold">{formatGHS(totalFee)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Per-transaction breakdown - SM-021 */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Transaction Breakdown ({transactions.length} transactions)
                      </p>
                      <div className="overflow-x-auto border border-border rounded-xl">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-muted/30">
                              {["Reference", "Date", "Gross", "Platform Fee", "Parent Fee", "Net"].map((h) => (
                                <th key={h} className="text-left px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-4 last:pr-4">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((txn, idx) => {
                              const txnPlatformFee = Math.round(txn.grossAmount * 0.015 * 100) / 100;
                              const txnParentFee = Math.round(txn.grossAmount * 0.02 * 100) / 100;
                              const txnNet = Math.round((txn.grossAmount - txnPlatformFee - txnParentFee) * 100) / 100;

                              return (
                                <tr key={txn.id} className={cn(
                                  "border-b border-border/50 last:border-0",
                                  idx % 2 === 0 ? "" : "bg-muted/10"
                                )}>
                                  <td className="pl-4 pr-3 py-2 font-mono text-xs">{txn.reference}</td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(txn.date)}
                                  </td>
                                  <td className="px-3 py-2 text-xs font-semibold">{formatGHS(txn.grossAmount)}</td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground">{formatGHS(txnPlatformFee)}</td>
                                  <td className="px-3 py-2 text-xs text-[#5c3d9e] font-medium">{formatGHS(txnParentFee)}</td>
                                  <td className="pl-3 pr-4 py-2 text-xs font-semibold">{formatGHS(txnNet)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Fee calculation explanation */}
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <Info className="size-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-amber-800">How fees are calculated</p>
                        <p className="text-xs text-amber-600 mt-1">
                          For each transaction: Gross Amount × 1.5% (platform) + Gross Amount × 2.0% (parent merchant). 
                          Your parent merchant's fee rate is set in their sub-merchant configuration.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Settlement Schedule Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          Settlement Schedule
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Settlements are processed every business day</p>
          <p>• Funds are typically available within 24-48 hours</p>
          <p>• Minimum settlement amount: GH₵100</p>
          <p>• Contact your parent merchant (Kwame Organics) for fee rate inquiries</p>
        </div>
      </motion.div>
    </div>
  );
}
