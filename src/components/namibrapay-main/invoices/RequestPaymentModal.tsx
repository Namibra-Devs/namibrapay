"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Zap, AlertCircle, Plus, Trash2, ChevronDown, Check, User } from "lucide-react";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/invoices";
import type { Invoice, InvoiceType, InvoiceLineItem } from "@/lib/mock-data/invoices";
import { CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";
import SingleDatePicker from "@/components/namibrapay-main/invoices/SingleDatePicker";

type NewInvoiceData = Omit<Invoice, "id" | "reference" | "createdAt">;

const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "NGN", "ZAR", "KES"];

const noSpinner =
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]";


function CustomerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (email: string, name: string) => void;
}) {
  const [search, setSearch] = useState(value);
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        !wrapperRef.current?.contains(e.target as Node) &&
        !dropRef.current?.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function openDrop() {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setOpen(true);
  }

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={wrapperRef} className="relative">
      <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${open ? "border-brand-teal ring-2 ring-brand-teal/20" : "border-gray-200"}`}>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); openDrop(); }}
          onFocus={openDrop}
          placeholder="customer@email.com"
          className="flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        <ChevronDown className={`w-4 h-4 text-gray-400 mr-3 shrink-0 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && filtered.length > 0 && dropPos && createPortal(
        <div
          ref={dropRef}
          style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width }}
          className="fixed z-60 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto"
        >
          {filtered.map((c) => (
            <button
              key={c.email}
              type="button"
              onClick={() => { onChange(c.email, c.name); setSearch(c.email); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-brand-teal" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.email}</p>
              </div>
              {value === c.email && <Check className="w-3.5 h-3.5 text-brand-teal ml-auto shrink-0" />}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

function TypeCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-brand-teal bg-brand-teal/5"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${selected ? "bg-brand-teal/15" : "bg-gray-100"}`}>
        <span className={selected ? "text-brand-teal" : "text-gray-400"}>{icon}</span>
      </div>
      <p className={`text-sm font-semibold mb-1 ${selected ? "text-brand-teal" : "text-gray-900"}`}>{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </button>
  );
}

export default function RequestPaymentModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: NewInvoiceData) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<InvoiceType>("simple");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [error, setError] = useState("");

  const lineTotal = lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0);

  function handleCustomer(email: string, name: string) {
    setCustomerEmail(email);
    setCustomerName(name);
    setError("");
  }

  function handleNext() {
    if (!customerEmail.trim()) { setError("Please add or select a customer."); return; }
    setError("");
    setStep(2);
  }

  function handleSend() {
    if (!customerEmail.trim()) { setError("Please add or select a customer."); return; }
    if (type === "simple") {
      if (!amount || Number(amount) <= 0) { setError("Enter a valid amount."); return; }
    } else {
      const valid = lineItems.every((li) => li.description.trim() && li.unitPrice > 0);
      if (!valid) { setError("Fill in all line items with a description and price."); return; }
    }
    const finalAmount = type === "simple" ? Number(amount) : lineTotal;
    onSubmit({
      customerName: customerName || customerEmail,
      customerEmail,
      type,
      status: "pending",
      amount: finalAmount,
      currency,
      note: note.trim() || undefined,
      lineItems: type === "professional" ? lineItems : undefined,
      dueDate: dueDate || undefined,
    });
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function updateLineItem(i: number, field: keyof InvoiceLineItem, value: string | number) {
    setLineItems((prev) => prev.map((li, idx) => idx === i ? { ...li, [field]: value } : li));
  }

  function removeLineItem(i: number) {
    setLineItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Request a Payment</h2>
            {step === 2 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {type === "professional" ? "Professional Invoice" : "Simple Invoice"} · {customerEmail}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              {/* Type selection */}
              <div className="flex gap-3">
                <TypeCard
                  selected={type === "professional"}
                  onClick={() => setType("professional")}
                  icon={<FileText className="w-4 h-4" />}
                  title="Professional Invoice"
                  description="Set line items, tax etc. and invoice a customer. PDF included."
                />
                <TypeCard
                  selected={type === "simple"}
                  onClick={() => setType("simple")}
                  icon={<Zap className="w-4 h-4" />}
                  title="Simple Invoice"
                  description="Set amount, description, and request payment from a customer."
                />
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer</label>
                <CustomerSelect value={customerEmail} onChange={handleCustomer} />
                {customerName && (
                  <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> {customerName}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && type === "simple" && (
            <>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Amount */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                  <div className="flex gap-2">
                    <div className="w-24 shrink-0">
                      <CustomSelect
                        value={currency}
                        onChange={setCurrency}
                        options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                      />
                    </div>
                    <div className="flex-1 flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal transition-colors">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(""); }}
                        className={`flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none ${noSpinner}`}
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                {/* Due date */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date <span className="text-gray-400 font-normal">(optional)</span></label>
                  <SingleDatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Note <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tell your customer why you are requesting this payment"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 resize-none"
                />
              </div>
            </>
          )}

          {step === 2 && type === "professional" && (
            <>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Currency */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                  <CustomSelect
                    value={currency}
                    onChange={setCurrency}
                    options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                  />
                </div>

                {/* Due date */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date <span className="text-gray-400 font-normal">(optional)</span></label>
                  <SingleDatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
                </div>
              </div>

              {/* Line items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Line Items</label>
                  <span className="text-xs text-gray-400">{currency} {lineTotal.toLocaleString()} total</span>
                </div>
                <div className="space-y-2">
                  {lineItems.map((li, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={li.description}
                        onChange={(e) => updateLineItem(i, "description", e.target.value)}
                        className="sm:flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={li.quantity}
                          onChange={(e) => updateLineItem(i, "quantity", Number(e.target.value))}
                          className={`w-16 shrink-0 px-2 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors text-center ${noSpinner}`}
                          min={1}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={li.unitPrice || ""}
                          onChange={(e) => updateLineItem(i, "unitPrice", Number(e.target.value))}
                          className={`flex-1 sm:w-24 sm:flex-none px-2 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors ${noSpinner}`}
                          min={0}
                        />
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLineItem(i)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add line item
                </button>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Note <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Additional notes for the customer"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors placeholder:text-gray-400 resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              Next: edit details
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-teal rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              Send Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
