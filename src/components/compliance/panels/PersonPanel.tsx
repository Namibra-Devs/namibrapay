"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";
import { PHONE_CODES, MONTHS, GH_REGIONS, NATIONALITIES, ID_DOCUMENTS } from "../constants";
import type { Person } from "../types";

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors bg-white";
const SELECT = `${INPUT} appearance-none`;
const LABEL = "block text-sm font-medium text-gray-700 mb-1.5";
const REQ = <span className="text-red-500 ml-0.5">*</span>;

function emptyForm(): Omit<Person, "id"> {
  return {
    email: "",
    firstName: "",
    lastName: "",
    phoneCode: "+233",
    phone: "",
    percentageOwned: "",
    dobMonth: "",
    dobDay: "",
    dobYear: "",
    nationality: "",
    idDocument: "",
    country: "Ghana",
    state: "",
    city: "",
    street: "",
    complex: "",
    proofFileName: "",
  };
}

interface PersonPanelProps {
  type: "director" | "owner";
  onSave: (person: Person) => void;
  onClose: () => void;
}

export default function PersonPanel({ type, onSave, onClose }: PersonPanelProps) {
  const [form, setForm] = useState<Omit<Person, "id">>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: keyof Omit<Person, "id">, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "Required";
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (type === "owner" && !form.percentageOwned) e.percentageOwned = "Required";
    if (!form.dobMonth || !form.dobDay || !form.dobYear) e.dob = "Required";
    if (!form.nationality) e.nationality = "Required";
    if (!form.idDocument) e.idDocument = "Required";
    if (!form.state) e.state = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.street.trim()) e.street = "Required";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({ ...form, id: Math.random().toString(36).substring(2) });
  }

  const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 18 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return createPortal(
    <>
      {/* Full-screen backdrop — portalled to body, so backdrop-filter ancestors can't trap it */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <motion.div
        className="fixed right-0 top-0 h-screen w-full max-w-110 bg-white shadow-2xl z-201 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-gray-900">
            {type === "director" ? "Add Director" : "Add Owner"}
          </h2>
          <button
            title="close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Email */}
          <div>
            <label className={LABEL}>Email address{REQ}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={INPUT}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>First name{REQ}</label>
              <input
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className={INPUT}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className={LABEL}>Last name{REQ}</label>
              <input
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className={INPUT}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={LABEL}>Phone number{REQ}</label>
            <div className="flex gap-2">
              <select
                value={form.phoneCode}
                onChange={(e) => set("phoneCode", e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors appearance-none bg-white w-24 shrink-0"
              >
                {PHONE_CODES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={INPUT}
                placeholder="0000000000"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Percentage owned (owner only) */}
          {type === "owner" && (
            <div>
              <label className={LABEL}>Percentage owned{REQ}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.percentageOwned}
                onChange={(e) => set("percentageOwned", e.target.value)}
                className={INPUT}
              />
              {errors.percentageOwned && (
                <p className="mt-1 text-xs text-red-500">{errors.percentageOwned}</p>
              )}
            </div>
          )}

          {/* Identification */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Identification</h3>

            <div>
              <label className={LABEL}>Date of birth{REQ}</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.dobMonth}
                  onChange={(e) => set("dobMonth", e.target.value)}
                  className={SELECT}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={form.dobDay}
                  onChange={(e) => set("dobDay", e.target.value)}
                  className={SELECT}
                >
                  <option value="">Day</option>
                  {days.map((d) => (
                    <option key={d} value={String(d)}>{d}</option>
                  ))}
                </select>
                <select
                  value={form.dobYear}
                  onChange={(e) => set("dobYear", e.target.value)}
                  className={SELECT}
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              {errors.dob && (
                <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>Nationality{REQ}</label>
              <select
                value={form.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                className={SELECT}
              >
                <option value="">Choose an option</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {errors.nationality && (
                <p className="mt-1 text-xs text-red-500">{errors.nationality}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>Identification document{REQ}</label>
              <select
                value={form.idDocument}
                onChange={(e) => set("idDocument", e.target.value)}
                className={SELECT}
              >
                <option value="">Choose document type</option>
                {ID_DOCUMENTS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              {errors.idDocument && (
                <p className="mt-1 text-xs text-red-500">{errors.idDocument}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Address</h3>

            <div>
              <p className="text-xs text-gray-400 mb-0.5">Country</p>
              <p className="text-sm font-medium text-gray-900">Ghana</p>
            </div>

            <div>
              <label className={LABEL}>State, region or county{REQ}</label>
              <select
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className={SELECT}
              >
                <option value="">Choose an option</option>
                {GH_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-xs text-red-500">{errors.state}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>City{REQ}</label>
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={INPUT}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-500">{errors.city}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>Street address{REQ}</label>
              <input
                value={form.street}
                onChange={(e) => set("street", e.target.value)}
                className={INPUT}
              />
              {errors.street && (
                <p className="mt-1 text-xs text-red-500">{errors.street}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>Complex or building (optional)</label>
              <input
                value={form.complex}
                onChange={(e) => set("complex", e.target.value)}
                className={INPUT}
                placeholder="Building name, unit number or floor"
              />
            </div>

            <div>
              <label className={LABEL}>Please upload a proof of address{REQ}</label>
              <label className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-xl py-4 px-4 cursor-pointer hover:border-brand-teal hover:bg-brand-teal/5 transition-colors">
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 truncate">
                  {form.proofFileName || "Drag files here or click to upload"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    set("proofFileName", e.target.files?.[0]?.name ?? "")
                  }
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <div className="mt-2 space-y-0.5 text-xs text-gray-400">
                <p>Proof of address can be any of these documents, not more than 6 months old:</p>
                <p>i. Utility bill for services to the address.</p>
                <p>ii. Bank statement showing current address.</p>
                <p>iii. Tax assessment.</p>
                <p>iv. Cable TV bill such as DSTV bill.</p>
                <p>v. Letter from a public authority.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-gray-100 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
          >
            Save
          </button>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
