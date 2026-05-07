import { UserPlus, Users } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { mockCustomers } from "@/lib/mock-data/customers";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer base and their transaction history.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add customer
        </button>
      </div>

      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Customers</h2>
          <span className="ml-auto text-xs text-gray-400">
            {mockCustomers.length} total
          </span>
        </div>

        {mockCustomers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No customers yet"
            description="Your customers will appear here once they make a payment."
          />
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
                {mockCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
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
                          <p className="text-[11px] text-gray-400">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">
                        {customer.phone}
                      </span>
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
                      <span className="text-xs text-gray-500">
                        {customer.transactions}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          customer.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200",
                        )}
                      >
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                      <span className="text-xs text-gray-400">
                        {formatDate(customer.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
