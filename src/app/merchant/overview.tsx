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
  mockMerchantProfile,
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

  // Determine status banner based on merchant profile
  const getAccountStatusBanner = () => {
    const { accountStatus, isVerified, hasPendingActions, pendingActionsCount, complianceStatus, kycStatus } = mockMerchantProfile;

    // Suspended account
    if (accountStatus === "suspended") {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        dotColor: "bg-red-500",
        textColor: "text-red-800",
        badgeText: "Suspended",
        badgeColor: "text-red-600",
        message: {
          full: "Account suspended · Contact support",
          short: "Suspended · Contact support"
        }
      };
    }

    // Pending verification
    if (accountStatus === "pending_verification" || kycStatus === "pending") {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        dotColor: "bg-amber-500",
        textColor: "text-amber-800",
        badgeText: "Pending",
        badgeColor: "text-amber-600",
        message: {
          full: "Verification pending · Limited access",
          short: "Verification pending"
        }
      };
    }

    // KYC rejected
    if (kycStatus === "rejected") {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        dotColor: "bg-red-500",
        textColor: "text-red-800",
        badgeText: "Action Required",
        badgeColor: "text-red-600",
        message: {
          full: "KYC rejected · Resubmit documents",
          short: "KYC rejected · Resubmit"
        }
      };
    }

    // Incomplete compliance
    if (complianceStatus === "incomplete") {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        dotColor: "bg-amber-500",
        textColor: "text-amber-800",
        badgeText: "Action Required",
        badgeColor: "text-amber-600",
        message: {
          full: `Complete ${pendingActionsCount} compliance step${pendingActionsCount !== 1 ? 's' : ''}`,
          short: `${pendingActionsCount} step${pendingActionsCount !== 1 ? 's' : ''} pending`
        }
      };
    }

    // Has pending actions (but otherwise active)
    if (hasPendingActions && pendingActionsCount > 0) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        dotColor: "bg-blue-500",
        textColor: "text-blue-800",
        badgeText: `${pendingActionsCount} pending`,
        badgeColor: "text-blue-600",
        message: {
          full: `Account active · ${pendingActionsCount} pending action${pendingActionsCount !== 1 ? 's' : ''}`,
          short: `Active · ${pendingActionsCount} action${pendingActionsCount !== 1 ? 's' : ''}`
        }
      };
    }

    // All good - active and verified
    return {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dotColor: "bg-emerald-400",
      textColor: "text-emerald-800",
      badgeText: isVerified ? "Verified" : "Active",
      badgeColor: "text-emerald-600",
      message: {
        full: "Account active · No pending actions",
        short: "Active · No pending actions"
      }
    };
  };

  const statusBanner = getAccountStatusBanner();

  return (
    <div className="sm:pl-6 sm:pr-4 py-4 space-y-4 pb-24 md:pb-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Good morning, Kwame
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with <span className="font-medium text-foreground">Kwame Organics Ltd</span> today.
        </p>
      </motion.div>

      {/* Account Status Banner - Dynamic based on merchant profile */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className={cn(
          "flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3",
          statusBanner.bg,
          statusBanner.border,
          "border"
        )}>
        <div className={cn("size-2 rounded-full shrink-0", statusBanner.dotColor)} />
        <p className={cn("text-xs sm:text-sm font-medium truncate", statusBanner.textColor)}>
          <span className="hidden sm:inline">{statusBanner.message.full}</span>
          <span className="sm:hidden">{statusBanner.message.short}</span>
        </p>
        <span className={cn(
          "ml-auto text-[10px] sm:text-xs whitespace-nowrap shrink-0",
          statusBanner.badgeColor
        )}>
          {statusBanner.badgeText}
        </span>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Collections Today", 
            value: formatGHS(today.collected), 
            sub: `${recentTxns.filter(t => t.type === "collection").length} transactions`, 
            icon: <ArrowDownCircle className="size-4" />, 
            accent: "#64c6c3",
            gradient: true // Mark this card for gradient
          },
          { label: "Payouts Today", value: formatGHS(today.paidOut === 0 ? 0 : today.paidOut), sub: "0 payouts processed", icon: <ArrowUpCircle className="size-4" />, accent: "#bcbbee" },
          { label: "Available Balance", value: formatGHS(today.pendingPayout), sub: "Pending next payout", icon: <Wallet className="size-4" />, accent: "#fedfb8" },
          { label: "Success Rate", value: `${successRate}%`, sub: "Last 50 transactions", icon: <TrendingUp className="size-4" />, accent: "#a3ffe2" },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={item}
            className={cn(
              "rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 hover:shadow-lg transition-all duration-300",
              kpi.gradient 
                ? "bg-linear-to-br from-brand-teal via-[#4db5b2] to-[#2d9a97] text-white border-0" 
                : "bg-card border border-border hover:border-ring/40"
            )}>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[10px] sm:text-xs font-medium uppercase tracking-wider",
                kpi.gradient ? "text-white/90" : "text-muted-foreground"
              )}>{kpi.label}</span>
              <div className={cn(
                "size-7 sm:size-8 rounded-lg flex items-center justify-center",
                kpi.gradient ? "bg-white/20 backdrop-blur-sm" : ""
              )} style={!kpi.gradient ? { background: `${kpi.accent}18` } : {}}>
                <div className="[&>svg]:size-3.5 sm:[&>svg]:size-4" style={{ color: kpi.gradient ? "white" : kpi.accent }}>{kpi.icon}</div>
              </div>
            </div>
            <div>
              <p className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold tracking-tight",
                kpi.gradient ? "text-white" : ""
              )} style={{ fontFamily: "var(--font-heading)" }}>{kpi.value}</p>
              <p className={cn(
                "text-[10px] sm:text-xs mt-0.5",
                kpi.gradient ? "text-white/80" : "text-muted-foreground"
              )}>{kpi.sub}</p>
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
                <p className="text-base sm:text-lg md:text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{formatGHS(s.collected)}</p>
                <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <div className="flex justify-between"><span>Fees</span><span className="text-destructive">-{formatGHS(s.fees)}</span></div>
                  <div className="flex justify-between"><span>Net settled</span><span className="text-emerald-600 font-medium">{formatGHS(s.netSettled)}</span></div>
                  <div className="flex justify-between border-t border-border pt-1 mt-1"><span>Paid out</span><span className="font-semibold text-foreground">{formatGHS(s.paidOut)}</span></div>
                </div>
              </div>
            ))}
            <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-xl p-4 flex flex-col justify-between">
              <p className="text-xs text-[#1a6e6c] font-medium uppercase tracking-wider mb-2">Pending Payout</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-[#1a6e6c]" style={{ fontFamily: "var(--font-heading)" }}>
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
          className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
          <AlertCircle className="size-4 text-blue-500 shrink-0" />
          <p className="text-xs sm:text-sm text-blue-800">
            Your role (Support Agent) provides transaction search access only. Contact your account admin for financial data.
          </p>
        </motion.div>
      )}
    </div>
  );
}
