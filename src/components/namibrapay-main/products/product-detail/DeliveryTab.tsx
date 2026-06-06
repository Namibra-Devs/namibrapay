"use client";

import { useState } from "react";
import { Truck, Plus, Trash2, AlertTriangle, Info } from "lucide-react";
import { CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";
import { MOCK_DELIVERY_FEES } from "@/lib/mock-data/products";
import type { Product, DeliveryFee } from "@/lib/mock-data/products";

const noSpinner =
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]";

const ADDRESS_OPTIONS = [
  { value: "disabled", label: "Disabled" },
  { value: "optional", label: "Optional" },
  { value: "required", label: "Required" },
];

export default function DeliveryTab({ product }: { product: Product }) {
  const [addressMode, setAddressMode] = useState<"disabled" | "optional" | "required">("required");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [fees, setFees] = useState<DeliveryFee[]>(
    MOCK_DELIVERY_FEES.filter(() => product.isPhysical),
  );
  const [newLocation, setNewLocation] = useState("");
  const [newFee, setNewFee] = useState("");

  function addFee() {
    if (!newLocation.trim() || !newFee) return;
    setFees((prev) => [
      ...prev,
      { id: `df_${Date.now()}`, location: newLocation.trim(), fee: Number(newFee) },
    ]);
    setNewLocation("");
    setNewFee("");
  }

  function deleteFee(id: string) {
    setFees((prev) => prev.filter((f) => f.id !== id));
  }

  if (!product.isPhysical) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Truck className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700">Delivery not applicable</p>
        <p className="mt-1.5 text-sm text-gray-400 max-w-sm leading-relaxed">
          This product does not contain physical goods. Enable &quot;Contains physical goods&quot; in the product settings to configure delivery.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 leading-relaxed">
          Delivery fees are charged at checkout and added to the product price. Customers must be informed of delivery timelines separately.
        </p>
      </div>

      {/* Delivery Fields */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Info className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Delivery Fields</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
            <CustomSelect
              value={addressMode}
              onChange={(v) => setAddressMode(v as "disabled" | "optional" | "required")}
              options={ADDRESS_OPTIONS}
              className="max-w-xs"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              {addressMode === "disabled"
                ? "No delivery address will be collected."
                : addressMode === "optional"
                  ? "Customers can optionally provide a delivery address."
                  : "Customers must provide a delivery address to complete purchase."}
            </p>
          </div>

          {addressMode !== "disabled" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Note (optional)</label>
              <textarea
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="e.g. Delivery takes 1–2 business days within Accra"
                rows={2}
                className="w-full max-w-md px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Delivery Fees */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Delivery Fees</h3>
            <p className="text-xs text-gray-400 mt-0.5">Set fees per delivery location</p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {fees.map((fee) => (
            <div key={fee.id} className="flex items-center gap-3">
              <div className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-700">{fee.location}</p>
              </div>
              <div className="w-28 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-900">{product.currency} {fee.fee.toLocaleString()}</p>
              </div>
              <button
                title="delete"
                type="button"
                onClick={() => deleteFee(fee.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add fee row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Location (e.g. Accra Central)"
              className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                placeholder="Fee"
                min={0}
                className={`flex-1 sm:w-28 sm:flex-none px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 ${noSpinner}`}
              />
              <button
                type="button"
                onClick={addFee}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
