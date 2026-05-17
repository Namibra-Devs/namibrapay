"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { MOCK_PAYMENT_PAGES } from "@/lib/mock-data/payment-pages";
import type { PaymentPage } from "@/lib/mock-data/payment-pages";
import PaymentPageFilters from "@/components/payment-pages/PaymentPageFilters";
import PaymentPageList from "@/components/payment-pages/PaymentPageList";
import NewPageModal from "@/components/payment-pages/NewPageModal";

type StatusFilter = "all" | "active" | "inactive";
type NewPageData = Omit<PaymentPage, "id" | "createdAt" | "visits" | "revenue">;

export default function PaymentPagesPage() {
  const [pages, setPages] = useState<PaymentPage[]>(MOCK_PAYMENT_PAGES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [pages, search, statusFilter]);

  function handleCreate(data: NewPageData) {
    const newPage: PaymentPage = {
      ...data,
      id: `pg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      visits: 0,
      revenue: 0,
    };
    setPages((prev) => [newPage, ...prev]);
  }

  function handleToggleStatus(id: string) {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
  }

  function handleDelete(id: string) {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Payment Pages</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <PaymentPageFilters status={statusFilter} onChange={setStatusFilter} />
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages"
            className="w-full pl-9 pr-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* List */}
      <PaymentPageList
        pages={filtered}
        onNewPage={() => setShowModal(true)}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <NewPageModal
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
