import Link from "next/link";
import {
  Zap,
  UserPlus,
  Globe,
  Key,
  ArrowUpRight,
} from "lucide-react";

const primaryAction = {
  label: "Accept a payment",
  href: "/payment-pages",
  description: "Create a payment link instantly",
};

const actions = [
  { label: "Add a customer", href: "/customers", icon: UserPlus },
  { label: "Create payment page", href: "/payment-pages", icon: Globe },
  { label: "View API keys", href: "/api-keys", icon: Key },
];

export default function QuickActions() {
  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Jump into common workflows without leaving the dashboard.
      </p>

      {/* Primary action */}
      <Link
        href={primaryAction.href}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 active:scale-[0.98] transition-all mb-3"
      >
        {primaryAction.label}
        <ArrowUpRight className="w-4 h-4" />
      </Link>

      {/* Secondary actions */}
      <div className="space-y-1.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200/70 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300/70 transition-all duration-200 group"
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-teal transition-colors" />
                {action.label}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-teal transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
