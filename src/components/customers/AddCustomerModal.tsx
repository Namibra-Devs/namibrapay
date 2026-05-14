"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PhoneCodePicker from "@/components/ui/PhoneCodePicker";

export interface NewCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
}

interface AddCustomerModalProps {
  onClose: () => void;
  onSubmit: (data: NewCustomerData) => void;
}

export default function AddCustomerModal({ onClose, onSubmit }: AddCustomerModalProps) {
  const [form, setForm] = useState<NewCustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+233",
    phoneNumber: "",
  });

  function update<K extends keyof NewCustomerData>(key: K, value: NewCustomerData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const canSubmit = form.firstName.trim() && form.lastName.trim() && form.email.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] w-full max-w-md fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-heading">New Customer</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* First Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder=""
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder=""
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder=""
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <div className="flex gap-2">
              <div className="w-28 shrink-0">
                <PhoneCodePicker
                  value={form.phoneCode}
                  onChange={(code) => update("phoneCode", code)}
                />
              </div>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                placeholder=""
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
