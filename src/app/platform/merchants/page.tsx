'use client';

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Filter, Plus, ChevronRight, X, Building2, Eye, ShieldAlert,
  ShieldCheck, ShieldX, Clock, AlertTriangle, CheckCircle, Ban,
  RefreshCw, Trash2, UserCheck, ExternalLink, MoreHorizontal,
  TrendingUp, Users, ArrowLeftRight, DollarSign, Copy, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { mockMerchants } from "@/lib/mock-data";
import type { Merchant } from "@/lib/mock-data";
import { usePermission } from "@/hooks/use-role";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { FormField, Input, Select } from "@/components/ui/form-field";

// ── Extended merchant detail data ──────────────────────────────────────────
type FeeSchedule = { label: string; rate: string; cap: string };
type MerchantNote = { id: string; author: string; date: string; text: string };

const FEE_SCHEDULES: Record<string, FeeSchedule[]> = {
  m1: [
    { label: "Collections — MTN", rate: "1.20%", cap: "GHS 50" },
    { label: "Collections — Vodafone", rate: "1.30%", cap: "GHS 50" },
    { label: "Payouts", rate: "0.80%", cap: "GHS 30" },
  ],
  default: [
    { label: "Collections", rate: "1.50%", cap: "GHS 60" },
    { label: "Payouts", rate: "1.00%", cap: "GHS 40" },
  ],
};

const MERCHANT_NOTES: Record<string, MerchantNote[]> = {
  m3: [
    { id: "n1", author: "Compliance Officer", date: new Date(Date.now() - 86400000).toISOString(), text: "Account suspended pending AML review. Escalated to KYC team." },
    { id: "n2", author: "Support Lead", date: new Date(Date.now() - 172800000).toISOString(), text: "Merchant contacted by phone. Requested additional documentation." },
  ],
  m6: [
    { id: "n3", author: "Super Admin", date: new Date(Date.now() - 604800000).toISOString(), text: "Deactivated per merchant request. Settlement complete." },
  ],
};

// ── Status helpers ──────────────────────────────────────────────────────────
const statusConfig: Record<Merchant["status"], { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  suspended: { label: "Suspended", color: "bg-red-50 text-red-700 border-red-200", icon: Ban },
  pending: { label: "Pending KYC", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  deactivated: { label: "Deactivated", color: "bg-muted text-muted-foreground border-border", icon: Trash2 },
};

const complianceConfig: Record<Merchant["complianceStatus"], { label: string; color: string; icon: React.ElementType }> = {
  verified: { label: "Verified", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ShieldCheck },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200", icon: ShieldAlert },
  flagged: { label: "Flagged", color: "bg-red-50 text-red-700 border-red-200", icon: ShieldX },
  rejected: { label: "Rejected", color: "bg-muted text-muted-foreground border-border", icon: ShieldX },
};

// ── Action modal ────────────────────────────────────────────────────────────
type ActionType = "suspend" | "reactivate" | "deactivate" | "impersonate";

const ACTION_CONFIG: Record<ActionType, { title: string; desc: string; confirm: string; color: string }> = {
  suspend: {
    title: "Suspend Merchant",
    desc: "All transactions will be blocked immediately. The merchant will receive an email notification. You can reactivate at any time.",
    confirm: "Suspend",
    color: "bg-amber-600 hover:bg-amber-700",
  },
  reactivate: {
    title: "Reactivate Merchant",
    desc: "The merchant account will be restored to Active status. Transactions will be processed normally.",
    confirm: "Reactivate",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  deactivate: {
    title: "Deactivate Merchant",
    desc: "This is a permanent action. All API keys will be revoked, sub-merchants offboarded, and no further transactions processed. Settlements will be completed first.",
    confirm: "Permanently Deactivate",
    color: "bg-destructive hover:opacity-90",
  },
  impersonate: {
    title: "Impersonate Merchant",
    desc: "You will view the merchant dashboard as the merchant owner. All actions you take will be logged with your identity. This session can be ended at any time.",
    confirm: "Start Impersonation",
    color: "bg-[#263b8e] hover:bg-[#1e2f72]",
  },
};

// ── Main component ──────────────────────────────────────────────────────────
export default function MerchantsPage() {
  const canManage = usePermission("merchants.manage");
  const canImpersonate = usePermission("merchants.impersonate");
  const canViewDetails = usePermission("merchants.view");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [complianceFilter, setComplianceFilter] = useState("all");
  const [selected, setSelected] = useState<Merchant | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "fees" | "team" | "notes">("overview");
  const [actionModal, setActionModal] = useState<{ merchant: Merchant; type: ActionType } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [impersonating, setImpersonating] = useState<Merchant | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState("");
  const { showToast } = useToast();

  // Fee configuration state
  const [feeConfig, setFeeConfig] = useState({
    collectionRate: "1.50",
    collectionFloor: "0.50",
    collectionCap: "60.00",
    payoutRate: "1.00",
    payoutFloor: "0.30",
    payoutCap: "40.00",
    feeBearer: "merchant" as "merchant" | "payer",
  });

  const filtered = useMemo(() => {
    return mockMerchants.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = !search
        || m.name.toLowerCase().includes(q)
        || m.registrationNumber.toLowerCase().includes(q)
        || m.email.toLowerCase().includes(q)
        || m.industry.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      const matchCompliance = complianceFilter === "all" || m.complianceStatus === complianceFilter;
      return matchSearch && matchStatus && matchCompliance;
    });
  }, [search, statusFilter, complianceFilter]);

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fees = selected ? (FEE_SCHEDULES[selected.id] ?? FEE_SCHEDULES.default) : [];
  const notes = selected ? (MERCHANT_NOTES[selected.id] ?? []) : [];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Impersonation banner ── */}
      <AnimatePresence>
        {impersonating && (
          <motion.div
            initial={{ y: -48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -48, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-amber-500 text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Eye className="size-4" />
              <span className="text-sm font-semibold">
                Impersonating: <strong>{impersonating.name}</strong> — all actions are logged
              </span>
            </div>
            <button onClick={() => setImpersonating(null)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all">
              <X className="size-3.5" /> End session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Merchant list panel ── */}
      <div className={cn("flex flex-col transition-all duration-300", selected ? "w-[420px] shrink-0 border-r border-border" : "flex-1")}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Merchants
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} of {mockMerchants.length} merchants</p>
            </div>
            {canManage && (
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all shrink-0">
                <Plus className="size-4" />
                {selected ? "Add" : "Add Merchant"}
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, reg no, email, industry…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-[#64c6c3]/60 transition-all" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3 text-muted-foreground" />
              {["all", "active", "suspended", "pending", "deactivated"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all capitalize",
                    statusFilter === s ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted/50")}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {["all", "verified", "pending", "flagged"].map((c) => (
                <button key={c} onClick={() => setComplianceFilter(c)}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all capitalize",
                    complianceFilter === c ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted/50")}>
                  {c === "all" ? "All KYC" : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.map((merchant) => {
            const sc = statusConfig[merchant.status];
            const cc = complianceConfig[merchant.complianceStatus];
            const StatusIcon = sc.icon;
            const CompIcon = cc.icon;
            const isSelected = selected?.id === merchant.id;

            return (
              <motion.button key={merchant.id}
                onClick={() => { setSelected(isSelected ? null : merchant); setDetailTab("overview"); }}
                className={cn("w-full text-left px-6 py-4 hover:bg-muted/30 transition-colors group",
                  isSelected && "bg-[#64c6c3]/5 border-r-2 border-r-[#64c6c3]")}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-[#263b8e]/10 border border-[#263b8e]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="size-4 text-[#263b8e]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{merchant.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{merchant.registrationNumber}</p>
                      <p className="text-xs text-muted-foreground truncate">{merchant.industry}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", sc.color)}>
                      <StatusIcon className="size-2.5" />{sc.label}
                    </span>
                    <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", cc.color)}>
                      <CompIcon className="size-2.5" />{cc.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="size-3" />{formatGHS(merchant.totalVolume)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />{merchant.subMerchantCount} sub-merchants
                  </span>
                </div>
              </motion.button>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Building2 className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No merchants found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail panel ── */}
      <AnimatePresence>
        {selected && canViewDetails && (
          <motion.div className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}>

            {/* Detail header */}
            <div className="px-6 py-4 border-b border-border bg-card/50 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-[#263b8e]/10 flex items-center justify-center shrink-0">
                  <Building2 className="size-5 text-[#263b8e]" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    {selected.name}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">{selected.registrationNumber}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {(() => { const sc = statusConfig[selected.status]; const I = sc.icon; return (
                      <span className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium", sc.color)}>
                        <I className="size-2.5" />{sc.label}
                      </span>
                    ); })()}
                    {(() => { const cc = complianceConfig[selected.complianceStatus]; const I = cc.icon; return (
                      <span className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium", cc.color)}>
                        <I className="size-2.5" />{cc.label}
                      </span>
                    ); })()}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {canImpersonate && selected.status === "active" && (
                  <button onClick={() => setActionModal({ merchant: selected, type: "impersonate" })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#263b8e]/30 text-[#263b8e] text-xs font-medium hover:bg-[#263b8e]/5 transition-all">
                    <Eye className="size-3.5" /> Impersonate
                  </button>
                )}
                {canManage && (
                  <div className="relative group/actions">
                    <button className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-all">
                      <MoreHorizontal className="size-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-20 p-1 min-w-[180px] opacity-0 group-hover/actions:opacity-100 transition-opacity pointer-events-none group-hover/actions:pointer-events-auto">
                      {selected.status === "active" && (
                        <button onClick={() => setActionModal({ merchant: selected, type: "suspend" })}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-700 hover:bg-amber-50 transition-all">
                          <Ban className="size-3.5" /> Suspend
                        </button>
                      )}
                      {selected.status === "suspended" && (
                        <button onClick={() => setActionModal({ merchant: selected, type: "reactivate" })}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-700 hover:bg-emerald-50 transition-all">
                          <RefreshCw className="size-3.5" /> Reactivate
                        </button>
                      )}
                      {selected.status !== "deactivated" && (
                        <button onClick={() => setActionModal({ merchant: selected, type: "deactivate" })}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-red-50 transition-all">
                          <Trash2 className="size-3.5" /> Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted/50 transition-all">
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/20">
              {[
                { icon: TrendingUp, label: "Total Volume", value: formatGHS(selected.totalVolume), color: "#64c6c3" },
                { icon: ArrowLeftRight, label: "Sub-merchants", value: String(selected.subMerchantCount), color: "#263b8e" },
                { icon: DollarSign, label: "Onboarded", value: new Date(selected.onboardingDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), color: "#bcbbee" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-3">
                  <div className="size-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                    <Icon className="size-3.5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-border bg-card/30">
              {(["overview", "fees", "team", "notes"] as const).map((t) => (
                <button key={t} onClick={() => setDetailTab(t)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                    detailTab === t ? "bg-card shadow-sm border border-border text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {t === "fees" ? "Fee Schedule" : t === "notes" ? `Notes ${notes.length > 0 ? `(${notes.length})` : ""}` : t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* OVERVIEW TAB */}
              {detailTab === "overview" && (
                <div className="space-y-5">
                  {/* Profile */}
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Business Details</h3>
                    {[
                      { label: "Legal Name", value: selected.name },
                      { label: "Registration No.", value: selected.registrationNumber, mono: true, copyable: true },
                      { label: "Industry", value: selected.industry },
                      { label: "Contact Email", value: selected.email, copyable: true },
                    ].map(({ label, value, mono, copyable }) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider shrink-0">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm", mono ? "font-mono text-xs" : "")}>{value}</span>
                          {copyable && (
                            <button onClick={() => handleCopy(`${label}-${selected.id}`, value)}
                              className="text-muted-foreground hover:text-foreground transition-colors">
                              {copiedId === `${label}-${selected.id}` ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KYC / Compliance status */}
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>KYC & Compliance</h3>
                    {(() => {
                      const cc = complianceConfig[selected.complianceStatus];
                      const I = cc.icon;
                      return (
                        <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border", cc.color)}>
                          <I className="size-4 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold">{cc.label}</p>
                            <p className="text-xs opacity-80">
                              {selected.complianceStatus === "verified" && "Full KYC completed. All documents on file."}
                              {selected.complianceStatus === "pending" && "Documents submitted. Under review."}
                              {selected.complianceStatus === "flagged" && "AML flag raised. Account suspended pending review."}
                              {selected.complianceStatus === "rejected" && "KYC rejected. Account deactivated."}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    {selected.complianceStatus === "flagged" && (
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#bcbbee]/40 text-[#5c3d9e] text-xs font-medium hover:bg-[#bcbbee]/10 transition-all">
                          <UserCheck className="size-3.5" /> View KYC File
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 transition-all">
                          <ExternalLink className="size-3.5" /> Open Ticket
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  {canManage && (
                    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                      <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Account Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selected.status === "active" && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "suspend" })}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 text-xs font-medium hover:bg-amber-100 transition-all">
                            <Ban className="size-3.5" /> Suspend Account
                          </button>
                        )}
                        {selected.status === "suspended" && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "reactivate" })}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 text-xs font-medium hover:bg-emerald-100 transition-all">
                            <RefreshCw className="size-3.5" /> Reactivate
                          </button>
                        )}
                        {selected.status !== "deactivated" && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "deactivate" })}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-destructive/20 text-destructive text-xs font-medium hover:bg-red-50 transition-all">
                            <Trash2 className="size-3.5" /> Deactivate
                          </button>
                        )}
                        {selected.status === "active" && canImpersonate && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "impersonate" })}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#263b8e]/20 text-[#263b8e] text-xs font-medium hover:bg-[#263b8e]/5 transition-all">
                            <Eye className="size-3.5" /> Impersonate
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FEES TAB */}
              {detailTab === "fees" && (
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground">
                    Fee schedules are set by the Platform Finance team. Rates apply to this merchant's collections and payouts.
                  </div>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {["Channel", "Rate", "Cap"].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fees.map((fee) => (
                          <tr key={fee.label} className="border-b border-border/50 last:border-0">
                            <td className="px-4 py-3 text-sm font-medium">{fee.label}</td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold text-[#263b8e]">{fee.rate}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{fee.cap}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => setShowFeeModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
                    >
                      Edit Fee Schedule
                    </button>
                  )}
                </div>
              )}

              {/* TEAM TAB */}
              {detailTab === "team" && (
                <div className="space-y-3">
                  <div className="bg-muted/20 border border-border rounded-xl px-4 py-3 text-xs text-muted-foreground">
                    Merchant team members. Managed by the merchant owner — platform staff can view only.
                  </div>
                  {[
                    { name: "Kwame Asante", email: selected.email, role: "Owner", lastLogin: new Date(Date.now() - 3600000).toISOString() },
                    { name: "Abena Mensah", email: `abena@${selected.email.split("@")[1]}`, role: "Admin", lastLogin: new Date(Date.now() - 86400000).toISOString() },
                    { name: "Kofi Boateng", email: `kofi@${selected.email.split("@")[1]}`, role: "Developer", lastLogin: new Date(Date.now() - 7200000).toISOString() },
                  ].map((member) => (
                    <div key={member.email} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#64c6c3]/10 border border-[#64c6c3]/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#1a6e6c]">{member.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2 py-0.5 rounded-full border font-medium bg-[#64c6c3]/10 text-[#1a6e6c] border-[#64c6c3]/20">{member.role}</span>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatDate(member.lastLogin)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES TAB */}
              {detailTab === "notes" && (
                <div className="space-y-4">
                  {canManage && (
                    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Add Internal Note</p>
                      <textarea rows={3} placeholder="Write an internal note about this merchant…"
                        className="w-full text-sm px-3 py-2.5 border border-border rounded-xl bg-background outline-none resize-none focus:border-[#64c6c3]/60 transition-all" />
                      <button className="px-4 py-2 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-xs font-medium transition-all">
                        Save Note
                      </button>
                    </div>
                  )}
                  {notes.length > 0 ? (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div key={note.id} className="bg-card border border-border rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-[#263b8e]">{note.author}</p>
                            <p className="text-[10px] text-muted-foreground">{formatDate(note.date)}</p>
                          </div>
                          <p className="text-sm text-foreground/80">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertTriangle className="size-8 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">No notes yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action confirmation modal ── */}
      <AnimatePresence>
        {actionModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => { setActionModal(null); setActionReason(""); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              {(() => {
                const cfg = ACTION_CONFIG[actionModal.type];
                const isDestructive = actionModal.type === "deactivate";
                return (
                  <>
                    <div className={cn("size-11 rounded-xl flex items-center justify-center mb-4 border",
                      actionModal.type === "suspend" && "bg-amber-50 border-amber-200",
                      actionModal.type === "reactivate" && "bg-emerald-50 border-emerald-200",
                      actionModal.type === "deactivate" && "bg-red-50 border-red-200",
                      actionModal.type === "impersonate" && "bg-[#263b8e]/10 border-[#263b8e]/20",
                    )}>
                      {actionModal.type === "suspend" && <Ban className="size-5 text-amber-600" />}
                      {actionModal.type === "reactivate" && <RefreshCw className="size-5 text-emerald-600" />}
                      {actionModal.type === "deactivate" && <Trash2 className="size-5 text-red-600" />}
                      {actionModal.type === "impersonate" && <Eye className="size-5 text-[#263b8e]" />}
                    </div>
                    <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-heading)" }}>{cfg.title}</h2>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>{actionModal.merchant.name}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-5">{cfg.desc}</p>

                    {(isDestructive || actionModal.type === "suspend") && (
                      <div className="mb-5">
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                          Reason {isDestructive && <span className="text-destructive">*</span>}
                        </label>
                        <textarea rows={2} value={actionReason} onChange={(e) => setActionReason(e.target.value)}
                          placeholder="Provide a reason for this action…"
                          className="w-full text-sm px-3 py-2.5 border border-border rounded-xl bg-background outline-none resize-none focus:border-[#64c6c3]/60 transition-all" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => { setActionModal(null); setActionReason(""); }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">
                        Cancel
                      </button>
                      <button
                        disabled={isDestructive && !actionReason.trim()}
                        onClick={() => {
                          if (actionModal.type === "impersonate") {
                            setImpersonating(actionModal.merchant);
                            showToast("info", "Impersonation Started", `Viewing as ${actionModal.merchant.name}`);
                          } else if (actionModal.type === "suspend") {
                            showToast("warning", "Merchant Suspended", `${actionModal.merchant.name} has been suspended`);
                          } else if (actionModal.type === "reactivate") {
                            showToast("success", "Merchant Reactivated", `${actionModal.merchant.name} is now active`);
                          } else if (actionModal.type === "deactivate") {
                            showToast("error", "Merchant Deactivated", `${actionModal.merchant.name} has been permanently deactivated`);
                          }
                          setActionModal(null);
                          setActionReason("");
                        }}
                        className={cn("flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed", cfg.color)}>
                        {cfg.confirm}
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Create merchant modal ── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Add Merchant</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Onboard a new merchant. KYC must be completed separately.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-muted/60"><X className="size-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Business Name", placeholder: "Acme Corp Ltd", col: 2 },
                  { label: "Registration Number", placeholder: "CS0012345678", col: 1 },
                  { label: "Industry", placeholder: "e.g. Retail", col: 1 },
                  { label: "Contact Email", placeholder: "ops@business.com", col: 2 },
                ].map((f) => (
                  <div key={f.label} className={f.col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{f.label}</label>
                    <input placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-[#64c6c3]/60 focus:ring-2 focus:ring-[#64c6c3]/10 transition-all" />
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4 flex items-start gap-2">
                <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">KYC verification must be completed by the Compliance team before the merchant can process payments.</p>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">Cancel</button>
                <button onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#263b8e] hover:bg-[#1e2f72] text-white text-sm font-medium transition-all">Create & Send KYC</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Fee Configuration Modal ── */}
      <Modal
        isOpen={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        title="Configure Fee Schedule"
        description={selected ? `Set custom fee rates for ${selected.name}` : ""}
        size="lg"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Changes Require Confirmation</p>
              <p className="text-sm text-amber-700">
                Fee schedule changes are logged in the audit trail and take effect immediately. Merchants will be notified via email.
              </p>
            </div>
          </div>

          {/* Collections Section */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Collection Fees
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Rate (%)" required>
                <Input
                  type="number"
                  step="0.1"
                  value={feeConfig.collectionRate}
                  onChange={(e) => setFeeConfig({ ...feeConfig, collectionRate: e.target.value })}
                  placeholder="1.50"
                />
              </FormField>
              <FormField label="Floor (GHS)" required description="Minimum fee">
                <Input
                  type="number"
                  step="0.1"
                  value={feeConfig.collectionFloor}
                  onChange={(e) => setFeeConfig({ ...feeConfig, collectionFloor: e.target.value })}
                  placeholder="0.50"
                />
              </FormField>
              <FormField label="Cap (GHS)" required description="Maximum fee">
                <Input
                  type="number"
                  step="0.1"
                  value={feeConfig.collectionCap}
                  onChange={(e) => setFeeConfig({ ...feeConfig, collectionCap: e.target.value })}
                  placeholder="60.00"
                />
              </FormField>
            </div>
          </div>

          {/* Payouts Section */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Payout Fees
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Rate (%)" required>
                <Input
                  type="number"
                  step="0.1"
                  value={feeConfig.payoutRate}
                  onChange={(e) => setFeeConfig({ ...feeConfig, payoutRate: e.target.value })}
                  placeholder="1.00"
                />
              </FormField>
              <FormField label="Floor (GHS)" required description="Minimum fee">
                <Input
                  type="number"
                  step="0.1"
                  value={feeConfig.payoutFloor}
                  onChange={(e) => setFeeConfig({ ...feeConfig, payoutFloor: e.target.value })}
                  placeholder="0.30"
                />
              </FormField>
              <FormField label="Cap (GHS)" required description="Maximum fee">
                <Input
                  type="number"
                  step="0.1"
                  value={feeConfig.payoutCap}
                  onChange={(e) => setFeeConfig({ ...feeConfig, payoutCap: e.target.value })}
                  placeholder="40.00"
                />
              </FormField>
            </div>
          </div>

          {/* Fee Bearer */}
          <FormField label="Fee Bearer" required description="Who absorbs transaction fees by default">
            <Select
              value={feeConfig.feeBearer}
              onChange={(e) => setFeeConfig({ ...feeConfig, feeBearer: e.target.value as "merchant" | "payer" })}
            >
              <option value="merchant">Merchant absorbs fees (deducted from settlement)</option>
              <option value="payer">Payer bears fees (added to checkout amount)</option>
            </Select>
          </FormField>

          {/* Fee Examples */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Fee Examples
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[100, 1000, 10000].map((amount) => {
                const collectionFee = Math.max(
                  Math.min((amount * parseFloat(feeConfig.collectionRate)) / 100, parseFloat(feeConfig.collectionCap)),
                  parseFloat(feeConfig.collectionFloor)
                );
                const payoutFee = Math.max(
                  Math.min((amount * parseFloat(feeConfig.payoutRate)) / 100, parseFloat(feeConfig.payoutCap)),
                  parseFloat(feeConfig.payoutFloor)
                );
                return (
                  <div key={amount} className="p-3 bg-muted/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-2">GHS {amount.toLocaleString()}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Collection:</span>
                        <span className="font-semibold">GHS {collectionFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payout:</span>
                        <span className="font-semibold">GHS {payoutFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setShowFeeModal(false)}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast("success", "Fee Schedule Updated", `Changes saved for ${selected?.name}`);
                setShowFeeModal(false);
              }}
              className="flex-1 px-4 py-2.5 bg-[#64c6c3] hover:bg-[#52a8a5] text-white rounded-xl text-sm font-medium transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
