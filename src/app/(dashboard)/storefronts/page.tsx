import { Store, Plus } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function StorefrontsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Storefronts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Build and manage your online storefronts to sell products directly.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create storefront
        </button>
      </div>
      <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Store className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">All Storefronts</h2>
        </div>
        <EmptyState
          icon={<Store className="w-8 h-8" />}
          title="No storefronts yet"
          description="Create a storefront to showcase and sell your products online."
          action={{ label: "Create storefront", href: "#" }}
        />
      </div>
    </div>
  );
}
