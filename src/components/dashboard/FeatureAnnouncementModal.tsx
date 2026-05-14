"use client";

import { X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface FeatureItem {
  title: string;
  description: string;
}

export interface FeatureAnnouncementModalProps {
  onClose: () => void;
  title: string;
  description?: string;
  features?: FeatureItem[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  illustrationType?: "rocket" | "bank_transfer";
}

function RocketIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="40" fill="#f0fdfb" />
      <circle cx="18" cy="20" r="2" fill="#64c6c3" opacity="0.6" />
      <circle cx="62" cy="16" r="1.5" fill="#64c6c3" opacity="0.5" />
      <circle cx="66" cy="34" r="2" fill="#64c6c3" opacity="0.4" />
      <circle cx="14" cy="44" r="1.5" fill="#64c6c3" opacity="0.5" />
      <path d="M40 16C40 16 28 26 28 40c0 4 2 7.5 4 10l8 8 8-8c2-2.5 4-6 4-10 0-14-12-24-12-24z" fill="#64c6c3" />
      <circle cx="40" cy="37" r="5" fill="white" opacity="0.9" />
      <circle cx="40" cy="37" r="3" fill="#64c6c3" opacity="0.4" />
      <path d="M28 46 L22 54 L32 50 Z" fill="#4db3b0" />
      <path d="M52 46 L58 54 L48 50 Z" fill="#4db3b0" />
      <ellipse cx="40" cy="60" rx="4" ry="3" fill="#fedfb8" opacity="0.8" />
      <ellipse cx="40" cy="64" rx="2.5" ry="2" fill="#ffb4b0" opacity="0.5" />
    </svg>
  );
}

function BankTransferIllustration() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-100 flex" style={{ height: 148 }}>
      {/* Left — teal gradient panel */}
      <div className="flex-1 bg-gradient-to-br from-[#e6f7f6] to-[#c8eeec] p-4 flex flex-col justify-between">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 bg-brand-teal text-white text-[9px] font-bold rounded-md tracking-wide">
            NEW
          </span>
          <span className="text-[11px] font-bold text-gray-600">NamibraPay</span>
        </div>
        <p className="text-[15px] font-bold text-gray-800 leading-snug">
          Pay with Bank<br />Transfer
        </p>
      </div>

      {/* Right — payment channel mockup */}
      <div className="w-40 bg-white border-l border-gray-100 px-3 py-3 flex flex-col justify-center gap-1.5">
        <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Pay with
        </p>
        {/* Mobile money row */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-gray-400">
          <span className="w-4 h-4 rounded-full bg-gray-100 shrink-0" />
          Mobile money
        </div>
        {/* Card row */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-gray-400">
          <span className="w-4 h-4 rounded-md bg-gray-100 shrink-0" />
          Card
        </div>
        {/* Bank Transfer row — active */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/30 text-[10px] text-brand-teal font-semibold">
          <span className="w-4 h-4 rounded-md bg-brand-teal shrink-0 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 4h6M4 1l3 3-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Bank Transfer
        </div>
      </div>
    </div>
  );
}

export default function FeatureAnnouncementModal({
  onClose,
  title,
  description,
  features,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  illustrationType = "rocket",
}: FeatureAnnouncementModalProps) {
  const isRich = features && features.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] w-full fade-in overflow-hidden ${isRich ? "max-w-md" : "max-w-sm"}`}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isRich ? (
          /* ── Rich layout (bank transfer style) ── */
          <div className="p-6">
            <BankTransferIllustration />

            <h2 className="mt-5 text-base font-bold font-heading text-gray-900 leading-snug">
              {title}
            </h2>

            <ol className="mt-3 space-y-2.5">
              {features!.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span className="shrink-0 font-semibold text-brand-teal">{i + 1}.</span>
                  <p className="text-gray-600">
                    <span className="font-semibold text-brand-teal">{f.title}:</span>{" "}
                    {f.description}
                  </p>
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-3 mt-6">
              {secondaryCtaLabel && secondaryCtaHref ? (
                <Link
                  href={secondaryCtaHref}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {secondaryCtaLabel}
                </Link>
              ) : (
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              )}
              <Link
                href={ctaHref}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 active:scale-[0.98] transition-all"
              >
                {ctaLabel}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ── Simple layout (rocket style) ── */
          <div className="p-8 flex flex-col items-center text-center">
            <div className="mb-5">
              {illustrationType === "rocket" ? <RocketIllustration /> : <BankTransferIllustration />}
            </div>
            <h2 className="text-lg font-bold font-heading text-gray-900 mb-2 leading-snug">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500 leading-relaxed mb-7">{description}</p>
            )}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <Link
                href={ctaHref}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 active:scale-[0.98] transition-all"
              >
                {ctaLabel}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
