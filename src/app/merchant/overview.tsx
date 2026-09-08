'use client';

import { motion } from "motion/react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { formatGHS, formatDate } from "@/lib/constants";
import {
  mockMerchantTransactions,
  mockMerchantChartData,
  mockSettlements,
} from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const statusIcons = {
  success: <CheckCircle2 className="size-3.5 text-emerald-500" />,
  failed: <XCircle className="size-3.5 text-destructive" />,
  pending: <Clock className="size-3.5 text-amber-500" />,
  processing: <RefreshCw className="size-3.5 text-blue-500" />,
  reversed: <ArrowUpCircle className="size-3.5 text-purple-500" />,
};

const statusBadge = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  reversed: "bg-purple-50 text-purple-700 border-purple-200",
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function MerchantOverview() {
  const { can } = useMerchantRole();
  const today = mockSettlements[0]!;
  const recentTxns = mockMerchantTransactions.slice(0, 10);
  const successCount = mockMerchantTransactions.filter((t) => t.status === "success").length;
  const successRate = Math.round((successCount / mockMerchantTransactions.length) * 100);

  return (
    <div className="px-6 py-6 space-y-4 pb-24 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Good morning, Kwame
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with <span className="font-medium text-foreground">Kwame Organics Ltd</span> today.
        </p>
      </motion.div>

      {/* Account Status Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <div className="size-2 rounded-full bg-emerald-400" />
        <p className="text-sm font-medium text-emerald-800">Account active · No pending actions</p>
        <span className="ml-auto text-xs text-emerald-600">Verified merchant</span>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Collections Today", value: formatGHS(today.collected), sub: `${recentTxns.filter(t => t.type === "collection").length} transactions`, icon: <ArrowDownCircle className="size-4" />, accent: "#64c6c3" },
          { label: "Payouts Today", value: formatGHS(today.paidOut === 0 ? 0 : today.paidOut), sub: "0 payouts processed", icon: <ArrowUpCircle className="size-4" />, accent: "#bcbbee" },
          { label: "Available Balance", value: formatGHS(today.pendingPayout), sub: "Pending next payout", icon: <Wallet className="size-4" />, accent: "#fedfb8" },
          { label: "Success Rate", value: `${successRate}%`, sub: "Last 50 transactions", icon: <TrendingUp className="size-4" />, accent: "#a3ffe2" },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={item}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-ring/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</span>
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.accent}18` }}>
                <div style={{ color: kpi.accent }}>{kpi.icon}</div>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart + Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* 7-day chart */}
        <div className="xl:col-span-3 bg-card border border-border rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>7-Day Transaction Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Collections vs payouts (GHS)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockMerchantChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mGradC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64c6c3" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#64c6c3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mGradP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bcbbee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#bcbbee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }}
                formatter={(v: unknown) => [formatGHS(typeof v === "number" ? v : 0)]}
              />
              <Area type="monotone" dataKey="collections" name="Collections" stroke="#64c6c3" strokeWidth={2} fill="url(#mGradC)" dot={false} />
              <Area type="monotone" dataKey="payouts" name="Payouts" stroke="#bcbbee" strokeWidth={2} fill="url(#mGradP)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        {can("transactions.view") && (
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Recent Transactions</h3>
              <Link href="/merchant/transactions" className="text-xs text-brand-teal hover:underline flex items-center gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-60">
              {recentTxns.map((txn) => (
                <div key={txn.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="shrink-0">{statusIcons[txn.status]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{txn.payerIdentifier}</p>
                    <p className="text-[10px] text-muted-foreground">{txn.reference}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-semibold", txn.type === "collection" ? "text-emerald-600" : "text-foreground")}>
                      {txn.type === "collection" ? "+" : "-"}{formatGHS(txn.amount)}
                    </p>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", statusBadge[txn.status])}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Settlement Summary */}
      {can("settlements.view") && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Settlement Summary</h2>
            <Link href="/merchant/settlements" className="text-xs text-brand-teal hover:underline flex items-center gap-1">
              Full report <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockSettlements.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">{s.periodLabel}</p>
                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>{formatGHS(s.collected)}</p>
                <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <div className="flex justify-between"><span>Fees</span><span className="text-destructive">-{formatGHS(s.fees)}</span></div>
                  <div className="flex justify-between"><span>Net settled</span><span className="text-emerald-600 font-medium">{formatGHS(s.netSettled)}</span></div>
                  <div className="flex justify-between border-t border-border pt-1 mt-1"><span>Paid out</span><span className="font-semibold text-foreground">{formatGHS(s.paidOut)}</span></div>
                </div>
              </div>
            ))}
            <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-xs text-[#1a6e6c] font-medium uppercase tracking-wider mb-2">Pending Payout</p>
              <p className="text-lg font-bold text-[#1a6e6c]" style={{ fontFamily: "var(--font-heading)" }}>
                {formatGHS(mockSettlements.reduce((a, s) => a + s.pendingPayout, 0))}
              </p>
              <p className="text-[10px] text-[#1a6e6c]/70 mt-1">Across all periods</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Support-only: limited message */}
      {!can("settlements.view") && !can("transactions.export") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <AlertCircle className="size-4 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-800">
            Your role (Support Agent) provides transaction search access only. Contact your account admin for financial data.
          </p>
        </motion.div>
      )}
    </div>
  );
}
