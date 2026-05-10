"use client";

import { useState } from "react";
import {
  STAFF_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  CATEGORY_MAP,
  BUSINESS_TYPE_OPTIONS,
  REGISTRATION_TYPE_OPTIONS,
} from "../constants";
import type { ProfileData } from "@/types/compliance";
import Select from "@/components/ui/Select";

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors bg-white";
const LABEL = "block text-sm font-medium text-gray-700 mb-1.5";
const REQ = <span className="text-red-500 ml-0.5">*</span>;

interface ProfileStepProps {
  data: ProfileData;
  isComplete: boolean;
  onSave: (data: ProfileData) => void;
  onNext: () => void;
}

export default function ProfileStep({
  data,
  isComplete,
  onSave,
  onNext,
}: ProfileStepProps) {
  const [editing, setEditing] = useState(!isComplete);
  const [form, setForm] = useState<ProfileData>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Partial<Record<keyof ProfileData, string>> = {};
    if (!form.tradingName.trim()) e.tradingName = "Required";
    if (form.description.trim().length < 100)
      e.description = "At least 100 characters required";
    if (!form.staffSize) e.staffSize = "Required";
    if (!form.annualVolume.trim()) e.annualVolume = "Required";
    if (!form.industry) e.industry = "Required";
    if (!form.category) e.category = "Required";
    if (!form.businessType) e.businessType = "Required";
    if (form.businessType === "registered") {
      if (!form.legalName.trim()) e.legalName = "Required";
      if (!form.registrationType) e.registrationType = "Required";
    }
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
    setEditing(false);
  }

  const categories = form.industry ? (CATEGORY_MAP[form.industry] ?? []) : [];

  if (!editing && isComplete) {
    const industryLabel =
      INDUSTRY_OPTIONS.find((o) => o.value === form.industry)?.label ?? form.industry;
    const categoryLabel =
      categories.find((o) => o.value === form.category)?.label ?? form.category;
    const sizeLabel =
      STAFF_SIZE_OPTIONS.find((o) => o.value === form.staffSize)?.label ?? form.staffSize;
    const bizTypeLabel =
      BUSINESS_TYPE_OPTIONS.find((o) => o.value === form.businessType)?.label ?? form.businessType;
    const regTypeLabel =
      REGISTRATION_TYPE_OPTIONS.find((o) => o.value === form.registrationType)?.label ?? form.registrationType;

    const rows: [string, string][] = [
      ["Country", "Ghana"],
      ["Industry", industryLabel],
      ["Category", categoryLabel],
      ["Trading name", form.tradingName],
      ["Size", sizeLabel],
      ["Annual projected sales volume", `GHS ${form.annualVolume}`],
      ["Description", form.description],
      ["Business type", bizTypeLabel],
    ];
    if (form.businessType === "registered") {
      rows.push(["Legal name", form.legalName]);
      rows.push(["Registration type", regTypeLabel]);
    }

    return (
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="space-y-3">
          {rows.map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm text-gray-900 break-words">{val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Profile</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about your business</p>

      <div className="space-y-4">
        {/* Country (read-only) */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Country</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">Ghana</span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold text-gray-500">
              GH
            </span>
          </div>
        </div>

        <div>
          <label className={LABEL}>
            Trading name{REQ}
          </label>
          <input
            value={form.tradingName}
            onChange={(e) => set("tradingName", e.target.value)}
            className={INPUT}
            placeholder="Your business trading name"
          />
          {errors.tradingName && (
            <p className="mt-1 text-xs text-red-500">{errors.tradingName}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>
            Description{REQ}
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className={`${INPUT} resize-none`}
            placeholder="Describe your business"
          />
          <p className="mt-1 text-xs text-gray-400">
            {form.description.length} / 100 minimum characters
          </p>
          {errors.description && (
            <p className="mt-0.5 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>
            Staff size{REQ}
          </label>
          <Select
            options={STAFF_SIZE_OPTIONS}
            value={form.staffSize}
            onChange={(v) => set("staffSize", v)}
            placeholder="Choose one"
          />
          {errors.staffSize && (
            <p className="mt-1 text-xs text-red-500">{errors.staffSize}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>
            Annual projected sales volume{REQ}
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-colors">
            <span className="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0">
              GHS
            </span>
            <input
              type="number"
              min="0"
              value={form.annualVolume}
              onChange={(e) => set("annualVolume", e.target.value)}
              className="flex-1 px-3 py-3 text-sm focus:outline-none bg-white"
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            We use your projected sales to tailor pricing, limits, and support for your business
          </p>
          {errors.annualVolume && (
            <p className="mt-0.5 text-xs text-red-500">{errors.annualVolume}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>
            Industry{REQ}
          </label>
          <Select
            options={INDUSTRY_OPTIONS}
            value={form.industry}
            onChange={(v) => {
              set("industry", v);
              set("category", "");
            }}
            placeholder="Choose industry"
          />
          {errors.industry && (
            <p className="mt-1 text-xs text-red-500">{errors.industry}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>
            Category{REQ}
          </label>
          <div className={!form.industry ? "opacity-50 pointer-events-none" : ""}>
            <Select
              options={categories}
              value={form.category}
              onChange={(v) => set("category", v)}
              placeholder={form.industry ? "Choose category" : "First, select an industry"}
            />
          </div>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
          <label className={LABEL}>
            Business type{REQ}
          </label>
          <Select
            options={BUSINESS_TYPE_OPTIONS}
            value={form.businessType}
            onChange={(v) => set("businessType", v)}
            placeholder="Type of business"
          />
          {errors.businessType && (
            <p className="mt-1 text-xs text-red-500">{errors.businessType}</p>
          )}
        </div>

        {form.businessType === "registered" && (
          <>
            <div>
              <label className={LABEL}>
                Legal business name{REQ}
              </label>
              <input
                value={form.legalName}
                onChange={(e) => set("legalName", e.target.value)}
                className={INPUT}
                placeholder="Registered legal name"
              />
              {errors.legalName && (
                <p className="mt-1 text-xs text-red-500">{errors.legalName}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>
                Registration type{REQ}
              </label>
              <Select
                options={REGISTRATION_TYPE_OPTIONS}
                value={form.registrationType}
                onChange={(v) => set("registrationType", v)}
                placeholder="Type of registration"
              />
              {errors.registrationType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.registrationType}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full py-3 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
      >
        Save
      </button>
    </div>
  );
}
