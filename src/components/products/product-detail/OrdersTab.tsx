"use client";

import { useState, useMemo } from "react";
import { Search, Download, Package, TrendingUp, DollarSign } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mock-data/products";
import type { Product } from "@/lib/mock-data/products";

const STATUS_COLORS = {
  completed: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  cancelled: "bg-red-50 text-red-500",
};

const DELIVERY_COLORS = {
  delivered: "bg-blue-50 text-blue-600",
  pending: "bg-gray-100 text-gray-500",
};

export default function OrdersTab({ product }: { product: Product }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "cancelled">("all");

  const orders = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      if (o.productId !== product.id) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (
        search &&
        !o.customer.toLowerCase().includes(search.toLowerCase()) &&
        !o.email.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [product.id, search, statusFilter]);

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.amount, 0);
  const totalSold = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Main */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer"
              className="w-full pl-9 pr-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto shrink-0">
              {(["all", "completed", "pending", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${statusFilter === s ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Package className="w-8 h-8 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">No orders yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Orders will appear here once customers purchase this product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    {product.isPhysical && (
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Delivery
                      </th>
                    )}
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 tabular-nums">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                        {order.currency} {order.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      {product.isPhysical && (
                        <td className="px-4 py-4">
                          {order.deliveryStatus && (
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${DELIVERY_COLORS[order.deliveryStatus]}`}
                            >
                              {order.deliveryStatus}
                            </span>
                          )}
                        </td>
                      )}
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar — stacks above on mobile, right column on lg+ */}
      <div className="flex flex-row lg:flex-col gap-3 lg:w-52 lg:shrink-0">
        <div className="flex-1 lg:flex-none bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-brand-teal" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Units Sold</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSold.toLocaleString()}</p>
        </div>
        <div className="flex-1 lg:flex-none bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {product.currency} {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
