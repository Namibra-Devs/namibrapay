"use client";

import { useState } from "react";
import { Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/lib/mock-data/products";

const noSpinner =
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function FI({
  label,
  type = "number",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "—"}
        className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 ${type === "number" ? noSpinner : ""}`}
      />
    </div>
  );
}

export default function InventoryTab({
  product,
  onUpdate,
}: {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [stock, setStock] = useState(String(product.stock ?? ""));
  const [minOrder, setMinOrder] = useState(String(product.minOrder ?? ""));
  const [maxOrder, setMaxOrder] = useState(String(product.maxOrder ?? ""));
  const [lowStockAlert, setLowStockAlert] = useState(String(product.lowStockAlert ?? ""));

  // Add option state
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [optionName, setOptionName] = useState("");
  const [optionValues, setOptionValues] = useState<string[]>(["", ""]);

  function saveInventory() {
    onUpdate({
      stock: stock ? Number(stock) : undefined,
      minOrder: minOrder ? Number(minOrder) : undefined,
      maxOrder: maxOrder ? Number(maxOrder) : undefined,
      lowStockAlert: lowStockAlert ? Number(lowStockAlert) : undefined,
    });
    setEditing(false);
  }

  function cancelEdit() {
    setStock(String(product.stock ?? ""));
    setMinOrder(String(product.minOrder ?? ""));
    setMaxOrder(String(product.maxOrder ?? ""));
    setLowStockAlert(String(product.lowStockAlert ?? ""));
    setEditing(false);
  }

  const stockVal = product.stockType === "unlimited" ? "Unlimited" : String(product.stock ?? 0);
  const inStockColor =
    product.stockType === "unlimited"
      ? "text-gray-900"
      : (product.stock ?? 0) === 0
        ? "text-red-500"
        : product.lowStockAlert && (product.stock ?? 0) <= product.lowStockAlert
          ? "text-amber-600"
          : "text-gray-900";

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price</p>
          <p className="text-xl font-bold text-gray-900">
            {product.currency} {product.price.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">In Stock</p>
          <p className={`text-xl font-bold ${inStockColor}`}>{stockVal}</p>
        </div>
        <StatCard
          label="Min Order"
          value={product.minOrder ?? "—"}
          sub={product.minOrder ? "units" : undefined}
        />
        <StatCard
          label="Max Order"
          value={product.maxOrder ?? "—"}
          sub={product.maxOrder ? "units" : undefined}
        />
      </div>

      {/* Edit panel */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Inventory Settings</h3>
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
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
              <button
                type="button"
                onClick={saveInventory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-teal rounded-lg hover:bg-brand-teal/90 transition-colors"
              >
                <Check className="w-3 h-3" />
                Save
              </button>
            </div>
          )}
        </div>

        <div className="p-5">
          {!editing ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Stock Quantity</p>
                <p className="font-medium text-gray-900">{stockVal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Low Stock Alert</p>
                <p className="font-medium text-gray-900">{product.lowStockAlert ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Min Order</p>
                <p className="font-medium text-gray-900">{product.minOrder ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Max Order</p>
                <p className="font-medium text-gray-900">{product.maxOrder ?? "—"}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.stockType === "limited" && (
                <FI label="Stock Quantity" value={stock} onChange={setStock} placeholder="0" />
              )}
              <FI label="Low Stock Alert" value={lowStockAlert} onChange={setLowStockAlert} placeholder="e.g. 10" />
              <FI label="Min Order" value={minOrder} onChange={setMinOrder} placeholder="1" />
              <FI label="Max Order" value={maxOrder} onChange={setMaxOrder} placeholder="—" />
            </div>
          )}
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product Options</h3>
            <p className="text-xs text-gray-400 mt-0.5">Add variants like size or colour</p>
          </div>
          <button
            type="button"
            onClick={() => setShowOptionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-teal rounded-lg hover:bg-brand-teal/90 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Option
          </button>
        </div>

        {(!product.variants || product.variants.length === 0) ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            No options added yet
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {product.variants.map((v) => (
              <div key={v.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{v.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {v.values.map((val) => (
                      <span key={val} className="px-2 py-0.5 bg-gray-100 text-xs rounded-lg text-gray-600">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
                <button type="button" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Option Modal */}
      {showOptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowOptionModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Add Product Option</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Option name</label>
                <input
                  type="text"
                  value={optionName}
                  onChange={(e) => setOptionName(e.target.value)}
                  placeholder="e.g. Size, Colour"
                  className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Values</label>
                <div className="space-y-2">
                  {optionValues.map((val, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const next = [...optionValues];
                          next[i] = e.target.value;
                          setOptionValues(next);
                        }}
                        placeholder={`Value ${i + 1}`}
                        className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
                      />
                      {optionValues.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setOptionValues(optionValues.filter((_, j) => j !== i))}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOptionValues([...optionValues, ""])}
                    className="flex items-center gap-1.5 text-xs text-brand-teal font-medium hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    Add value
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowOptionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // In a real app, update product variants
                  setShowOptionModal(false);
                  setOptionName("");
                  setOptionValues(["", ""]);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
