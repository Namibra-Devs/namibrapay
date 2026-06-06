"use client";

import { TrendingUp, ArrowLeftRight, Users, Banknote } from "lucide-react";
import StatCard from "@/components/namibrapay-main/dashboard/StatCard";
import RecentTransactions from "@/components/namibrapay-main/dashboard/RecentTransactions";
import QuickActions from "@/components/namibrapay-main/dashboard/QuickActions";
import BalancePanel from "@/components/namibrapay-main/dashboard/BalancePanel";
import RevenueChart from "@/components/namibrapay-main/dashboard/charts/RevenueChart";
import SuccessRateChart from "@/components/namibrapay-main/dashboard/charts/SuccessRateChart";
import PaymentIssuesChart from "@/components/namibrapay-main/dashboard/charts/PaymentIssuesChart";
import { mockDashboardStats } from "@/lib/mock-data/dashboard";
import { mockTransactions } from "@/lib/mock-data/transactions";
import { mockUser } from "@/lib/mock-data/dashboard";
import type { ColorKey } from "@/lib/mock-data/dashboard";

const statIcons: Record<ColorKey, React.ComponentType<{ className?: string }>> =
  {
    teal: TrendingUp,
    blue: ArrowLeftRight,
    violet: Users,
    amber: Banknote,
  };

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Welcome back, {mockUser.firstName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s a snapshot of your payment activity.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/88 backdrop-blur-sm border border-gray-200/70 text-sm text-gray-600 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.08)] transition-all duration-200">
          <span className="text-xs font-medium">This month</span>
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockDashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            icon={statIcons[stat.colorKey]}
          />
        ))}
      </div>

      {/* Revenue chart + Balance panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <BalancePanel />
        </div>
      </div>

      {/* Success Rate + Payment Issues charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuccessRateChart />
        <PaymentIssuesChart />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={mockTransactions.slice(0, 4)} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
