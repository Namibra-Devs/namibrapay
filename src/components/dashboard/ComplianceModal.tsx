"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { mockUser } from "@/lib/mock-data/dashboard";

interface ComplianceModalProps {
  onClose: () => void;
}

export default function ComplianceModal({ onClose }: ComplianceModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white/92 backdrop-blur-xl rounded-3xl border border-gray-200/70 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.55)] p-8 fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-teal/20 to-brand-navy/20 flex items-center justify-center mb-4 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.2)]">
            <Image
              src="/logo.png"
              alt="NamibraPay"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>

          <h2 className="text-base font-bold text-gray-900 font-heading">
            {mockUser.business}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Welcome to NamibraPay
          </p>

          <p className="mt-5 text-sm text-gray-600 leading-relaxed max-w-xs">
            Your account is in{" "}
            <span className="font-semibold text-amber-600">test mode</span> so
            you can start exploring right away. To activate live payments,
            complete your compliance verification.
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full px-6 py-3 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 active:scale-[0.98] transition-all duration-200 shadow-[0_8px_20px_-8px_rgba(100,198,195,0.6)]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
