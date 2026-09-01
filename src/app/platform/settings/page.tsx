'use client';

import { Settings } from "lucide-react";
import ComingSoonPage from "../_components/coming-soon";

export default function SettingsPage() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Platform Settings
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Global fee schedules, transaction limits, payout windows, and team management.</p>
      <ComingSoonPage
        icon={Settings}
        title="Platform Settings"
        description="Global platform configuration — fee schedules, limits, payout windows, Tier 1 user management — coming soon."
        accent="#bcbbee"
      />
    </div>
  );
}
