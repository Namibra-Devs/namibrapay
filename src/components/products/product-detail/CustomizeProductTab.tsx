"use client";

import { useState } from "react";
import {
  Edit2,
  Check,
  X,
  Copy,
  Upload,
  ExternalLink,
  FileText,
} from "lucide-react";
import type { Product } from "@/lib/mock-data/products";

const BASE_URL = "https://store.namibrapay.com/";

function Toggle({
  checked,
  onChange,
  label,
  sub,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button
        title="Toggle"
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-brand-teal" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}

type SubTab = "info" | "downloads";

export default function CustomizeProductTab({
  product,
  onUpdate,
}: {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
}) {
  const [subTab, setSubTab] = useState<SubTab>("info");
  const [editDesc, setEditDesc] = useState(false);
  const [description, setDescription] = useState(product.description ?? "");
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(product.status === "active");

  const pageUrl = `${BASE_URL}${product.slug}`;

  function copyUrl() {
    navigator.clipboard.writeText(pageUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function saveDesc() {
    onUpdate({ description });
    setEditDesc(false);
  }

  function handleStatusToggle(v: boolean) {
    setActive(v);
    onUpdate({ status: v ? "active" : "archived" });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left: Media */}
      <div className="w-full lg:w-64 lg:shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Product Media</p>
          </div>
          <div className="p-4 space-y-3">
            {/* Main image slot */}
            <div className="aspect-square rounded-xl bg-linear-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-colors">
              <Upload className="w-6 h-6 text-gray-300" />
              <p className="text-xs text-gray-400 text-center px-4">
                Click to upload main image
              </p>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              Supports JPG, PNG, GIF, WEBP · Max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Right: Info / Downloads */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Sub tabs */}
          <div className="flex items-center gap-0 border-b border-gray-100">
            {(["info", "downloads"] as SubTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSubTab(t)}
                className={`px-5 py-3.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  subTab === t
                    ? "border-brand-teal text-brand-teal"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "info" ? "Product Info" : "Digital Downloads"}
              </button>
            ))}
          </div>

          {subTab === "info" && (
            <div className="p-5 space-y-5">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">
                    Description
                  </p>
                  {!editDesc ? (
                    <button
                      type="button"
                      onClick={() => setEditDesc(true)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-teal transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDescription(product.description ?? "");
                          setEditDesc(false);
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={saveDesc}
                        className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  )}
                </div>
                {!editDesc ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description ?? (
                      <span className="text-gray-400 italic">
                        No description added.
                      </span>
                    )}
                  </p>
                ) : (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 resize-none"
                  />
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Shareable URL */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Shareable URL
                </p>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="flex-1 text-sm text-gray-600 truncate">
                    {pageUrl}
                  </p>
                  <a
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={copyUrl}
                    className="p-1 text-gray-400 hover:text-brand-teal transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-brand-teal" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Status toggle */}
              <Toggle
                checked={active}
                onChange={handleStatusToggle}
                label="Product active"
                sub="Customers can discover and purchase this product"
              />
            </div>
          )}

          {subTab === "downloads" && (
            <div className="p-5">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-colors cursor-pointer">
                <FileText className="w-8 h-8 text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  No digital files yet
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Upload PDFs, ZIPs, or other digital files to deliver to
                  customers after purchase.
                </p>
                <button
                  type="button"
                  className="mt-4 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
