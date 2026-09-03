'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, CreditCard, Bell, Shield, ToggleLeft, AlertTriangle, Check } from "lucide-react";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function MerchantSettingsPage() {
  const { can } = useMerchantRole();
  const { showToast } = useToast();
  
  // Business Profile state
  const [businessName, setBusinessName] = useState("Kwame Organics Ltd");
  const [businessAddress, setBusinessAddress] = useState("12 Liberation Rd, Accra, Ghana");
  const [contactEmail, setContactEmail] = useState("ops@kwameorganics.com");
  const [contactPhone, setContactPhone] = useState("+233 20 123 4567");
  
  // Fee bearer state
  const [feeBearer, setFeeBearer] = useState<"merchant" | "payer">("merchant");
  
  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    successfulTransaction: true,
    failedTransaction: true,
    settlementProcessed: true,
    payoutCompleted: true,
    securityEvents: true,
  });
  
  const handleSaveProfile = () => {
    showToast("success", "Profile Updated", "Your business profile has been saved successfully.");
  };
  
  const handleSaveFeeBearer = () => {
    showToast("success", "Preference Saved", `Fee bearer updated to: ${feeBearer === "merchant" ? "Merchant" : "Payer"}`);
  };
  
  const handleSaveNotifications = () => {
    showToast("success", "Notifications Updated", "Your notification preferences have been saved.");
  };

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your business profile, payout account, and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Business Profile */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-[#263b8e]/10 flex items-center justify-center">
              <Building2 className="size-4 text-[#263b8e]" />
            </div>
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Business Profile</h2>
          </div>
          {[
            { label: "Business Name", value: businessName, setValue: setBusinessName, editable: can("settings.manage") },
            { label: "Registration Number", value: "CS004152023", setValue: null, editable: false },
            { label: "Business Address", value: businessAddress, setValue: setBusinessAddress, editable: can("settings.manage") },
            { label: "Contact Email", value: contactEmail, setValue: setContactEmail, editable: can("settings.manage") },
            { label: "Contact Phone", value: contactPhone, setValue: setContactPhone, editable: can("settings.manage") },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{field.label}</label>
              <input
                value={field.value}
                onChange={(e) => field.setValue?.(e.target.value)}
                disabled={!field.editable}
                className={cn("w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all",
                  field.editable
                    ? "bg-background border-border focus:border-[#64c6c3]/60 focus:ring-2 focus:ring-[#64c6c3]/10"
                    : "bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed")}
              />
            </div>
          ))}
          {can("settings.manage") && (
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <Check className="size-4" />
              Save Changes
            </button>
          )}
        </motion.div>

        {/* Payout Account */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-[#64c6c3]/10 flex items-center justify-center">
              <CreditCard className="size-4 text-[#64c6c3]" />
            </div>
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Payout Account</h2>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-emerald-800">GCB Bank</p>
              <p className="text-xs text-emerald-600 font-mono">•••• •••• •••• 4821</p>
              <p className="text-xs text-emerald-600">Kwame Organics Ltd</p>
            </div>
            <div className="size-2 rounded-full bg-emerald-400" />
          </div>
          {can("payout.change_bank") && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">Bank account changes require NamibraPay Compliance approval and take 2–5 business days to take effect.</p>
              </div>
              <button className="px-4 py-2.5 border border-[#263b8e]/30 text-[#263b8e] rounded-xl text-sm font-medium hover:bg-[#263b8e]/5 transition-all">
                Request Account Change
              </button>
            </div>
          )}

          {/* Fee Bearer */}
          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center gap-3">
              <ToggleLeft className="size-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Fee Bearer Preference</h3>
            </div>
            {can("settings.manage") ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "merchant" as const, label: "Merchant bears fees", desc: "Fees deducted from your settlement" },
                    { key: "payer" as const, label: "Payer bears fees", desc: "Fees added to the checkout amount" },
                  ].map((opt) => (
                    <label 
                      key={opt.key} 
                      className={cn(
                        "flex flex-col gap-1 p-3 rounded-xl border cursor-pointer transition-all hover:bg-muted/30",
                        feeBearer === opt.key ? "border-[#64c6c3]/40 bg-[#64c6c3]/5" : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="fee_bearer" 
                          checked={feeBearer === opt.key}
                          onChange={() => setFeeBearer(opt.key)}
                          className="accent-[#64c6c3] size-3" 
                        />
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground pl-5">{opt.desc}</p>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={handleSaveFeeBearer}
                  className="w-full px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Check className="size-4" />
                  Save Fee Preference
                </button>
              </>
            ) : (
              <div className="bg-muted/30 rounded-xl px-3 py-2.5 text-sm text-muted-foreground">
                Merchant absorbs fees (default)
              </div>
            )}
          </div>
        </motion.div>

        {/* Notifications */}
        {can("settings.manage") && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-9 rounded-xl bg-[#bcbbee]/10 flex items-center justify-center">
                <Bell className="size-4 text-[#5c3d9e]" />
              </div>
              <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: "successfulTransaction" as const, label: "Successful transaction", sub: "Email & SMS on each collection" },
                { key: "failedTransaction" as const, label: "Failed transaction", sub: "Email on failures" },
                { key: "settlementProcessed" as const, label: "Settlement processed", sub: "Email when NSP settles funds" },
                { key: "payoutCompleted" as const, label: "Payout completed", sub: "Email when payout hits your bank" },
                { key: "securityEvents" as const, label: "Security events", sub: "Email on login, key changes" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.sub}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationPrefs[n.key]}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, [n.key]: e.target.checked }))}
                    className="accent-[#64c6c3] size-4" 
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={handleSaveNotifications}
              className="w-full px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Check className="size-4" />
              Save Notification Preferences
            </button>
          </motion.div>
        )}

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-[#a3ffe2]/10 flex items-center justify-center">
              <Shield className="size-4 text-[#1a7a5e]" />
            </div>
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Security</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Two-Factor Authentication</p>
                  <p className="text-xs text-emerald-600">Enabled on your account</p>
                </div>
              </div>
              <button className="text-xs text-emerald-700 font-medium hover:underline">Manage</button>
            </div>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-all border border-border">
              Change password
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-all border border-border">
              View active sessions
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
