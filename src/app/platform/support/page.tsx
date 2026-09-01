import { Headphones } from "lucide-react";
import ComingSoonPage from "../_components/coming-soon";

export default function SupportPage() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Support Tools
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Cross-merchant transaction search, dispute management, and SLA tracking.</p>
      <ComingSoonPage
        icon={Headphones}
        title="Support Tools"
        description="Transaction search, dispute & refund flows, escalation routing, SLA tracking per provider, and incident log — coming in Milestone 5."
        accent="#a3ffe2"
      />
    </div>
  );
}
