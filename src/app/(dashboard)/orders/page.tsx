"use client";

import { useState, useMemo } from "react";
import { Search, Download, TrendingUp, DollarSign } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mock-data/orders";
import type { Order, OrderStatus } from "@/lib/mock-data/orders";
import OrderFilters from "@/components/namibrapay-main/orders/OrderFilters";
import type { OrderFilterState } from "@/components/namibrapay-main/orders/OrderFilters";
import OrderList from "@/components/namibrapay-main/orders/OrderList";

const DEFAULT_FILTERS: OrderFilterState = {
  productIds: [],
  status: "all",
  dateFrom: "",
  dateTo: "",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [pendingFilters, setPendingFilters] = useState<OrderFilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (
        appliedFilters.productIds.length > 0 &&
        !appliedFilters.productIds.includes(o.productId)
      )
        return false;
      if (appliedFilters.status !== "all" && o.status !== appliedFilters.status) return false;
      if (appliedFilters.dateFrom && o.createdAt < appliedFilters.dateFrom) return false;
      if (appliedFilters.dateTo && o.createdAt > appliedFilters.dateTo + "T23:59:59Z") return false;
      if (
        search &&
        !o.reference.toLowerCase().includes(search.toLowerCase()) &&
        !o.customerName.toLowerCase().includes(search.toLowerCase()) &&
        !o.customerEmail.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, appliedFilters, search]);

  function handleUpdateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const totalRevenue = filtered
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.amount, 0);

  const currency = orders[0]?.currency ?? "GHS";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage orders from your storefronts, payment pages, and products.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <OrderFilters
              filters={pendingFilters}
              onChange={setPendingFilters}
              onApply={() => setAppliedFilters(pendingFilters)}
              onReset={() => {
                setPendingFilters(DEFAULT_FILTERS);
                setAppliedFilters(DEFAULT_FILTERS);
              }}
            />

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID or customer..."
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
          </div>

          {/* Count */}
          {filtered.length > 0 && (
            <p className="text-xs text-gray-400 px-0.5">
              Showing {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* List */}
          <OrderList orders={filtered} onUpdateStatus={handleUpdateStatus} />
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-row lg:flex-col gap-3 lg:w-52 lg:shrink-0">
          <div className="flex-1 lg:flex-none bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.25)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-brand-teal" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{filtered.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {filtered.filter((o) => o.status === "pending").length} pending
            </p>
          </div>

          <div className="flex-1 lg:flex-none bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.25)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalRevenue > 0 ? `${currency} ${totalRevenue.toLocaleString()}` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">from delivered orders</p>
          </div>

          {/* Status breakdown */}
          <div className="flex-1 lg:flex-none bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.25)] p-4 hidden lg:block">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Breakdown</p>
            <div className="space-y-2">
              {(["delivered", "pending", "cancelled", "refunded"] as OrderStatus[]).map((s) => {
                const count = filtered.filter((o) => o.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <span className="text-xs capitalize text-gray-500">{s}</span>
                    <span className="text-xs font-semibold text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
