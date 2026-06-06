"use client";

import { useState } from "react";
import { Download, ImagePlus, AlertTriangle, Trash2 } from "lucide-react";
import SettingSection, { Field, SaveButton, Checkbox, Input, CustomSelect } from "@/components/namibrapay-main/settings/SettingSection";

export default function PreferencesTab() {
  // Payments
  const [defaultCurrency, setDefaultCurrency] = useState("GHS");
  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptMomo, setAcceptMomo] = useState(true);
  const [acceptApplePay, setAcceptApplePay] = useState(true);
  const [acceptBankTransfer, setAcceptBankTransfer] = useState(false);
  const [receiptToMe, setReceiptToMe] = useState(true);
  const [receiptToCustomers, setReceiptToCustomers] = useState(true);

  // Transfers
  const [transferReceiptToMe, setTransferReceiptToMe] = useState(true);
  const [transferReceiptToRecipients, setTransferReceiptToRecipients] = useState(true);
  const [otpConfirm, setOtpConfirm] = useState(true);
  const [otpViaEmail, setOtpViaEmail] = useState(true);

  // Transfer approval
  const [confirmLive, setConfirmLive] = useState(false);
  const [confirmTest, setConfirmTest] = useState(false);
  const [approvalUrlLive, setApprovalUrlLive] = useState("");
  const [approvalUrlTest, setApprovalUrlTest] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [onReject, setOnReject] = useState("Blacklist Recipient");

  // Subscriptions
  const [dailyReports, setDailyReports] = useState(true);
  const [expiringCards, setExpiringCards] = useState(true);
  const [completedSub, setCompletedSub] = useState(true);
  const [cancelledSub, setCancelledSub] = useState(true);
  const [expiringToCustomer, setExpiringToCustomer] = useState(true);
  const [expiringToMe, setExpiringToMe] = useState(true);

  // Low Balance Alert
  const [balanceCurrency, setBalanceCurrency] = useState("GHS");
  const [notifSms, setNotifSms] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifWebhooks, setNotifWebhooks] = useState(false);
  const [warningAmount, setWarningAmount] = useState("0");
  const [criticalAmount, setCriticalAmount] = useState("0");
  const [balanceTab, setBalanceTab] = useState<"live" | "test">("live");

  // Display
  const [pagination, setPagination] = useState<"single" | "scroll">("scroll");
  const [timezone, setTimezone] = useState<"utc" | "local">("utc");

  const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "NGN", "KES", "ZAR"];

  return (
    <div className="space-y-4">
      {/* Payments */}
      <SettingSection title="Payments" footer={<SaveButton />}>
        <Field label="Default Currency">
          <CustomSelect
            value={defaultCurrency}
            onChange={setDefaultCurrency}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            className="max-w-40"
          />
        </Field>
        <Field label="Accept payments via">
          <div className="space-y-2.5">
            <Checkbox checked={acceptCard} onChange={setAcceptCard} label="Card" />
            <Checkbox checked={acceptMomo} onChange={setAcceptMomo} label="Mobile Money" />
            <Checkbox checked={acceptApplePay} onChange={setAcceptApplePay} label="Apple Pay" />
            <Checkbox checked={acceptBankTransfer} onChange={setAcceptBankTransfer} label="Bank Transfer" />
          </div>
        </Field>
        <Field label="Transaction receipts">
          <div className="space-y-2.5">
            <Checkbox checked={receiptToMe} onChange={setReceiptToMe} label="Send to me" />
            <Checkbox checked={receiptToCustomers} onChange={setReceiptToCustomers} label="Send to customers" />
          </div>
        </Field>
      </SettingSection>

      {/* Transfers */}
      <SettingSection title="Transfers" footer={<SaveButton />}>
        <Field label="Transfer receipts">
          <div className="space-y-2.5">
            <Checkbox checked={transferReceiptToMe} onChange={setTransferReceiptToMe} label="Send to me" />
            <Checkbox checked={transferReceiptToRecipients} onChange={setTransferReceiptToRecipients} label="Send to recipients" />
          </div>
        </Field>
        <Field label="OTP confirmation">
          <div className="space-y-2.5">
            <Checkbox checked={otpConfirm} onChange={setOtpConfirm} label="Confirm transfers before sending" />
            <Checkbox checked={otpViaEmail} onChange={setOtpViaEmail} label="Send OTP via email" />
          </div>
        </Field>
      </SettingSection>

      {/* Transfer Approval */}
      <SettingSection title="Transfer Approval" footer={<SaveButton />}>
        <Field label="Approval URL">
          <div className="space-y-3">
            <div>
              <Checkbox checked={confirmLive} onChange={setConfirmLive} label="Confirm transfers in live mode" />
              <Input value={approvalUrlLive} onChange={setApprovalUrlLive} placeholder="https://yourserver.com/approve-transfer" className="mt-2" />
            </div>
            <div>
              <Checkbox checked={confirmTest} onChange={setConfirmTest} label="Confirm transfers in test mode" />
              <Input value={approvalUrlTest} onChange={setApprovalUrlTest} placeholder="https://yourserver.com/approve-transfer" className="mt-2" />
            </div>
          </div>
        </Field>
        <Field label="Contact email for transfers">
          <Input value={transferEmail} onChange={setTransferEmail} placeholder="example@example.com" type="email" />
        </Field>
        <Field label="On Reject">
          <CustomSelect
            value={onReject}
            onChange={setOnReject}
            options={[
              { value: "Blacklist Recipient", label: "Blacklist Recipient" },
              { value: "Do Nothing", label: "Do Nothing" },
            ]}
            className="max-w-xs"
          />
        </Field>
      </SettingSection>

      {/* Subscriptions */}
      <SettingSection title="Subscriptions" footer={<SaveButton />}>
        {[
          { label: "Daily issue reports", checkLabel: "Send to me", checked: dailyReports, onChange: setDailyReports },
          { label: "Webhook events for expiring cards", checkLabel: "Subscribe", checked: expiringCards, onChange: setExpiringCards },
          { label: "Completed subscription alerts", checkLabel: "Send to me", checked: completedSub, onChange: setCompletedSub },
          { label: "Cancelled subscription alerts", checkLabel: "Send to me", checked: cancelledSub, onChange: setCancelledSub },
        ].map(({ label, checkLabel, checked, onChange }) => (
          <Field key={label} label={label}>
            <Checkbox checked={checked} onChange={onChange} label={checkLabel} />
          </Field>
        ))}
        <Field label="Expiring card alerts">
          <div className="space-y-2.5">
            <Checkbox checked={expiringToCustomer} onChange={setExpiringToCustomer} label="Send to customer" />
            <Checkbox checked={expiringToMe} onChange={setExpiringToMe} label="Send to me" />
          </div>
        </Field>
      </SettingSection>

      {/* Payouts & Balances */}
      <SettingSection title="Payouts and Balances">
        <Field label="Payout schedule">
          <p className="text-sm text-gray-700">Settled next day</p>
        </Field>
        <Field label="Financial report">
          <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors">
            <Download className="w-4 h-4" />
            Download Financial Report
          </a>
        </Field>
      </SettingSection>

      {/* Low Balance Alert */}
      <SettingSection title="Low Balance Alert" footer={<SaveButton />}>
        {/* Live/Test tabs */}
        <div className="flex border-b border-gray-100 mb-4 -mx-6 px-6">
          {(["live", "test"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setBalanceTab(t)}
              className={`pb-3 text-sm font-medium capitalize mr-6 border-b-2 transition-colors ${
                balanceTab === t ? "border-brand-teal text-brand-teal" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Field label="Balance currency">
          <CustomSelect
            value={balanceCurrency}
            onChange={setBalanceCurrency}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            className="max-w-40"
          />
        </Field>
        <Field label="Receive notifications via">
          <div className="space-y-2.5">
            <Checkbox checked={notifSms} onChange={setNotifSms} label="SMS" />
            <Checkbox checked={notifEmail} onChange={setNotifEmail} label="Email" />
            <Checkbox checked={notifWebhooks} onChange={setNotifWebhooks} label="Webhooks" />
          </div>
        </Field>
        <Field label="Warning amount">
          <div className="flex items-center gap-2 max-w-xs">
            <span className="text-sm text-gray-400 shrink-0">{balanceCurrency}</span>
            <Input value={warningAmount} onChange={setWarningAmount} />
          </div>
        </Field>
        <Field label="Critical amount">
          <div className="flex items-center gap-2 max-w-xs">
            <span className="text-sm text-gray-400 shrink-0">{balanceCurrency}</span>
            <Input value={criticalAmount} onChange={setCriticalAmount} />
          </div>
        </Field>
      </SettingSection>

      {/* Pagination */}
      <SettingSection title="Pagination" footer={<SaveButton />}>
        <Field label="Style">
          <div className="space-y-2.5">
            {(["single", "scroll"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="pagination"
                  checked={pagination === v}
                  onChange={() => setPagination(v)}
                  className="accent-brand-teal"
                />
                <span className="text-sm text-gray-700 capitalize">{v === "single" ? "Single page" : "Continuous scroll"}</span>
              </label>
            ))}
          </div>
        </Field>
      </SettingSection>

      {/* Timezone */}
      <SettingSection title="Timezone" footer={<SaveButton />}>
        <Field label="Default Timezone">
          <div className="space-y-2.5">
            {(["utc", "local"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="timezone"
                  checked={timezone === v}
                  onChange={() => setTimezone(v)}
                  className="accent-brand-teal"
                />
                <span className="text-sm text-gray-700 uppercase">{v}</span>
              </label>
            ))}
          </div>
        </Field>
      </SettingSection>

      {/* Logo */}
      <SettingSection title="Logo">
        <Field label="Business Logo">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ImagePlus className="w-4 h-4 text-gray-400" />
            Add Logo
          </button>
        </Field>
      </SettingSection>

      {/* Danger zone */}
      <div className="flex items-center justify-center gap-6 py-2">
        <button type="button" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Delete test data
        </button>
        <span className="text-gray-200">·</span>
        <button type="button" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
          <AlertTriangle className="w-3.5 h-3.5" />
          Close this business
        </button>
      </div>
    </div>
  );
}
