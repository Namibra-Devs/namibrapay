"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SettingSection, { Field, SaveButton, Input } from "@/components/settings/SettingSection";

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  function add() {
    const v = inputValue.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInputValue("");
  }

  function remove(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 min-h-11 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal transition-colors">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-teal/10 text-brand-teal text-xs font-medium rounded-lg"
        >
          {tag}
          <button type="button" onClick={() => remove(tag)}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="email"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          if (e.key === "Backspace" && !inputValue && tags.length) remove(tags[tags.length - 1]);
        }}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : "Add more emails"}
        className="flex-1 min-w-24 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
      />
    </div>
  );
}

export default function ContactTab() {
  const [disputeEmails, setDisputeEmails] = useState<string[]>(["john@gmail.com"]);
  const [refundEmails, setRefundEmails] = useState<string[]>([]);
  const [supportEmail, setSupportEmail] = useState("bright@namibra.io");
  const [generalEmail, setGeneralEmail] = useState("bright@namibra.io");

  return (
    <SettingSection
      title="Contact"
      description="When a dispute or more support is required for a transaction, NamibraPay will notify you via email at the addresses specified below."
      footer={<SaveButton />}
    >
      <Field label="Dispute emails" help="Receive notifications about chargebacks and fraud claims">
        <TagInput tags={disputeEmails} onChange={setDisputeEmails} placeholder="Add email addresses" />
      </Field>

      <Field label="Refund emails" help="If not provided, refund alerts go to your Disputes email">
        <TagInput tags={refundEmails} onChange={setRefundEmails} placeholder="Add refund emails" />
      </Field>

      <Field label="Support email">
        <Input value={supportEmail} onChange={setSupportEmail} placeholder="support@example.com" type="email" />
      </Field>

      <Field label="General email">
        <Input value={generalEmail} onChange={setGeneralEmail} placeholder="hello@example.com" type="email" />
      </Field>
    </SettingSection>
  );
}
