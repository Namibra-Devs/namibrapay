"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { GH_REGIONS } from "../constants";
import type { ContactData, Address } from "@/types/compliance";
import Select from "@/components/ui/Select";
import PhoneCodePicker from "@/components/ui/PhoneCodePicker";
import { toast } from "@/components/ui/Toast";

const INPUT =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-colors bg-white";
const LABEL = "block text-sm font-medium text-gray-700 mb-1.5";
const REQ = <span className="text-red-500 ml-0.5">*</span>;

interface AddressFormProps {
  title: string;
  data: Address;
  onChange: (a: Address) => void;
  showGPS?: boolean;
}

function AddressForm({ title, data, onChange, showGPS = true }: AddressFormProps) {
  function set(key: keyof Address, val: string) {
    onChange({ ...data, [key]: val });
  }
  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      )}
      <div>
        <p className="text-xs text-gray-400 mb-0.5">Country</p>
        <p className="text-sm font-medium text-gray-900">Ghana</p>
      </div>
      <div>
        <label className={LABEL}>State or region{REQ}</label>
        <Select
          options={GH_REGIONS.map((r) => ({ value: r, label: r }))}
          value={data.state}
          onChange={(v) => set("state", v)}
          placeholder="Choose state, region or county"
        />
      </div>
      <div>
        <label className={LABEL}>City{REQ}</label>
        <input
          value={data.city}
          onChange={(e) => set("city", e.target.value)}
          className={INPUT}
        />
      </div>
      <div>
        <label className={LABEL}>Street address{REQ}</label>
        <input
          value={data.street}
          onChange={(e) => set("street", e.target.value)}
          className={INPUT}
        />
      </div>
      {showGPS && (
        <div>
          <label className={LABEL}>GPS address{REQ}</label>
          <input
            value={data.gpsAddress}
            onChange={(e) => set("gpsAddress", e.target.value)}
            className={INPUT}
            placeholder="AK-00000-00000"
          />
        </div>
      )}
      <div>
        <label className={LABEL}>Complex or building (optional)</label>
        <input
          value={data.complex}
          onChange={(e) => set("complex", e.target.value)}
          className={INPUT}
          placeholder="Building name, unit number or floor"
        />
      </div>
    </div>
  );
}

interface ContactStepProps {
  data: ContactData;
  isComplete: boolean;
  onSave: (data: ContactData) => void;
  onNext: () => void;
}

export default function ContactStep({
  data,
  isComplete,
  onSave,
  onNext,
}: ContactStepProps) {
  const [editing, setEditing] = useState(!isComplete);
  const [form, setForm] = useState<ContactData>(data);
  const [saving, setSaving] = useState(false);
  const [showWebsite, setShowWebsite] = useState(!!data.website);
  const [showTwitter, setShowTwitter] = useState(!!data.twitter);
  const [showFacebook, setShowFacebook] = useState(!!data.facebook);
  const [showInstagram, setShowInstagram] = useState(!!data.instagram);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof ContactData>(key: K, value: ContactData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.generalEmail.trim()) e.generalEmail = "Required";
    if (!form.supportEmail.trim() && !form.useSupportAsGeneral)
      e.supportEmail = "Required";
    if (!form.disputesEmail.trim() && !form.useDisputeAsGeneral)
      e.disputesEmail = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.registeredAddress.state) e.regState = "Required";
    if (!form.registeredAddress.city.trim()) e.regCity = "Required";
    if (!form.registeredAddress.street.trim()) e.regStreet = "Required";
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    const id = toast.loading("Saving contact details...", {
      description: "Saving your emails, phone number and addresses",
    });
    await new Promise((r) => setTimeout(r, 800));
    const saved = { ...form };
    if (saved.useSupportAsGeneral) saved.supportEmail = saved.generalEmail;
    if (saved.useDisputeAsGeneral) saved.disputesEmail = saved.generalEmail;
    if (saved.useRegisteredForOffice)
      saved.officeAddress = { ...saved.registeredAddress };
    onSave(saved);
    setEditing(false);
    setSaving(false);
    toast.success("Contact details saved", {
      id,
      description: "Your contact information has been saved successfully",
    });
  }

  if (!editing && isComplete) {
    function fmtAddr(a: Address) {
      return [a.street, a.city, a.state, a.country].filter(Boolean).join(", ");
    }

    return (
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Contact</h2>
        <div className="space-y-3">
          {[
            ["General email", form.generalEmail],
            ["Support", form.supportEmail || form.generalEmail],
            ["Disputes", form.disputesEmail || form.generalEmail],
            ["Phone number", `${form.phoneCode} ${form.phone}`],
            ["Registered address", fmtAddr(form.registeredAddress)],
            ["Office address", fmtAddr(form.officeAddress)],
            ...(form.website ? [["Website", form.website]] : []),
          ].map(([label, val]) => (
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
      <h2 className="text-base font-semibold text-gray-900 mb-1">Contact</h2>
      <p className="text-sm text-gray-500 mb-6">
        Provide your business contact information
      </p>

      <div className="space-y-6">
        {/* Contact emails & phone */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Contact</h3>

          <div>
            <label className={LABEL}>General email{REQ}</label>
            <input
              type="email"
              value={form.generalEmail}
              onChange={(e) => set("generalEmail", e.target.value)}
              className={INPUT}
            />
            {errors.generalEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.generalEmail}</p>
            )}
          </div>

          <div>
            <label className={LABEL}>Support{REQ}</label>
            {!form.useSupportAsGeneral && (
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => set("supportEmail", e.target.value)}
                className={`${INPUT} mb-2`}
              />
            )}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.useSupportAsGeneral}
                onChange={(e) => set("useSupportAsGeneral", e.target.checked)}
                className="rounded border-gray-300 text-brand-teal"
              />
              Use general email
            </label>
            {errors.supportEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.supportEmail}</p>
            )}
          </div>

          <div>
            <label className={LABEL}>Disputes{REQ}</label>
            {!form.useDisputeAsGeneral && (
              <input
                type="email"
                value={form.disputesEmail}
                onChange={(e) => set("disputesEmail", e.target.value)}
                className={`${INPUT} mb-2`}
                placeholder="Enter dispute email and press enter"
              />
            )}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.useDisputeAsGeneral}
                onChange={(e) => set("useDisputeAsGeneral", e.target.checked)}
                className="rounded border-gray-300 text-brand-teal"
              />
              Add general email
            </label>
            {errors.disputesEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.disputesEmail}</p>
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
        </div>

        {/* Online presence */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Online presence{REQ}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Provide the online channel you use to engage with your customers
            </p>
          </div>

          {!showWebsite ? (
            <button
              onClick={() => setShowWebsite(true)}
              className="text-sm text-brand-teal hover:underline"
            >
              + Website
            </button>
          ) : (
            <div>
              <label className={LABEL}>Website</label>
              <input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                className={INPUT}
                placeholder="https://www.example.com"
              />
            </div>
          )}

          {!showTwitter ? (
            <button
              onClick={() => setShowTwitter(true)}
              className="text-sm text-brand-teal hover:underline"
            >
              + Twitter handle
            </button>
          ) : (
            <div>
              <label className={LABEL}>Twitter handle</label>
              <input
                value={form.twitter}
                onChange={(e) => set("twitter", e.target.value)}
                className={INPUT}
                placeholder="@handle"
              />
            </div>
          )}

          {!showFacebook ? (
            <button
              onClick={() => setShowFacebook(true)}
              className="text-sm text-brand-teal hover:underline"
            >
              + Facebook username
            </button>
          ) : (
            <div>
              <label className={LABEL}>Facebook username</label>
              <input
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                className={INPUT}
                placeholder="username"
              />
            </div>
          )}

          {!showInstagram ? (
            <button
              onClick={() => setShowInstagram(true)}
              className="text-sm text-brand-teal hover:underline"
            >
              + Instagram handle
            </button>
          ) : (
            <div>
              <label className={LABEL}>Instagram handle</label>
              <input
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                className={INPUT}
                placeholder="@handle"
              />
            </div>
          )}
        </div>

        {/* Registered address */}
        <AddressForm
          title="Registered address"
          data={form.registeredAddress}
          onChange={(addr) => set("registeredAddress", addr)}
        />
        {(errors.regState || errors.regCity || errors.regStreet) && (
          <p className="text-xs text-red-500 -mt-4">
            Please complete the registered address
          </p>
        )}

        {/* Office address */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">Office address</h3>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.useRegisteredForOffice}
              onChange={(e) => set("useRegisteredForOffice", e.target.checked)}
              className="rounded border-gray-300 text-brand-teal"
            />
            Use registered address
          </label>
          {!form.useRegisteredForOffice && (
            <AddressForm
              title=""
              data={form.officeAddress}
              onChange={(addr) => set("officeAddress", addr)}
            />
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full py-3 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Save"}
      </button>
    </div>
  );
}
