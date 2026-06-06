"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  LayoutGrid,
  List,
  Package,
  Plus,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  ArchiveRestore,
} from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/mock-data/products";

function StatusBadge({ status }: { status: Product["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
        status === "active"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      <span
        className={`w-1 h-1 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-gray-300"}`}
      />
      {status === "active" ? "Active" : "Archived"}
    </span>
  );
}

function StockBadge({ product }: { product: Product }) {
  if (product.stockType === "unlimited") {
    return <span className="text-xs text-gray-400">Unlimited stock</span>;
  }
  const qty = product.stock ?? 0;
  const low = product.lowStockAlert ? qty <= product.lowStockAlert : false;
  return (
    <span className={`text-xs font-medium ${qty === 0 ? "text-red-500" : low ? "text-amber-500" : "text-gray-500"}`}>
      {qty === 0 ? "Out of stock" : `${qty} in stock`}
    </span>
  );
}

function ProductMenu({
  product,
  onDuplicate,
  onToggleArchive,
  onDelete,
}: {
  product: Product;
  onDuplicate: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function openMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
  }

  function closeMenu() {
    setMenuPos(null);
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={openMenu}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        title="Options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {menuPos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={closeMenu} />
            <div
              className="fixed z-50 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1"
              style={{ top: menuPos.top, right: menuPos.right }}
            >
              <button
                type="button"
                onClick={() => { onDuplicate(product.id); closeMenu(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => { onToggleArchive(product.id); closeMenu(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {product.status === "active" ? (
                  <Archive className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ArchiveRestore className="w-3.5 h-3.5 text-gray-400" />
                )}
                {product.status === "active" ? "Archive" : "Unarchive"}
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={() => { onDelete(product.id); closeMenu(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}

function GridCard({
  product,
  onDuplicate,
  onToggleArchive,
  onDelete,
}: {
  product: Product;
  onDuplicate: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-2xl border border-gray-200 hover:border-brand-teal/40 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Image placeholder */}
      <div className="h-36 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
        <Package className="w-10 h-10 text-gray-200" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand-teal transition-colors">
              {product.name}
            </p>
            {product.description && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{product.description}</p>
            )}
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <ProductMenu
              product={product}
              onDuplicate={onDuplicate}
              onToggleArchive={onToggleArchive}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-base font-bold text-gray-900">
            {product.currency} {product.price.toLocaleString()}
          </p>
          <StatusBadge status={product.status} />
        </div>

        <div className="mt-2">
          <StockBadge product={product} />
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{product.unitsSold.toLocaleString()} sold</span>
          <span>{product.currency} {product.revenue.toLocaleString()} earned</span>
        </div>
      </div>
    </Link>
  );
}

function ListRow({
  product,
  onDuplicate,
  onToggleArchive,
  onDelete,
}: {
  product: Product;
  onDuplicate: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
      <td className="px-5 py-4">
        <Link href={`/products/${product.id}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-gray-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate hover:text-brand-teal transition-colors">
              {product.name}
            </p>
            {product.description && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{product.description}</p>
            )}
          </div>
        </Link>
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-gray-900 tabular-nums whitespace-nowrap">
        {product.currency} {product.price.toLocaleString()}
      </td>
      <td className="px-4 py-4">
        <StockBadge product={product} />
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 tabular-nums">
        {product.unitsSold.toLocaleString()}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900 tabular-nums whitespace-nowrap">
        {product.currency} {product.revenue.toLocaleString()}
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-end">
          <ProductMenu
            product={product}
            onDuplicate={onDuplicate}
            onToggleArchive={onToggleArchive}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}

export default function ProductList({
  products,
  onNewProduct,
  onDuplicate,
  onToggleArchive,
  onDelete,
}: {
  products: Product[];
  onNewProduct: () => void;
  onDuplicate: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (products.length === 0) {
    return (
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Package className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-900">No products found</p>
        <p className="mt-1.5 text-sm text-gray-400 max-w-xs leading-relaxed">
          Create products to sell through your payment pages and storefronts.
        </p>
        <button
          type="button"
          onClick={onNewProduct}
          className="mt-6 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" && (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <GridCard
              key={p.id}
              product={p}
              onDuplicate={onDuplicate}
              onToggleArchive={onToggleArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* List */}
      {view === "list" && (
        <div className="overflow-x-auto">
        <table className="w-full min-w-150">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Sold
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ListRow
                key={p.id}
                product={p}
                onDuplicate={onDuplicate}
                onToggleArchive={onToggleArchive}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
