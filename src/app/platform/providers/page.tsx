import { Cpu } from "lucide-react";
import ComingSoonPage from "../_components/coming-soon";

export default function ProvidersPage() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Provider Engineering
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Provider health dashboards, credential management, routing rules, and webhook infrastructure.</p>
      <ComingSoonPage
        icon={Cpu}
        title="Provider Engineering"
        description="Health dashboards, credential rotation, routing rules (Super Admin approval), sandbox environments, webhook infrastructure — coming in Milestone 6."
        accent="#64c6c3"
      />
    </div>
  );
}
