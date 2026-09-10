'use client';

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import { formatGHS, formatDate } from "@/lib/constants";
import { smTransactions, smChartData, smPayouts } from "@/lib/sub-merchant-mock-data";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";
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
};

const statusBadge = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function SubMerchantOverviewPage() {
  const { can, role } = useSubMerchantRole();
  const [showViewerBanner, setShowViewerBanner] = useState(false);
  
  // Show viewer banner for Viewer role (check session storage to see if dismissed)
  useEffect(() => {
    if (role === "sub_viewer") {
      const dismissed = sessionStorage.getItem("viewer-banner-dismissed");
      if (!dismissed) {
        setShowViewerBanner(true);
      }
    }
  }, [role]);

  const dismissViewerBanner = () => {
    setShowViewerBanner(false);
    sessionStorage.setItem("viewer-banner-dismissed", "true");
  };
  
  // Calculate metrics
  const recentTxns = smTransactions.slice(0, 10);
  const successCount = smTransactions.filter((t) => t.status === "success").length;
  const successRate = Math.round((successCount / smTransactions.length) * 100);
  
  const todayCollections = smTransactions
    .filter(t => t.type === "collection" && t.date.includes("2026-09-01"))
    .reduce((sum, t) => sum + t.grossAmount, 0);
  
  const todayCollectionsCount = smTransactions
    .filter(t => t.type === "collection" && t.date.includes("2026-09-01"))
    .length;
  
  const availableBalance = smPayouts[0]?.net || 0;

  return (
    <div className="px-6 py-6 space-y-4 pb-24 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Good morning, Kofi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with <span className="font-medium text-foreground">Kofi Craft Ghana</span> today.
        </p>
      </motion.div>

      {/* Viewer Mode Banner */}
      {showViewerBanner && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3"
        >
          <div className="size-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
            <Eye className="size-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-800">You're in Viewer mode</p>
            <p className="text-xs text-blue-600 mt-1">
              You have read-only access to view transactions, settlements, and reports. You cannot raise disputes, manage team members, or change settings. Contact your admin for elevated permissions.
            </p>
          </div>
          <button
            onClick={dismissViewerBanner}
            className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      )}

      {/* Account Status Banner - SM-002 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <div className="size-2 rounded-full bg-emerald-400" />
        <p className="text-sm font-medium text-emerald-800">Account active · No pending actions</p>
        <span className="ml-auto text-xs text-emerald-600">Sub-merchant account</span>
      </motion.div>

      {/* KPI Cards - SM-001 */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Collections Today", 
            value: formatGHS(todayCollections), 
            sub: `${todayCollectionsCount} transactions`, 
            icon: <ArrowDownCircle className="size-4" />, 
            accent: "#64c6c3",
            gradient: true // Add gradient to Collections Today
          },
          { 
            label: "Available Balance", 
            value: formatGHS(availableBalance), 
            sub: "Last payout received", 
            icon: <Wallet className="size-4" />, 
            accent: "#bcbbee" 
          },
          { 
            label: "Success Rate", 
            value: `${successRate}%`, 
            sub: "Last 50 transactions", 
            icon: <TrendingUp className="size-4" />, 
            accent: "#64c6c3" 
          },
          { 
            label: "Total Volume", 
            value: formatGHS(197800), 
            sub: "Last 7 days", 
            icon: <TrendingUp className="size-4" />, 
            accent: "#fedfb8" 
          },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={item}
            className={cn(
              "rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300",
              kpi.gradient 
                ? "bg-linear-to-br from-brand-teal via-[#4db5b2] to-[#2d9a97] text-white border-0 hover:shadow-lg" 
                : "bg-card border border-border hover:border-ring/40"
            )}>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-wider",
                kpi.gradient ? "text-white/90" : "text-muted-foreground"
              )}>{kpi.label}</span>
              <div className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                kpi.gradient ? "bg-white/20 backdrop-blur-sm" : ""
              )} style={!kpi.gradient ? { background: `${kpi.accent}18` } : {}}>
                <div style={{ color: kpi.gradient ? "white" : kpi.accent }}>{kpi.icon}</div>
              </div>
            </div>
            <div>
              <p className={cn(
                "text-2xl font-bold mb-0.5",
                kpi.gradient ? "text-white" : ""
              )} style={{ fontFamily: "var(--font-heading)" }}>{kpi.value}</p>
              <p className={cn(
                "text-[11px]",
                kpi.gradient ? "text-white/80" : "text-muted-foreground"
              )}>{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 7-day Transaction Volume Chart - SM-001 */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          7-Day Collection Volume
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={smChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="smVolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3ffe2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a3ffe2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tickFormatter={(v: number) => `${(v / 1_000).toFixed(0)}K`} 
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              formatter={(v) => typeof v === "number" ? formatGHS(v) : v} 
              contentStyle={{ 
                background: "var(--card)", 
                border: "1px solid var(--border)", 
                borderRadius: 8, 
                fontSize: 12 
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="collections" 
              stroke="#1a7a5e" 
              strokeWidth={2} 
              fill="url(#smVolGrad)" 
              name="Collections" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Recent Transactions
          </h2>
          <a href="/sub-merchant/transactions" className="text-xs text-[#1a7a5e] hover:underline font-medium">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Reference", "Date/Time", "Amount", "Fee", "Net", "Status", "Customer"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTxns.map((txn, i) => (
                <tr key={txn.id} 
                  className={cn(
                    "border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                    i % 2 === 0 ? "" : "bg-muted/10"
                  )}
                >
                  <td className="pl-5 pr-4 py-3 font-mono text-xs">{txn.reference}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(txn.date)}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold">{formatGHS(txn.grossAmount)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatGHS(txn.fee)}</td>
                  <td className="px-4 py-3 text-xs font-medium">{formatGHS(txn.net)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "flex items-center gap-1.5 w-fit px-2 py-1 rounded-full border text-[11px] font-medium",
                      statusBadge[txn.status]
                    )}>
                      {statusIcons[txn.status]}
                      {txn.status}
                    </span>
                  </td>
                  <td className="pl-4 pr-5 py-3 text-xs text-muted-foreground">{txn.customerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
