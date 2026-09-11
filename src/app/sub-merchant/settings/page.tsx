'use client';

import { useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  Mail,
  MapPin,
  Bell,
  Check,
  Info,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/Toast";
import PhoneInput from "@/components/ui/phone-input";

export default function SubMerchantSettingsPage() {
  const { can, role } = useSubMerchantRole();
  const { showToast } = useToast();

  // Business Profile state - SM-040
  const [businessName, setBusinessName] = useState("Kofi Craft Ghana");
  const [contactEmail, setContactEmail] = useState("kofi@koficraft.com");
  const [contactPhone, setContactPhone] = useState("+233 24 555 6789");
  const [businessAddress, setBusinessAddress] = useState("Plot 45, Achimota Mile 7\nAccra, Ghana");

  const [originalProfile] = useState({
    businessName: "Kofi Craft Ghana",
    contactEmail: "kofi@koficraft.com",
    contactPhone: "+233 24 555 6789",
    businessAddress: "Plot 45, Achimota Mile 7\nAccra, Ghana",
  });

  const hasProfileChanges = 
    businessName !== originalProfile.businessName ||
    contactEmail !== originalProfile.contactEmail ||
    contactPhone !== originalProfile.contactPhone ||
    businessAddress !== originalProfile.businessAddress;

  // Notification preferences state - SM-041
  const [notifications, setNotifications] = useState({
    transactionSuccess: true,
    transactionFailed: true,
    payoutCompleted: true,
    payoutFailed: true,
    disputeUpdate: true,
    weeklyReport: false,
  });

  const [originalNotifications] = useState({
    transactionSuccess: true,
    transactionFailed: true,
    payoutCompleted: true,
    payoutFailed: true,
    disputeUpdate: true,
    weeklyReport: false,
  });

  const hasNotificationChanges = JSON.stringify(notifications) !== JSON.stringify(originalNotifications);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Save business profile - SM-040
  const handleSaveProfile = () => {
    if (!can("settings.manage")) {
      showToast("error", "Access Denied", "You don't have permission to update settings.");
      return;
    }

    if (!businessName.trim()) {
      showToast("warning", "Missing Business Name", "Please enter a business name.");
      return;
    }

    if (!contactEmail.trim() || !isValidEmail(contactEmail)) {
      showToast("warning", "Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!contactPhone.trim()) {
      showToast("warning", "Missing Phone", "Please enter a contact phone number.");
      return;
    }

    if (!businessAddress.trim()) {
      showToast("warning", "Missing Address", "Please enter a business address.");
      return;
    }

    showToast("success", "Profile Updated", "Your business profile has been updated successfully.");
  };

  // Save notification preferences - SM-041
  const handleSaveNotifications = () => {
    if (!can("settings.manage")) {
      showToast("error", "Access Denied", "You don't have permission to update settings.");
      return;
    }

    showToast("success", "Preferences Saved", "Your notification preferences have been updated.");
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your business profile and notification preferences
        </p>
      </motion.div>

      {/* Viewer Mode Notice */}
      {role === "sub_viewer" && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3"
        >
          <Eye className="size-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Read-Only Access</p>
            <p className="text-xs text-blue-600 mt-1">
              You're viewing settings in read-only mode. Contact your admin to make changes.
            </p>
          </div>
        </motion.div>
      )}

      {/* Business Profile Section - SM-040 */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="size-10 rounded-xl bg-brand-mint/20 border border-brand-mint/40 flex items-center justify-center">
            <Building2 className="size-5 text-[#1a7a5e]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
              Business Profile
            </h2>
            <p className="text-xs text-muted-foreground">Update your business information</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <Info className="size-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-600">
              Contact your parent merchant (Kwame Organics) to update your business category or fee rate.
            </p>
          </div>

          {/* Business Name */}
          <FormField label="Business Name" required>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="pl-9"
                disabled={!can("settings.manage")}
              />
            </div>
          </FormField>

          {/* Contact Email */}
          <FormField label="Contact Email" required>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@business.com"
                className="pl-9"
                disabled={!can("settings.manage")}
              />
            </div>
          </FormField>

          {/* Contact Phone */}
          <FormField label="Contact Phone" required>
            <PhoneInput
              value={contactPhone}
              onChange={setContactPhone}
              placeholder="XX XXX XXXX"
              disabled={!can("settings.manage")}
            />
          </FormField>

          {/* Business Address */}
          <FormField label="Business Address" required>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Textarea
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Street address, city, region"
                rows={3}
                className="pl-9"
                disabled={!can("settings.manage")}
              />
            </div>
          </FormField>

          {/* Save button */}
          {can("settings.manage") ? (
            <button
              onClick={handleSaveProfile}
              disabled={!hasProfileChanges}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                hasProfileChanges
                  ? "bg-[#1a7a5e] text-white hover:bg-[#1a7a5e]/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {hasProfileChanges ? "Save Changes" : "No Changes"}
            </button>
          ) : (
            <button
              onClick={() => showToast("info", "Action Restricted", "Only Admins can update settings. Contact your admin to make changes.")}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed"
            >
              View Only Mode
            </button>
          )}
        </div>
      </motion.div>

      {/* Notification Preferences Section - SM-041 */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="size-10 rounded-xl bg-brand-lavender/20 border border-brand-lavender/40 flex items-center justify-center">
            <Bell className="size-5 text-[#5c3d9e]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
              Notification Preferences
            </h2>
            <p className="text-xs text-muted-foreground">Choose which notifications you want to receive</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Transaction notifications */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Transaction Alerts</p>
            <div className="space-y-3">
              {[
                { key: "transactionSuccess" as const, label: "Successful Transaction", desc: "Get notified when a collection succeeds" },
                { key: "transactionFailed" as const, label: "Failed Transaction", desc: "Get notified when a collection fails" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  disabled={!can("settings.manage")}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-ring/40 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "size-5 rounded border-2 flex items-center justify-center transition-all",
                    notifications[item.key]
                      ? "border-[#1a7a5e] bg-[#1a7a5e]"
                      : "border-border"
                  )}>
                    {notifications[item.key] && <Check className="size-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payout notifications */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payout Alerts</p>
            <div className="space-y-3">
              {[
                { key: "payoutCompleted" as const, label: "Payout Completed", desc: "Get notified when a settlement is processed" },
                { key: "payoutFailed" as const, label: "Payout Failed", desc: "Get notified when a settlement fails" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  disabled={!can("settings.manage")}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-ring/40 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "size-5 rounded border-2 flex items-center justify-center transition-all",
                    notifications[item.key]
                      ? "border-[#1a7a5e] bg-[#1a7a5e]"
                      : "border-border"
                  )}>
                    {notifications[item.key] && <Check className="size-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Other notifications */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Other Alerts</p>
            <div className="space-y-3">
              {[
                { key: "disputeUpdate" as const, label: "Dispute Updates", desc: "Get notified about dispute status changes" },
                { key: "weeklyReport" as const, label: "Weekly Report", desc: "Receive a summary of your weekly activity" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  disabled={!can("settings.manage")}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-ring/40 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "size-5 rounded border-2 flex items-center justify-center transition-all",
                    notifications[item.key]
                      ? "border-[#1a7a5e] bg-[#1a7a5e]"
                      : "border-border"
                  )}>
                    {notifications[item.key] && <Check className="size-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          {can("settings.manage") ? (
            <button
              onClick={handleSaveNotifications}
              disabled={!hasNotificationChanges}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mt-6",
                hasNotificationChanges
                  ? "bg-[#1a7a5e] text-white hover:bg-[#1a7a5e]/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {hasNotificationChanges ? "Save Preferences" : "No Changes"}
            </button>
          ) : (
            <button
              onClick={() => showToast("info", "Action Restricted", "Only Admins can update notification preferences. Contact your admin to make changes.")}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed mt-6"
            >
              View Only Mode
            </button>
          )}
        </div>
      </motion.div>

      {/* Account info */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="bg-muted/30 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Parent Merchant:</strong> Kwame Organics</p>
            <p><strong>Account Type:</strong> Sub-merchant account</p>
            <p><strong>Fee Rate:</strong> 3.5% (2.0% parent + 1.5% platform)</p>
            <p>For account closure or fee rate changes, contact your parent merchant.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
