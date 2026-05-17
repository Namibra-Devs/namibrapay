"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Receipt, MoreHorizontal, ExternalLink, Send, Trash2, FileText } from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/lib/mock-data/invoices";

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string; dot: string }> = {
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-50 text-red-500",
    dot: "bg-red-400",
  },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function InvoiceMenu({
  invoice,
  onDelete,
}: {
  invoice: Invoice;
  onDelete: (id: string) => void;
}) {
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function openMenu() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
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

      {menuPos && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuPos(null)} />
          <div
            className="fixed z-50 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              type="button"
              onClick={() => setMenuPos(null)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              View invoice
            </button>
            {invoice.status === "draft" && (
              <button
                type="button"
                onClick={() => setMenuPos(null)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-gray-400" />
                Send invoice
              </button>
            )}
            {invoice.status === "pending" && (
              <button
                type="button"
                onClick={() => setMenuPos(null)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-gray-400" />
                Resend invoice
              </button>
            )}
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={() => { onDelete(invoice.id); setMenuPos(null); }}
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

export default function InvoiceList({
  invoices,
  onDelete,
}: {
  invoices: Invoice[];
  onDelete: (id: string) => void;
}) {
  if (invoices.length === 0) {
    return (
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Receipt className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-900">No invoices sent</p>
        <p className="mt-1.5 text-sm text-gray-400 max-w-xs leading-relaxed">
          Use this feature to bill your customers easily or send professional invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Invoice</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Due</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">{inv.reference}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(inv.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-gray-900">{inv.customerName}</p>
                  <p className="text-xs text-gray-400">{inv.customerEmail}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <FileText className="w-3.5 h-3.5" />
                    {inv.type === "professional" ? "Professional" : "Simple"}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                  {inv.currency} {inv.amount.toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <InvoiceMenu invoice={inv} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
