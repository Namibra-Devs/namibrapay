'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Building2, ChevronRight, MoreHorizontal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { mockSubMerchants } from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";

const statusConfig = {
  pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  active: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  suspended: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-400" },
  deactivated: { badge: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
};

export default function SubMerchantsPage() {
  const { can } = useMerchantRole();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Sub-Merchants</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your sub-accounts — each operates under your merchant agreement.</p>
        </div>
        {can("submerchants.create") && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all shrink-0">
            <Plus className="size-4" />
            Add Sub-Merchant
          </button>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: mockSubMerchants.length, color: "text-foreground" },
          { label: "Active", value: mockSubMerchants.filter(s => s.status === "active").length, color: "text-emerald-600" },
          { label: "Pending", value: mockSubMerchants.filter(s => s.status === "pending").length, color: "text-amber-600" },
          { label: "Suspended", value: mockSubMerchants.filter(s => s.status === "suspended").length, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn("text-2xl font-bold", stat.color)} style={{ fontFamily: "var(--font-heading)" }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Sub-merchant cards */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockSubMerchants.map((sm) => {
          const sc = statusConfig[sm.status];
          return (
            <div key={sm.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-ring/40 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#64c6c3]/10 border border-[#64c6c3]/20 flex items-center justify-center">
                    <Building2 className="size-5 text-[#64c6c3]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{sm.name}</p>
                    <p className="text-xs text-muted-foreground">{sm.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1", sc.badge)}>
                    <div className={cn("size-1.5 rounded-full", sc.dot)} />
                    {sm.status}
                  </span>
                  {can("submerchants.manage") && (
                    <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Volume</p>
                  <p className="font-bold text-sm">{sm.volume > 0 ? formatGHS(sm.volume) : "—"}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fee Rate</p>
                  <p className="font-bold text-sm">{sm.feeRate}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Onboarded {formatDate(sm.onboardingDate + "T00:00:00Z").split(",")[0]}</span>
                <div className="flex items-center gap-1 text-[#64c6c3] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="size-3" />
                  View details
                  <ChevronRight className="size-3" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowCreate(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-heading)" }}>Add Sub-Merchant</h2>
            <p className="text-sm text-muted-foreground mb-5">Application will be submitted to NamibraPay Compliance for review.</p>
            <div className="space-y-4">
              {[
                { label: "Business Name", placeholder: "e.g. Accra North Branch" },
                { label: "Contact Email", placeholder: "contact@yourbusiness.com" },
                { label: "Contact Phone", placeholder: "+233 XX XXX XXXX" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{field.label}</label>
                  <input placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-[#64c6c3]/60 focus:ring-2 focus:ring-[#64c6c3]/10 transition-all" />
                </div>
              ))}
              <div className="bg-[#fedfb8]/20 border border-[#fedfb8]/40 rounded-xl px-4 py-3 text-xs text-[#d35400]">
                KYC documents will be requested by Compliance after submission.
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">
                Cancel
              </button>
              <button onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#263b8e] hover:bg-[#1e2f72] text-white text-sm font-medium transition-all">
                Submit Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
