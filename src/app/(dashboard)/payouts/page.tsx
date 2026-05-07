import { Banknote } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Payouts
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor settlements and payouts to your bank account.
        </p>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Banknote className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Payouts</h2>
        </div>
        <EmptyState
          icon={<Banknote className="w-8 h-8" />}
          title="No payouts yet"
          description="Your settlements and payouts will appear here once processed."
        />
      </div>
    </div>
  );
}
