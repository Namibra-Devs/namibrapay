import { Layers, Plus } from "lucide-react";
import EmptyState from "@/components/namibrapay-main/dashboard/EmptyState";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Plans
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage subscription billing plans.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create plan
        </button>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Layers className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Plans</h2>
        </div>
        <EmptyState
          icon={<Layers className="w-8 h-8" />}
          title="No plans yet"
          description="Create a billing plan to start accepting recurring payments."
          action={{ label: "Create plan", href: "#" }}
        />
      </div>
    </div>
  );
}
