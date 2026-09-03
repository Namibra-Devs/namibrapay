'use client';

import { motion } from "motion/react";
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Activity,
  DollarSign,
  Users,
} from "lucide-react";
import { KpiCard } from "./_components/kpi-card";
import { NspBalanceCard } from "./_components/nsp-card";
import { AlertsFeed } from "./_components/alerts-feed";
import { TransactionChart } from "./_components/transaction-chart";
import { mockProviders, mockAlerts } from "@/lib/mock-data";
import { formatGHS } from "@/lib/constants";

const kpis = [
  {
    label: "Transactions Today",
    value: "14,283",
    sub: "GHS 8.4M total volume",
    trend: { value: "+12.4%", positive: true },
    accent: "#64c6c3",
    icon: <Activity className="size-4" />,
  },
  {
    label: "Successful",
    value: "13,841",
    sub: "96.9% success rate",
    trend: { value: "+0.4%", positive: true },
    accent: "#a3ffe2",
    icon: <CheckCircle2 className="size-4" />,
  },
  {
    label: "Failed",
    value: "442",
    sub: "3.1% failure rate",
    trend: { value: "+0.4%", positive: false },
    accent: "#ffb4b0",
    icon: <XCircle className="size-4" />,
  },
  {
    label: "Platform Revenue",
    value: formatGHS(284_320),
    sub: "Net margin today",
    trend: { value: "+8.2%", positive: true },
    accent: "#fedfb8",
    icon: <DollarSign className="size-4" />,
  },
  {
    label: "Active Merchants",
    value: "127",
    sub: "3 pending onboarding",
    trend: { value: "+2 this week", positive: true },
    accent: "#bcbbee",
    icon: <Users className="size-4" />,
  },
  {
    label: "Success Rate",
    value: "96.9%",
    sub: "7-day avg: 97.2%",
    trend: { value: "-0.3%", positive: false },
    accent: "#263b8e",
    icon: <TrendingUp className="size-4" />,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function PlatformOverview() {
  const unread = mockAlerts.filter((a) => !a.isRead);
  const allAlerts = [...unread, ...mockAlerts.filter((a) => a.isRead)];

  return (
    <div className="px-6 py-6 space-y-8 pb-24 md:pb-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Platform Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time operational intelligence across all providers and merchants.
        </p>
      </motion.div>

      {/* KPI Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={item}>
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* NSP Balances */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>
              Provider NSP Balances
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Settlement float per provider — live</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400 inline-block" />Healthy</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400 inline-block" />Warning</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-400 inline-block" />Critical</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockProviders.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <NspBalanceCard provider={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Chart + Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <div className="xl:col-span-2">
          <TransactionChart />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-base mb-1" style={{ fontFamily: "var(--font-heading)" }}>
              Recent Alerts
            </h3>
            <p className="text-xs text-muted-foreground">
              {unread.length} unread · {allAlerts.length} total
            </p>
          </div>
          <div className="overflow-y-auto max-h-95 space-y-2 pr-0.5">
            <AlertsFeed alerts={allAlerts} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
