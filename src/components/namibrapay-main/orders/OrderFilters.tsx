"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X, Plus, Search, ChevronDown } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import { ORDER_STATUS_OPTIONS } from "@/lib/mock-data/orders";
import { CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";
import DateRangePicker from "@/components/namibrapay-main/refunds/DateRangePicker";

export interface OrderFilterState {
  productIds: string[];
  status: string;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_FILTERS: OrderFilterState = {
  productIds: [],
  status: "all",
  dateFrom: "",
  dateTo: "",
};

export default function OrderFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: {
  filters: OrderFilterState;
  onChange: (f: OrderFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const activeCount =
    filters.productIds.length +
    (filters.status !== "all" ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      !filters.productIds.includes(p.id) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const selectedProducts = MOCK_PRODUCTS.filter((p) => filters.productIds.includes(p.id));

  function addProduct(id: string) {
    onChange({ ...filters, productIds: [...filters.productIds, id] });
    setProductSearch("");
  }

  function removeProduct(id: string) {
    onChange({ ...filters, productIds: filters.productIds.filter((p) => p !== id) });
  }

  return (
    <div className="relative">
      {open && createPortal(
        <div className="fixed inset-0 z-25" onMouseDown={() => setOpen(false)} />,
        document.body,
      )}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
          activeCount > 0
            ? "border-brand-teal text-brand-teal bg-brand-teal/5"
            : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-teal text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Filters</p>
          </div>

          <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Products */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Products</p>
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedProducts.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-brand-teal/10 text-brand-teal text-xs rounded-lg font-medium"
                    >
                      {p.name}
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="hover:text-brand-teal/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-8 pr-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
                />
              </div>
              {productSearch && filteredProducts.length > 0 && (
                <div className="mt-1.5 border border-gray-200 rounded-xl overflow-hidden">
                  {filteredProducts.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addProduct(p.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
              {productSearch && filteredProducts.length === 0 && (
                <p className="mt-2 text-xs text-gray-400 text-center">No products found</p>
              )}
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
              <CustomSelect
                value={filters.status}
                onChange={(v) => onChange({ ...filters, status: v })}
                options={ORDER_STATUS_OPTIONS}
              />
            </div>

            {/* Date range */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Date</p>
              <DateRangePicker
                startDate={filters.dateFrom}
                endDate={filters.dateTo}
                onChange={(start, end) => onChange({ ...filters, dateFrom: start, dateTo: end })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={() => { onReset(); setOpen(false); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => { onApply(); setOpen(false); }}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
