'use client';

import { useState } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  RefreshCw,
  Check,
  AlertTriangle,
  Globe,
  Send,
  Terminal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { mockApiKeys, mockWebhookLogs } from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";

type Tab = "keys" | "webhooks" | "sandbox";

export default function ApiPage() {
  const { can } = useMerchantRole();
  const [tab, setTab] = useState<Tab>("keys");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNewKeySecret, setShowNewKeySecret] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs: { key: Tab; label: string; icon: typeof Globe }[] = [
    { key: "keys", label: "API Keys", icon: Zap },
    { key: "webhooks", label: "Webhooks", icon: Globe },
    ...(can("api.manage") ? [{ key: "sandbox" as const, label: "Sandbox Console", icon: Terminal }] : []),
  ];

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>API & Webhooks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your integration credentials, webhook endpoints, and test your setup.</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* API Keys */}
      {tab === "keys" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {can("api.manage") && (
            <div className="flex justify-end">
              <button onClick={() => setShowNewKeySecret(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all">
                <Plus className="size-4" />
                Generate New Key
              </button>
            </div>
          )}

          <div className="space-y-3">
            {mockApiKeys.map((key) => (
              <div key={key.id}
                className={cn("bg-card border rounded-2xl p-5 transition-all",
                  key.status === "revoked" ? "border-border/50 opacity-60" : "border-border hover:border-ring/40")}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-2 rounded-full", key.status === "active" ? "bg-emerald-400" : "bg-muted-foreground")} />
                    <div>
                      <p className="font-semibold text-sm">{key.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium",
                          key.environment === "live"
                            ? "bg-[#263b8e]/10 text-[#263b8e] border-[#263b8e]/20"
                            : "bg-amber-50 text-amber-700 border-amber-200")}>
                          {key.environment}
                        </span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize",
                          key.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border")}>
                          {key.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {can("api.manage") && key.status === "active" && (
                    <button onClick={() => setRevokeTarget(key.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-red-50 transition-all">
                      <Trash2 className="size-3" />
                      Revoke
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-muted-foreground w-20 shrink-0 font-medium uppercase tracking-wider">Public key</span>
                    <code className="text-xs font-mono flex-1 truncate">{key.publicKey}</code>
                    <button onClick={() => handleCopy(`pub-${key.id}`, key.publicKey)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      {copiedId === `pub-${key.id}` ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                    <span className="text-[10px] text-muted-foreground w-20 shrink-0 font-medium uppercase tracking-wider">Secret key</span>
                    <code className="text-xs font-mono flex-1 truncate text-muted-foreground">{key.secretKeyMasked}</code>
                    <span className="text-[10px] text-muted-foreground">Hidden</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
                  <span>Created: {formatDate(key.createdAt)}</span>
                  {key.lastUsed && <span>Last used: {formatDate(key.lastUsed)}</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Webhooks */}
      {tab === "webhooks" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Webhook Config */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Webhook Endpoint</h3>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  defaultValue="https://api.kwameorganics.com/webhooks/namibrapay"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-[#64c6c3]/60 transition-all font-mono"
                />
              </div>
              {can("api.manage") && (
                <button className="px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all">
                  Save
                </button>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Subscribed Events</p>
              <div className="flex flex-wrap gap-2">
                {["collection.success", "collection.failed", "payout.completed", "payout.failed", "dispute.opened"].map((evt) => (
                  <label key={evt} className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 border border-border rounded-lg cursor-pointer hover:bg-muted/60 transition-all">
                    <input type="checkbox" defaultChecked={evt !== "dispute.opened"} className="accent-[#64c6c3] size-3" />
                    <code className="text-[11px]">{evt}</code>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Log */}
          <div>
            <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>Recent Deliveries</h3>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Event", "Time", "Status", "Retries", ""].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockWebhookLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3"><code className="text-xs bg-muted px-2 py-0.5 rounded-md">{log.event}</code></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(log.timestamp)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-medium",
                            log.success ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200")}>
                            {log.httpStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-center">{log.retryCount}</td>
                        <td className="px-4 py-3">
                          {!log.success && can("api.manage") && (
                            <button className="flex items-center gap-1 text-xs text-[#64c6c3] hover:underline">
                              <RefreshCw className="size-3" />
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sandbox */}
      {tab === "sandbox" && can("api.manage") && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">Sandbox mode — no real money moves. All transactions are simulated.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Trigger Test Collection", desc: "Simulate a successful mobile money collection", color: "#64c6c3", event: "collection.success" },
              { label: "Simulate Failed Payment", desc: "Trigger an insufficient funds failure", color: "#ffb4b0", event: "collection.failed" },
              { label: "Test Payout", desc: "Simulate a payout disbursement", color: "#bcbbee", event: "payout.completed" },
              { label: "Simulate Timeout", desc: "Test your timeout handling logic", color: "#fedfb8", event: "timeout" },
            ].map((action) => (
              <div key={action.event} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${action.color}18` }}>
                    <Send className="size-4" style={{ color: action.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl text-sm font-medium border transition-all hover:shadow-sm"
                  style={{ borderColor: `${action.color}40`, background: `${action.color}08`, color: action.color }}>
                  Run test
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Revoke Confirmation */}
      {revokeTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setRevokeTarget(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="size-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
              <AlertTriangle className="size-6 text-red-500" />
            </div>
            <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-heading)" }}>Revoke API Key</h2>
            <p className="text-sm text-muted-foreground mb-6">This action is <strong>immediate and irreversible</strong>. Any live integrations using this key will stop working instantly.</p>
            <div className="flex gap-3">
              <button onClick={() => setRevokeTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">
                Cancel
              </button>
              <button onClick={() => setRevokeTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-white text-sm font-medium hover:opacity-90 transition-all">
                Revoke Key
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
