import { Monitor } from "lucide-react";
import EmptyState from "@/components/namibrapay-main/dashboard/EmptyState";

export default function TerminalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Terminals
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage physical and virtual POS terminals for in-person payments.
        </p>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Monitor className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Terminals</h2>
        </div>
        <EmptyState
          icon={<Monitor className="w-8 h-8" />}
          title="No terminals configured"
          description="Add a POS terminal to start accepting in-person payments."
          action={{ label: "Add terminal", href: "#" }}
        />
      </div>
    </div>
  );
}
