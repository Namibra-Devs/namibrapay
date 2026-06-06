"use client";

import { useState } from "react";
import { X, Package, AlertCircle } from "lucide-react";
import { CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";
import type { Product } from "@/lib/mock-data/products";

type NewProductData = Omit<Product, "id" | "createdAt" | "unitsSold" | "revenue" | "slug">;

const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "NGN", "ZAR", "KES"];

const noSpinner =
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]";

function FL({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>
  );
}

function FI({
  type = "text",
  placeholder,
  value,
  onChange,
  prefix,
  min,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  min?: number;
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal transition-colors">
      {prefix && (
        <span className="px-3 py-2.5 text-sm text-gray-500 bg-gray-50 border-r border-gray-200 shrink-0">
          {prefix}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none bg-white placeholder:text-gray-400 ${type === "number" ? noSpinner : ""}`}
      />
    </div>
  );
}

function FTA({
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 resize-none"
    />
  );
}

export default function NewProductModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: NewProductData) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [price, setPrice] = useState("");
  const [stockType, setStockType] = useState<"unlimited" | "limited">("unlimited");
  const [stock, setStock] = useState("");
  const [isPhysical, setIsPhysical] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) { setError("Product name is required."); return; }
    if (!price || Number(price) <= 0) { setError("Enter a valid price."); return; }
    if (stockType === "limited" && (!stock || Number(stock) < 0)) {
      setError("Enter a valid stock quantity.");
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      currency,
      status: "active",
      stockType,
      stock: stockType === "limited" ? Number(stock) : undefined,
      isPhysical,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-teal/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-brand-teal" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">New Product</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <FL>Product name</FL>
            <FI placeholder="e.g. LPG 12.5kg Cylinder" value={name} onChange={(v) => { setName(v); setError(""); }} />
          </div>

          <div>
            <FL>Description</FL>
            <FTA placeholder="Brief description of the product" value={description} onChange={setDescription} />
          </div>

          <div>
            <FL>Price</FL>
            <div className="flex gap-2">
              <div className="w-28">
                <CustomSelect
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                />
              </div>
              <div className="flex-1">
                <FI type="number" placeholder="0.00" value={price} onChange={(v) => { setPrice(v); setError(""); }} min={0} />
              </div>
            </div>
          </div>

          <div>
            <FL>Quantity</FL>
            <div className="flex gap-2">
              <div className="w-36">
                <CustomSelect
                  value={stockType}
                  onChange={(v) => setStockType(v as "unlimited" | "limited")}
                  options={[
                    { value: "unlimited", label: "Unlimited" },
                    { value: "limited", label: "Limited" },
                  ]}
                />
              </div>
              {stockType === "limited" && (
                <div className="flex-1">
                  <FI type="number" placeholder="Available units" value={stock} onChange={(v) => { setStock(v); setError(""); }} min={0} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">Contains physical goods</p>
              <p className="text-xs text-gray-400 mt-0.5">Enable delivery fields for this product</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPhysical((v) => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${isPhysical ? "bg-brand-teal" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isPhysical ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
}
