import { Building2 } from "lucide-react";
import SettingSection from "@/components/settings/SettingSection";

export default function AccountsTab() {
  return (
    <SettingSection title="Payout Accounts">
      <div className="flex flex-col items-center py-8 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Building2 className="w-5 h-5 text-gray-400" />
        </div>
        {/* Skeleton lines */}
        <div className="w-48 h-3 bg-gray-100 rounded-full mb-2" />
        <div className="w-32 h-3 bg-gray-100 rounded-full mb-6" />

        <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-5">
          Complete your activation request and take your business live to manage bank and mobile money accounts for your business.
        </p>
        <button
          type="button"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors"
        >
          Complete activation request
        </button>
      </div>
    </SettingSection>
  );
}
