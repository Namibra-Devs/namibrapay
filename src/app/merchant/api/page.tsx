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
  Key,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { mockApiKeys, mockWebhookLogs } from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField, Input, Select } from "@/components/ui/form-field";
import CustomSelect from "@/components/ui/select";

type Tab = "keys" | "webhooks" | "sandbox";

export default function ApiPage() {
  const { can } = useMerchantRole();
  const [tab, setTab] = useState<Tab>("keys");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNewKeySecret, setShowNewKeySecret] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  
  // Generate API key modal state
  const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"live" | "test">("test");
  const [generatedKey, setGeneratedKey] = useState<{ public: string; secret: string } | null>(null);
  
  // Webhook configuration modal state
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.kwameorganics.com/webhooks/namibrapay");
  
  const { showToast } = useToast();
  
  // TODO: Replace with actual compliance status from API/auth context
  const complianceStatus: "incomplete" | "pending" | "approved" | "rejected" = "pending";

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
                <button 
                  onClick={() => setShowGenerateKeyModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all"
                >
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
                            ? "bg-brand-navy/10 text-brand-navy border-brand-navy/20"
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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Webhook Endpoint</h3>
              {can("api.manage") && (
                <button
                  onClick={() => setShowWebhookModal(true)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted/50 transition-all"
                >
                  Configure
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  value={webhookUrl}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/30 border border-border rounded-xl outline-none font-mono cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Subscribed Events</p>
              <div className="flex flex-wrap gap-2">
                {["collection.success", "collection.failed", "payout.completed", "payout.failed", "dispute.opened"].map((evt) => (
                  <label key={evt} className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 border border-border rounded-lg cursor-pointer hover:bg-muted/60 transition-all">
                    <input type="checkbox" defaultChecked={evt !== "dispute.opened"} className="accent-brand-teal size-3" />
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
                            <button className="flex items-center gap-1 text-xs text-brand-teal hover:underline">
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

      {/* Generate API Key Modal */}
      <Modal
        isOpen={showGenerateKeyModal}
        onClose={() => {
          setShowGenerateKeyModal(false);
          setNewKeyLabel("");
          setNewKeyEnvironment("test");
          setGeneratedKey(null);
        }}
        title="Generate API Key"
        description="Create new API credentials for integration"
        size="md"
      >
        <div className="space-y-6">
          {!generatedKey ? (
            <>
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">API Key Security</p>
                  <p className="text-sm text-blue-700">
                    Your secret key will only be shown once. Store it securely - you won't be able to see it again.
                  </p>
                </div>
              </div>

              <FormField
                label="Key Label"
                required
                description="Descriptive name for this API key"
              >
                <Input
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="e.g. Production Server, Mobile App"
                />
              </FormField>

              <FormField
                label="Environment"
                required
                description="Select whether this key is for testing or live transactions"
              >
                <CustomSelect
                  value={newKeyEnvironment}
                  onChange={(val) => setNewKeyEnvironment(val as "live" | "test")}
                  options={[
                    { value: "test", label: "Test Environment (Sandbox)" },
                    { value: "live", label: "Live Environment (Production)" },
                  ]}
                />
              </FormField>

              {newKeyEnvironment === "live" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">Production Key</p>
                    <p className="text-sm text-amber-700">
                      This key will process real transactions with actual money. Ensure it's stored securely.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    setShowGenerateKeyModal(false);
                    setNewKeyLabel("");
                    setNewKeyEnvironment("test");
                  }}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={!newKeyLabel.trim()}
                  onClick={() => {
                    // Simulate key generation
                    const publicKey = `pk_${newKeyEnvironment}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
                    const secretKey = `sk_${newKeyEnvironment}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
                    setGeneratedKey({ public: publicKey, secret: secretKey });
                  }}
                  className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Key className="size-4" />
                  Generate Key
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success State - Show Generated Keys */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <Check className="size-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">API Key Generated</p>
                  <p className="text-sm text-emerald-700">Copy and save your secret key now.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Public Key
                  </label>
                  <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2.5">
                    <code className="text-xs font-mono flex-1 truncate">{generatedKey.public}</code>
                    <button
                      onClick={() => {
                        void navigator.clipboard.writeText(generatedKey.public);
                        showToast("success", "Copied", "Public key copied to clipboard");
                      }}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Secret Key <span className="text-red-600">— Save this now!</span>
                  </label>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                    <code className="text-xs font-mono flex-1 truncate text-amber-900">{generatedKey.secret}</code>
                    <button
                      onClick={() => {
                        void navigator.clipboard.writeText(generatedKey.secret);
                        showToast("success", "Copied", "Secret key copied to clipboard");
                      }}
                      className="shrink-0 text-amber-700 hover:text-amber-900 transition-colors"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>
                  <p className="text-xs text-amber-700 mt-2">
                    ⚠️ You won't be able to see this secret key again. Store it securely.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast("success", "API Key Created", `${newKeyLabel} key has been added to your account.`);
                  setShowGenerateKeyModal(false);
                  setNewKeyLabel("");
                  setNewKeyEnvironment("test");
                  setGeneratedKey(null);
                }}
                className="w-full px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all"
              >
                Done
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Configure Webhook Modal */}
      <Modal
        isOpen={showWebhookModal}
        onClose={() => setShowWebhookModal(false)}
        title="Configure Webhook"
        description="Set up event notifications for your integration"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Globe className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Webhook Endpoint</p>
              <p className="text-sm text-blue-700">
                We'll send POST requests to this URL when subscribed events occur. Ensure your endpoint returns a 200 OK response.
              </p>
            </div>
          </div>

          <FormField
            label="Webhook URL"
            required
            description="HTTPS endpoint to receive event notifications"
          >
            <Input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://yourdomain.com/webhooks/namibrapay"
            />
          </FormField>

          <FormField
            label="Subscribed Events"
            required
            description="Select which events to receive"
          >
            <div className="space-y-2">
              {[
                { event: "collection.success", label: "Collection Success", desc: "When a collection is successfully completed" },
                { event: "collection.failed", label: "Collection Failed", desc: "When a collection fails" },
                { event: "payout.completed", label: "Payout Completed", desc: "When funds are disbursed" },
                { event: "payout.failed", label: "Payout Failed", desc: "When a payout fails" },
                { event: "dispute.opened", label: "Dispute Opened", desc: "When a customer opens a dispute" },
              ].map(({ event, label, desc }) => (
                <label
                  key={event}
                  className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-all"
                >
                  <input
                    type="checkbox"
                    defaultChecked={event !== "dispute.opened"}
                    className="mt-0.5 accent-brand-teal size-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    <code className="text-[10px] text-muted-foreground">{event}</code>
                  </div>
                </label>
              ))}
            </div>
          </FormField>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setShowWebhookModal(false)}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!webhookUrl.trim() || !webhookUrl.startsWith("https://")}
              onClick={() => {
                showToast("success", "Webhook Updated", "Your webhook configuration has been saved.");
                setShowWebhookModal(false);
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
