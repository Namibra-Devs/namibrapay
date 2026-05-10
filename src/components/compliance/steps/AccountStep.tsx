"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { MOBILE_MONEY_PROVIDERS, GH_BANKS, PHONE_CODES } from "../constants";
import type { AccountData } from "../types";

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors bg-white";
const SELECT = `${INPUT} appearance-none`;
const LABEL = "block text-sm font-medium text-gray-700 mb-1.5";
const REQ = <span className="text-red-500 ml-0.5">*</span>;

interface AccountStepProps {
  data: AccountData;
  isComplete: boolean;
  onSave: (data: AccountData) => void;
  onNext: () => void;
}

export default function AccountStep({
  data,
  isComplete,
  onSave,
  onNext,
}: AccountStepProps) {
  const [editing, setEditing] = useState(!isComplete);
  const [form, setForm] = useState<AccountData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof AccountData>(key: K, value: AccountData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nameOnAccount.trim()) e.nameOnAccount = "Required";
    if (form.accountType === "bank") {
      if (!form.bankName) e.bankName = "Required";
      if (!form.accountNumber.trim()) e.accountNumber = "Account number is required";
    } else {
      if (!form.provider) e.provider = "Required";
      if (!form.mobilePhone.trim()) e.mobilePhone = "Required";
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

  if (!editing && isComplete) {
    const providerLabel =
      MOBILE_MONEY_PROVIDERS.find((p) => p.value === form.provider)?.label ??
      form.provider;

    return (
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-3">
          {form.accountType === "bank" ? (
            <>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Bank</p>
                <p className="text-sm text-gray-900">{form.bankName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Account number</p>
                <p className="text-sm text-gray-900">{form.accountNumber}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Provider</p>
                <p className="text-sm text-gray-900">{providerLabel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Phone number</p>
                <p className="text-sm text-gray-900">{form.mobilePhone}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Name on account</p>
            <p className="text-sm text-gray-900">{form.nameOnAccount}</p>
          </div>
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
      <h2 className="text-base font-semibold text-gray-900 mb-1">Account</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter the business bank account
      </p>

      <div className="space-y-4">
        <div>
          <label className={LABEL}>Account type{REQ}</label>
          <select
            value={form.accountType}
            onChange={(e) =>
              set("accountType", e.target.value as AccountData["accountType"])
            }
            className={SELECT}
          >
            <option value="mobile_money">Mobile money</option>
            <option value="bank">Bank account</option>
          </select>
        </div>

        {form.accountType === "bank" && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">
              The minimum settlement threshold for using a bank account is GHS 50.{" "}
              <button className="underline font-medium">Learn more</button>
            </p>
          </div>
        )}

        {form.accountType === "bank" ? (
          <>
            <div>
              <label className={LABEL}>Bank name{REQ}</label>
              <select
                value={form.bankName}
                onChange={(e) => set("bankName", e.target.value)}
                className={SELECT}
              >
                <option value="">Select bank</option>
                {GH_BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.bankName && (
                <p className="mt-1 text-xs text-red-500">{errors.bankName}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>Corporate bank account number{REQ}</label>
              <p className="text-xs text-gray-400 mb-1.5">
                For faster activation, make sure your payout account is registered
                under the same name as your NamibraPay profile.
              </p>
              <input
                value={form.accountNumber}
                onChange={(e) => set("accountNumber", e.target.value)}
                className={`${INPUT} ${errors.accountNumber ? "border-red-300 focus:border-red-400 focus:ring-red-200/30" : ""}`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.accountNumber}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={LABEL}>Provider{REQ}</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-colors">
                <select
                  value={form.provider}
                  onChange={(e) => set("provider", e.target.value)}
                  className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white appearance-none"
                >
                  <option value="">Select provider</option>
                  {MOBILE_MONEY_PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                {form.provider && (
                  <button
                    type="button"
                    onClick={() => set("provider", "")}
                    className="px-3 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.provider && (
                <p className="mt-1 text-xs text-red-500">{errors.provider}</p>
              )}
            </div>

            <div>
              <label className={LABEL}>Phone number{REQ}</label>
              <p className="text-xs text-gray-400 mb-1.5">
                For faster activation, make sure your payout account is registered
                under the same name as your NamibraPay profile.
              </p>
              <input
                value={form.mobilePhone}
                onChange={(e) => set("mobilePhone", e.target.value)}
                className={INPUT}
                placeholder="0000000000"
              />
              {errors.mobilePhone && (
                <p className="mt-1 text-xs text-red-500">{errors.mobilePhone}</p>
              )}
            </div>
          </>
        )}

        <div>
          <label className={LABEL}>Name on account{REQ}</label>
          <input
            value={form.nameOnAccount}
            onChange={(e) => set("nameOnAccount", e.target.value)}
            className={INPUT}
          />
          <p className="mt-1 text-xs text-gray-400">
            To help us verify your account, the name on your corporate bank
            account should match the name you provided for your legal business name
          </p>
          {errors.nameOnAccount && (
            <p className="mt-0.5 text-xs text-red-500">{errors.nameOnAccount}</p>
          )}
        </div>
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
