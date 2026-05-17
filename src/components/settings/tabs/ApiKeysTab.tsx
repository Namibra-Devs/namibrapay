"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, Plus, X, AlertTriangle, ExternalLink } from "lucide-react";
import SettingSection, { Field, SaveButton, Input } from "@/components/settings/SettingSection";
import { MOCK_API_CONFIG } from "@/lib/mock-data/settings";

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button title="close" type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ApiKeysTab() {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState<string[]>(MOCK_API_CONFIG.ipWhitelist);
  const [showIpModal, setShowIpModal] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [ips, setIps] = useState<string[]>([]);
  const [callbackUrl, setCallbackUrl] = useState(MOCK_API_CONFIG.testCallbackUrl);
  const [webhookUrl, setWebhookUrl] = useState(MOCK_API_CONFIG.testWebhookUrl);

  function copyPublicKey() {
    navigator.clipboard.writeText(MOCK_API_CONFIG.testPublicKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function addIp() {
    const v = ipInput.trim();
    if (v && !ips.includes(v)) setIps((prev) => [...prev, v]);
    setIpInput("");
  }

  function saveIpWhitelist() {
    setIpWhitelist(ips);
    setShowIpModal(false);
  }

  function openIpModal() {
    setIps([...ipWhitelist]);
    setShowIpModal(true);
  }

  const maskedSecret = "•".repeat(44);

  return (
    <>
      <SettingSection footer={<SaveButton />}>
        <p className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          API Configuration — Test Mode
        </p>

        {/* Warning banner */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl mb-5">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">
            These keys are for testing only. Please <strong>DO NOT</strong> use them in production.
          </p>
        </div>

        <Field label="Test Secret Key">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="flex-1 text-sm font-mono text-gray-700 truncate">
                  {showSecret ? MOCK_API_CONFIG.testSecretKey : maskedSecret}
                </span>
                <button type="button" onClick={() => setShowSecret((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="button" className="text-xs font-medium text-brand-teal hover:text-brand-teal/70 transition-colors flex items-center gap-1">
              Generate new secret key
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400">?</span>
            </button>
          </div>
        </Field>

        <Field label="IP Whitelist">
          <button
            type="button"
            onClick={openIpModal}
            className="flex items-center gap-1.5 w-full px-4 py-2.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 border-dashed rounded-xl hover:border-brand-teal hover:text-brand-teal transition-colors"
          >
            <Plus className="w-4 h-4" />
            {ipWhitelist.length > 0
              ? `${ipWhitelist.length} IP${ipWhitelist.length !== 1 ? "s" : ""} whitelisted — click to manage`
              : "Add IP addresses"}
          </button>
        </Field>

        <Field label="Test Public Key">
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-sm font-mono text-gray-700 truncate block">{MOCK_API_CONFIG.testPublicKey}</span>
            </div>
            <button
              type="button"
              onClick={copyPublicKey}
              className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-brand-teal" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <Field label="Test Callback URL">
          <Input value={callbackUrl} onChange={setCallbackUrl} placeholder="https://example.com" type="url" />
        </Field>

        <Field label="Test Webhook URL">
          <Input value={webhookUrl} onChange={setWebhookUrl} placeholder="https://example.com" type="url" />
        </Field>

        <div className="pt-2 text-center">
          <p className="text-sm text-gray-400">
            Need help with your integration?{" "}
            <a href="#" className="text-brand-teal font-medium hover:underline inline-flex items-center gap-1">
              Check out our API documentation
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </SettingSection>

      {showIpModal && (
        <Modal title="IP Whitelist" onClose={() => setShowIpModal(false)}>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIp()}
              placeholder="123.45.67.89"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={addIp}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors"
            >
              Add
            </button>
          </div>

          {ips.length > 0 && (
            <div className="space-y-2 mb-5">
              {ips.map((ip) => (
                <div key={ip} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                  <span className="text-sm font-mono text-gray-700">{ip}</span>
                  <button title="close" type="button" onClick={() => setIps((prev) => prev.filter((i) => i !== ip))} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowIpModal(false)}
              className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveIpWhitelist}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
