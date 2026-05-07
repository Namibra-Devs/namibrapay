import { UserCheck } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function SubscribersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-heading">
          Subscribers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage customers subscribed to your recurring plans.
        </p>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <UserCheck className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Subscribers</h2>
        </div>
        <EmptyState
          icon={<UserCheck className="w-8 h-8" />}
          title="No subscribers yet"
          description="Customers who subscribe to your plans will appear here."
        />
      </div>
    </div>
  );
}
