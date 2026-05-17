"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Package, Archive, ArchiveRestore } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import type { Product } from "@/lib/mock-data/products";
import OrdersTab from "@/components/products/product-detail/OrdersTab";
import InventoryTab from "@/components/products/product-detail/InventoryTab";
import CustomizeProductTab from "@/components/products/product-detail/CustomizeProductTab";
import DiscountCodesTab from "@/components/products/product-detail/DiscountCodesTab";
import DeliveryTab from "@/components/products/product-detail/DeliveryTab";
import AfterPurchaseTab from "@/components/products/product-detail/AfterPurchaseTab";

type TabId = "orders" | "inventory" | "customize" | "discounts" | "delivery" | "after-purchase";

const TABS: { id: TabId; label: string; badge?: string }[] = [
  { id: "orders", label: "Orders" },
  { id: "inventory", label: "Inventory" },
  { id: "customize", label: "Customize Product" },
  { id: "discounts", label: "Discount Codes", badge: "NEW" },
  { id: "delivery", label: "Delivery" },
  { id: "after-purchase", label: "After Purchase" },
];

export default function ProductDetailView({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | undefined>(
    MOCK_PRODUCTS.find((p) => p.id === id),
  );
  const [tab, setTab] = useState<TabId>("orders");

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Package className="w-10 h-10 text-gray-200 mb-4" />
        <p className="text-sm font-semibold text-gray-500">Product not found</p>
        <Link href="/products" className="mt-3 text-sm text-brand-teal hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  function handleUpdate(updates: Partial<Product>) {
    setProduct((prev) => (prev ? { ...prev, ...updates } : prev));
  }

  function toggleArchive() {
    handleUpdate({ status: product!.status === "active" ? "archived" : "active" });
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/products" className="hover:text-brand-teal transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-gray-300" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading truncate">{product.name}</h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
                  product.status === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${product.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`}
                />
                {product.status === "active" ? "Active" : "Archived"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {product.currency} {product.price.toLocaleString()} ·{" "}
              {product.stockType === "unlimited"
                ? "Unlimited stock"
                : `${product.stock ?? 0} in stock`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleArchive}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors sm:shrink-0"
        >
          {product.status === "active" ? (
            <>
              <Archive className="w-4 h-4" />
              Archive
            </>
          ) : (
            <>
              <ArchiveRestore className="w-4 h-4" />
              Unarchive
            </>
          )}
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-0 border-b border-gray-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-teal text-white leading-none">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === "orders" && <OrdersTab product={product} />}
        {tab === "inventory" && <InventoryTab product={product} onUpdate={handleUpdate} />}
        {tab === "customize" && <CustomizeProductTab product={product} onUpdate={handleUpdate} />}
        {tab === "discounts" && <DiscountCodesTab product={product} />}
        {tab === "delivery" && <DeliveryTab product={product} />}
        {tab === "after-purchase" && <AfterPurchaseTab product={product} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
}
