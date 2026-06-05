"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Clock,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import { formatDate } from "@/lib/compliance-utils";

interface Report {
  id: string;
  name: string;
  type: "REGULATORY" | "OPERATIONAL" | "MANAGEMENT";
  category: string;
  description: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUAL" | "ON_DEMAND";
  lastGenerated?: string;
  nextDue?: string;
  status: "SCHEDULED" | "READY" | "OVERDUE" | "SUBMITTED";
}

// Mock reports data
const mockReports: Report[] = [
  {
    id: "REP-001",
    name: "Monthly Onboarding Statistics",
    type: "OPERATIONAL",
    category: "KYC Statistics",
    description: "Monthly summary of new applications, approvals, and rejections",
    frequency: "MONTHLY",
    lastGenerated: "2024-02-01T09:00:00Z",
    nextDue: "2024-03-01T09:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-002",
    name: "Quarterly Risk Assessment Report",
    type: "REGULATORY",
    category: "Risk Management",
    description: "Comprehensive risk assessment for regulatory submission",
    frequency: "QUARTERLY",
    lastGenerated: "2024-01-15T10:00:00Z",
    nextDue: "2024-04-15T10:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-003",
    name: "Weekly Screening Hits Summary",
    type: "OPERATIONAL",
    category: "Sanctions Screening",
    description: "Summary of all screening hits and dispositions",
    frequency: "WEEKLY",
    lastGenerated: "2024-02-19T08:00:00Z",
    nextDue: "2024-02-26T08:00:00Z",
    status: "READY",
  },
  {
    id: "REP-004",
    name: "Annual AML/CFT Compliance Report",
    type: "REGULATORY",
    category: "AML Compliance",
    description: "Annual compliance report for Bank of Ghana submission",
    frequency: "ANNUAL",
    lastGenerated: "2023-12-31T23:59:00Z",
    nextDue: "2024-12-31T23:59:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-005",
    name: "Daily Transaction Monitoring Alerts",
    type: "OPERATIONAL",
    category: "Transaction Monitoring",
    description: "Daily summary of transaction monitoring alerts and dispositions",
    frequency: "DAILY",
    lastGenerated: "2024-02-21T06:00:00Z",
    nextDue: "2024-02-22T06:00:00Z",
    status: "READY",
  },
  {
    id: "REP-006",
    name: "Monthly STR Filing Report",
    type: "REGULATORY",
    category: "Suspicious Activity",
    description: "Monthly summary of Suspicious Transaction Reports filed with FIU",
    frequency: "MONTHLY",
    lastGenerated: "2024-02-01T09:00:00Z",
    nextDue: "2024-03-01T09:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-007",
    name: "Quarterly Executive Dashboard",
    type: "MANAGEMENT",
    category: "Executive Summary",
    description: "High-level compliance metrics and trends for executive review",
    frequency: "QUARTERLY",
    lastGenerated: "2024-01-15T09:00:00Z",
    nextDue: "2024-04-15T09:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-008",
    name: "Monthly Document Expiry Report",
    type: "OPERATIONAL",
    category: "Document Management",
    description: "Report of expiring and expired documents requiring renewal",
    frequency: "MONTHLY",
    lastGenerated: "2024-02-01T09:00:00Z",
    nextDue: "2024-03-01T09:00:00Z",
    status: "READY",
  },
];

export default function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter reports
  const filteredReports = mockReports.filter((report) => {
    const matchesType = typeFilter === "ALL" || report.type === typeFilter;
    const matchesFrequency = frequencyFilter === "ALL" || report.frequency === frequencyFilter;
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    return matchesType && matchesFrequency && matchesStatus;
  });

  // Calculate stats
  const totalReports = mockReports.length;
  const readyReports = mockReports.filter((r) => r.status === "READY").length;
  const scheduledReports = mockReports.filter((r) => r.status === "SCHEDULED").length;
  const overdueReports = mockReports.filter((r) => r.status === "OVERDUE").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READY":
        return "success";
      case "SCHEDULED":
        return "info";
      case "OVERDUE":
        return "error";
      case "SUBMITTED":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REGULATORY":
        return "bg-red-100 text-red-700 border-red-200";
      case "OPERATIONAL":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "MANAGEMENT":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage compliance reports</p>
        </div>
        <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm">
          <FileText className="w-4 h-4" />
          Custom Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value={totalReports}
          icon={FileText}
          color="teal"
        />
        <StatCard
          title="Ready to Download"
          value={readyReports}
          icon={CheckCircle2}
          color="mint"
        />
        <StatCard
          title="Scheduled"
          value={scheduledReports}
          icon={Clock}
          color="navy"
        />
        <StatCard
          title="Overdue"
          value={overdueReports}
          icon={Calendar}
          color="pink"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-wrap flex-1 flex gap-3">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "ALL", label: "All Types" },
                { value: "REGULATORY", label: "Regulatory" },
                { value: "OPERATIONAL", label: "Operational" },
                { value: "MANAGEMENT", label: "Management" },
              ]}
              className="flex-1"
            />
            <Select
              value={frequencyFilter}
              onChange={setFrequencyFilter}
              options={[
                { value: "ALL", label: "All Frequencies" },
                { value: "DAILY", label: "Daily" },
                { value: "WEEKLY", label: "Weekly" },
                { value: "MONTHLY", label: "Monthly" },
                { value: "QUARTERLY", label: "Quarterly" },
                { value: "ANNUAL", label: "Annual" },
              ]}
              className="flex-1"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "ALL", label: "All Status" },
                { value: "READY", label: "Ready" },
                { value: "SCHEDULED", label: "Scheduled" },
                { value: "OVERDUE", label: "Overdue" },
                { value: "SUBMITTED", label: "Submitted" },
              ]}
              className="flex-1"
            />
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          report.type
                        )}`}
                      >
                        {report.type}
                      </span>
                      <Badge variant={getStatusColor(report.status)} size="sm">
                        {report.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.category}</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center shrink-0">
                    {report.type === "REGULATORY" ? (
                      <FileText className="w-6 h-6 text-brand-teal" />
                    ) : report.type === "MANAGEMENT" ? (
                      <TrendingUp className="w-6 h-6 text-brand-teal" />
                    ) : (
                      <BarChart3 className="w-6 h-6 text-brand-teal" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{report.description}</p>

                <div className="mt-auto space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frequency</span>
                    <span className="font-medium text-gray-900">{report.frequency}</span>
                  </div>
                  {report.lastGenerated && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Generated</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(report.lastGenerated)}
                      </span>
                    </div>
                  )}
                  {report.nextDue && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Due</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(report.nextDue)}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    {report.status === "READY" && (
                      <button className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center justify-center gap-2 text-sm">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                    {report.status === "SCHEDULED" && (
                      <button className="flex-1 px-4 py-2.5 border border-brand-teal text-brand-teal rounded-lg font-medium hover:bg-brand-teal/5 transition-colors text-sm">
                        Generate Now
                      </button>
                    )}
                    <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-xl hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left text-sm">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-brand-teal" />
            </div>
            <p className="font-medium text-gray-900 mb-1">Schedule Report</p>
            <p className="text-sm text-gray-600">Set up automated report generation</p>
          </button>

          <button className="p-4 border border-gray-300 rounded-xl hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left text-sm">
            <div className="w-10 h-10 bg-brand-navy/10 rounded-lg flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-brand-navy" />
            </div>
            <p className="font-medium text-gray-900 mb-1">Report Templates</p>
            <p className="text-sm text-gray-600">Manage and customize templates</p>
          </button>

          <button className="p-4 border border-gray-300 rounded-xl hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left text-sm">
            <div className="w-10 h-10 bg-brand-mint/10 rounded-lg flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-brand-mint" />
            </div>
            <p className="font-medium text-gray-900 mb-1">Export All</p>
            <p className="text-sm text-gray-600">Bulk download ready reports</p>
          </button>
        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
}
