import { AlertTriangle } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function DisputesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Disputes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage chargebacks and payment disputes raised by customers.
        </p>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <AlertTriangle className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Disputes</h2>
        </div>
        <EmptyState
          icon={<AlertTriangle className="w-8 h-8" />}
          title="No disputes"
          description="You're all caught up. Any payment disputes will appear here."
        />
      </div>
    </div>
  );
}
