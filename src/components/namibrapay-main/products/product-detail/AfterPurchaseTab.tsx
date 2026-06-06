"use client";

import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";
import type { Product } from "@/lib/mock-data/products";

const SPLIT_OPTIONS = [
  { value: "none", label: "No split payment" },
  { value: "equal", label: "Equal split" },
  { value: "percentage", label: "Percentage split" },
];

function Row({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3.5 border-b border-gray-100 last:border-0">
      <p className="sm:w-44 text-xs sm:text-sm font-semibold sm:font-medium text-gray-400 sm:text-gray-500 sm:shrink-0 sm:pt-0.5 uppercase sm:normal-case tracking-wider sm:tracking-normal">
        {label}
      </p>
      <p className="text-sm text-gray-700 flex-1 leading-relaxed">
        {value || <span className="text-gray-400 italic">{placeholder ?? "Not set"}</span>}
      </p>
    </div>
  );
}

export default function AfterPurchaseTab({
  product,
  onUpdate,
}: {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(product.redirectUrl ?? "");
  const [successMessage, setSuccessMessage] = useState(product.successMessage ?? "");
  const [notifyEmail, setNotifyEmail] = useState(product.notifyEmail ?? "");
  const [splitPayment, setSplitPayment] = useState("none");

  function save() {
    onUpdate({
      redirectUrl: redirectUrl || undefined,
      successMessage: successMessage || undefined,
      notifyEmail: notifyEmail || undefined,
    });
    setEditing(false);
  }

  function cancel() {
    setRedirectUrl(product.redirectUrl ?? "");
    setSuccessMessage(product.successMessage ?? "");
    setNotifyEmail(product.notifyEmail ?? "");
    setEditing(false);
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400";

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">After Purchase Settings</h3>
            <p className="text-xs text-gray-400 mt-0.5">Configure what happens after a successful payment</p>
          </div>
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button type="button" onClick={cancel} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <X className="w-3 h-3" />
                Cancel
              </button>
              <button type="button" onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-teal rounded-lg hover:bg-brand-teal/90 transition-colors">
                <Check className="w-3 h-3" />
                Save
              </button>
            </div>
          )}
        </div>

        <div className="p-5">
          {!editing ? (
            <div>
              <Row
                label="Redirect URL"
                value={product.redirectUrl}
                placeholder="No redirect set — customer stays on confirmation page"
              />
              <Row
                label="Success Message"
                value={product.successMessage}
                placeholder="Default confirmation message"
              />
              <Row
                label="Notify Email"
                value={product.notifyEmail}
                placeholder="No notification email"
              />
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3.5">
                <p className="sm:w-44 text-xs sm:text-sm font-semibold sm:font-medium text-gray-400 sm:text-gray-500 sm:shrink-0 sm:pt-0.5 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                  Split Payments
                </p>
                <p className="text-sm text-gray-400 italic">No split payment</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Redirect URL</label>
                <input
                  type="url"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/thank-you"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-400">Customer is redirected here after payment. Leave blank for default confirmation page.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Success Message</label>
                <textarea
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="Thank you for your purchase! We'll process your order shortly."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notification Email</label>
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="alerts@yourcompany.com"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-400">Send a notification to this email for every successful purchase.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Split Payments</label>
                <CustomSelect
                  value={splitPayment}
                  onChange={setSplitPayment}
                  options={SPLIT_OPTIONS}
                  className="max-w-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
