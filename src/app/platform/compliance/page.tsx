"use client"

import { ShieldCheck } from "lucide-react";
import ComingSoonPage from "../_components/coming-soon";

export default function CompliancePage() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Compliance & KYC
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Onboarding review queue, KYC documents, AML monitoring, and regulatory inquiries.</p>
      <ComingSoonPage
        icon={ShieldCheck}
        title="Compliance & KYC"
        description="Application review queue, KYC document viewer, AML monitoring feed, document retention programme — coming in Milestone 4."
        accent="#bcbbee"
      />
    </div>
  );
}
