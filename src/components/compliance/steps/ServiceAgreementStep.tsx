"use client";

import { useState } from "react";
import { AlertTriangle, Pencil, Loader2 } from "lucide-react";
import PhoneCodePicker from "@/components/ui/PhoneCodePicker";
import { toast } from "@/components/ui/Toast";
import type {
  ServiceAgreementData,
  ProfileData,
  ContactData,
} from "@/types/compliance";

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors bg-white";
const LABEL = "block text-sm font-medium text-gray-700 mb-1.5";
const REQ = <span className="text-red-500 ml-0.5">*</span>;

interface ServiceAgreementStepProps {
  data: ServiceAgreementData;
  profile: ProfileData;
  contact: ContactData;
  onSubmit: (data: ServiceAgreementData) => void;
  onGoToStep: (step: number) => void;
}

export default function ServiceAgreementStep({
  data,
  profile,
  contact,
  onSubmit,
  onGoToStep,
}: ServiceAgreementStepProps) {
  const [form, setForm] = useState<ServiceAgreementData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof ServiceAgreementData>(
    key: K,
    value: ServiceAgreementData[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.jobTitle.trim()) e.jobTitle = "Required";
    if (!form.accepted)
      e.accepted = "You must accept the agreement to continue";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    const id = toast.loading("Submitting agreement...", {
      description: "Submitting your merchant service agreement for review",
    });
    await new Promise((r) => setTimeout(r, 1000));
    onSubmit(form);
    setSubmitting(false);
    toast.success("Agreement submitted", {
      id,
      description: "Your compliance information has been submitted for review",
    });
  }

  const entityName = profile.legalName || profile.tradingName;
  const addr = contact.officeAddress;
  const addrStr = [addr.street, addr.city, addr.state, addr.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Merchant Service Agreement
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Kindly read through and accept the merchant service agreement.
      </p>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Important</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Please ensure that the information you provide is correct.{" "}
            <strong>
              DO NOT ACCEPT THIS AGREEMENT IF YOUR DETAILS ARE INCORRECT.
            </strong>
          </p>
        </div>
      </div>

      {/* Agreement text */}
      <div className="space-y-4 text-sm text-gray-700 leading-relaxed mb-6">
        <h3 className="font-semibold text-gray-900">Services Agreement</h3>
        <p>
          The{" "}
          <button className="text-brand-teal hover:underline font-medium">
            NamibraPay Merchant Services Agreement
          </button>{" "}
          is an agreement between you and NamibraPay. It details
          NamibraPay&apos;s obligations to you and your obligations to
          NamibraPay. It also highlights certain risks and requirements on using
          the Services and you must consider them carefully as you will be bound
          by the provision of this Agreement through your use of this website or
          any of our Services. By accepting this Agreement electronically, you
          will be deemed to have acknowledged and agreed that you are bound by
          the terms of the Agreement and it shall be deemed to have been
          accepted by the Company.
        </p>

        <h3 className="font-semibold text-gray-900">Accept Agreement</h3>
        <p>
          If you are accepting this Agreement on behalf of your employer or
          another entity, you represent and warrant that you have full legal
          authority to bind your employer or such entity to these terms and
          conditions. If you don&apos;t have the legal authority to bind, please
          do not sign the agreement below.
        </p>
        <p className="font-semibold">
          By signing this agreement, I am accepting this agreement on behalf of{" "}
          {entityName}. I represent and warrant that (a) I have the full
          authority to bind the entity to this Agreement, (b) I have read and
          understand this Agreement, and (c) I agree to all the terms and
          conditions of this Agreement on behalf of the entity that I represent
          and (d) I sign this Agreement of my own volition, without duress or
          any undue influence from any person.
        </p>

        {/* Pre-filled summary rows */}
        <div className="space-y-1 mt-4">
          {[
            { label: "Contracting entity", value: entityName, step: 0 },
            { label: "Company address", value: addrStr || "—", step: 1 },
            ...(contact.website
              ? [{ label: "Website", value: contact.website, step: 1 }]
              : []),
          ].map(({ label, value, step }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3 border-b border-gray-100"
            >
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm text-gray-900">{value}</p>
              </div>
              <button
                title={`Edit ${label}`}
                onClick={() => onGoToStep(step)}
                className="p-1.5 rounded-lg text-brand-teal hover:bg-brand-teal/10 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Signing form */}
      <div className="space-y-4">
        <div>
          <label className={LABEL}>Full name{REQ}</label>
          <input
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={INPUT}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>Phone number{REQ}</label>
          <div className="flex gap-2">
            <PhoneCodePicker
              value={form.phoneCode}
              onChange={(v) => set("phoneCode", v)}
              className="w-28 shrink-0"
            />
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={`${INPUT} flex-1`}
              placeholder="0000000000"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

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

        <div>
          <label className={LABEL}>Job title{REQ}</label>
          <input
            value={form.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            className={INPUT}
          />
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-red-500">{errors.jobTitle}</p>
          )}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.accepted}
            onChange={(e) => set("accepted", e.target.checked)}
            className="rounded border-gray-300 text-brand-teal w-4 h-4 shrink-0"
          />
          <span className="text-sm text-gray-700">
            I accept the merchant service agreement
          </span>
        </label>
        {errors.accepted && (
          <p className="text-xs text-red-500">{errors.accepted}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : "Accept"}
        </button>
      </div>
    </div>
  );
}
