"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import type { Product } from "@/lib/mock-data/products";
import ProductFilters from "@/components/products/ProductFilters";
import type { ProductFilterState } from "@/components/products/ProductFilters";
import ProductList from "@/components/products/ProductList";
import NewProductModal from "@/components/products/NewProductModal";

type NewProductData = Omit<Product, "id" | "createdAt" | "unitsSold" | "revenue" | "slug">;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductFilterState>({
    status: "all",
    stockType: "all",
  });
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.stockType !== "all" && p.stockType !== filters.stockType) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, filters, search]);

  function handleCreate(data: NewProductData) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newProduct: Product = {
      ...data,
      id: `prod_${Date.now()}`,
      slug,
      unitsSold: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  }

  function handleDuplicate(id: string) {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const copy: Product = {
      ...original,
      id: `prod_${Date.now()}`,
      name: `${original.name} (copy)`,
      slug: `${original.slug}-copy`,
      unitsSold: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [copy, ...prev]);
  }

  function handleToggleArchive(id: string) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "archived" : "active" }
          : p,
      ),
    );
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <ProductFilters filters={filters} onChange={setFilters} />
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full pl-9 pr-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* List */}
      <ProductList
        products={filtered}
        onNewProduct={() => setShowModal(true)}
        onDuplicate={handleDuplicate}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <NewProductModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            handleCreate(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
