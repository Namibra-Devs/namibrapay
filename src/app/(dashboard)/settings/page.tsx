"use client";

import { Settings, User, Building2, Bell, Shield, CreditCard } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your personal information and preferences.",
    href: "#profile",
  },
  {
    icon: Building2,
    title: "Workspace",
    description: "Configure your business name, logo, and workspace details.",
    href: "#workspace",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Choose which events you want to be notified about.",
    href: "#notifications",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Manage your password, MFA, and active sessions.",
    href: "#security",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "View your current plan and manage payment methods.",
    href: "#billing",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account, workspace, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.title}
              className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5 text-left hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] hover:border-gray-300/70 transition-all duration-200 group"
            >
              <div className="p-2.5 rounded-xl bg-gray-50 w-fit mb-4 group-hover:bg-brand-teal/10 transition-colors">
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-brand-teal transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                {section.title}
              </h3>
              <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                {section.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">
            Account Information
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full name", value: "Tyler Bright" },
            { label: "Email address", value: "bright@namibra.io" },
            { label: "Role", value: "Super Admin" },
            { label: "Workspace", value: "Test Workspace" },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {field.label}
              </p>
              <p className="text-sm font-medium text-gray-900">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
