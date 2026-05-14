"use client";

import { X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface FeatureAnnouncementModalProps {
  onClose: () => void;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: React.ReactNode;
}

function RocketIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="40" fill="#f0fdfb" />
      {/* Stars */}
      <circle cx="18" cy="20" r="2" fill="#64c6c3" opacity="0.6" />
      <circle cx="62" cy="16" r="1.5" fill="#64c6c3" opacity="0.5" />
      <circle cx="66" cy="34" r="2" fill="#64c6c3" opacity="0.4" />
      <circle cx="14" cy="44" r="1.5" fill="#64c6c3" opacity="0.5" />
      {/* Rocket body */}
      <path
        d="M40 16C40 16 28 26 28 40c0 4 2 7.5 4 10l8 8 8-8c2-2.5 4-6 4-10 0-14-12-24-12-24z"
        fill="#64c6c3"
      />
      {/* Rocket window */}
      <circle cx="40" cy="37" r="5" fill="white" opacity="0.9" />
      <circle cx="40" cy="37" r="3" fill="#64c6c3" opacity="0.4" />
      {/* Rocket fins */}
      <path d="M28 46 L22 54 L32 50 Z" fill="#4db3b0" />
      <path d="M52 46 L58 54 L48 50 Z" fill="#4db3b0" />
      {/* Exhaust */}
      <ellipse cx="40" cy="60" rx="4" ry="3" fill="#fedfb8" opacity="0.8" />
      <ellipse cx="40" cy="64" rx="2.5" ry="2" fill="#ffb4b0" opacity="0.5" />
    </svg>
  );
}

export default function FeatureAnnouncementModal({
  onClose,
  title,
  description,
  ctaLabel,
  ctaHref,
  icon,
}: FeatureAnnouncementModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] w-full max-w-sm p-8 fade-in flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="mb-5">
          {icon ?? <RocketIllustration />}
        </div>

        {/* Content */}
        <h2 className="text-lg font-bold font-heading text-gray-900 mb-2 leading-snug">
          {title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          {description}
        </p>

        {/* Actions */}
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
    </div>
  );
}
