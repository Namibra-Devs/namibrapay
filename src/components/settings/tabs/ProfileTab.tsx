"use client";

import { useState } from "react";
import { KeyRound, Fingerprint } from "lucide-react";
import SettingSection, { Field, SaveButton, Input, Checkbox, Toggle } from "@/components/settings/SettingSection";
import PhoneCodePicker from "@/components/ui/PhoneCodePicker";
import { mockUser } from "@/lib/mock-data/dashboard";

export default function ProfileTab() {
  const [form, setForm] = useState({
    firstName: mockUser.name.split(" ")[0],
    lastName:  mockUser.name.split(" ")[1] ?? "",
    email:     mockUser.email,
    phoneCode: "+233",
    phone:     "242826513",
    isDeveloper: true,
  });
  const [twoFa, setTwoFa] = useState(false);

  function set(k: keyof typeof form, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <SettingSection
        title="Personal Information"
        footer={<SaveButton />}
      >
        <Field label="Full Name">
          <div className="flex gap-3">
            <Input value={form.firstName} onChange={(v) => set("firstName", v)} placeholder="First name" />
            <Input value={form.lastName}  onChange={(v) => set("lastName",  v)} placeholder="Last name"  />
          </div>
        </Field>

        <Field label="Email" help="Your login email address">
          <Input value={form.email} readOnly />
        </Field>

        <Field label="Phone Number">
          <div className="flex gap-2">
            <PhoneCodePicker
              value={form.phoneCode}
              onChange={(v) => set("phoneCode", v)}
            />
            <Input
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="Phone number"
              className="flex-1"
            />
          </div>
        </Field>

        <Field label="Technical Skill">
          <Checkbox
            checked={form.isDeveloper}
            onChange={(v) => set("isDeveloper", v)}
            label="I am a developer"
          />
        </Field>
      </SettingSection>

      {/* Authentication */}
      <SettingSection title="Authentication">
        <Field label="Password">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-gray-400" />
            Change Password
          </button>
        </Field>

        <Field label="Two-factor Auth" help="Add an extra layer of security to your account">
          <Toggle
            checked={twoFa}
            onChange={setTwoFa}
            label={twoFa ? "Enabled" : "Disabled"}
          />
        </Field>

        <Field label="Passkeys" help="Sign in without a password using biometrics or a security key">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Fingerprint className="w-4 h-4 text-gray-400" />
            Add a passkey
          </button>
        </Field>
      </SettingSection>
    </div>
  );
}
