'use client';

import { useState } from "react";
import {
  Cpu, Activity, AlertTriangle, CheckCircle, Clock,
  Server, Key, RotateCw, Settings,
  AlertCircle, ChevronRight, Shield, Zap, BarChart2, GitBranch, XCircle, Plus, Info,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField, Input, Textarea, Select } from "@/components/ui/form-field";
import DatePicker from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { usePermission } from "@/hooks/use-role";
import CustomSelect from "@/components/ui/select";
import {
  mockProviderDetails,
  mockProviderCredentials,
  mockRoutingRules,
  mockMaintenanceWindows,
  mockProviderIncidents,
  getProviderStatusColor,
  getCredentialStatusColor,
  getRoutingRuleStatusColor,
} from "@/lib/providers-mock-data";

// ── Tabs ────────────────────────────────────────────────────────────────────
type Tab = "health" | "routing" | "credentials" | "maintenance" | "incidents";

const TABS: { id: Tab; label: string }[] = [
  { id: "health", label: "Health Monitoring" },
  { id: "routing", label: "Routing Rules" },
  { id: "credentials", label: "Credentials" },
  { id: "maintenance", label: "Maintenance" },
  { id: "incidents", label: "Incidents" },
];

// ── Main Component ──────────────────────────────────────────────────────────
export default function ProvidersPage() {
  const canView = usePermission("providers.view");
  const canEdit = usePermission("providers.edit");

  const [tab, setTab] = useState<Tab>("health");
  const [selectedProvider, setSelectedProvider] = useState(mockProviderDetails[0]);
  
  // Add provider modal
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [newProviderName, setNewProviderName] = useState("");
  const [newProviderType, setNewProviderType] = useState("");
  const [newProviderApiUrl, setNewProviderApiUrl] = useState("");
  
  // Credential rotation modal
  const [showRotateCredentialModal, setShowRotateCredentialModal] = useState<any>(null);
  const [rotationReason, setRotationReason] = useState("");
  const [rotationNotes, setRotationNotes] = useState("");
  
  // Routing approval modal
  const [showRoutingApprovalModal, setShowRoutingApprovalModal] = useState<any>(null);
  const [approvalDecision, setApprovalDecision] = useState<"approve" | "reject" | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  
  // Schedule Maintenance modal (PD-054)
  const [showScheduleMaintenanceModal, setShowScheduleMaintenanceModal] = useState(false);
  const [maintenanceProvider, setMaintenanceProvider] = useState("");
  const [maintenanceReason, setMaintenanceReason] = useState("");
  const [maintenanceStartDate, setMaintenanceStartDate] = useState("");
  const [maintenanceStartTime, setMaintenanceStartTime] = useState("");
  const [maintenanceDuration, setMaintenanceDuration] = useState("");
  const [maintenanceNotifyMerchants, setMaintenanceNotifyMerchants] = useState(true);
  
  const { showToast } = useToast();

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Cpu className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Provider Engineering is available to Platform Engineers and Super Admin roles only.</p>
      </div>
    );
  }

  const operationalCount = mockProviderDetails.filter(p => p.status === "operational").length;
  const degradedCount = mockProviderDetails.filter(p => p.status === "degraded" || p.status === "down").length;
  const pendingRules = mockRoutingRules.filter(r => r.status === "pending_approval").length;
  const expiringCreds = mockProviderCredentials.filter(c => c.status === "expiring_soon" || c.status === "expired").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Provider Engineering
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Health monitoring · Routing rules · Credential management · API configuration
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
              <CheckCircle className="size-3" />
              {operationalCount} operational
            </span>
            {degradedCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                <AlertTriangle className="size-3" />
                {degradedCount} degraded
              </span>
            )}
            {pendingRules > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium">
                <Clock className="size-3" />
                {pendingRules} rule{pendingRules > 1 ? "s" : ""} pending
              </span>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                tab === t.id ? "bg-card shadow-sm border border-border text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
              {t.label}
              {t.id === "routing" && pendingRules > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[9px] font-bold">{pendingRules}</span>
              )}
              {t.id === "credentials" && expiringCreds > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold">{expiringCreds}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ── HEALTH MONITORING TAB ── */}
        {tab === "health" && (
          <div className="space-y-4">
            {/* Provider Cards Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {mockProviderDetails.map((provider) => {
                const statusCfg = getProviderStatusColor(provider.status);
                const isDown = provider.status === "down";
                
                return (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider)}
                    className={cn("bg-card border rounded-2xl p-5 text-left transition-all hover:shadow-md",
                      selectedProvider.id === provider.id ? "border-brand-teal shadow-sm" : "border-border",
                      isDown && "border-red-200")}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold font-mono text-muted-foreground">{provider.shortCode}</span>
                      <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusCfg)}>
                        {provider.status === "operational" ? <CheckCircle className="size-2.5" /> :
                         provider.status === "degraded" ? <AlertTriangle className="size-2.5" /> :
                         provider.status === "down" ? <XCircle className="size-2.5" /> :
                         <Clock className="size-2.5" />}
                        {provider.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 truncate">{provider.name}</p>
                    
                    {/* Metrics */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className={cn("font-bold", provider.successRate >= 95 ? "text-emerald-600" : "text-red-600")}>
                          {provider.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Latency (p95)</span>
                        <span className={cn("font-bold", provider.p95LatencyMs < 1000 ? "text-emerald-600" : "text-amber-600")}>
                          {provider.p95LatencyMs}ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Throughput</span>
                        <span className="font-bold">{provider.throughput}/min</span>
                      </div>
                    </div>

                    {/* Uptime Bar */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Uptime (30d)</span>
                        <span className="font-semibold">{provider.uptime}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all",
                            provider.uptime >= 99 ? "bg-emerald-500" : provider.uptime >= 95 ? "bg-amber-500" : "bg-red-500")}
                          style={{ width: `${provider.uptime}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Provider Details */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    {selectedProvider.name}
                  </h2>
                  <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                    API v{selectedProvider.apiVersion} · Last health check {new Date(selectedProvider.lastHealthCheck).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {canEdit && (
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all">
                    <Settings className="size-4" /> Configure
                  </button>
                )}
              </div>

              {/* Latency Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "p50 Latency", value: `${selectedProvider.p50LatencyMs}ms`, color: "#64c6c3", icon: Zap },
                  { label: "p95 Latency", value: `${selectedProvider.p95LatencyMs}ms`, color: "#263b8e", icon: Activity },
                  { label: "p99 Latency", value: `${selectedProvider.p99LatencyMs}ms`, color: "#fedfb8", icon: BarChart2 },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-muted/30 border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                        <Icon className="size-3.5" style={{ color }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>API Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-semibold">{selectedProvider.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span className="font-semibold text-red-600">{selectedProvider.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Throughput</span>
                      <span className="font-semibold">{selectedProvider.throughput} txn/min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg Latency</span>
                      <span className="font-semibold">{selectedProvider.avgLatencyMs}ms</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">API Version</span>
                      <span className="font-semibold font-mono">{selectedProvider.apiVersion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Supported Channels</span>
                      <span className="font-semibold">{selectedProvider.supportedChannels.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Collection Rate</span>
                      <span className="font-semibold">{selectedProvider.feeSchedule.collectionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Payout Rate</span>
                      <span className="font-semibold">{selectedProvider.feeSchedule.payoutRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROUTING RULES TAB ── */}
        {tab === "routing" && (
          <div className="space-y-4">
            {/* Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Super Admin Approval Required</p>
                  <p className="text-sm text-amber-700">
                    All routing rule changes require Super Admin approval before going live. Changes are staged until approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Rule Button */}
            {canEdit && (
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal hover:bg-[#52a8a5] text-white rounded-xl text-sm font-medium transition-all">
                  <GitBranch className="size-4" /> Add Routing Rule
                </button>
              </div>
            )}

            {/* Routing Rules List */}
            <div className="space-y-3">
              {mockRoutingRules.map((rule) => {
                const statusCfg = getRoutingRuleStatusColor(rule.status);
                const isPending = rule.status === "pending_approval";
                
                return (
                  <div key={rule.id} className={cn("bg-card border rounded-2xl p-5",
                    isPending ? "border-amber-200 shadow-sm" : "border-border")}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="size-9 rounded-xl bg-brand-teal/20 flex items-center justify-center shrink-0">
                          <GitBranch className="size-4 text-[#1a6e6c]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-semibold text-sm">{rule.name}</p>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusCfg)}>
                              {rule.status === "active" ? <CheckCircle className="size-2.5" /> :
                               rule.status === "pending_approval" ? <Clock className="size-2.5" /> :
                               <XCircle className="size-2.5" />}
                              {rule.status.replace(/_/g, " ")}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full font-mono">
                              Priority {rule.priority}
                            </span>
                            {!rule.enabled && (
                              <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full font-medium">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ChevronRight className="size-3" />
                              {rule.ruleType.replace(/_/g, " ")}
                            </span>
                            <span className="flex items-center gap-1">
                              Target: <span className="font-mono text-foreground">{rule.targetProvider}</span>
                            </span>
                            {rule.fallbackProvider && (
                              <span className="flex items-center gap-1">
                                Fallback: <span className="font-mono text-foreground">{rule.fallbackProvider}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {canEdit && rule.status === "pending_approval" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => {
                              setShowRoutingApprovalModal(rule);
                              setApprovalDecision("reject");
                            }}
                            className="px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-red-50 transition-all"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => {
                              setShowRoutingApprovalModal(rule);
                              setApprovalDecision("approve");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Rule Details */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Created by</span>
                        <p className="font-medium mt-0.5">{rule.createdBy} · {formatDate(rule.createdAt)}</p>
                      </div>
                      {rule.approvedBy && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Approved by</span>
                          <p className="font-medium mt-0.5">{rule.approvedBy} · {formatDate(rule.approvedAt!)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CREDENTIALS TAB ── */}
        {tab === "credentials" && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Credentials", value: String(mockProviderCredentials.length), color: "#64c6c3", icon: Key },
                { label: "Active", value: String(mockProviderCredentials.filter(c => c.status === "active").length), color: "#10b981", icon: CheckCircle },
                { label: "Expiring Soon", value: String(mockProviderCredentials.filter(c => c.status === "expiring_soon").length), color: "#f59e0b", icon: AlertTriangle },
                { label: "Expired", value: String(mockProviderCredentials.filter(c => c.status === "expired").length), color: "#ef4444", icon: XCircle },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                    <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                      <Icon className="size-4" style={{ color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Credentials Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Provider", "Credential", "Type", "Status", "Last Rotated", "Expires", "Schedule", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockProviderCredentials.map((cred) => {
                    const statusCfg = getCredentialStatusColor(cred.status);
                    const isExpired = cred.status === "expired";
                    const isExpiring = cred.status === "expiring_soon";
                    
                    return (
                      <tr key={cred.id} className={cn("border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                        (isExpired || isExpiring) && "bg-red-50/30")}>
                        <td className="pl-5 pr-4 py-3.5">
                          <span className="text-sm font-medium">{cred.providerName.split(" ")[0]}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-medium">{cred.label}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                            {cred.credentialType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusCfg)}>
                            {cred.status === "active" ? <CheckCircle className="size-2.5" /> :
                             cred.status === "expiring_soon" ? <Clock className="size-2.5" /> :
                             <AlertTriangle className="size-2.5" />}
                            {cred.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {new Date(cred.lastRotated).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm">{new Date(cred.expiresAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                          <p className={cn("text-xs", isExpired ? "text-red-600" : isExpiring ? "text-amber-600" : "text-muted-foreground")}>
                            {isExpired ? "Expired" : `${cred.daysUntilExpiry} days`}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {cred.rotationSchedule}
                        </td>
                        <td className="px-4 py-3.5">
                          {canEdit && (
                            <button 
                              onClick={() => setShowRotateCredentialModal(cred)}
                              className="p-1.5 hover:bg-muted rounded-lg transition-all"
                              title="Rotate credential"
                            >
                              <RotateCw className="size-3.5 text-muted-foreground" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MAINTENANCE TAB ── */}
        {tab === "maintenance" && (
          <div className="space-y-4">
            {/* Header with Schedule button */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Scheduled maintenance windows and provider downtimes</p>
              {canEdit && (
                <button
                  onClick={() => setShowScheduleMaintenanceModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all"
                >
                  <Plus className="size-4" /> Schedule Maintenance
                </button>
              )}
            </div>

            {mockMaintenanceWindows.map((maint) => {
              const statusColors = {
                scheduled: "bg-blue-50 text-blue-700 border-blue-200",
                in_progress: "bg-amber-50 text-amber-700 border-amber-200",
                completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                cancelled: "bg-muted text-muted-foreground border-border",
              }[maint.status];

              return (
                <div key={maint.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold">{maint.providerName}</span>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusColors)}>
                          {maint.status.replace(/_/g, " ")}
                        </span>
                        {maint.type === "emergency" && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle className="size-2.5" /> Emergency
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{maint.reason}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Start</span>
                          <p className="font-medium mt-0.5">{formatDate(maint.scheduledStart)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End</span>
                          <p className="font-medium mt-0.5">{formatDate(maint.scheduledEnd)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <p className="font-medium mt-0.5">{maint.duration} minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── INCIDENTS TAB ── */}
        {tab === "incidents" && (
          <div className="space-y-4">
            {mockProviderIncidents.map((incident) => {
              const severityColors = {
                critical: "bg-red-100 text-red-700 border-red-200",
                high: "bg-orange-100 text-orange-700 border-orange-200",
                medium: "bg-amber-100 text-amber-700 border-amber-200",
                low: "bg-blue-100 text-blue-700 border-blue-200",
              }[incident.severity];

              const statusColors = {
                active: "bg-red-50 text-red-700 border-red-200",
                investigating: "bg-amber-50 text-amber-700 border-amber-200",
                resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
              }[incident.status];

              return (
                <div key={incident.id} className={cn("bg-card border rounded-2xl p-5",
                  incident.severity === "critical" ? "border-red-200 shadow-sm" : "border-border")}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-semibold">{incident.providerName}</span>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase", severityColors)}>
                          {incident.severity}
                        </span>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusColors)}>
                          {incident.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        {incident.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Started {formatDate(incident.startedAt)}</span>
                        {incident.resolvedAt && (
                          <>
                            <span>·</span>
                            <span>Resolved {formatDate(incident.resolvedAt)}</span>
                            <span>·</span>
                            <span>Duration: {incident.duration}min</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{incident.impactedTransactions} transactions impacted</span>
                      </div>
                      {incident.rootCause && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-xs font-semibold text-emerald-900 mb-1">Root Cause</p>
                          <p className="text-xs text-emerald-700">{incident.rootCause}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Provider Modal */}
      <Modal
        isOpen={showAddProviderModal}
        onClose={() => {
          setShowAddProviderModal(false);
          setNewProviderName("");
          setNewProviderType("");
          setNewProviderApiUrl("");
        }}
        title="Add Bank Provider"
        description="Configure a new bank partner connection"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Configuration Required</p>
              <p className="text-sm text-blue-700">
                After adding the provider, you'll need to configure credentials, API endpoints, and routing rules before it can process transactions.
              </p>
            </div>
          </div>

          {/* Provider Name */}
          <FormField
            label="Provider Name"
            required
            description="Display name for the bank provider"
          >
            <Input
              type="text"
              value={newProviderName}
              onChange={(e) => setNewProviderName(e.target.value)}
              placeholder="e.g., MTN Mobile Money"
            />
          </FormField>

          {/* Provider Type */}
          <FormField
            label="Provider Type"
            required
            description="Category of mobile money provider"
          >
            <CustomSelect
              value={newProviderType}
              onChange={setNewProviderType}
              options={[
                { value: "mobile_money", label: "Mobile Money (MNO)" },
                { value: "aggregator", label: "Payment Aggregator" },
                { value: "bank", label: "Bank Gateway" },
                { value: "card", label: "Card Processor" },
              ]}
              placeholder="Select type..."
            />
          </FormField>

          {/* API Base URL */}
          <FormField
            label="API Base URL"
            required
            description="Production endpoint for the provider API"
          >
            <Input
              type="url"
              value={newProviderApiUrl}
              onChange={(e) => setNewProviderApiUrl(e.target.value)}
              placeholder="https://api.provider.com/v1"
            />
          </FormField>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              New providers are created in <strong>sandbox mode</strong> by default. You must complete full configuration and testing before enabling live transactions.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowAddProviderModal(false);
                setNewProviderName("");
                setNewProviderType("");
                setNewProviderApiUrl("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!newProviderName.trim() || !newProviderType || !newProviderApiUrl.trim()}
              onClick={() => {
                showToast("success", "Provider Added", `${newProviderName} has been added in sandbox mode`);
                setShowAddProviderModal(false);
                setNewProviderName("");
                setNewProviderType("");
                setNewProviderApiUrl("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-teal hover:bg-[#52b4b1] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Provider
            </button>
          </div>
        </div>
      </Modal>

      {/* Rotate Credential Modal */}
      <Modal
        isOpen={showRotateCredentialModal !== null}
        onClose={() => {
          setShowRotateCredentialModal(null);
          setRotationReason("");
          setRotationNotes("");
        }}
        title="Rotate Credential"
        description={showRotateCredentialModal ? `${showRotateCredentialModal.providerName} - ${showRotateCredentialModal.label}` : ""}
        size="md"
      >
        {showRotateCredentialModal && (
          <div className="space-y-6">
            {/* Warning Banner */}
            <div className={cn("rounded-xl p-4 flex items-start gap-3",
              showRotateCredentialModal.status === "expired" ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200")}>
              <AlertTriangle className={cn("size-5 shrink-0 mt-0.5",
                showRotateCredentialModal.status === "expired" ? "text-red-600" : "text-amber-600")} />
              <div>
                <p className={cn("text-sm font-semibold mb-1",
                  showRotateCredentialModal.status === "expired" ? "text-red-900" : "text-amber-900")}>
                  {showRotateCredentialModal.status === "expired" ? "Credential Expired" : "Credential Rotation"}
                </p>
                <p className={cn("text-sm",
                  showRotateCredentialModal.status === "expired" ? "text-red-700" : "text-amber-700")}>
                  {showRotateCredentialModal.status === "expired" 
                    ? "This credential has expired and must be rotated immediately to restore service."
                    : "Rotating credentials will invalidate the old credential and generate a new one. All API calls will use the new credential after rotation."}
                </p>
              </div>
            </div>

            {/* Current Credential Info */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Rotated</p>
                  <p className="font-mono text-xs">{new Date(showRotateCredentialModal.lastRotated).toLocaleDateString("en-GB")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expires</p>
                  <p className="font-mono text-xs">{new Date(showRotateCredentialModal.expiresAt).toLocaleDateString("en-GB")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Schedule</p>
                  <p className="font-semibold text-xs">{showRotateCredentialModal.rotationSchedule}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-mono text-xs">{showRotateCredentialModal.credentialType.replace(/_/g, " ")}</p>
                </div>
              </div>
            </div>

            {/* Rotation Reason */}
            <FormField
              label="Rotation Reason"
              required
              description="Why is this credential being rotated?"
            >
            <CustomSelect
              value={rotationReason}
              onChange={setRotationReason}
              options={[
                { value: "scheduled", label: "Scheduled rotation" },
                { value: "expiring", label: "Expiring soon" },
                { value: "expired", label: "Expired" },
                { value: "compromised", label: "Security compromise suspected" },
                { value: "provider_request", label: "Provider requested rotation" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select reason..."
            />
            </FormField>

            {/* Rotation Notes */}
            <FormField
              label="Rotation Notes"
              description="Optional details about this rotation"
            >
              <Textarea
                rows={3}
                value={rotationNotes}
                onChange={(e) => setRotationNotes(e.target.value)}
                placeholder="Any additional context about this rotation..."
              />
            </FormField>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                The new credential will be generated and automatically deployed. The old credential will be invalidated within 5 minutes.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setShowRotateCredentialModal(null);
                  setRotationReason("");
                  setRotationNotes("");
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={!rotationReason}
                onClick={() => {
                  showToast("success", "Credential Rotated", `New ${showRotateCredentialModal.credentialType.replace(/_/g, " ")} generated and deployed`);
                  setShowRotateCredentialModal(null);
                  setRotationReason("");
                  setRotationNotes("");
                }}
                className="flex-1 px-4 py-2.5 bg-brand-lavender hover:bg-[#a8a7dc] text-[#1a1a3e] rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className="size-4 inline mr-1.5" /> Rotate Credential
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Routing Approval Modal */}
      <Modal
        isOpen={showRoutingApprovalModal !== null}
        onClose={() => {
          setShowRoutingApprovalModal(null);
          setApprovalDecision(null);
          setApprovalNotes("");
        }}
        title={approvalDecision === "approve" ? "Approve Routing Rule" : "Reject Routing Rule"}
        description={showRoutingApprovalModal ? showRoutingApprovalModal.name : ""}
        size="md"
      >
        {showRoutingApprovalModal && (
          <div className="space-y-6">
            {/* Decision Banner */}
            <div className={cn("rounded-xl p-4 flex items-start gap-3",
              approvalDecision === "approve" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200")}>
              {approvalDecision === "approve" ? (
                <CheckCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={cn("text-sm font-semibold mb-1",
                  approvalDecision === "approve" ? "text-emerald-900" : "text-red-900")}>
                  {approvalDecision === "approve" ? "Approve Routing Change" : "Reject Routing Change"}
                </p>
                <p className={cn("text-sm",
                  approvalDecision === "approve" ? "text-emerald-700" : "text-red-700")}>
                  {approvalDecision === "approve" 
                    ? "This routing rule will go live immediately and affect transaction routing for matching criteria."
                    : "This routing rule will be rejected and removed from the staging area. The requester will be notified."}
                </p>
              </div>
            </div>

            {/* Rule Details */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rule Type</p>
                <p className="text-sm font-semibold">{showRoutingApprovalModal.ruleType.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{showRoutingApprovalModal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target Provider</p>
                  <p className="text-sm font-mono">{showRoutingApprovalModal.targetProvider}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <p className="text-sm font-semibold">{showRoutingApprovalModal.priority}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created By</p>
                <p className="text-sm">{showRoutingApprovalModal.createdBy} · {new Date(showRoutingApprovalModal.createdAt).toLocaleDateString("en-GB")}</p>
              </div>
            </div>

            {/* Approval Notes */}
            <FormField
              label={approvalDecision === "approve" ? "Approval Notes" : "Rejection Reason"}
              required={approvalDecision === "reject"}
              description={approvalDecision === "approve" ? "Optional comments about this approval" : "Explain why this rule is being rejected"}
            >
              <Textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={approvalDecision === "approve" 
                  ? "Verified routing logic, approved for production..."
                  : "Rule conflicts with existing routing, requires revision..."}
              />
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setShowRoutingApprovalModal(null);
                  setApprovalDecision(null);
                  setApprovalNotes("");
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={approvalDecision === "reject" && !approvalNotes.trim()}
                onClick={() => {
                  const action = approvalDecision === "approve" ? "approved" : "rejected";
                  showToast(
                    approvalDecision === "approve" ? "success" : "warning",
                    `Routing Rule ${action.charAt(0).toUpperCase() + action.slice(1)}`,
                    `${showRoutingApprovalModal.name} has been ${action}`
                  );
                  setShowRoutingApprovalModal(null);
                  setApprovalDecision(null);
                  setApprovalNotes("");
                }}
                className={cn("flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  approvalDecision === "approve" 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white")}
              >
                {approvalDecision === "approve" ? "Approve Rule" : "Reject Rule"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Schedule Maintenance Modal (PD-054) ── */}
      <Modal
        isOpen={showScheduleMaintenanceModal}
        onClose={() => {
          setShowScheduleMaintenanceModal(false);
          setMaintenanceProvider("");
          setMaintenanceReason("");
          setMaintenanceStartDate("");
          setMaintenanceStartTime("");
          setMaintenanceDuration("");
          setMaintenanceNotifyMerchants(true);
        }}
        title="Schedule Maintenance Window"
        description="Plan a maintenance window for a network service provider"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Service Impact</p>
              <p className="text-sm text-amber-700">
                During maintenance, transactions for the selected provider will be unavailable. Merchants will be notified automatically if enabled.
              </p>
            </div>
          </div>

          {/* Provider Selection */}
          <FormField
            label="Provider"
            required
            description="Select network service provider"
          >
            <CustomSelect
              value={maintenanceProvider}
              onChange={setMaintenanceProvider}
              options={mockProviderDetails.map(p => ({ value: p.id, label: p.name }))}
              placeholder="Select provider..."
            />
          </FormField>

          {/* Reason */}
          <FormField
            label="Maintenance Reason"
            required
            description="Briefly describe the maintenance activity"
          >
            <Textarea
              value={maintenanceReason}
              onChange={(e) => setMaintenanceReason(e.target.value)}
              placeholder="e.g., Server upgrade, security patch, network optimization"
              rows={3}
            />
          </FormField>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              required
              description="Maintenance date"
            >
              <DatePicker
                value={maintenanceStartDate}
                onChange={setMaintenanceStartDate}
                placeholder="Select date"
              />
            </FormField>
            <FormField
              label="Start Time"
              required
              description="Local time (GMT)"
            >
              <Input
                type="time"
                value={maintenanceStartTime}
                onChange={(e) => setMaintenanceStartTime(e.target.value)}
              />
            </FormField>
          </div>

          {/* Duration */}
          <FormField
            label="Duration (minutes)"
            required
            description="Expected maintenance window length"
          >
            <CustomSelect
              value={maintenanceDuration}
              onChange={setMaintenanceDuration}
              options={[
                { value: "30", label: "30 minutes" },
                { value: "60", label: "1 hour" },
                { value: "120", label: "2 hours" },
                { value: "180", label: "3 hours" },
                { value: "240", label: "4 hours" },
                { value: "360", label: "6 hours" },
                { value: "480", label: "8 hours" },
                { value: "720", label: "12 hours" },
              ]}
              placeholder="Select duration..."
            />
          </FormField>

          {/* Notification Toggle */}
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceNotifyMerchants}
                onChange={(e) => setMaintenanceNotifyMerchants(e.target.checked)}
                className="mt-1 size-4 rounded border-border text-brand-navy focus:ring-2 focus:ring-brand-navy/20"
              />
              <div>
                <p className="text-sm font-semibold">Notify Affected Merchants</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Send email notification to all merchants using this provider about the scheduled maintenance
                </p>
              </div>
            </label>
          </div>

          {/* Preview */}
          {maintenanceProvider && maintenanceStartDate && maintenanceStartTime && maintenanceDuration && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-900 mb-2">Preview</p>
              <p className="text-sm text-blue-800">
                {mockProviderDetails.find(p => p.id === maintenanceProvider)?.name} will be unavailable from{" "}
                <span className="font-semibold">{maintenanceStartDate} at {maintenanceStartTime}</span> for{" "}
                <span className="font-semibold">{maintenanceDuration} minutes</span>.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowScheduleMaintenanceModal(false);
                setMaintenanceProvider("");
                setMaintenanceReason("");
                setMaintenanceStartDate("");
                setMaintenanceStartTime("");
                setMaintenanceDuration("");
                setMaintenanceNotifyMerchants(true);
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!maintenanceProvider || !maintenanceReason.trim() || !maintenanceStartDate || !maintenanceStartTime || !maintenanceDuration}
              onClick={() => {
                const providerName = mockProviderDetails.find(p => p.id === maintenanceProvider)?.name;
                showToast(
                  "success",
                  "Maintenance Scheduled",
                  `${providerName} maintenance window created. ${maintenanceNotifyMerchants ? "Notifications sent to affected merchants." : "No notifications sent."}`
                );
                setShowScheduleMaintenanceModal(false);
                setMaintenanceProvider("");
                setMaintenanceReason("");
                setMaintenanceStartDate("");
                setMaintenanceStartTime("");
                setMaintenanceDuration("");
                setMaintenanceNotifyMerchants(true);
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule Maintenance
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
