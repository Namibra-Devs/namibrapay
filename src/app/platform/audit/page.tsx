import { ScrollText } from "lucide-react";
import ComingSoonPage from "../_components/coming-soon";

export default function AuditLogPage() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Audit Log
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Full audit trail — every action across every tier, every actor.</p>
      <ComingSoonPage
        icon={ScrollText}
        title="Audit Log"
        description="Filterable audit trail by actor, entity, action, and date range — coming in Milestone 6."
        accent="#263b8e"
      />
    </div>
  );
}
