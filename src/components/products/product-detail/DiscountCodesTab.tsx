"use client";

import { useState } from "react";
import { Tag, Plus, X, ChevronDown, AlertCircle, Trash2 } from "lucide-react";
import { CustomSelect } from "@/components/settings/SettingSection";
import { MOCK_DISCOUNT_CODES } from "@/lib/mock-data/products";
import type { Product, DiscountCode } from "@/lib/mock-data/products";

const noSpinner =
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]";

const TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed Amount" },
  { value: "percentage", label: "Percentage" },
  { value: "free-delivery", label: "Free Delivery" },
];

function NewDiscountModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (code: DiscountCode) => void;
}) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountCode["type"]>("fixed");
  const [value, setValue] = useState("");
  const [showPrefs, setShowPrefs] = useState(false);
  const [singleUse, setSingleUse] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [error, setError] = useState("");

  function handleCreate() {
    if (!code.trim()) { setError("Discount code is required."); return; }
    if (type !== "free-delivery" && (!value || Number(value) <= 0)) {
      setError("Enter a valid discount value.");
      return;
    }
    onAdd({
      id: `dc_${Date.now()}`,
      productId: product.id,
      code: code.trim().toUpperCase(),
      type,
      value: type !== "free-delivery" ? Number(value) : undefined,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    });
    onClose();
  }

  const discountedPrice =
    type === "fixed" && value
      ? Math.max(0, product.price - Number(value))
      : type === "percentage" && value
        ? product.price * (1 - Number(value) / 100)
        : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">New Discount Code</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              placeholder="e.g. SAVE20"
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount type</label>
            <CustomSelect
              value={type}
              onChange={(v) => setType(v as DiscountCode["type"])}
              options={TYPE_OPTIONS}
            />
          </div>

          {type !== "free-delivery" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {type === "percentage" ? "Percentage off (%)" : `Amount off (${product.currency})`}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(""); }}
                placeholder={type === "percentage" ? "e.g. 10" : "e.g. 20"}
                min={0}
                max={type === "percentage" ? 100 : undefined}
                className={`w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 ${noSpinner}`}
              />
              {discountedPrice !== null && (
                <p className="mt-1.5 text-xs text-gray-400">
                  Product price after discount:{" "}
                  <span className="font-semibold text-brand-teal">
                    {product.currency} {discountedPrice.toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Preferences */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPrefs((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Preferences
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPrefs ? "rotate-180" : ""}`} />
            </button>
            {showPrefs && (
              <div className="px-4 pb-3 space-y-3 border-t border-gray-100">
                <label className="flex items-center gap-2.5 pt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={singleUse}
                    onChange={(e) => setSingleUse(e.target.checked)}
                    className="w-4 h-4 accent-brand-teal rounded"
                  />
                  <span className="text-sm text-gray-700">Single use per customer</span>
                </label>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Minimum order amount ({product.currency})</label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="No minimum"
                    min={0}
                    className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 ${noSpinner}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleCreate} className="px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors">
            Create Code
          </button>
        </div>
      </div>
    </div>
  );
}

const TYPE_LABELS: Record<DiscountCode["type"], string> = {
  fixed: "Fixed",
  percentage: "Percentage",
  "free-delivery": "Free Delivery",
};

const TYPE_BADGE: Record<DiscountCode["type"], string> = {
  fixed: "bg-blue-50 text-blue-600",
  percentage: "bg-purple-50 text-purple-600",
  "free-delivery": "bg-emerald-50 text-emerald-600",
};

export default function DiscountCodesTab({ product }: { product: Product }) {
  const initial = MOCK_DISCOUNT_CODES.filter((d) => d.productId === product.id);
  const [codes, setCodes] = useState<DiscountCode[]>(initial);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Discount Codes</h3>
          <p className="text-xs text-gray-400 mt-0.5">Create discount codes to offer special pricing</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Code
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {codes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Tag className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No discount codes yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Create discount codes to offer special pricing to your customers.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-4 flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Code
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-120">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Discount</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Used</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {codes.map((dc) => (
                <tr key={dc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <code className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg">
                      {dc.code}
                    </code>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_BADGE[dc.type]}`}>
                      {TYPE_LABELS[dc.type]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {dc.type === "free-delivery"
                      ? "Free delivery"
                      : dc.type === "percentage"
                        ? `${dc.value}% off`
                        : `${product.currency} ${dc.value} off`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 tabular-nums">{dc.usageCount} times</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setCodes((prev) => prev.filter((c) => c.id !== dc.id))}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showModal && (
        <NewDiscountModal
          product={product}
          onClose={() => setShowModal(false)}
          onAdd={(code) => setCodes((prev) => [code, ...prev])}
        />
      )}
    </div>
  );
}
