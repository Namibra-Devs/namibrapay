"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Globe,
  CreditCard,
  RefreshCw,
  ShoppingCart,
  Copy,
  Check,
  MoreHorizontal,
  ExternalLink,
  PowerOff,
  Trash2,
  Plus,
} from "lucide-react";
import type { PaymentPage } from "@/lib/mock-data/payment-pages";

const BASE_URL = "https://pay.namibrapay.com/";

const TYPE_CONFIG = {
  "one-time": {
    icon: CreditCard,
    label: "One-time",
    className: "bg-blue-50 text-blue-600",
    iconClass: "text-blue-500",
  },
  subscription: {
    icon: RefreshCw,
    label: "Subscription",
    className: "bg-purple-50 text-purple-600",
    iconClass: "text-purple-500",
  },
  product: {
    icon: ShoppingCart,
    label: "Product",
    className: "bg-amber-50 text-amber-700",
    iconClass: "text-amber-500",
  },
};

function PageRow({
  page,
  onToggleStatus,
  onDelete,
}: {
  page: PaymentPage;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(
    null,
  );
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const cfg = TYPE_CONFIG[page.type];
  const Icon = cfg.icon;
  const pageUrl = `${BASE_URL}${page.slug}`;

  function openMenu() {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }

  function closeMenu() {
    setMenuPos(null);
  }

  function copy() {
    navigator.clipboard.writeText(pageUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
      {/* Name + type */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.className.split(" ")[0]}`}
          >
            <Icon className={`w-4 h-4 ${cfg.iconClass}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {page.name}
            </p>
            {page.description && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {page.description}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Type badge */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.className}`}
        >
          {cfg.label}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              page.status === "active" ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
          <span
            className={`text-sm capitalize ${page.status === "active" ? "text-emerald-600" : "text-gray-400"}`}
          >
            {page.status}
          </span>
        </div>
      </td>

      {/* Stats */}
      <td className="px-4 py-4 text-sm text-gray-600 tabular-nums">
        {page.visits.toLocaleString()} visits
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900 tabular-nums">
        {page.currency} {page.revenue.toLocaleString()}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1 justify-end">
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Open page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={copy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-brand-teal" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <div className="relative">
            <button
              ref={menuBtnRef}
              title="more"
              type="button"
              onClick={openMenu}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuPos &&
              createPortal(
                <>
                  <div className="fixed inset-0 z-40" onClick={closeMenu} />
                  <div
                    className="fixed z-50 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1"
                    style={{ top: menuPos.top, right: menuPos.right }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onToggleStatus(page.id);
                        closeMenu();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <PowerOff className="w-3.5 h-3.5 text-gray-400" />
                      {page.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(page.id);
                        closeMenu();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete page
                    </button>
                  </div>
                </>,
                document.body,
              )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function PaymentPageList({
  pages,
  onNewPage,
  onToggleStatus,
  onDelete,
}: {
  pages: PaymentPage[];
  onNewPage: () => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (pages.length === 0) {
    return (
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Globe className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-900">
          No payment pages yet
        </p>
        <p className="mt-1.5 text-sm text-gray-400 max-w-xs leading-relaxed">
          The easiest way to accept payments. Create a page, share the link to
          your customers, and start collecting payments.
        </p>
        <button
          type="button"
          onClick={onNewPage}
          className="mt-6 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Page
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Visits
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Revenue
            </th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <PageRow
              key={page.id}
              page={page}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
