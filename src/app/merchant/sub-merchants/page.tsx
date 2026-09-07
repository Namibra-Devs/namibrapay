'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Building2, ChevronRight, MoreHorizontal, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { INDUSTRY_OPTIONS } from "@/lib/constants/options";
import { mockSubMerchants } from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { FormField, Input, Textarea, Select } from "@/components/ui/form-field";
import PhoneInput from "@/components/ui/phone-input";
import CustomSelect from "@/components/ui/select";

const statusConfig = {
  pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  active: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  suspended: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-400" },
  deactivated: { badge: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
};

export default function SubMerchantsPage() {
  const { can } = useMerchantRole();
  const [showCreate, setShowCreate] = useState(false);
  
  // Create sub-merchant modal state
  const [newSubMerchantName, setNewSubMerchantName] = useState("");
  const [newSubMerchantEmail, setNewSubMerchantEmail] = useState("");
  const [newSubMerchantPhone, setNewSubMerchantPhone] = useState("");
  const [newSubMerchantAddress, setNewSubMerchantAddress] = useState("");
  const [newSubMerchantFeeRate, setNewSubMerchantFeeRate] = useState("");
  const [newSubMerchantCategory, setNewSubMerchantCategory] = useState("");
  
  const { showToast } = useToast();

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
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all shrink-0">
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
                  <div className="size-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
                    <Building2 className="size-5 text-brand-teal" />
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
                <div className="flex items-center gap-1 text-brand-teal font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
      <Modal
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          setNewSubMerchantName("");
          setNewSubMerchantEmail("");
          setNewSubMerchantPhone("");
          setNewSubMerchantAddress("");
          setNewSubMerchantFeeRate("");
          setNewSubMerchantCategory("");
        }}
        title="Add Sub-Merchant"
        description="Application will be submitted to NamibraPay Compliance for review"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Compliance Review Required</p>
              <p className="text-sm text-amber-700">
                KYC documents will be requested by Compliance after submission. Approval typically takes 2-3 business days.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <FormField
            label="Business Name"
            required
            description="Legal or trading name of the sub-merchant"
          >
            <Input
              value={newSubMerchantName}
              onChange={(e) => setNewSubMerchantName(e.target.value)}
              placeholder="e.g. Accra North Branch"
            />
          </FormField>

          <FormField
            label="Business Category"
            required
            description="Type of business or industry"
          >
            <CustomSelect
              value={newSubMerchantCategory}
              onChange={setNewSubMerchantCategory}
              options={INDUSTRY_OPTIONS}
              placeholder="Select category..."
            />
          </FormField>

          <FormField
            label="Contact Email"
            required
            description="Primary email for this sub-merchant"
          >
            <Input
              type="email"
              value={newSubMerchantEmail}
              onChange={(e) => setNewSubMerchantEmail(e.target.value)}
              placeholder="contact@branch.com"
            />
          </FormField>

          <FormField
            label="Contact Phone"
            required
            description="Phone number with country code"
          >
            <PhoneInput
              value={newSubMerchantPhone}
              onChange={setNewSubMerchantPhone}
              placeholder="XX XXX XXXX"
            />
          </FormField>

          <FormField
            label="Business Address"
            required
            description="Physical location of the sub-merchant"
          >
            <Textarea
              value={newSubMerchantAddress}
              onChange={(e) => setNewSubMerchantAddress(e.target.value)}
              placeholder="Street address, city, region"
              rows={2}
            />
          </FormField>

          <FormField
            label="Fee Rate (%)"
            required
            description="Transaction fee percentage (max 3.5%)"
          >
            <Input
              type="number"
              step="0.1"
              min="0"
              max="3.5"
              value={newSubMerchantFeeRate}
              onChange={(e) => setNewSubMerchantFeeRate(e.target.value)}
              placeholder="e.g. 2.5"
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowCreate(false);
                setNewSubMerchantName("");
                setNewSubMerchantEmail("");
                setNewSubMerchantPhone("");
                setNewSubMerchantAddress("");
                setNewSubMerchantFeeRate("");
                setNewSubMerchantCategory("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={
                !newSubMerchantName.trim() ||
                !newSubMerchantEmail.trim() ||
                !newSubMerchantPhone.trim() ||
                !newSubMerchantAddress.trim() ||
                !newSubMerchantFeeRate ||
                !newSubMerchantCategory ||
                parseFloat(newSubMerchantFeeRate) > 3.5
              }
              onClick={() => {
                showToast(
                  "success",
                  "Application Submitted",
                  `${newSubMerchantName} has been submitted for compliance review. You'll receive an email once approved.`
                );
                setShowCreate(false);
                setNewSubMerchantName("");
                setNewSubMerchantEmail("");
                setNewSubMerchantPhone("");
                setNewSubMerchantAddress("");
                setNewSubMerchantFeeRate("");
                setNewSubMerchantCategory("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
