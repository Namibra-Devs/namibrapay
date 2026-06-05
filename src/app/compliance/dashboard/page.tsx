"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import { cn, formatDate, calculateSLARemaining } from "@/lib/compliance-utils";

// Mock data
const kpis = [
  {
    label: "Pending Applications",
    value: 24,
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "blue",
  },
  {
    label: "Under Review",
    value: 18,
    change: "-5%",
    trend: "down",
    icon: Clock,
    color: "purple",
  },
  {
    label: "Approved Today",
    value: 7,
    change: "+3",
    trend: "up",
    icon: CheckCircle,
    color: "green",
  },
  {
    label: "Escalated Cases",
    value: 3,
    change: "+1",
    trend: "up",
    icon: AlertTriangle,
    color: "red",
  },
];

const myQueue = [
  {
    id: "APP-2024-001",
    applicantName: "Kwame Tech Solutions",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskBand: "MEDIUM",
    slaDeadline: "2026-06-04T10:00:00Z",
    submittedAt: "2026-06-02T14:30:00Z",
  },
  {
    id: "APP-2024-002",
    applicantName: "Sarah Osei",
    type: "INDIVIDUAL",
    status: "PENDING_INFO",
    riskBand: "LOW",
    slaDeadline: "2026-06-05T16:00:00Z",
    submittedAt: "2026-06-01T09:15:00Z",
  },
  {
    id: "APP-2024-003",
    applicantName: "Global Traders Ltd",
    type: "BUSINESS",
    status: "ESCALATED",
    riskBand: "HIGH",
    slaDeadline: "2026-06-03T12:00:00Z",
    submittedAt: "2026-05-30T11:45:00Z",
  },
];

const recentActivity = [
  {
    user: "John Mensah",
    action: "approved",
    target: "APP-2024-045",
    time: "10 minutes ago",
  },
  {
    user: "Mary Adu",
    action: "rejected",
    target: "APP-2024-038",
    time: "25 minutes ago",
  },
  {
    user: "Peter Owusu",
    action: "requested more info",
    target: "APP-2024-042",
    time: "1 hour ago",
  },
  {
    user: "Jane Mensah",
    action: "escalated",
    target: "APP-2024-003",
    time: "2 hours ago",
  },
];

const riskDistribution = [
  { band: "Low", count: 42, color: "bg-green-500" },
  { band: "Medium", count: 28, color: "bg-yellow-500" },
  { band: "High", count: 8, color: "bg-red-500" },
];

export default function ComplianceDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">
            Compliance Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Jane. Here's what's happening today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      kpi.color === "blue" && "bg-blue-100",
                      kpi.color === "purple" && "bg-purple-100",
                      kpi.color === "green" && "bg-green-100",
                      kpi.color === "red" && "bg-red-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        kpi.color === "blue" && "text-blue-600",
                        kpi.color === "purple" && "text-purple-600",
                        kpi.color === "green" && "text-green-600",
                        kpi.color === "red" && "text-red-600"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      kpi.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {kpi.change}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-brand-navy">
                  {kpi.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-brand-navy">
                My Queue
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Applications assigned to you
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {myQueue.map((item) => {
                const sla = calculateSLARemaining(item.slaDeadline);
                return (
                  <Link
                    key={item.id}
                    href={`/compliance/applications/${item.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-brand-navy hover:text-brand-teal transition-colors">
                          {item.applicantName}
                        </p>
                        <p className="text-sm text-gray-500">{item.id}</p>
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          item.riskBand === "LOW" &&
                            "bg-green-100 text-green-700",
                          item.riskBand === "MEDIUM" &&
                            "bg-yellow-100 text-yellow-700",
                          item.riskBand === "HIGH" && "bg-red-100 text-red-700"
                        )}
                      >
                        {item.riskBand}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            item.status === "UNDER_REVIEW" && "bg-purple-500",
                            item.status === "PENDING_INFO" && "bg-orange-500",
                            item.status === "ESCALATED" && "bg-red-500"
                          )}
                        ></span>
                        {item.status.replace("_", " ")}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          sla.isBreached && "text-red-600 font-medium",
                          sla.isUrgent && "text-orange-600 font-medium"
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {sla.isBreached ? "Overdue" : `${sla.remaining} ${sla.unit}`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100">
              <Link
                href="/compliance/applications"
                className="block w-full text-center text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
              >
                View All Applications →
              </Link>
            </div>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-brand-navy">
                Risk Distribution
              </h2>
              <p className="text-sm text-gray-500 mt-1">Pending applications</p>
            </div>
            <div className="p-6 space-y-6">
              {riskDistribution.map((risk) => {
                const total = riskDistribution.reduce(
                  (acc, r) => acc + r.count,
                  0
                );
                const percentage = (risk.count / total) * 100;

                return (
                  <div key={risk.band}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {risk.band} Risk
                      </span>
                      <span className="text-sm font-bold text-brand-navy">
                        {risk.count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className={cn("h-full", risk.color)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-brand-navy">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-500 mt-1">Team compliance actions</p>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-brand-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-gray-500">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
