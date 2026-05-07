"use client";

import { Key, Eye, EyeOff, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ApiKeyRowProps {
  label: string;
  value: string;
  type: "public" | "secret";
}

function ApiKeyRow({ label, value, type }: ApiKeyRowProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const maskedValue = visible
    ? value
    : value.slice(0, 8) + "•".repeat(24) + value.slice(-4);

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <span className="font-mono text-sm text-gray-800 break-all">
          {maskedValue}
        </span>
      </div>
      <div className="flex items-center gap-1.5 ml-4 shrink-0">
        {type === "secret" && (
          <button
            onClick={() => setVisible((v) => !v)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title={visible ? "Hide" : "Reveal"}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="Copy"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          API Keys
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Use these keys to authenticate API requests from your application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Test keys */}
        <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[11px] font-semibold text-amber-600">
                Test Mode
              </span>
            </div>
          </div>
          <h2 className="text-sm font-semibold text-gray-900 mt-3 mb-1">
            Test API Keys
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Use these keys in your development environment. No real money moves.
          </p>
          <div>
            <ApiKeyRow
              label="Public Key"
              value="pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
              type="public"
            />
            <ApiKeyRow
              label="Secret Key"
              value="sk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
              type="secret"
            />
          </div>
        </div>

        {/* Live keys */}
        <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span className="text-[11px] font-semibold text-gray-500">
                Live Mode
              </span>
            </div>
          </div>
          <h2 className="text-sm font-semibold text-gray-900 mt-3 mb-1">
            Live API Keys
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Go live only after completing your compliance verification.
          </p>
          <div className="flex flex-col items-center justify-center py-8">
            <Key className="w-8 h-8 text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">
              Complete compliance to unlock
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center max-w-xs">
              Submit your compliance documents to activate live payments.
            </p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90 transition-colors">
              Complete compliance
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <Key className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Keep your secret key private.</span>{" "}
          Never share it publicly or commit it to version control. Regenerate
          immediately if compromised.
        </p>
      </div>
    </div>
  );
}
