'use client';

import { useState } from "react";
import {
  Settings, DollarSign, Shield, Clock, Users, Bell, Globe,
  Save, RotateCw, CheckCircle, AlertTriangle, Info, Lock,
  Mail, Smartphone, TrendingUp, Percent, Calendar, Edit, UserPlus,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField, Input, Select } from "@/components/ui/form-field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { usePermission } from "@/hooks/use-role";
import CustomSelect from "@/components/ui/Select";

// ── Tabs ────────────────────────────────────────────────────────────────────
type Tab = "fees" | "limits" | "payouts" | "team" | "notifications" | "system";

const TABS: { id: Tab; label: string }[] = [
  { id: "fees", label: "Fee Schedules" },
  { id: "limits", label: "Transaction Limits" },
  { id: "payouts", label: "Payout Windows" },
  { id: "team", label: "Team Management" },
  { id: "notifications", label: "Notifications" },
  { id: "system", label: "System Config" },
];

// ── Main Component ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const canView = usePermission("settings.view");
  const canEdit = usePermission("settings.edit");

  const [tab, setTab] = useState<Tab>("fees");
  const [hasChanges, setHasChanges] = useState(false);

  // Fee Schedule State
  const [collectionFee, setCollectionFee] = useState(1.8);
  const [payoutFee, setPayoutFee] = useState(1.2);
  const [minimumFee, setMinimumFee] = useState(0.5);

  // Transaction Limits State
  const [maxSingleTransaction, setMaxSingleTransaction] = useState(50000);
  const [dailyTransactionLimit, setDailyTransactionLimit] = useState(200000);
  const [monthlyTransactionLimit, setMonthlyTransactionLimit] = useState(5000000);

  // Team invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteName, setInviteName] = useState("");

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    systemUpdates: false,
  });

  // Save confirmation
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const { showToast } = useToast();

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Settings className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Platform Settings is available to Finance Managers and Super Admin roles only.</p>
      </div>
    );
  }

  const handleSave = () => {
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    // Simulate save
    setHasChanges(false);
    setShowSaveConfirm(false);
    showToast("success", "Settings Saved", "Platform configuration has been updated successfully");
  };

  const handleReset = () => {
    // Reset to defaults
    setCollectionFee(1.8);
    setPayoutFee(1.2);
    setMinimumFee(0.5);
    setMaxSingleTransaction(50000);
    setDailyTransactionLimit(200000);
    setMonthlyTransactionLimit(5000000);
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/50 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Global configuration · Fee schedules · Transaction limits · Team management
            </p>
          </div>
          {canEdit && hasChanges && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all"
              >
                <RotateCw className="size-3.5 sm:size-4" />
                <span className="hidden xs:inline">Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-brand-teal hover:bg-[#52a8a5] text-white rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                <Save className="size-3.5 sm:size-4" />
                <span className="hidden xs:inline">Save Changes</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn("px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all",
                tab === t.id ? "bg-card shadow-sm border border-border text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
        {/* ── FEE SCHEDULES TAB ── */}
        {tab === "fees" && (
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-4 sm:size-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-1">Platform-Wide Configuration</p>
                  <p className="text-xs sm:text-sm text-amber-700">
                    Fee changes apply to all merchants platform-wide. Existing transactions are not affected. 30-day notice period applies for merchant-facing fee increases.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Fee Structure */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    Current Fee Structure
                  </h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Effective since Feb 1, 2024</p>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] sm:text-xs font-medium self-start sm:self-auto">
                  <CheckCircle className="size-2.5 sm:size-3" /> Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Collection Fee */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wider">
                    Collection Fee
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <input
                        type="number"
                        value={collectionFee}
                        onChange={(e) => {
                          setCollectionFee(parseFloat(e.target.value));
                          setHasChanges(true);
                        }}
                        disabled={!canEdit}
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 bg-card border border-border rounded-lg text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
                      />
                      <span className="text-xl sm:text-2xl font-bold text-muted-foreground">%</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Fee charged on money collection</p>
                  </div>
                </div>

                {/* Payout Fee */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wider">
                    Payout Fee
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <input
                        type="number"
                        value={payoutFee}
                        onChange={(e) => {
                          setPayoutFee(parseFloat(e.target.value));
                          setHasChanges(true);
                        }}
                        disabled={!canEdit}
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 bg-card border border-border rounded-lg text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
                      />
                      <span className="text-xl sm:text-2xl font-bold text-muted-foreground">%</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Fee charged on disbursements</p>
                  </div>
                </div>

                {/* Minimum Fee */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wider">
                    Minimum Fee
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-xl font-bold text-muted-foreground">GHS</span>
                      <input
                        type="number"
                        value={minimumFee}
                        onChange={(e) => {
                          setMinimumFee(parseFloat(e.target.value));
                          setHasChanges(true);
                        }}
                        disabled={!canEdit}
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 bg-card border border-border rounded-lg text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Minimum fee per transaction</p>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                <h3 className="text-xs sm:text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Fee Examples</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[100, 1000, 10000].map((amount) => {
                    const collectionCalc = Math.max((amount * collectionFee) / 100, minimumFee);
                    const payoutCalc = Math.max((amount * payoutFee) / 100, minimumFee);
                    return (
                      <div key={amount} className="p-3 sm:p-4 bg-muted/30 rounded-xl">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">GHS {amount.toLocaleString()} transaction</p>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Collection:</span>
                            <span className="font-semibold">GHS {collectionCalc.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Payout:</span>
                            <span className="font-semibold">GHS {payoutCalc.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTION LIMITS TAB ── */}
        {tab === "limits" && (
          <div className="max-w-4xl space-y-4">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Transaction Limits
              </h2>

              <div className="space-y-4">
                {/* Single Transaction Limit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold">Maximum Single Transaction</label>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Per-transaction limit for all channels</p>
                    </div>
                    {canEdit && <Edit className="size-3.5 sm:size-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-semibold text-muted-foreground shrink-0">GHS</span>
                    <input
                      type="number"
                      value={maxSingleTransaction}
                      onChange={(e) => {
                        setMaxSingleTransaction(parseInt(e.target.value));
                        setHasChanges(true);
                      }}
                      disabled={!canEdit}
                      step="1000"
                      min="1000"
                      max="100000"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-xl text-base sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Daily Limit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold">Daily Transaction Limit</label>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Cumulative daily limit per merchant</p>
                    </div>
                    {canEdit && <Edit className="size-3.5 sm:size-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-semibold text-muted-foreground shrink-0">GHS</span>
                    <input
                      type="number"
                      value={dailyTransactionLimit}
                      onChange={(e) => {
                        setDailyTransactionLimit(parseInt(e.target.value));
                        setHasChanges(true);
                      }}
                      disabled={!canEdit}
                      step="10000"
                      min="10000"
                      max="1000000"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-xl text-base sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Monthly Limit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold">Monthly Transaction Limit</label>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Cumulative monthly limit per merchant</p>
                    </div>
                    {canEdit && <Edit className="size-3.5 sm:size-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-semibold text-muted-foreground shrink-0">GHS</span>
                    <input
                      type="number"
                      value={monthlyTransactionLimit}
                      onChange={(e) => {
                        setMonthlyTransactionLimit(parseInt(e.target.value));
                        setHasChanges(true);
                      }}
                      disabled={!canEdit}
                      step="100000"
                      min="100000"
                      max="50000000"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-xl text-base sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Limit Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Single Transaction", value: maxSingleTransaction, icon: DollarSign, color: "#64c6c3" },
                { label: "Daily Limit", value: dailyTransactionLimit, icon: Clock, color: "#263b8e" },
                { label: "Monthly Limit", value: monthlyTransactionLimit, icon: TrendingUp, color: "#fedfb8" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="size-7 sm:size-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                      <Icon className="size-3.5 sm:size-4" style={{ color }} />
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    GHS {value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PAYOUT WINDOWS TAB ── */}
        {tab === "payouts" && (
          <div className="max-w-4xl">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Settlement Schedules
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { day: "Monday", time: "02:00 AM", status: "active", nextRun: "Feb 5, 2024" },
                  { day: "Wednesday", time: "02:00 AM", status: "active", nextRun: "Feb 7, 2024" },
                  { day: "Friday", time: "02:00 AM", status: "active", nextRun: "Feb 2, 2024" },
                ].map((schedule) => (
                  <div key={schedule.day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="size-8 sm:size-10 rounded-xl bg-brand-teal/20 flex items-center justify-center shrink-0">
                        <Calendar className="size-4 sm:size-5 text-[#1a6e6c]" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs sm:text-sm">{schedule.day} Settlement</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Runs at {schedule.time} GMT</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-11 sm:pl-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Next run</p>
                        <p className="text-xs sm:text-sm font-semibold">{schedule.nextRun}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                        <CheckCircle className="size-2.5" /> {schedule.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TEAM MANAGEMENT TAB ── */}
        {tab === "team" && (
          <div className="max-w-4xl">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Platform Team
                </h2>
                {canEdit && (
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-brand-teal hover:bg-[#52a8a5] text-white rounded-xl text-xs sm:text-sm font-medium transition-all self-start sm:self-auto"
                  >
                    <UserPlus className="size-3.5 sm:size-4" /> Invite User
                  </button>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                {[
                  { name: "Kwame Mensah", role: "Super Admin", email: "kwame@namibrapay.com", status: "active" },
                  { name: "Yaw Boateng", role: "Finance Manager", email: "yaw@namibrapay.com", status: "active" },
                  { name: "Esi Mensah", role: "Compliance Manager", email: "esi@namibrapay.com", status: "active" },
                  { name: "Kwesi Osei", role: "Support Lead", email: "kwesi@namibrapay.com", status: "active" },
                  { name: "Kofi Asante", role: "Platform Engineer", email: "kofi@namibrapay.com", status: "active" },
                ].map((user) => (
                  <div key={user.email} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border border-border rounded-xl hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="size-8 sm:size-10 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0">
                        <span className="font-bold text-xs sm:text-sm text-[#1a6e6c]">{user.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs sm:text-sm truncate">{user.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 pl-11 sm:pl-0">
                      <span className="px-2 sm:px-3 py-1 bg-muted rounded-lg text-[10px] sm:text-xs font-medium">{user.role}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                        <CheckCircle className="size-2.5" /> {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {tab === "notifications" && (
          <div className="max-w-4xl">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Notification Preferences
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { key: "emailNotifications", title: "Email Notifications", description: "Receive email alerts for critical events", icon: Mail },
                  { key: "smsNotifications", title: "SMS Notifications", description: "Receive SMS for high-priority alerts", icon: Smartphone },
                  { key: "transactionAlerts", title: "Transaction Alerts", description: "Daily transaction summary reports", icon: DollarSign },
                  { key: "securityAlerts", title: "Security Alerts", description: "Immediate alerts for security events", icon: Shield },
                  { key: "systemUpdates", title: "System Updates", description: "Platform maintenance and update notifications", icon: Globe },
                ].map((notif) => {
                  const isEnabled = notifications[notif.key as keyof typeof notifications];
                  return (
                    <div key={notif.title} className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-border rounded-xl">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="size-8 sm:size-10 rounded-xl bg-brand-navy/10 flex items-center justify-center shrink-0">
                          <notif.icon className="size-4 sm:size-5 text-brand-navy" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm">{notif.title}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{notif.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (canEdit) {
                            setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key as keyof typeof prev] }));
                            setHasChanges(true);
                          }
                        }}
                        className={cn("relative w-11 sm:w-12 h-5 sm:h-6 rounded-full transition-colors shrink-0",
                          isEnabled ? "bg-brand-teal" : "bg-muted",
                          canEdit ? "cursor-pointer" : "cursor-not-allowed opacity-50")}
                        disabled={!canEdit}
                      >
                        <span className={cn("absolute top-0.5 size-4 sm:size-5 bg-white rounded-full shadow-sm transition-transform",
                          isEnabled ? "right-0.5" : "left-0.5")}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SYSTEM CONFIG TAB ── */}
        {tab === "system" && (
          <div className="max-w-4xl space-y-4">
            {/* System Info */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                System Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Platform Details</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Version</span>
                      <span className="font-semibold font-mono">v2.4.1</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Environment</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] sm:text-xs font-semibold">Production</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Region</span>
                      <span className="font-semibold text-right">West Africa (Ghana)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-semibold">99.98%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Last Updated</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Fee Structure</span>
                      <span className="font-semibold">Feb 1, 2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Transaction Limits</span>
                      <span className="font-semibold">Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Payout Windows</span>
                      <span className="font-semibold">Jan 1, 2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">System Config</span>
                      <span className="font-semibold">Feb 1, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Lock className="size-5 text-brand-navy shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Security & Compliance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All configuration changes are logged in the audit trail. Critical changes require Super Admin approval and are subject to 24-hour notice period.
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle className="size-3" /> SSL Encrypted
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle className="size-3" /> Audit Logged
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle className="size-3" /> Bank of Ghana Compliant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Team Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail("");
          setInviteRole("");
          setInviteName("");
        }}
        title="Invite Team Member"
        description="Add a new user to the platform team"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Email Invitation</p>
              <p className="text-sm text-blue-700">
                An invitation email will be sent with setup instructions. The user must complete account setup within 7 days.
              </p>
            </div>
          </div>

          {/* Full Name */}
          <FormField
            label="Full Name"
            required
            description="User's full name as it will appear in the system"
          >
            <Input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g., Kwame Mensah"
            />
          </FormField>

          {/* Email Address */}
          <FormField
            label="Email Address"
            required
            description="Work email for login and notifications"
          >
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@namibrapay.com"
            />
          </FormField>

          {/* Role Selection */}
          <FormField
            label="Platform Role"
            required
            description="Determines access permissions and capabilities"
          >
            <CustomSelect
              value={inviteRole}
              onChange={setInviteRole}
              options={[
                { value: "super_admin", label: "Super Admin (Full Access)" },
                { value: "finance_manager", label: "Finance Manager (Treasury & Fees)" },
                { value: "compliance_manager", label: "Compliance Manager (KYC & AML)" },
                { value: "support_lead", label: "Support Lead (Tickets & Disputes)" },
                { value: "platform_engineer", label: "Platform Engineer (Providers & Config)" },
              ]}
              placeholder="Select role..."
            />
          </FormField>

          {/* Role Permissions Info */}
          {inviteRole && (
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Role Permissions</p>
              <ul className="space-y-1.5 text-sm">
                {inviteRole === "super_admin" && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Full platform access</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> User management</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> All approval workflows</li>
                  </>
                )}
                {inviteRole === "finance_manager" && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Treasury management</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Fee configuration</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Payout approvals</li>
                  </>
                )}
                {inviteRole === "compliance_manager" && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> KYC review & approval</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> AML monitoring</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Compliance reporting</li>
                  </>
                )}
                {inviteRole === "support_lead" && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Ticket management</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Dispute handling</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Refund requests</li>
                  </>
                )}
                {inviteRole === "platform_engineer" && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Provider configuration</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> Credential management</li>
                    <li className="flex items-center gap-2"><CheckCircle className="size-3.5 text-emerald-600" /> System monitoring</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowInviteModal(false);
                setInviteEmail("");
                setInviteRole("");
                setInviteName("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!inviteEmail.trim() || !inviteRole || !inviteName.trim()}
              onClick={() => {
                showToast("success", "Invitation Sent", `Invite email sent to ${inviteEmail}`);
                setShowInviteModal(false);
                setInviteEmail("");
                setInviteRole("");
                setInviteName("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-teal hover:bg-[#52b4b1] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </Modal>

      {/* Save Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={confirmSave}
        title="Save Configuration Changes?"
        description="This will update the platform settings and apply them immediately to all merchants."
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="default"
      />
    </div>
  );
}
