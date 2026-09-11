'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import {
  DollarSign, AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown,
  RefreshCw, Download, Plus, ChevronDown, ChevronUp, X, FileText, Flag,
  ArrowUpRight, ArrowDownLeft, Banknote, BarChart2, Check, Search, Settings, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { usePermission } from "@/hooks/use-role";
import { mockProviders } from "@/lib/mock-data";
import {
  mockPrefundRequests, mockReconciliationEntries, mockPayoutBatches, mockFeeLedger, mockFinancialReports,
} from "@/lib/treasury-mock-data";
import type { PrefundRequest, PayoutBatch, ReconciliationEntry } from "@/lib/treasury-mock-data";
import { mockChartData } from "@/lib/mock-data";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import DatePicker from "@/components/ui/date-picker";
import CustomSelect from "@/components/ui/Select";

// ── Tabs ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "prefunding" | "reconciliation" | "payouts" | "fee_ledger" | "reports";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "prefunding", label: "Settlement Prefunding" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "payouts", label: "Payout Batches" },
  { id: "fee_ledger", label: "Fee Ledger" },
  { id: "reports", label: "Reports" },
];

// ── Status helpers ──────────────────────────────────────────────────────────
const prefundStatusCfg: Record<PrefundRequest["status"], { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock       },
  approved:  { label: "Approved",  color: "bg-blue-50 text-blue-700 border-blue-200",      icon: CheckCircle },
  rejected:  { label: "Rejected",  color: "bg-red-50 text-red-700 border-red-200",         icon: XCircle     },
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Check   },
};

const batchStatusCfg: Record<PayoutBatch["status"], { label: string; color: string; icon: React.ElementType }> = {
  pending_approval: { label: "Pending Approval", color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock       },
  approved:         { label: "Approved",          color: "bg-blue-50 text-blue-700 border-blue-200",      icon: CheckCircle },
  processing:       { label: "Processing",        color: "bg-purple-50 text-purple-700 border-purple-200", icon: RefreshCw  },
  completed:        { label: "Completed",         color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Check  },
  failed:           { label: "Failed",            color: "bg-red-50 text-red-700 border-red-200",         icon: XCircle     },
  rejected:         { label: "Rejected",          color: "bg-muted text-muted-foreground border-border",  icon: XCircle     },
};

const reconcStatusCfg: Record<ReconciliationEntry["status"], { label: string; color: string; icon: React.ElementType }> = {
  balanced:    { label: "Balanced",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  discrepancy: { label: "Discrepancy", color: "bg-red-50 text-red-700 border-red-200",            icon: AlertTriangle },
  pending:     { label: "Pending",     color: "bg-amber-50 text-amber-700 border-amber-200",      icon: Clock       },
};

const reportTypeCfg = {
  reconciliation: { color: "bg-brand-navy/10 text-brand-navy", label: "Reconciliation" },
  fee_ledger:     { color: "bg-brand-teal/10 text-[#1a6e6c]", label: "Fee Ledger"     },
  payout:         { color: "bg-brand-peach/40 text-amber-700", label: "Payouts"        },
  volume:         { color: "bg-[#bcbbee]/40 text-purple-700", label: "Volume"        },
  settlement_balance:    { color: "bg-emerald-50 text-emerald-700",  label: "Settlement Balance"   },
};

// ── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, icon: Icon, trend }: {
  label: string; value: string; sub: string; color: string; icon: React.ElementType; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
      <div className="flex items-center justify-between">
        <div className="size-8 sm:size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
          <Icon className="size-3.5 sm:size-4" style={{ color }} />
        </div>
        {trend && (
          <span className={cn("text-[10px] sm:text-[11px] font-medium flex items-center gap-0.5",
            trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-muted-foreground")}>
            {trend === "up" ? <TrendingUp className="size-2.5 sm:size-3" /> : <TrendingDown className="size-2.5 sm:size-3" />}
            <span className="hidden sm:inline">vs yesterday</span>
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ── Settlement Balance Bar ───────────────────────────────────────
function SettlementBalanceBar({ balance, threshold }: { balance: number; threshold: number }) {
  const pct = Math.min((balance / (threshold * 4)) * 100, 100);
  const thresholdPct = Math.min((threshold / (threshold * 4)) * 100, 100);
  const isWarning = balance < threshold * 1.5;
  const isCritical = balance < threshold;
  return (
    <div className="mt-2">
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", isCritical ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-brand-teal")}
          style={{ width: `${pct}%` }}
        />
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
          style={{ left: `${thresholdPct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{formatGHS(balance)}</span>
        <span className="text-[10px] text-muted-foreground">Threshold: {formatGHS(threshold)}</span>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function TreasuryPage() {
  const canApprove = usePermission("treasury.approve");
  const canView    = usePermission("treasury.view");

  const [tab, setTab] = useState<Tab>("overview");
  const [expandedReconc, setExpandedReconc] = useState<string | null>(null);
  const [approvalModal, setApprovalModal] = useState<{ type: "prefund" | "payout"; id: string; action: "approve" | "reject" } | null>(null);
  const [showPrefundModal, setShowPrefundModal] = useState(false);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState<ReconciliationEntry | null>(null);
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [approvalNote, setApprovalNote] = useState("");
  
  // Export modal state (PD-027)
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [exportReportType, setExportReportType] = useState("");
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const [prefundProviderId, setPrefundProviderId] = useState("");
  
  // Report generation modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<string>("");
  const [reportName, setReportName] = useState("");
  const [reportDateFrom, setReportDateFrom] = useState("");
  const [reportDateTo, setReportDateTo] = useState("");
  const [reportFormat, setReportFormat] = useState<"pdf" | "csv">("pdf");
  
  const { showToast } = useToast();

  // Threshold configuration state
  const [thresholds, setThresholds] = useState({
    mtn: { warning: 150000, critical: 100000 },
    vodafone: { warning: 120000, critical: 80000 },
    airteltigo: { warning: 100000, critical: 60000 },
    gip: { warning: 80000, critical: 50000 },
  });

  // Discrepancy flag state
  const [flagNote, setFlagNote] = useState("");

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <DollarSign className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Treasury & Finance is available to Finance and Super Admin roles only.</p>
      </div>
    );
  }

  const totalSettlementBalance = mockProviders.reduce((s, p) => s + p.settlementBalance, 0);
  const pendingPrefunds = mockPrefundRequests.filter((p) => p.status === "pending").length;
  const pendingBatches  = mockPayoutBatches.filter((b) => b.status === "pending_approval").length;
  const totalFees       = mockFeeLedger.reduce((s, e) => s + e.feeAmount, 0);
  const discrepancies   = mockReconciliationEntries.filter((r) => r.status === "discrepancy").length;

  const filteredLedger  = mockFeeLedger.filter((e) =>
    !ledgerSearch || e.merchantName.toLowerCase().includes(ledgerSearch.toLowerCase()) || e.ref.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-card/50 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Treasury & Finance
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              <span className="hidden sm:inline">Settlement balance monitoring · Reconciliation · Payouts · Fee Ledger</span>
              <span className="sm:hidden">Balance · Reconciliation · Payouts</span>
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {canApprove && pendingPrefunds > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[10px] sm:text-xs font-medium whitespace-nowrap">
                <Clock className="size-3" />
                {pendingPrefunds} prefund{pendingPrefunds > 1 ? "s" : ""}
              </span>
            )}
            {canApprove && pendingBatches > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[10px] sm:text-xs font-medium whitespace-nowrap">
                <Clock className="size-3" />
                {pendingBatches} batch{pendingBatches > 1 ? "es" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mx-2 px-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-3 sm:px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all shrink-0",
                tab === t.id ? "bg-card shadow-sm border border-border text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.replace("Settlement ", "").replace(" Ledger", "")}</span>
              {t.id === "prefunding" && pendingPrefunds > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[9px] font-bold">{pendingPrefunds}</span>
              )}
              {t.id === "payouts" && pendingBatches > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[9px] font-bold">{pendingBatches}</span>
              )}
              {t.id === "reconciliation" && discrepancies > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold">{discrepancies}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-4">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard key="settlement" label="UMB Settlement Balance" value={formatGHS(totalSettlementBalance)} sub="Universal Merchant Bank" color="#64c6c3" icon={Banknote} trend="up" />
              <KpiCard key="volume" label="Today's Volume" value={formatGHS(4_940_000)} sub="All transactions via UMB" color="#263b8e" icon={TrendingUp} trend="up" />
              <KpiCard key="fees" label="Total Fees (30d)" value={formatGHS(totalFees)} sub="Platform + Bank share" color="#fedfb8" icon={DollarSign} trend="neutral" />
              <KpiCard key="discrepancies" label="Discrepancies" value={String(discrepancies)} sub="Active reconciliation flags" color={discrepancies > 0 ? "#ef4444" : "#64c6c3"} icon={AlertTriangle} />
            </div>

            {/* Settlement Balance card */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>UMB Settlement Balance</h2>
                {canApprove && (
                  <button
                    onClick={() => setShowThresholdModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted/50 transition-all"
                  >
                    <Settings className="size-3" /> Configure Thresholds
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {mockProviders.map((p) => {
                  const isCritical = p.balanceStatus === "critical";
                  const isWarning  = p.balanceStatus === "warning";
                  return (
                    <div key={p.id} className={cn("bg-card border rounded-2xl p-4", isCritical ? "border-red-200" : isWarning ? "border-amber-200" : "border-border")}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground font-mono">{p.shortCode}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          isCritical ? "bg-red-50 text-red-700" : isWarning ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700")}>
                          {p.balanceStatus}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-0.5">{p.name}</p>
                      <SettlementBalanceBar balance={p.settlementBalance} threshold={p.balanceThreshold} />
                      {(isCritical || isWarning) && canApprove && (
                        <button
                          onClick={() => { setShowPrefundModal(true); }}
                          className="mt-2.5 w-full py-1.5 rounded-lg text-[11px] font-medium border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all">
                          Request Prefund
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7-day volume chart */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>7-Day Transaction Volume</h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#263b8e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#263b8e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => typeof v === "number" ? formatGHS(v) : v} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="volume" stroke="#263b8e" strokeWidth={2} fill="url(#volGrad)" name="Volume" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Fee split bar */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Daily Fee Split (Bank vs Platform)</h2>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={mockChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="successful" name="Bank Share (1%)" fill="#64c6c3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" name="Platform Share (0.5%)" fill="#263b8e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── Float Utilization Report (PD-026) ── */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    Float Utilization Report
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    <span className="hidden sm:inline">Prefunded float amount, daily average utilization, and peak usage for UMB settlement account</span>
                    <span className="sm:hidden">Float usage for UMB settlement</span>
                  </p>
                </div>
                <BarChart2 className="size-6 sm:size-8 text-brand-teal shrink-0" />
              </div>

              {/* UMB Float Card */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {[
                  {
                    provider: "Universal Merchant Bank",
                    shortCode: "UMB",
                    color: "#64c6c3",
                    prefundedAmount: 4_500_000,
                    dailyAvgUtilization: 3_200_000,
                    peakUtilization: 4_100_000,
                    idleFloat: 400_000,
                    lastPrefund: new Date(Date.now() - 3 * 86400000),
                  },
                ].map((provider) => {
                    const utilizationPercent = (provider.dailyAvgUtilization / provider.prefundedAmount) * 100;
                    const peakPercent = (provider.peakUtilization / provider.prefundedAmount) * 100;
                    const idlePercent = (provider.idleFloat / provider.prefundedAmount) * 100;

                    return (
                      <div key={provider.shortCode} className="border border-border rounded-xl p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="size-10 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                              style={{ backgroundColor: provider.color }}
                            >
                              {provider.shortCode}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold">{provider.provider}</h3>
                              <p className="text-xs text-muted-foreground">
                                Last prefund: {formatDate(provider.lastPrefund)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Prefunded Amount */}
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Prefunded Float Amount</p>
                          <p className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                            {formatGHS(provider.prefundedAmount)}
                          </p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-1 text-[10px] sm:text-xs">Avg Daily</p>
                            <p className="font-bold text-xs sm:text-sm">{formatGHS(provider.dailyAvgUtilization)}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {utilizationPercent.toFixed(0)}% used
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1 text-[10px] sm:text-xs">Peak Usage</p>
                            <p className="font-bold text-xs sm:text-sm">{formatGHS(provider.peakUtilization)}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {peakPercent.toFixed(0)}% peak
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1 text-[10px] sm:text-xs">Idle Float</p>
                            <p className="font-bold text-xs sm:text-sm">{formatGHS(provider.idleFloat)}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {idlePercent.toFixed(0)}% idle
                            </p>
                          </div>
                        </div>

                        {/* Utilization Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Average Utilization</span>
                            <span className="font-semibold">{utilizationPercent.toFixed(1)}%</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                            {/* Average utilization */}
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all"
                              style={{
                                width: `${utilizationPercent}%`,
                                backgroundColor: provider.color,
                                opacity: 0.6,
                              }}
                            />
                            {/* Peak marker */}
                            <div
                              className="absolute inset-y-0 w-0.5 transition-all"
                              style={{
                                left: `${peakPercent}%`,
                                backgroundColor: provider.color,
                              }}
                              title={`Peak: ${peakPercent.toFixed(1)}%`}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                            <span>0%</span>
                            <span>Peak at {peakPercent.toFixed(0)}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Health Indicator */}
                        {(() => {
                          if (utilizationPercent > 90) {
                            return (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                                <AlertTriangle className="size-4 text-red-600 shrink-0" />
                                <p className="text-xs text-red-700">
                                  High utilization — consider increasing prefund
                                </p>
                              </div>
                            );
                          } else if (idlePercent > 30) {
                            return (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-2">
                                <Info className="size-4 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-700">
                                  High idle float — consider reducing prefund
                                </p>
                              </div>
                            );
                          } else {
                            return (
                              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-2">
                                <CheckCircle className="size-4 text-emerald-600 shrink-0" />
                                <p className="text-xs text-emerald-700">
                                  Optimal utilization range
                                </p>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    );
                  })}
              </div>

              {/* Summary Stats */}
              <div className="pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Prefunded</p>
                  <p className="text-base sm:text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {formatGHS(4_500_000)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Avg Daily Usage</p>
                  <p className="text-base sm:text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {formatGHS(3_200_000)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Peak Usage</p>
                  <p className="text-base sm:text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {formatGHS(4_100_000)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Idle Float</p>
                  <p className="text-base sm:text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {formatGHS(400_000)}
                  </p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <Info className="size-4 sm:size-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Float Optimization</p>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Optimal utilization is 60-85%. <span className="hidden sm:inline">High utilization indicates potential shortages. High idle float suggests over-prefunding. 
                    Review weekly and adjust prefund amounts accordingly.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTLEMENT PREFUNDING ── */}
        {tab === "prefunding" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">Track and approve UMB settlement prefunding requests.</p>
              {canApprove && (
                <button onClick={() => setShowPrefundModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0">
                  <Plus className="size-4" /> New Request
                </button>
              )}
            </div>

            {/* Prefund request cards */}
            <div className="space-y-3">
              {mockPrefundRequests.map((req) => {
                const cfg = prefundStatusCfg[req.status];
                const Icon = cfg.icon;
                const isPending = req.status === "pending";
                return (
                  <div key={req.id} className={cn("bg-card border rounded-2xl p-4 sm:p-5", isPending && canApprove ? "border-amber-200/60 shadow-sm" : "border-border")}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="size-8 sm:size-9 rounded-xl bg-brand-navy/10 flex items-center justify-center shrink-0">
                          <Banknote className="size-3.5 sm:size-4 text-brand-navy" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="font-semibold text-xs sm:text-sm truncate">{req.provider}</p>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0", cfg.color)}>
                              <Icon className="size-2.5" />{cfg.label}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            <span className="hidden sm:inline">Requested by </span><span className="text-foreground font-medium">{req.requestedBy}</span> · {formatDate(req.requestedAt)}
                          </p>
                          {req.approvedBy && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {req.status === "rejected" ? "Rejected" : "Approved"} by <span className="text-foreground font-medium">{req.approvedBy}</span>
                              {req.approvedAt ? ` · ${formatDate(req.approvedAt)}` : ""}
                            </p>
                          )}
                          {req.notes && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 italic line-clamp-2">"{req.notes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                        <p className="text-base sm:text-lg font-bold text-brand-navy" style={{ fontFamily: "var(--font-heading)" }}>{formatGHS(req.amount)}</p>
                        {isPending && canApprove && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setApprovalModal({ type: "prefund", id: req.id, action: "reject" })}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-[10px] sm:text-xs font-medium hover:bg-red-50 transition-all">
                              Reject
                            </button>
                            <button
                              onClick={() => setApprovalModal({ type: "prefund", id: req.id, action: "approve" })}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-brand-navy hover:bg-[#1e2f72] text-white text-[10px] sm:text-xs font-medium transition-all">
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RECONCILIATION ── */}
        {tab === "reconciliation" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="hidden sm:inline">Daily provider reconciliation. Discrepancies are flagged for investigation.</span>
                <span className="sm:hidden">Daily reconciliation & discrepancies</span>
              </p>
              <button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-medium hover:bg-muted/50 transition-all shrink-0"
              >
                <Download className="size-3.5" /> Export
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-200">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Date", "Provider", "Collections", "Payouts", "Fees", "Status", ""].map((h, idx) => (
                        <th key={`reconc-header-${idx}`} className="text-left px-3 sm:px-4 py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-4 sm:first:pl-5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                  {mockReconciliationEntries.map((entry) => {
                    const cfg = reconcStatusCfg[entry.status];
                    const Icon = cfg.icon;
                    const isExpanded = expandedReconc === entry.id;
                    const collDiff = entry.actualCollections - entry.expectedCollections;
                    return (
                      <>
                        <tr key={entry.id} className={cn("border-b border-border/50 last:border-0 transition-colors",
                          entry.status === "discrepancy" ? "bg-red-50/30" : "hover:bg-muted/20")}>
                          <td className="pl-5 pr-4 py-3.5 text-sm font-medium">{entry.date}</td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded font-mono bg-muted/60">{entry.provider}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm font-medium">{formatGHS(entry.actualCollections)}</p>
                            {collDiff !== 0 && (
                              <p className={cn("text-[10px] font-medium", collDiff < 0 ? "text-red-500" : "text-emerald-500")}>
                                {collDiff < 0 ? "−" : "+"}{formatGHS(Math.abs(collDiff))}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-sm">{formatGHS(entry.actualPayouts)}</td>
                          <td className="px-4 py-3.5 text-sm">{formatGHS(entry.actualFees)}</td>
                          <td className="px-4 py-3.5">
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", cfg.color)}>
                              <Icon className="size-2.5" />{cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {entry.status === "discrepancy" && (
                              <button onClick={() => setExpandedReconc(isExpanded ? null : entry.id)}
                                className="flex items-center gap-1 text-xs text-brand-navy hover:underline">
                                Details {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                              </button>
                            )}
                          </td>
                        </tr>
                        {isExpanded && entry.status === "discrepancy" && (
                          <tr key={`${entry.id}-exp`} className="bg-red-50/50 border-b border-red-100">
                            <td colSpan={7} className="px-5 py-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                                  <div className="space-y-1">
                                    <p className="text-sm font-semibold text-red-700">
                                      Discrepancy: {entry.discrepancyAmount !== undefined ? formatGHS(entry.discrepancyAmount) : "—"}
                                    </p>
                                    <p className="text-sm text-red-600">{entry.discrepancyCause}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <p className="text-xs text-muted-foreground">Expected: {formatGHS(entry.expectedCollections)}</p>
                                      <span className="text-muted-foreground">·</span>
                                      <p className="text-xs text-muted-foreground">Actual: {formatGHS(entry.actualCollections)}</p>
                                    </div>
                                  </div>
                                </div>
                                {canApprove && (
                                  <button
                                    onClick={() => setShowFlagModal(entry)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-all shrink-0"
                                  >
                                    <Flag className="size-3.5" /> Flag for Investigation
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PAYOUT BATCHES ── */}
        {tab === "payouts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground">Review and approve merchant payout batches.</p>
            </div>

            <div className="space-y-3">
              {mockPayoutBatches.map((batch) => {
                const cfg = batchStatusCfg[batch.status];
                const Icon = cfg.icon;
                const isPending = batch.status === "pending_approval";
                return (
                  <div key={batch.id} className={cn("bg-card border rounded-2xl p-4 sm:p-5", isPending && canApprove ? "border-amber-200/60 shadow-sm" : "border-border")}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="size-8 sm:size-9 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                          <ArrowUpRight className="size-3.5 sm:size-4 text-[#1a6e6c]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="font-semibold text-xs sm:text-sm font-mono truncate">{batch.batchRef}</p>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0", cfg.color)}>
                              <Icon className="size-2.5" />{cfg.label}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-mono shrink-0">{batch.provider}</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{batch.merchantName}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                            {batch.payoutCount} payouts · Created {formatDate(batch.createdAt)}
                          </p>
                          {batch.failedCount && (
                            <p className="text-[10px] sm:text-xs text-red-600 font-medium mt-0.5">
                              {batch.failedCount} failed payouts — requires review
                            </p>
                          )}
                          {batch.approvedBy && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                              Approved by {batch.approvedBy}{batch.approvedAt ? ` · ${formatDate(batch.approvedAt)}` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                        <p className="text-base sm:text-lg font-bold text-brand-navy" style={{ fontFamily: "var(--font-heading)" }}>
                          {formatGHS(batch.totalAmount)}
                        </p>
                        {isPending && canApprove && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setApprovalModal({ type: "payout", id: batch.id, action: "reject" })}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-[10px] sm:text-xs font-medium hover:bg-red-50 transition-all">
                              Reject
                            </button>
                            <button
                              onClick={() => setApprovalModal({ type: "payout", id: batch.id, action: "approve" })}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-brand-navy hover:bg-[#1e2f72] text-white text-[10px] sm:text-xs font-medium transition-all">
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FEE LEDGER ── */}
        {tab === "fee_ledger" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input value={ledgerSearch} onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder="Search merchant or ref…"
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-teal/60 transition-all" />
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total fees shown</p>
                  <p className="text-xs sm:text-sm font-bold text-brand-navy">{formatGHS(filteredLedger.reduce((s, e) => s + e.feeAmount, 0))}</p>
                </div>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-medium hover:bg-muted/50 transition-all shrink-0"
                >
                  <Download className="size-3.5" /> Export
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-250">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Date", "Merchant", "Channel", "Type", "Tx Amount", "Rate", "Fee", "Bank Share", "Platform Share", "Ref"].map((h, idx) => (
                      <th key={`ledger-header-${idx}`} className="text-left px-2 sm:px-3 py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-4 sm:first:pl-5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLedger.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="pl-4 sm:pl-5 pr-2 sm:pr-3 py-3 text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{formatDate(entry.date)}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs font-medium max-w-35 truncate">{entry.merchantName}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs">{entry.channel}</td>
                      <td className="px-2 sm:px-3 py-3">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium",
                          entry.transactionType === "collection" ? "bg-brand-teal/10 text-[#1a6e6c]" : "bg-brand-peach/40 text-amber-700")}>
                          {entry.transactionType === "collection" ? <ArrowDownLeft className="size-2.5" /> : <ArrowUpRight className="size-2.5" />}
                          <span className="hidden sm:inline">{entry.transactionType}</span>
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs font-medium">{formatGHS(entry.transactionAmount)}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs font-mono text-brand-navy font-bold">{entry.feeRate}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs font-semibold">{formatGHS(entry.feeAmount)}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs text-muted-foreground">{formatGHS(entry.bankShare)}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs text-muted-foreground">{formatGHS(entry.platformShare)}</td>
                      <td className="px-2 sm:px-3 py-3 text-[10px] sm:text-xs font-mono text-muted-foreground truncate max-w-20">{entry.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {tab === "reports" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">Generate and download financial reports.</p>
              {canApprove && (
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0"
                >
                  <Plus className="size-4" /> Generate Report
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockFinancialReports.map((report) => {
                const typeCfg = reportTypeCfg[report.type];
                return (
                  <div key={report.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-sm transition-all">
                    <div className={cn("size-9 sm:size-10 rounded-xl flex items-center justify-center shrink-0", typeCfg.color)}>
                      <FileText className="size-3.5 sm:size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs sm:text-sm truncate">{report.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2">{report.description}</p>
                        </div>
                        <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted/50 transition-all shrink-0">
                          <Download className="size-3" /> {report.size}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mt-2.5 flex-wrap">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", typeCfg.color)}>{typeCfg.label}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{report.period}</span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(report.generatedAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick-generate row */}
            <div className="bg-muted/30 border border-border rounded-2xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Quick Generate</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {(["reconciliation", "fee_ledger", "payout", "volume", "settlement_balance"] as const).map((t) => {
                  const cfg = reportTypeCfg[t];
                  return (
                    <button 
                      key={t}
                      onClick={() => {
                        setReportType(t);
                        setReportName(`${cfg.label} Report`);
                        setShowReportModal(true);
                      }}
                      className={cn("flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border text-xs font-medium transition-all hover:shadow-sm", cfg.color, "bg-card hover:bg-muted/30")}
                    >
                      <BarChart2 className="size-4" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Approval modal ── */}
      <AnimatePresence>
        {approvalModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm"
            onClick={() => { setApprovalModal(null); setApprovalNote(""); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className={cn("size-10 sm:size-11 rounded-xl flex items-center justify-center mb-3 sm:mb-4 border",
                approvalModal.action === "approve" ? "bg-brand-navy/10 border-brand-navy/20" : "bg-red-50 border-red-200")}>
                {approvalModal.action === "approve" ? <CheckCircle className="size-4 sm:size-5 text-brand-navy" /> : <XCircle className="size-4 sm:size-5 text-red-500" />}
              </div>
              <h2 className="font-bold text-base sm:text-lg mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                {approvalModal.action === "approve" ? "Approve" : "Reject"} {approvalModal.type === "prefund" ? "Prefund Request" : "Payout Batch"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">
                {approvalModal.action === "approve"
                  ? "This action will be logged with your identity."
                  : "A rejection note is required. The requester will be notified."}
              </p>
              <div className="mb-4 sm:mb-5">
                <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Note {approvalModal.action === "reject" && <span className="text-destructive">*</span>}
                </label>
                <textarea rows={2} value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder={approvalModal.action === "approve" ? "Optional note…" : "Reason for rejection…"}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 border border-border rounded-xl bg-background outline-none resize-none focus:border-brand-teal/60 transition-all" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button onClick={() => { setApprovalModal(null); setApprovalNote(""); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1">
                  Cancel
                </button>
                <button
                  disabled={approvalModal.action === "reject" && !approvalNote.trim()}
                  onClick={() => {
                    const isApprove = approvalModal.action === "approve";
                    const type = approvalModal.type === "prefund" ? "Prefund Request" : "Payout Batch";
                    if (isApprove) {
                      showToast("success", `${type} Approved`, "The request has been approved and will be processed.");
                    } else {
                      showToast("warning", `${type} Rejected`, "The requester has been notified.");
                    }
                    setApprovalModal(null);
                    setApprovalNote("");
                  }}
                  className={cn("flex-1 px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-2",
                    approvalModal.action === "approve" ? "bg-brand-navy hover:bg-[#1e2f72]" : "bg-destructive hover:opacity-90")}>
                  {approvalModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── New Prefund Request modal ── */}
      <AnimatePresence>
        {showPrefundModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm"
            onClick={() => setShowPrefundModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4 sm:mb-5 gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base sm:text-lg truncate" style={{ fontFamily: "var(--font-heading)" }}>Request Settlement Prefund</h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">This will be submitted for Finance approval.</p>
                </div>
                <button onClick={() => setShowPrefundModal(false)} className="p-1.5 rounded-lg hover:bg-muted/60 shrink-0"><X className="size-4" /></button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Provider</label>
                  <CustomSelect
                    value={prefundProviderId}
                    onChange={setPrefundProviderId}
                    options={mockProviders.map((p) => ({
                      value: p.id,
                      label: `${p.name} — ${formatGHS(p.settlementBalance)} current`
                    }))}
                    placeholder="Select provider..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Amount (GHS)</label>
                  <input type="number" placeholder="e.g. 500000"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-teal/60 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Justification</label>
                  <textarea rows={3} placeholder="Why is this prefund needed?"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 border border-border rounded-xl bg-background outline-none resize-none focus:border-brand-teal/60 transition-all" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
                <button onClick={() => setShowPrefundModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1">Cancel</button>
                <button onClick={() => {
                  showToast("success", "Prefund Request Submitted", "Your request has been submitted for approval.");
                  setShowPrefundModal(false);
                }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-[#1e2f72] text-white text-xs sm:text-sm font-medium transition-all order-1 sm:order-2">Submit Request</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Settlement Balance Threshold Configuration Modal ── */}
      <Modal
        isOpen={showThresholdModal}
        onClose={() => setShowThresholdModal(false)}
        title="Configure Balance Alert Thresholds"
        description="Set warning and critical balance levels for UMB settlement account"
        size="lg"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Automated Alerts</p>
              <p className="text-sm text-blue-700">
                When balances drop below these thresholds, the system will send email/SMS alerts to Finance team members.
              </p>
            </div>
          </div>

          {/* Provider Thresholds */}
          <div className="space-y-4">
            {Object.entries(thresholds).map(([provider, values]) => {
              const providerName = provider.toUpperCase();
              return (
                <div key={provider} className="border border-border rounded-xl p-4">
                  <h3 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    {providerName}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Warning Level (GHS)" required description="Amber alert">
                      <Input
                        type="number"
                        step="1000"
                        value={values.warning}
                        onChange={(e) => setThresholds({
                          ...thresholds,
                          [provider]: { ...values, warning: parseInt(e.target.value) }
                        })}
                        placeholder="150000"
                      />
                    </FormField>
                    <FormField label="Critical Level (GHS)" required description="Red alert">
                      <Input
                        type="number"
                        step="1000"
                        value={values.critical}
                        onChange={(e) => setThresholds({
                          ...thresholds,
                          [provider]: { ...values, critical: parseInt(e.target.value) }
                        })}
                        placeholder="100000"
                      />
                    </FormField>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setShowThresholdModal(false)}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast("success", "Thresholds Updated", "Balance alert thresholds have been saved.");
                setShowThresholdModal(false);
              }}
              className="flex-1 px-4 py-2.5 bg-brand-teal hover:bg-[#52a8a5] text-white rounded-xl text-sm font-medium transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Flag Discrepancy Modal ── */}
      <Modal
        isOpen={showFlagModal !== null}
        onClose={() => {
          setShowFlagModal(null);
          setFlagNote("");
        }}
        title="Flag Reconciliation Discrepancy"
        description={showFlagModal ? `${showFlagModal.provider} - ${showFlagModal.date}` : ""}
        size="md"
      >
        <div className="space-y-6">
          {showFlagModal && (
            <>
              {/* Discrepancy Summary */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-5 text-red-600" />
                  <p className="text-sm font-semibold text-red-900">
                    Discrepancy: {formatGHS(showFlagModal.discrepancyAmount || 0)}
                  </p>
                </div>
                <p className="text-sm text-red-700">{showFlagModal.discrepancyCause}</p>
                <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                  <div>
                    <span className="text-red-600">Expected:</span>
                    <p className="font-semibold text-red-900">{formatGHS(showFlagModal.expectedCollections)}</p>
                  </div>
                  <div>
                    <span className="text-red-600">Actual:</span>
                    <p className="font-semibold text-red-900">{formatGHS(showFlagModal.actualCollections)}</p>
                  </div>
                </div>
              </div>

              {/* Investigation Note */}
              <FormField
                label="Investigation Notes"
                required
                description="Document the issue and planned resolution steps"
              >
                <Textarea
                  rows={4}
                  value={flagNote}
                  onChange={(e) => setFlagNote(e.target.value)}
                  placeholder="Describe the discrepancy cause, investigation steps, and expected resolution timeline..."
                />
              </FormField>

              {/* Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  This will create a tracked investigation case. You'll need to coordinate with the provider's back-office team within their dispute window.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    setShowFlagModal(null);
                    setFlagNote("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={!flagNote.trim()}
                  onClick={() => {
                    showToast("warning", "Discrepancy Flagged", "Investigation case created and assigned to your team.");
                    setShowFlagModal(null);
                    setFlagNote("");
                  }}
                  className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Flag for Investigation
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* ── Export Modal (PD-027) ── */}
      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportFormat("csv");
          setExportReportType("");
          setExportDateFrom("");
          setExportDateTo("");
        }}
        title="Export Financial Data"
        description="Download reports in CSV or PDF format"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FileText className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Data Export</p>
              <p className="text-sm text-blue-700">
                Export financial records for accounting, audits, or analysis. Large date ranges may take longer to generate.
              </p>
            </div>
          </div>

          {/* Format Selection */}
          <FormField
            label="Export Format"
            required
            description="Choose file format"
          >
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat("csv")}
                className={cn(
                  "flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all",
                  exportFormat === "csv"
                    ? "border-brand-teal bg-brand-teal/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">CSV</p>
                  <p className="text-xs text-muted-foreground">Spreadsheet format</p>
                </div>
                {exportFormat === "csv" && <Check className="size-4 text-brand-teal ml-auto" />}
              </button>
              <button
                onClick={() => setExportFormat("pdf")}
                className={cn(
                  "flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all",
                  exportFormat === "pdf"
                    ? "border-brand-navy bg-brand-navy/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">PDF</p>
                  <p className="text-xs text-muted-foreground">Print-ready report</p>
                </div>
                {exportFormat === "pdf" && <Check className="size-4 text-brand-navy ml-auto" />}
              </button>
            </div>
          </FormField>

          {/* Report Type */}
          <FormField
            label="Report Type"
            required
            description="Select data to export"
          >
            <CustomSelect
              value={exportReportType}
              onChange={setExportReportType}
              options={[
                { value: "financial", label: "Financial Summary Report" },
                { value: "fee_ledger", label: "Fee Ledger (All Transactions)" },
                { value: "reconciliation", label: "Reconciliation Records" },
                { value: "float_utilization", label: "Float Utilization Report" },
                { value: "payout_history", label: "Payout Batch History" },
                { value: "prefund_requests", label: "Settlement Prefunding Requests" },
              ]}
              placeholder="Select report type..."
            />
          </FormField>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              required
              description="From date"
            >
              <DatePicker
                value={exportDateFrom}
                onChange={setExportDateFrom}
                placeholder="Select start date"
                max={exportDateTo || undefined}
              />
            </FormField>
            <FormField
              label="End Date"
              required
              description="To date"
            >
              <DatePicker
                value={exportDateTo}
                onChange={setExportDateTo}
                placeholder="Select end date"
                min={exportDateFrom || undefined}
              />
            </FormField>
          </div>

          {/* Warning for large exports */}
          {exportDateFrom && exportDateTo && (
            (() => {
              const daysDiff = Math.ceil(
                (new Date(exportDateTo).getTime() - new Date(exportDateFrom).getTime()) / 86400000
              );
              if (daysDiff > 90) {
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      Large date range selected ({daysDiff} days). Export may take several minutes to generate.
                    </p>
                  </div>
                );
              }
              return null;
            })()
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowExportModal(false);
                setExportFormat("csv");
                setExportReportType("");
                setExportDateFrom("");
                setExportDateTo("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!exportReportType || !exportDateFrom || !exportDateTo}
              onClick={() => {
                const reportLabels: Record<string, string> = {
                  financial: "Financial Summary",
                  fee_ledger: "Fee Ledger",
                  reconciliation: "Reconciliation",
                  float_utilization: "Float Utilization",
                  payout_history: "Payout History",
                  prefund_requests: "Prefunding Requests",
                };
                showToast(
                  "success",
                  "Export Started",
                  `${reportLabels[exportReportType]} (${exportFormat.toUpperCase()}) is being generated. Download will start shortly.`
                );
                setShowExportModal(false);
                setExportFormat("csv");
                setExportReportType("");
                setExportDateFrom("");
                setExportDateTo("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="size-4" />
              Generate Export
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Report Generation Modal ── */}
      <Modal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportType("");
          setReportName("");
          setReportDateFrom("");
          setReportDateTo("");
          setReportFormat("pdf");
        }}
        title="Generate Financial Report"
        description="Create custom financial reports with specific parameters"
        size="md"
      >
        <div className="space-y-4">
          {/* Report Type */}
          <FormField
            label="Report Type"
            required
            description="Select the type of report to generate"
          >
            <CustomSelect
              value={reportType}
              onChange={setReportType}
              options={[
                { value: "reconciliation", label: "Reconciliation Report" },
                { value: "fee_ledger", label: "Fee Ledger Report" },
                { value: "payout", label: "Payout Report" },
                { value: "volume", label: "Transaction Volume Report" },
                { value: "nsp_balance", label: "Settlement Balance Report" },
                { value: "financial_summary", label: "Financial Summary Report" },
                { value: "custom", label: "Custom Report" },
              ]}
              placeholder="Select report type..."
            />
          </FormField>

          {/* Report Name */}
          <FormField
            label="Report Name"
            required
            description="Give this report a descriptive name"
          >
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g., Monthly Reconciliation Report"
            />
          </FormField>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              required
              description="Report start date"
            >
              <DatePicker
                value={reportDateFrom}
                onChange={setReportDateFrom}
                placeholder="Select start date"
                max={reportDateTo || undefined}
              />
            </FormField>
            <FormField
              label="End Date"
              required
              description="Report end date"
            >
              <DatePicker
                value={reportDateTo}
                onChange={setReportDateTo}
                placeholder="Select end date"
                min={reportDateFrom || undefined}
              />
            </FormField>
          </div>

          {/* Format Selection */}
          <FormField
            label="Output Format"
            required
            description="Choose report format"
          >
            <CustomSelect
              value={reportFormat}
              onChange={(v) => setReportFormat(v as "pdf" | "csv")}
              options={[
                { value: "pdf", label: "PDF Document" },
                { value: "csv", label: "CSV Spreadsheet" },
              ]}
              placeholder="Select format..."
            />
          </FormField>

          {/* Info Note */}
          {reportType && reportDateFrom && reportDateTo && (
            <div className="bg-brand-navy/5 border border-brand-navy/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="size-5 text-brand-navy shrink-0 mt-0.5" />
              <div className="text-sm text-brand-navy">
                <p className="font-medium mb-1">Report Preview</p>
                <p className="text-xs opacity-80">
                  {reportName || "Unnamed Report"} • {reportTypeCfg[reportType as keyof typeof reportTypeCfg]?.label || reportType} • {reportFormat.toUpperCase()}
                  <br />
                  Period: {new Date(reportDateFrom).toLocaleDateString()} - {new Date(reportDateTo).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowReportModal(false);
                setReportType("");
                setReportName("");
                setReportDateFrom("");
                setReportDateTo("");
                setReportFormat("pdf");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!reportType || !reportName || !reportDateFrom || !reportDateTo}
              onClick={() => {
                showToast(
                  "success",
                  "Report Generation Started",
                  `${reportName} is being generated as ${reportFormat.toUpperCase()}. It will appear in the reports list once complete.`
                );
                setShowReportModal(false);
                setReportType("");
                setReportName("");
                setReportDateFrom("");
                setReportDateTo("");
                setReportFormat("pdf");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FileText className="size-4" />
              Generate Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
