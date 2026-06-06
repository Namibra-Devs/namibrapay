"use client";

import { useState, useMemo } from "react";
import { Search, Download, Receipt, DollarSign, Clock, FileCheck } from "lucide-react";
import { MOCK_INVOICES } from "@/lib/mock-data/invoices";
import type { Invoice } from "@/lib/mock-data/invoices";
import InvoiceFilters from "@/components/namibrapay-main/invoices/InvoiceFilters";
import type { InvoiceFilterState } from "@/components/namibrapay-main/invoices/InvoiceFilters";
import { DEFAULT_INVOICE_FILTERS } from "@/components/namibrapay-main/invoices/InvoiceFilters";
import InvoiceList from "@/components/namibrapay-main/invoices/InvoiceList";
import RequestPaymentModal from "@/components/namibrapay-main/invoices/RequestPaymentModal";

let nextId = MOCK_INVOICES.length + 1;
function genRef() {
  const d = new Date();
  return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(nextId).padStart(3, "0")}`;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [search, setSearch] = useState("");
  const [pendingFilters, setPendingFilters] = useState<InvoiceFilterState>(DEFAULT_INVOICE_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<InvoiceFilterState>(DEFAULT_INVOICE_FILTERS);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (appliedFilters.status !== "all" && inv.status !== appliedFilters.status) return false;
      if (appliedFilters.type !== "all" && inv.type !== appliedFilters.type) return false;
      if (appliedFilters.dateFrom && inv.createdAt < appliedFilters.dateFrom) return false;
      if (appliedFilters.dateTo && inv.createdAt > appliedFilters.dateTo + "T23:59:59Z") return false;
      if (
        search &&
        !inv.reference.toLowerCase().includes(search.toLowerCase()) &&
        !inv.customerName.toLowerCase().includes(search.toLowerCase()) &&
        !inv.customerEmail.toLowerCase().includes(search.toLowerCase())
      ) return false;
      return true;
    });
  }, [invoices, appliedFilters, search]);

  function handleCreate(data: Omit<Invoice, "id" | "reference" | "createdAt">) {
    const id = `inv_${String(nextId).padStart(3, "0")}`;
    const reference = genRef();
    nextId++;
    setInvoices((prev) => [
      { ...data, id, reference, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setShowModal(false);
  }

  function handleDelete(id: string) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }

  const received = filtered.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = filtered.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const overdue = filtered.filter((i) => i.status === "overdue").length;
  const currency = invoices[0]?.currency ?? "GHS";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and send professional invoices to your customers.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <InvoiceFilters
              filters={pendingFilters}
              onChange={setPendingFilters}
              onApply={() => setAppliedFilters(pendingFilters)}
              onReset={() => { setPendingFilters(DEFAULT_INVOICE_FILTERS); setAppliedFilters(DEFAULT_INVOICE_FILTERS); }}
            />

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Invoice ID, customer email or name..."
                className="w-full pl-9 pr-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors shrink-0"
            >
              <Receipt className="w-3.5 h-3.5" />
              Request a Payment
            </button>
          </div>

          {filtered.length > 0 && (
            <p className="text-xs text-gray-400 px-0.5">
              Showing {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
            </p>
          )}

          <InvoiceList invoices={filtered} onDelete={handleDelete} />
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-row lg:flex-col gap-3 lg:w-52 lg:shrink-0">
          <div className="flex-1 lg:flex-none bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.25)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {received > 0 ? `${currency} ${received.toLocaleString()}` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">from paid invoices</p>
          </div>

          <div className="flex-1 lg:flex-none bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.25)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {pending > 0 ? `${currency} ${pending.toLocaleString()}` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">awaiting payment</p>
          </div>

          <div className="flex-1 lg:flex-none bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.25)] p-4 hidden lg:block">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Breakdown</p>
            <div className="space-y-2">
              {(["paid", "pending", "overdue", "draft"] as const).map((s) => {
                const count = filtered.filter((i) => i.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <span className="text-xs capitalize text-gray-500">{s}</span>
                    <span className="text-xs font-semibold text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {overdue > 0 && (
            <div className="flex-1 lg:flex-none bg-red-50 rounded-2xl border border-red-100 p-4 hidden lg:block">
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-4 h-4 text-red-400" />
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{overdue}</p>
              <p className="text-xs text-red-400 mt-1">invoice{overdue !== 1 ? "s" : ""} past due</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <RequestPaymentModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
