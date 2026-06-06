"use client";

import { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import CustomerFilters from "@/components/namibrapay-main/customers/CustomerFilters";
import AddCustomerModal from "@/components/namibrapay-main/customers/AddCustomerModal";
import { mockCustomers } from "@/lib/mock-data/customers";
import type { Customer } from "@/lib/mock-data/customers";
import type { CustomerFilterState } from "@/components/namibrapay-main/customers/CustomerFilters";
import type { NewCustomerData } from "@/components/namibrapay-main/customers/AddCustomerModal";
import { DEFAULT_CUSTOMER_FILTERS } from "@/components/namibrapay-main/customers/CustomerFilters";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EmptyFolderIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 18C6 15.8 7.8 14 10 14H24L30 20H54C56.2 20 58 21.8 58 24V50C58 52.2 56.2 54 54 54H10C7.8 54 6 52.2 6 50V18Z"
        stroke="#64c6c3"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M24 32L40 46M40 32L24 46"
        stroke="#64c6c3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

let customerIdCounter = mockCustomers.length + 1;

export default function CustomersPage() {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<CustomerFilterState>(DEFAULT_CUSTOMER_FILTERS);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (
        filters.accountNumber.trim() &&
        !c.code.toLowerCase().includes(filters.accountNumber.trim().toLowerCase())
      )
        return false;

      if (
        filters.searchEmail.trim() &&
        !c.email.toLowerCase().includes(filters.searchEmail.trim().toLowerCase()) &&
        !c.name.toLowerCase().includes(filters.searchEmail.trim().toLowerCase())
      )
        return false;

      return true;
    });
  }, [customers, filters]);

  const hasFilters =
    filters.accountNumber.trim() !== "" || filters.searchEmail.trim() !== "";

  function handleAddCustomer(data: NewCustomerData) {
    const id = String(customerIdCounter++);
    const newCustomer: Customer = {
      id,
      code: `CUS_${Math.random().toString(36).slice(2, 12).toUpperCase()}`,
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: `${data.phoneCode} ${data.phoneNumber}`.trim(),
      totalSpent: 0,
      currency: "GHS",
      transactions: 0,
      createdAt: new Date().toISOString(),
      status: "active",
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setShowModal(false);
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer base and their transaction history.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          + Add Customer
        </button>
      </div>

      {/* Filter bar */}
      <CustomerFilters filters={filters} onChange={setFilters} />

      {/* Table card */}
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-4">
              <EmptyFolderIcon />
            </div>
            <p className="text-base font-semibold text-gray-700 mb-1">
              {hasFilters ? "Your filter returned no customers" : "No customers yet"}
            </p>
            <p className="text-sm text-gray-400 max-w-xs">
              {hasFilters
                ? "Please try another query or clear your filters."
                : "Your customers will appear here once they make a payment."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                    Phone
                  </th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Total Spent
                  </th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Transactions
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-teal/20 to-brand-navy/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-brand-navy">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs leading-snug">
                            {customer.name}
                          </p>
                          <p className="text-[11px] text-gray-400">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{customer.phone}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs font-semibold text-gray-900">
                        {customer.currency}{" "}
                        {customer.totalSpent.toLocaleString("en-GH", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right hidden md:table-cell">
                      <span className="text-xs text-gray-500">{customer.transactions}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          customer.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        )}
                      >
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                      <span className="text-xs text-gray-400">{formatDate(customer.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <AddCustomerModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddCustomer}
        />
      )}
    </div>
  );
}
