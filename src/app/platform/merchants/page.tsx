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
import { INDUSTRY_OPTIONS } from "@/lib/constants/options";
import { mockMerchants } from "@/lib/mock-data";
import type { Merchant } from "@/lib/mock-data";
import { usePermission } from "@/hooks/use-role";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField, Input, Select } from "@/components/ui/form-field";
import PhoneInput from "@/components/ui/phone-input";
import CustomSelect from "@/components/ui/Select";

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
    color: "bg-brand-navy hover:bg-[#1e2f72]",
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
  
  // Create merchant form state
  const [newMerchantName, setNewMerchantName] = useState("");
  const [newMerchantRegNumber, setNewMerchantRegNumber] = useState("");
  const [newMerchantEmail, setNewMerchantEmail] = useState("");
  const [newMerchantPhone, setNewMerchantPhone] = useState("");
  const [newMerchantAddress, setNewMerchantAddress] = useState("");
  const [newMerchantIndustry, setNewMerchantIndustry] = useState("");
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
    <div className="flex h-full overflow-hidden relative">
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
      <div className={cn("flex flex-col transition-all duration-300", 
        selected ? "hidden md:flex md:w-105 shrink-0 border-r border-border" : "flex-1")}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-card/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate" style={{ fontFamily: "var(--font-heading)" }}>
                Merchants
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{filtered.length} of {mockMerchants.length} merchants</p>
            </div>
            {canManage && (
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0">
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
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-teal/60 transition-all" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="size-3 text-muted-foreground" />
              {["all", "active", "suspended", "pending", "deactivated"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={cn("px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium border transition-all capitalize whitespace-nowrap",
                    statusFilter === s ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted/50")}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {["all", "verified", "pending", "flagged"].map((c) => (
                <button key={c} onClick={() => setComplianceFilter(c)}
                  className={cn("px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium border transition-all capitalize whitespace-nowrap",
                    complianceFilter === c ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted/50")}>
                  {c === "all" ? "All KYC" : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border pb-20 md:pb-0">
          {filtered.map((merchant) => {
            const sc = statusConfig[merchant.status];
            const cc = complianceConfig[merchant.complianceStatus];
            const StatusIcon = sc.icon;
            const CompIcon = cc.icon;
            const isSelected = selected?.id === merchant.id;

            return (
              <motion.button key={merchant.id}
                onClick={() => { setSelected(isSelected ? null : merchant); setDetailTab("overview"); }}
                className={cn("w-full text-left px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/30 transition-colors group",
                  isSelected && "bg-brand-teal/5 border-r-2 border-r-brand-teal")}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="size-8 sm:size-9 rounded-xl bg-brand-navy/10 border border-brand-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="size-3.5 sm:size-4 text-brand-navy" />
                    </div>
                    <div className="min-w-0 flex-1">
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
          <motion.div 
            className="fixed inset-0 md:relative md:flex-1 flex flex-col overflow-hidden bg-background z-50 md:z-auto"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}>

            {/* Detail header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="size-9 sm:size-10 rounded-xl bg-brand-navy/10 flex items-center justify-center shrink-0">
                  <Building2 className="size-4 sm:size-5 text-brand-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base sm:text-lg leading-tight truncate" style={{ fontFamily: "var(--font-heading)" }}>
                    {selected.name}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-mono truncate">{selected.registrationNumber}</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
                    {(() => { const sc = statusConfig[selected.status]; const I = sc.icon; return (
                      <span className={cn("inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full border font-medium shrink-0", sc.color)}>
                        <I className="size-2.5" />{sc.label}
                      </span>
                    ); })()}
                    {(() => { const cc = complianceConfig[selected.complianceStatus]; const I = cc.icon; return (
                      <span className={cn("inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full border font-medium shrink-0", cc.color)}>
                        <I className="size-2.5" />{cc.label}
                      </span>
                    ); })()}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                {canImpersonate && selected.status === "active" && (
                  <button onClick={() => setActionModal({ merchant: selected, type: "impersonate" })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-brand-navy/30 text-brand-navy text-xs font-medium hover:bg-brand-navy/5 transition-all">
                    <Eye className="size-3.5" /> Impersonate
                  </button>
                )}
                {canManage && (
                  <div className="relative group/actions">
                    <button className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-all">
                      <MoreHorizontal className="size-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-20 p-1 min-w-45 opacity-0 group-hover/actions:opacity-100 transition-opacity pointer-events-none group-hover/actions:pointer-events-auto">
                      {selected.status === "active" && (
                        <button onClick={() => setActionModal({ merchant: selected, type: "suspend" })}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm text-amber-700 hover:bg-amber-50 transition-all whitespace-nowrap">
                          <Ban className="size-3.5" /> Suspend
                        </button>
                      )}
                      {selected.status === "suspended" && (
                        <button onClick={() => setActionModal({ merchant: selected, type: "reactivate" })}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm text-emerald-700 hover:bg-emerald-50 transition-all whitespace-nowrap">
                          <RefreshCw className="size-3.5" /> Reactivate
                        </button>
                      )}
                      {selected.status !== "deactivated" && (
                        <button onClick={() => setActionModal({ merchant: selected, type: "deactivate" })}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm text-destructive hover:bg-red-50 transition-all whitespace-nowrap">
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
            <div className="grid grid-cols-1 xs:grid-cols-3 divide-y xs:divide-y-0 xs:divide-x divide-border border-b border-border bg-muted/20">
              {[
                { icon: TrendingUp, label: "Total Volume", value: formatGHS(selected.totalVolume), color: "#64c6c3" },
                { icon: ArrowLeftRight, label: "Sub-merchants", value: String(selected.subMerchantCount), color: "#263b8e" },
                { icon: DollarSign, label: "Onboarded", value: new Date(selected.onboardingDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), color: "#bcbbee" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3">
                  <div className="size-7 sm:size-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                    <Icon className="size-3 sm:size-3.5" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-xs sm:text-sm font-bold truncate" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 py-2 sm:py-3 border-b border-border bg-card/30 overflow-x-auto scrollbar-none">
              {(["overview", "fees", "team", "notes"] as const).map((t) => (
                <button key={t} onClick={() => setDetailTab(t)}
                  className={cn("px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all capitalize whitespace-nowrap",
                    detailTab === t ? "bg-card shadow-sm border border-border text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {t === "fees" ? "Fee Schedule" : t === "notes" ? `Notes ${notes.length > 0 ? `(${notes.length})` : ""}` : t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
              {/* OVERVIEW TAB */}
              {detailTab === "overview" && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Profile */}
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-xs sm:text-sm" style={{ fontFamily: "var(--font-heading)" }}>Business Details</h3>
                    {[
                      { label: "Legal Name", value: selected.name },
                      { label: "Registration No.", value: selected.registrationNumber, mono: true, copyable: true },
                      { label: "Industry", value: selected.industry },
                      { label: "Contact Email", value: selected.email, copyable: true },
                    ].map(({ label, value, mono, copyable }) => (
                      <div key={label} className="flex items-center justify-between gap-2 sm:gap-4 py-2 border-b border-border/50 last:border-0">
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider shrink-0">{label}</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn("text-[11px] sm:text-sm font-medium truncate", mono ? "font-mono" : "")}>{value}</span>
                          {copyable && (
                            <button onClick={() => handleCopy(`${label}-${selected.id}`, value)}
                              className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                              {copiedId === `${label}-${selected.id}` ? <Check className="size-3 sm:size-3.5" /> : <Copy className="size-3 sm:size-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KYC / Compliance status */}
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-xs sm:text-sm" style={{ fontFamily: "var(--font-heading)" }}>KYC & Compliance</h3>
                    {(() => {
                      const cc = complianceConfig[selected.complianceStatus];
                      const I = cc.icon;
                      return (
                        <div className={cn("flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border", cc.color)}>
                          <I className="size-3.5 sm:size-4 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold">{cc.label}</p>
                            <p className="text-[10px] sm:text-xs opacity-80">
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
                      <div className="flex flex-col xs:flex-row gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-brand-lavender/40 text-[#5c3d9e] text-[10px] sm:text-xs font-medium hover:bg-brand-lavender/10 transition-all">
                          <UserCheck className="size-3 sm:size-3.5" /> View KYC File
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-[10px] sm:text-xs font-medium hover:bg-muted/50 transition-all">
                          <ExternalLink className="size-3 sm:size-3.5" /> Open Ticket
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  {canManage && (
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                      <h3 className="font-semibold text-xs sm:text-sm" style={{ fontFamily: "var(--font-heading)" }}>Account Actions</h3>
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                        {selected.status === "active" && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "suspend" })}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 text-[10px] sm:text-xs font-medium hover:bg-amber-100 transition-all">
                            <Ban className="size-3 sm:size-3.5" /> Suspend Account
                          </button>
                        )}
                        {selected.status === "suspended" && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "reactivate" })}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] sm:text-xs font-medium hover:bg-emerald-100 transition-all">
                            <RefreshCw className="size-3 sm:size-3.5" /> Reactivate
                          </button>
                        )}
                        {selected.status !== "deactivated" && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "deactivate" })}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-xl border border-destructive/20 text-destructive text-[10px] sm:text-xs font-medium hover:bg-red-50 transition-all">
                            <Trash2 className="size-3 sm:size-3.5" /> Deactivate
                          </button>
                        )}
                        {selected.status === "active" && canImpersonate && (
                          <button onClick={() => setActionModal({ merchant: selected, type: "impersonate" })}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-xl border border-brand-navy/20 text-brand-navy text-[10px] sm:text-xs font-medium hover:bg-brand-navy/5 transition-all">
                            <Eye className="size-3 sm:size-3.5" /> Impersonate
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FEES TAB */}
              {detailTab === "fees" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-muted/30 border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs text-muted-foreground">
                    Fee schedules are set by the Platform Finance team. Rates apply to this merchant's collections and payouts.
                  </div>
                  <div className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-100">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            {["Channel", "Rate", "Cap"].map((h) => (
                              <th key={h} className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {fees.map((fee) => (
                            <tr key={fee.label} className="border-b border-border/50 last:border-0">
                              <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium">{fee.label}</td>
                              <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                                <span className="text-xs sm:text-sm font-bold text-brand-navy">{fee.rate}</span>
                              </td>
                              <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-muted-foreground">{fee.cap}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => setShowFeeModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all w-full sm:w-auto"
                    >
                      Edit Fee Schedule
                    </button>
                  )}
                </div>
              )}

              {/* TEAM TAB */}
              {detailTab === "team" && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-muted/20 border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs text-muted-foreground">
                    Merchant team members. Managed by the merchant owner — platform staff can view only.
                  </div>
                  {[
                    { name: "Kwame Asante", email: selected.email, role: "Owner", lastLogin: new Date(Date.now() - 3600000).toISOString() },
                    { name: "Abena Mensah", email: `abena@${selected.email.split("@")[1]}`, role: "Admin", lastLogin: new Date(Date.now() - 86400000).toISOString() },
                    { name: "Kofi Boateng", email: `kofi@${selected.email.split("@")[1]}`, role: "Developer", lastLogin: new Date(Date.now() - 7200000).toISOString() },
                  ].map((member) => (
                    <div key={member.email} className="bg-card border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="size-7 sm:size-8 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold text-[#1a6e6c]">{member.name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">{member.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full border font-medium bg-brand-teal/10 text-[#1a6e6c] border-brand-teal/20 whitespace-nowrap">{member.role}</span>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">{formatDate(member.lastLogin)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES TAB */}
              {detailTab === "notes" && (
                <div className="space-y-3 sm:space-y-4">
                  {canManage && (
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Add Internal Note</p>
                      <textarea rows={3} placeholder="Write an internal note about this merchant…"
                        className="w-full text-xs sm:text-sm px-3 py-2.5 border border-border rounded-xl bg-background outline-none resize-none focus:border-brand-teal/60 transition-all" />
                      <button className="px-3 sm:px-4 py-2 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-[10px] sm:text-xs font-medium transition-all">
                        Save Note
                      </button>
                    </div>
                  )}
                  {notes.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {notes.map((note) => (
                        <div key={note.id} className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-xs font-semibold text-brand-navy">{note.author}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground">{formatDate(note.date)}</p>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground/80">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertTriangle className="size-7 sm:size-8 text-muted-foreground/30 mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">No notes yet</p>
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
                      actionModal.type === "impersonate" && "bg-brand-navy/10 border-brand-navy/20",
                    )}>
                      {actionModal.type === "suspend" && <Ban className="size-5 text-amber-600" />}
                      {actionModal.type === "reactivate" && <RefreshCw className="size-5 text-emerald-600" />}
                      {actionModal.type === "deactivate" && <Trash2 className="size-5 text-red-600" />}
                      {actionModal.type === "impersonate" && <Eye className="size-5 text-brand-navy" />}
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
                          className="w-full text-sm px-3 py-2.5 border border-border rounded-xl bg-background outline-none resize-none focus:border-brand-teal/60 transition-all" />
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

      {/* ── Create Merchant Modal (PD-011) ── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewMerchantName("");
          setNewMerchantRegNumber("");
          setNewMerchantEmail("");
          setNewMerchantPhone("");
          setNewMerchantAddress("");
          setNewMerchantIndustry("");
        }}
        title="Create Merchant Account"
        description="Onboard a new merchant business. KYC approval required before activation."
        size="md"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <Building2 className="size-4 sm:size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Two-Step Process</p>
              <p className="text-xs sm:text-sm text-blue-700">
                Creating the account will generate login credentials. The merchant must complete KYC verification with Compliance before processing transactions.
              </p>
            </div>
          </div>

          {/* Business Name */}
          <FormField
            label="Business Name"
            required
            description="Registered business name"
          >
            <Input
              type="text"
              value={newMerchantName}
              onChange={(e) => setNewMerchantName(e.target.value)}
              placeholder="e.g., Acme Payments Ltd"
            />
          </FormField>

          {/* Registration Number */}
          <FormField
            label="Business Registration Number"
            required
            description="Company registration number"
          >
            <Input
              type="text"
              value={newMerchantRegNumber}
              onChange={(e) => setNewMerchantRegNumber(e.target.value)}
              placeholder="e.g., CS001234567890"
            />
          </FormField>

          {/* Industry */}
          <FormField
            label="Industry"
            required
            description="Business sector"
          >
            <CustomSelect
              value={newMerchantIndustry}
              onChange={setNewMerchantIndustry}
              options={INDUSTRY_OPTIONS}
              placeholder="Select industry..."
            />
          </FormField>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              label="Owner Email"
              required
              description="Primary contact"
            >
              <Input
                type="email"
                value={newMerchantEmail}
                onChange={(e) => setNewMerchantEmail(e.target.value)}
                placeholder="owner@business.com"
              />
            </FormField>
            <FormField
              label="Phone Number"
              required
              description="Contact number"
            >
              <PhoneInput
                value={newMerchantPhone}
                onChange={setNewMerchantPhone}
                placeholder="XX XXX XXXX"
              />
            </FormField>
          </div>

          {/* Business Address */}
          <FormField
            label="Business Address"
            required
            description="Physical location"
          >
            <Input
              type="text"
              value={newMerchantAddress}
              onChange={(e) => setNewMerchantAddress(e.target.value)}
              placeholder="123 High Street, Accra"
            />
          </FormField>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="size-4 sm:size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-700">
              The merchant will receive an email invitation to set their password and complete onboarding. KYC documents must be reviewed by Compliance before the account goes live.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setNewMerchantName("");
                setNewMerchantRegNumber("");
                setNewMerchantEmail("");
                setNewMerchantPhone("");
                setNewMerchantAddress("");
                setNewMerchantIndustry("");
              }}
              className="w-full sm:flex-1 px-4 py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              disabled={!newMerchantName.trim() || !newMerchantRegNumber.trim() || !newMerchantEmail.trim() || !newMerchantPhone.trim() || !newMerchantAddress.trim() || !newMerchantIndustry}
              onClick={() => {
                showToast("success", "Merchant Created", `${newMerchantName} has been created. Invitation email sent to ${newMerchantEmail}`);
                setShowCreateModal(false);
                setNewMerchantName("");
                setNewMerchantRegNumber("");
                setNewMerchantEmail("");
                setNewMerchantPhone("");
                setNewMerchantAddress("");
                setNewMerchantIndustry("");
              }}
              className="w-full sm:flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              Create & Send Invite
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Fee Configuration Modal ── */}
      <Modal
        isOpen={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        title="Configure Fee Schedule"
        description={selected ? `Set custom fee rates for ${selected.name}` : ""}
        size="lg"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="size-4 sm:size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-1">Changes Require Confirmation</p>
              <p className="text-xs sm:text-sm text-amber-700">
                Fee schedule changes are logged in the audit trail and take effect immediately. Merchants will be notified via email.
              </p>
            </div>
          </div>

          {/* Collections Section */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Collection Fees
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
            <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Payout Fees
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
            <CustomSelect
              value={feeConfig.feeBearer}
              onChange={(val) => setFeeConfig({ ...feeConfig, feeBearer: val as "merchant" | "payer" })}
              options={[
                { value: "merchant", label: "Merchant absorbs fees (deducted from settlement)" },
                { value: "payer", label: "Payer bears fees (added to checkout amount)" },
              ]}
            />
          </FormField>

          {/* Fee Examples */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Fee Examples
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <button
              onClick={() => setShowFeeModal(false)}
              className="w-full sm:flex-1 px-4 py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast("success", "Fee Schedule Updated", `Changes saved for ${selected?.name}`);
                setShowFeeModal(false);
              }}
              className="w-full sm:flex-1 px-4 py-2.5 bg-brand-teal hover:bg-[#52a8a5] text-white rounded-xl text-xs sm:text-sm font-medium transition-all order-1 sm:order-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
