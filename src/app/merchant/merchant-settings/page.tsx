'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, CreditCard, Bell, Shield, ToggleLeft, AlertTriangle, Check, Lock, Monitor, FileText } from "lucide-react";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import PhoneInput from "@/components/ui/phone-input";
import { Modal } from "@/components/ui/modal";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import CustomSelect from "@/components/ui/Select";
import { BANK_OPTIONS_GHANA } from "@/lib/constants/options";

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
  
  // Modal states
  const [showBankChangeModal, setShowBankChangeModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  
  // Bank change form state
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [changeReason, setChangeReason] = useState("");
  
  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSaveProfile = () => {
    showToast("success", "Profile Updated", "Your business profile has been saved successfully.");
  };
  
  const handleSaveFeeBearer = () => {
    showToast("success", "Preference Saved", `Fee bearer updated to: ${feeBearer === "merchant" ? "Merchant" : "Payer"}`);
  };
  
  const handleSaveNotifications = () => {
    showToast("success", "Notifications Updated", "Your notification preferences have been saved.");
  };
  
  const handleRequestBankChange = () => {
    if (!newBankName || !newAccountNumber || !newAccountName || !changeReason) {
      showToast("error", "Missing Information", "Please fill in all fields.");
      return;
    }
    showToast("success", "Request Submitted", "Your bank account change request has been submitted for compliance review. You'll be notified within 2-5 business days.");
    setShowBankChangeModal(false);
    // Reset form
    setNewBankName("");
    setNewAccountNumber("");
    setNewAccountName("");
    setChangeReason("");
  };
  
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("error", "Missing Information", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords Don't Match", "New password and confirmation must match.");
      return;
    }
    if (newPassword.length < 8) {
      showToast("error", "Weak Password", "Password must be at least 8 characters long.");
      return;
    }
    showToast("success", "Password Changed", "Your password has been updated successfully. You'll be logged out of all other sessions.");
    setShowChangePasswordModal(false);
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your business profile, payout account, and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Business Profile */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-brand-navy/10 flex items-center justify-center">
              <Building2 className="size-4 text-brand-navy" />
            </div>
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Business Profile</h2>
          </div>
          {[
            { label: "Business Name", value: businessName, setValue: setBusinessName, editable: can("settings.manage"), type: "text" },
            { label: "Registration Number", value: "CS004152023", setValue: null, editable: false, type: "text" },
            { label: "Business Address", value: businessAddress, setValue: setBusinessAddress, editable: can("settings.manage"), type: "text" },
            { label: "Contact Email", value: contactEmail, setValue: setContactEmail, editable: can("settings.manage"), type: "email" },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setValue?.(e.target.value)}
                disabled={!field.editable}
                className={cn("w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all",
                  field.editable
                    ? "bg-background border-border focus:border-brand-teal/60 focus:ring-2 focus:ring-brand-teal/10"
                    : "bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed")}
              />
            </div>
          ))}
          
          {/* Contact Phone - Separate for PhoneInput */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Contact Phone</label>
            {can("settings.manage") ? (
              <PhoneInput
                value={contactPhone}
                onChange={setContactPhone}
                placeholder="XX XXX XXXX"
              />
            ) : (
              <input
                value={contactPhone}
                disabled
                className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed"
              />
            )}
          </div>
          {can("settings.manage") && (
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
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
            <div className="size-9 rounded-xl bg-brand-teal/10 flex items-center justify-center">
              <CreditCard className="size-4 text-brand-teal" />
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
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-start gap-2">
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">Bank account changes require NamibraPay Compliance approval and take 2–5 business days to take effect.</p>
              </div>
              <button 
                onClick={() => setShowBankChangeModal(true)}
                className="px-4 py-2.5 border border-brand-navy/30 text-brand-navy rounded-xl text-sm font-medium hover:bg-brand-navy/5 transition-all">
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
                        feeBearer === opt.key ? "border-brand-teal/40 bg-brand-teal/5" : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="fee_bearer" 
                          checked={feeBearer === opt.key}
                          onChange={() => setFeeBearer(opt.key)}
                          className="accent-brand-teal size-3" 
                        />
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground pl-5">{opt.desc}</p>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={handleSaveFeeBearer}
                  className="w-full px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
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
              <div className="size-9 rounded-xl bg-brand-lavender/10 flex items-center justify-center">
                <Bell className="size-4 text-[#5c3d9e]" />
              </div>
              <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: "successfulTransaction", label: "Successful transaction", sub: "Email & SMS on each collection" },
                { key: "failedTransaction", label: "Failed transaction", sub: "Email on failures" },
                { key: "settlementProcessed", label: "Settlement processed", sub: "Email when bank settles funds" },
                { key: "payoutCompleted", label: "Payout completed", sub: "Email when payout hits your bank" },
                { key: "securityEvents", label: "Security events", sub: "Email on login, key changes" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.sub}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notificationPrefs[n.key as keyof typeof notificationPrefs]}
                    onChange={(e) => setNotificationPrefs(prev => ({ ...prev, [n.key]: e.target.checked }))}
                    className="accent-brand-teal size-4 cursor-pointer" 
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={handleSaveNotifications}
              className="w-full px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
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
            <div className="size-9 rounded-xl bg-brand-mint/10 flex items-center justify-center">
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
            <button 
              onClick={() => setShowChangePasswordModal(true)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-all border border-border">
              Change password
            </button>
            <button 
              onClick={() => setShowActiveSessionsModal(true)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-all border border-border">
              View active sessions
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bank Account Change Request Modal */}
      <Modal
        isOpen={showBankChangeModal}
        onClose={() => {
          setShowBankChangeModal(false);
          setNewBankName("");
          setNewAccountNumber("");
          setNewAccountName("");
          setChangeReason("");
        }}
        title="Request Bank Account Change"
        description="Submit a request to update your payout bank account"
        size="md"
      >
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Compliance Review Required</p>
              <p className="text-xs text-amber-700">
                Bank account changes require verification by NamibraPay Compliance team. This process typically takes 2–5 business days. You'll receive an email notification once reviewed.
              </p>
            </div>
          </div>

          <FormField label="Bank Name" required>
            <CustomSelect
              value={newBankName}
              onChange={setNewBankName}
              options={BANK_OPTIONS_GHANA}
              placeholder="Select bank"
            />
          </FormField>

          <FormField label="Account Number" required>
            <Input
              type="text"
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value)}
              placeholder="Enter account number"
            />
          </FormField>

          <FormField label="Account Name" required>
            <Input
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="Must match business name"
            />
          </FormField>

          <FormField label="Reason for Change" required>
            <Textarea
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Briefly explain why you need to change the bank account..."
              rows={3}
            />
          </FormField>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              onClick={() => {
                setShowBankChangeModal(false);
                setNewBankName("");
                setNewAccountNumber("");
                setNewAccountName("");
                setChangeReason("");
              }}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestBankChange}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 order-1 sm:order-2"
            >
              <FileText className="size-3.5 sm:size-4" />
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
        title="Change Password"
        description="Update your account password"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Current Password" required>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </FormField>

          <FormField label="New Password" required description="Must be at least 8 characters">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </FormField>

          <FormField label="Confirm New Password" required>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </FormField>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Security Notice</p>
              <p className="text-xs text-blue-700">
                Changing your password will log you out of all other active sessions on other devices for security.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              onClick={() => {
                setShowChangePasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 order-1 sm:order-2"
            >
              <Lock className="size-3.5 sm:size-4" />
              Change Password
            </button>
          </div>
        </div>
      </Modal>

      {/* Active Sessions Modal */}
      <Modal
        isOpen={showActiveSessionsModal}
        onClose={() => setShowActiveSessionsModal(false)}
        title="Active Sessions"
        description="Devices and browsers currently logged into your account"
        size="md"
      >
        <div className="space-y-3">
          {[
            { 
              id: "1", 
              device: "Windows PC · Chrome", 
              location: "Accra, Ghana", 
              ip: "102.176.45.xx", 
              lastActive: "Active now", 
              current: true 
            },
            { 
              id: "2", 
              device: "iPhone · Safari", 
              location: "Accra, Ghana", 
              ip: "102.176.45.xx", 
              lastActive: "2 hours ago", 
              current: false 
            },
            { 
              id: "3", 
              device: "MacBook Pro · Safari", 
              location: "Tema, Ghana", 
              ip: "197.251.23.xx", 
              lastActive: "Yesterday", 
              current: false 
            },
          ].map((session) => (
            <div key={session.id} className={cn(
              "p-4 rounded-xl border transition-all",
              session.current ? "bg-emerald-50 border-emerald-200" : "bg-card border-border"
            )}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "size-9 rounded-lg flex items-center justify-center shrink-0",
                    session.current ? "bg-emerald-100" : "bg-muted"
                  )}>
                    <Monitor className={cn(
                      "size-4",
                      session.current ? "text-emerald-600" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn(
                        "text-sm font-medium",
                        session.current ? "text-emerald-900" : "text-foreground"
                      )}>
                        {session.device}
                      </p>
                      {session.current && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs",
                      session.current ? "text-emerald-700" : "text-muted-foreground"
                    )}>
                      {session.location} · {session.ip}
                    </p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      session.current ? "text-emerald-600" : "text-muted-foreground"
                    )}>
                      {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <button 
                    onClick={() => {
                      showToast("success", "Session Terminated", `Logged out of ${session.device}`);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline shrink-0"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              showToast("success", "All Sessions Terminated", "You've been logged out of all other devices. This session remains active.");
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs sm:text-sm font-medium transition-all"
          >
            Revoke All Other Sessions
          </button>
        </div>
      </Modal>
    </div>
  );
}
