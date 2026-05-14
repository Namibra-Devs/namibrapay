import { cn } from "@/lib/utils";
import type { Refund, RefundStatus } from "@/lib/mock-data/refunds";

const statusConfig: Record<RefundStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  processed: {
    label: "Processed",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
};

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;
}

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

interface RefundTableProps {
  refunds: Refund[];
  hasFilters: boolean;
}

export default function RefundTable({ refunds, hasFilters }: RefundTableProps) {
  if (refunds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-4">
          <EmptyFolderIcon />
        </div>
        <p className="text-base font-semibold text-gray-700 mb-1">
          {hasFilters ? "No refunds" : "No refunds yet"}
        </p>
        <p className="text-sm text-gray-400 max-w-xs">
          {hasFilters
            ? "There're no refunds for this query. Please try another query or clear your filters."
            : "Refund requests from your customers will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Refund ID
            </th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
              Customer
            </th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
              Reason
            </th>
            <th className="text-right pl-3 pr-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Amount
            </th>
            <th className="text-left pl-6 pr-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Status
            </th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {refunds.map((refund) => {
            const status = statusConfig[refund.status];
            return (
              <tr
                key={refund.id}
                className="hover:bg-gray-50/50 transition-colors duration-150 group cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div>
                    <span className="font-mono text-xs text-gray-500 group-hover:text-gray-700 transition-colors block">
                      {refund.refundId}
                    </span>
                    <span className="font-mono text-[11px] text-gray-400">
                      {refund.bankReference}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3.5 hidden sm:table-cell">
                  <div>
                    <p className="font-medium text-gray-900 text-xs leading-snug">
                      {refund.customer}
                    </p>
                    <p className="text-[11px] text-gray-400">{refund.email}</p>
                  </div>
                </td>
                <td className="px-3 py-3.5 hidden md:table-cell">
                  <span className="text-xs text-gray-500">{refund.reason}</span>
                </td>
                <td className="pl-3 pr-6 py-3.5 text-right">
                  <span className="text-xs font-semibold text-gray-900">
                    {formatAmount(refund.amount, refund.currency)}
                  </span>
                </td>
                <td className="pl-6 pr-3 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                  <span className="text-xs text-gray-400">{formatDate(refund.createdAt)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
