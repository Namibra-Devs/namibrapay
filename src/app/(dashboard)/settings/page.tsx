"use client";

import { useState } from "react";
import ProfileTab from "@/components/settings/tabs/ProfileTab";
import ContactTab from "@/components/settings/tabs/ContactTab";
import AccountsTab from "@/components/settings/tabs/AccountsTab";
import PreferencesTab from "@/components/settings/tabs/PreferencesTab";
import TeamTab from "@/components/settings/tabs/TeamTab";
import ApiKeysTab from "@/components/settings/tabs/ApiKeysTab";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "contact", label: "Contact" },
  { id: "accounts", label: "Accounts" },
  { id: "preferences", label: "Preferences" },
  { id: "team", label: "Team" },
  { id: "api", label: "API Keys & Webhooks" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account, team, and business configuration.</p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-brand-teal text-brand-teal"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "contact" && <ContactTab />}
        {activeTab === "accounts" && <AccountsTab />}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "team" && <TeamTab />}
        {activeTab === "api" && <ApiKeysTab />}
      </div>
    </div>
  );
}
