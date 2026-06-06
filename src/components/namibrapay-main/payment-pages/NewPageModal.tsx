"use client";

import { useState } from "react";
import {
  X, CreditCard, RefreshCw, ShoppingCart, ChevronRight,
  ChevronLeft, Upload, Plus, Trash2, ChevronDown,
} from "lucide-react";
import type { PaymentPage, PageType } from "@/lib/mock-data/payment-pages";
import { CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";

type Step =
  | "type"
  | "one-time"
  | "product"
  | "sub-pick"
  | "sub-existing"
  | "sub-new"
  | "sub-customer";

type SubType = "existing" | "new" | "customer";
type NewPageData = Omit<PaymentPage, "id" | "createdAt" | "visits" | "revenue">;

interface AdvancedState {
  slug: string;
  redirectUrl: string;
  successMessage: string;
  notifyEmail: string;
  extraFields: { name: string; placeholder: string }[];
}

const defaultAdvanced: AdvancedState = {
  slug: "",
  redirectUrl: "",
  successMessage: "",
  notifyEmail: "",
  extraFields: [],
};

const BASE_URL = "https://pay.namibrapay.com/";

const STEP_TITLE: Record<Step, string> = {
  type: "New Payment Page",
  "one-time": "New Payment Page",
  product: "New Product Page",
  "sub-pick": "New Subscription Page",
  "sub-existing": "New Subscription Page",
  "sub-new": "New Subscription Page",
  "sub-customer": "New Subscription Page",
};

const BACK_MAP: Partial<Record<Step, Step>> = {
  "one-time": "type",
  product: "type",
  "sub-pick": "type",
  "sub-existing": "sub-pick",
  "sub-new": "sub-pick",
  "sub-customer": "sub-pick",
};

// ─── Shared primitives ────────────────────────────────────────────────────────

function FL({ label, required }: { label: string; required?: boolean }) {
  return (
    <p className="text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </p>
  );
}

function FI({
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  className?: string;
}) {
  const noSpinner = type === "number"
    ? "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
    : "";

  if (prefix) {
    return (
      <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal transition-colors ${className ?? ""}`}>
        <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0 font-mono">
          {prefix}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none placeholder:text-gray-400 ${noSpinner}`}
        />
      </div>
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 ${noSpinner} ${className ?? ""}`}
    />
  );
}

function FTA({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 resize-none"
    />
  );
}

function ImageUploadZone() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
        <Upload className="w-4 h-4 text-gray-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">Drag files here or click to upload</p>
        <p className="text-xs text-gray-400 mt-0.5">Recommended: 1024 × 512 px JPG or PNG, under 1 MB</p>
      </div>
    </div>
  );
}

function FCheck({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
          checked ? "bg-brand-teal border-brand-teal" : "border-gray-300 group-hover:border-brand-teal/50"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function AdvancedSection({
  state,
  setState,
}: {
  state: AdvancedState;
  setState: (s: AdvancedState) => void;
}) {
  const [open, setOpen] = useState(false);

  function setField<K extends keyof AdvancedState>(key: K, value: AdvancedState[K]) {
    setState({ ...state, [key]: value });
  }

  function addField() {
    setState({ ...state, extraFields: [...state.extraFields, { name: "", placeholder: "" }] });
  }

  function removeField(i: number) {
    setState({ ...state, extraFields: state.extraFields.filter((_, idx) => idx !== i) });
  }

  function updateField(i: number, key: "name" | "placeholder", value: string) {
    const updated = state.extraFields.map((f, idx) => idx === i ? { ...f, [key]: value } : f);
    setState({ ...state, extraFields: updated });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-teal transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
        {open ? "Hide advanced options" : "Show advanced options"}
      </button>

      {open && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
          <div>
            <FL label="Custom link" />
            <FI
              value={state.slug}
              onChange={(v) => setField("slug", v)}
              placeholder="your-page-url"
              prefix={BASE_URL}
            />
          </div>
          <div>
            <FL label="Redirect after payment" />
            <FI
              value={state.redirectUrl}
              onChange={(v) => setField("redirectUrl", v)}
              placeholder="https://example.com/thank-you"
              type="url"
            />
          </div>
          <div>
            <FL label="Success message" />
            <FI
              value={state.successMessage}
              onChange={(v) => setField("successMessage", v)}
              placeholder="Thank you for your payment!"
            />
          </div>
          <div>
            <FL label="Send notifications to" />
            <p className="text-xs text-gray-400 mb-1.5">This email address will receive transaction notices</p>
            <FI
              value={state.notifyEmail}
              onChange={(v) => setField("notifyEmail", v)}
              placeholder="Email address"
              type="email"
            />
          </div>
          <div>
            <FL label="Collect extra information" />
            <div className="space-y-2">
              {state.extraFields.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FI
                    value={f.name}
                    onChange={(v) => updateField(i, "name", v)}
                    placeholder="Field name"
                    className="flex-1"
                  />
                  <FI
                    value={f.placeholder}
                    onChange={(v) => updateField(i, "placeholder", v)}
                    placeholder="e.g. ID Number"
                    className="flex-1"
                  />
                  <button
                    title="delete"
                    type="button"
                    onClick={() => removeField(i)}
                    className="p-2 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 text-sm font-medium text-brand-teal hover:text-brand-teal/70 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormFooter({
  onCancel,
  onSubmit,
  disabled,
  label = "Create",
}: {
  onCancel: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div className="flex gap-2 px-6 py-4 border-t border-gray-100 shrink-0">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {label}
      </button>
    </div>
  );
}

// ─── Step screens ─────────────────────────────────────────────────────────────

const PAGE_TYPES = [
  {
    id: "one-time" as PageType,
    icon: CreditCard,
    label: "One-time Payment",
    desc: "Create a simple page for your customers to pay you",
  },
  {
    id: "subscription" as PageType,
    icon: RefreshCw,
    label: "Subscription Payment",
    desc: "Create a page for recurring payments and subscriptions",
  },
  {
    id: "product" as PageType,
    icon: ShoppingCart,
    label: "Product Payment",
    desc: "Create a page to sell one or more products from your inventory",
  },
];

function TypeScreen({ onSelect }: { onSelect: (t: PageType) => void }) {
  return (
    <div className="px-6 py-5 space-y-3 overflow-y-auto">
      {PAGE_TYPES.map(({ id, icon: Icon, label, desc }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0 group-hover:bg-brand-teal/20 transition-colors">
            <Icon className="w-5 h-5 text-brand-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-teal transition-colors shrink-0" />
        </button>
      ))}
    </div>
  );
}

const SUB_TYPES: { id: SubType; label: string; desc: string }[] = [
  { id: "existing", label: "One of my existing plans", desc: "Link this page to a plan you've already created" },
  { id: "new", label: "I want to create a new plan", desc: "Define a new plan name, amount, and billing interval" },
  { id: "customer", label: "Let my customers create the plan", desc: "Customers choose their own subscription amount" },
];

function SubPickScreen({ onSelect }: { onSelect: (t: SubType) => void }) {
  return (
    <div className="px-6 py-5 space-y-2.5 overflow-y-auto">
      <p className="text-sm text-gray-500 mb-4">What do you want your customers to subscribe to?</p>
      {SUB_TYPES.map(({ id, label, desc }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left group"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-teal shrink-0" />
        </button>
      ))}
    </div>
  );
}

// ─── Forms ────────────────────────────────────────────────────────────────────

function OneTimeForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (d: NewPageData) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fixedAmount, setFixedAmount] = useState(false);
  const [amount, setAmount] = useState("");
  const [collectPhone, setCollectPhone] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedState>(defaultAdvanced);

  function handleSubmit() {
    const slug = advanced.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSubmit({
      name,
      description,
      type: "one-time",
      status: "active",
      slug,
      amount: fixedAmount ? Number(amount) : undefined,
      currency: "GHS",
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <FL label="Page name" required />
          <FI value={name} onChange={setName} placeholder="Name of your page" />
        </div>
        <div>
          <FL label="Description" />
          <p className="text-xs text-gray-400 mb-1.5">Optional</p>
          <FTA value={description} onChange={setDescription} placeholder="Page description or extra instructions" />
        </div>
        <div>
          <FL label="SEO Image" />
          <p className="text-xs text-gray-400 mb-1.5">Optional — shown when page is shared on social media</p>
          <ImageUploadZone />
        </div>
        <FCheck checked={fixedAmount} onChange={setFixedAmount} label="I want a fixed payment amount on this page" />
        {fixedAmount && (
          <div className="flex items-center gap-2 pl-6">
            <span className="text-sm text-gray-400 shrink-0">GHS</span>
            <FI value={amount} onChange={setAmount} placeholder="0.00" type="number" />
          </div>
        )}
        <FCheck checked={collectPhone} onChange={setCollectPhone} label="Collect phone numbers on this page" />
        <AdvancedSection state={advanced} setState={setAdvanced} />
      </div>
      <FormFooter onCancel={onBack} onSubmit={handleSubmit} disabled={!name.trim()} />
    </>
  );
}

function ProductForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (d: NewPageData) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectPhone, setCollectPhone] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedState>(defaultAdvanced);

  function handleSubmit() {
    const slug = advanced.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSubmit({ name, description, type: "product", status: "active", slug, currency: "GHS" });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <FL label="Page name" required />
          <FI value={name} onChange={setName} placeholder="Name of your page" />
        </div>
        <div>
          <FL label="Description" />
          <p className="text-xs text-gray-400 mb-1.5">Optional</p>
          <FTA value={description} onChange={setDescription} placeholder="Page description or extra instructions" />
        </div>
        <div>
          <FL label="SEO Image" />
          <p className="text-xs text-gray-400 mb-1.5">Optional — shown when page is shared on social media</p>
          <ImageUploadZone />
        </div>
        <FCheck checked={collectPhone} onChange={setCollectPhone} label="Collect phone numbers on this page" />
        <AdvancedSection state={advanced} setState={setAdvanced} />
      </div>
      <FormFooter onCancel={onBack} onSubmit={handleSubmit} disabled={!name.trim()} />
    </>
  );
}

const MOCK_PLANS = [
  { value: "plan_monthly", label: "Monthly LPG Delivery — GHS 250/month" },
  { value: "plan_weekly", label: "Weekly Refill Plan — GHS 80/week" },
  { value: "plan_annual", label: "Annual Package — GHS 2,400/year" },
];

function SubExistingForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (d: NewPageData) => void }) {
  const [plan, setPlan] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectPhone, setCollectPhone] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedState>(defaultAdvanced);

  function handleSubmit() {
    const slug = advanced.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSubmit({ name, description, type: "subscription", status: "active", slug, currency: "GHS" });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <FL label="Plan" required />
          <CustomSelect
            value={plan}
            onChange={setPlan}
            options={MOCK_PLANS}
            placeholder="Search for existing plans"
          />
        </div>
        <div>
          <FL label="Page name" required />
          <FI value={name} onChange={setName} placeholder="Name of your page" />
        </div>
        <div>
          <FL label="Description" />
          <p className="text-xs text-gray-400 mb-1.5">Optional</p>
          <FTA value={description} onChange={setDescription} placeholder="Page description or extra instructions" />
        </div>
        <div>
          <FL label="SEO Image" />
          <p className="text-xs text-gray-400 mb-1.5">Optional — shown when page is shared on social media</p>
          <ImageUploadZone />
        </div>
        <FCheck checked={collectPhone} onChange={setCollectPhone} label="Collect phone numbers on this page" />
        <AdvancedSection state={advanced} setState={setAdvanced} />
      </div>
      <FormFooter onCancel={onBack} onSubmit={handleSubmit} disabled={!plan || !name.trim()} />
    </>
  );
}

const INTERVALS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannually", label: "Every 6 months" },
  { value: "annually", label: "Annually" },
];

function SubNewForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (d: NewPageData) => void }) {
  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [interval, setInterval] = useState("");
  const [invoiceLimit, setInvoiceLimit] = useState("");
  const [collectPhone, setCollectPhone] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedState>(defaultAdvanced);

  function handleSubmit() {
    const slug = advanced.slug || planName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSubmit({
      name: planName,
      type: "subscription",
      status: "active",
      slug,
      amount: Number(amount),
      currency: "GHS",
    });
  }

  const valid = planName.trim() && amount && interval;

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <FL label="Plan name" required />
          <FI value={planName} onChange={setPlanName} placeholder="Name of your plan" />
        </div>
        <div>
          <FL label="Plan amount" required />
          <FI value={amount} onChange={setAmount} placeholder={`Cost of the plan (GHS 2 minimum)`} type="number" prefix="GHS" />
          <p className="text-xs text-gray-400 mt-1">Minimum plan amount is GHS 2</p>
        </div>
        <div>
          <FL label="Billing interval" required />
          <CustomSelect
            value={interval}
            onChange={setInterval}
            options={INTERVALS}
            placeholder="Choose plan interval"
          />
        </div>
        <div>
          <FL label="Invoice limit" />
          <FI value={invoiceLimit} onChange={setInvoiceLimit} placeholder="Set limit (optional)" type="number" />
          <p className="text-xs text-gray-400 mt-1">Use this if you want subscriptions to run for a fixed number of times</p>
        </div>
        <div>
          <FL label="SEO Image" />
          <p className="text-xs text-gray-400 mb-1.5">Optional — shown when page is shared on social media</p>
          <ImageUploadZone />
        </div>
        <FCheck checked={collectPhone} onChange={setCollectPhone} label="Collect phone numbers on this page" />
        <AdvancedSection state={advanced} setState={setAdvanced} />
      </div>
      <FormFooter onCancel={onBack} onSubmit={handleSubmit} disabled={!valid} />
    </>
  );
}

function SubCustomerForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (d: NewPageData) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectPhone, setCollectPhone] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedState>(defaultAdvanced);

  function handleSubmit() {
    const slug = advanced.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSubmit({ name, description, type: "subscription", status: "active", slug, currency: "GHS" });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div className="px-4 py-3 bg-brand-teal/5 border border-brand-teal/20 rounded-xl">
          <p className="text-sm text-brand-teal font-medium">Customer-defined plans</p>
          <p className="text-xs text-brand-teal/80 mt-0.5">Your customers will set their own subscription amount when they visit this page.</p>
        </div>
        <div>
          <FL label="Page name" required />
          <FI value={name} onChange={setName} placeholder="Name of your page" />
        </div>
        <div>
          <FL label="Description" />
          <p className="text-xs text-gray-400 mb-1.5">Optional</p>
          <FTA value={description} onChange={setDescription} placeholder="Page description or extra instructions" />
        </div>
        <div>
          <FL label="SEO Image" />
          <p className="text-xs text-gray-400 mb-1.5">Optional — shown when page is shared on social media</p>
          <ImageUploadZone />
        </div>
        <FCheck checked={collectPhone} onChange={setCollectPhone} label="Collect phone numbers on this page" />
        <AdvancedSection state={advanced} setState={setAdvanced} />
      </div>
      <FormFooter onCancel={onBack} onSubmit={handleSubmit} disabled={!name.trim()} />
    </>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function NewPageModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: NewPageData) => void;
}) {
  const [step, setStep] = useState<Step>("type");

  const backStep = BACK_MAP[step];

  function handleTypeSelect(type: PageType) {
    if (type === "subscription") {
      setStep("sub-pick");
    } else {
      setStep(type as Step);
    }
  }

  function handleSubSelect(sub: SubType) {
    setStep(`sub-${sub}` as Step);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 shrink-0">
          {backStep && (
            <button
              title="left"
              type="button"
              onClick={() => setStep(backStep)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors -ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <h3 className="text-base font-semibold text-gray-900 flex-1">{STEP_TITLE[step]}</h3>
          <button
            title="close"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screens */}
        {step === "type" && <TypeScreen onSelect={handleTypeSelect} />}
        {step === "sub-pick" && <SubPickScreen onSelect={handleSubSelect} />}
        {step === "one-time" && (
          <OneTimeForm
            onBack={() => setStep("type")}
            onSubmit={(d) => { onSubmit(d); onClose(); }}
          />
        )}
        {step === "product" && (
          <ProductForm
            onBack={() => setStep("type")}
            onSubmit={(d) => { onSubmit(d); onClose(); }}
          />
        )}
        {step === "sub-existing" && (
          <SubExistingForm
            onBack={() => setStep("sub-pick")}
            onSubmit={(d) => { onSubmit(d); onClose(); }}
          />
        )}
        {step === "sub-new" && (
          <SubNewForm
            onBack={() => setStep("sub-pick")}
            onSubmit={(d) => { onSubmit(d); onClose(); }}
          />
        )}
        {step === "sub-customer" && (
          <SubCustomerForm
            onBack={() => setStep("sub-pick")}
            onSubmit={(d) => { onSubmit(d); onClose(); }}
          />
        )}
      </div>
    </div>
  );
}
