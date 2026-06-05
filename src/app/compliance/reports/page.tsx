"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Clock,
  CheckCircle2,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
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

  // State management
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<Report | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyReport, setHistoryReport] = useState<Report | null>(null);
  const [customReport, setCustomReport] = useState({
    name: "",
    type: "OPERATIONAL" as Report["type"],
    category: "",
    description: "",
    frequency: "ON_DEMAND" as Report["frequency"],
  });

  // Helper functions
  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  // Filter reports with useMemo
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesType = typeFilter === "ALL" || report.type === typeFilter;
      const matchesFrequency = frequencyFilter === "ALL" || report.frequency === frequencyFilter;
      const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
      return matchesType && matchesFrequency && matchesStatus;
    });
  }, [reports, typeFilter, frequencyFilter, statusFilter]);

  // Calculate stats
  const totalReports = reports.length;
  const readyReports = reports.filter((r) => r.status === "READY").length;
  const scheduledReports = reports.filter((r) => r.status === "SCHEDULED").length;
  const overdueReports = reports.filter((r) => r.status === "OVERDUE").length;

  // Handle download report
  const handleDownload = async (report: Report) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reportContent = `
NAMIBRAPAY COMPLIANCE REPORT
============================

Report ID: ${report.id}
Report Name: ${report.name}
Type: ${report.type}
Category: ${report.category}
Frequency: ${report.frequency}

Description: ${report.description}

Last Generated: ${report.lastGenerated ? formatDate(report.lastGenerated, true) : "N/A"}
Next Due: ${report.nextDue ? formatDate(report.nextDue, true) : "N/A"}
Status: ${report.status}

Generated on: ${new Date().toISOString()}
      `;

      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.id}-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast("Report downloaded successfully!");
    } catch (error) {
      console.error("Failed to download report:", error);
      showAlert("Failed to download report. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle generate now - open modal
  const handleGenerateNowClick = (report: Report) => {
    setGeneratingReport(report);
    setShowGenerateModal(true);
  };

  // Handle generate now - confirmed
  const handleGenerateConfirmed = async () => {
    if (!generatingReport) return;

    setShowGenerateModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setReports(
        reports.map((r) =>
          r.id === generatingReport.id
            ? {
                ...r,
                status: "READY" as Report["status"],
                lastGenerated: new Date().toISOString(),
              }
            : r
        )
      );

      showToast("Report generated successfully!");
      setGeneratingReport(null);
    } catch (error) {
      console.error("Failed to generate report:", error);
      showAlert("Failed to generate report. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle view history
  const handleViewHistory = (report: Report) => {
    setHistoryReport(report);
    setShowHistoryModal(true);
  };

  // Handle custom report
  const handleCustomReportClick = () => {
    setCustomReport({
      name: "",
      type: "OPERATIONAL",
      category: "",
      description: "",
      frequency: "ON_DEMAND",
    });
    setShowCustomReportModal(true);
  };

  // Handle create custom report
  const handleCreateCustomReport = async () => {
    if (!customReport.name.trim() || !customReport.category.trim() || !customReport.description.trim()) {
      showAlert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newReport: Report = {
        id: `REP-${String(reports.length + 1).padStart(3, "0")}`,
        name: customReport.name,
        type: customReport.type,
        category: customReport.category,
        description: customReport.description,
        frequency: customReport.frequency,
        status: "READY",
        lastGenerated: new Date().toISOString(),
      };

      setReports([newReport, ...reports]);

      showToast("Custom report created successfully!");
      setShowCustomReportModal(false);
    } catch (error) {
      console.error("Failed to create custom report:", error);
      showAlert("Failed to create custom report. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setTypeFilter("ALL");
    setFrequencyFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters = typeFilter !== "ALL" || frequencyFilter !== "ALL" || statusFilter !== "ALL";

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
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-60 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{successMessage}</span>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert Modal */}
        <AnimatePresence>
          {showAlertModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => setShowAlertModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Alert</h3>
                </div>
                <p className="text-sm text-gray-700 mb-6">{alertMessage}</p>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="w-full px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Report Modal */}
        <AnimatePresence>
          {showGenerateModal && generatingReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowGenerateModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Generate Report</h2>
                  <button
                    onClick={() => !isProcessing && setShowGenerateModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>{generatingReport.name}</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    This will generate the report immediately. The report will be available for download once generated.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateConfirmed}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Now"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View History Modal */}
        <AnimatePresence>
          {showHistoryModal && historyReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => setShowHistoryModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-brand-teal" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Report History</h2>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Report Name</p>
                    <p className="text-sm font-medium text-gray-900">{historyReport.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Type</p>
                      <p className="text-sm font-medium text-gray-900">{historyReport.type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Frequency</p>
                      <p className="text-sm font-medium text-gray-900">{historyReport.frequency}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Generation History</p>
                    <div className="space-y-3">
                      {historyReport.lastGenerated && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="text-xs text-green-600 font-semibold">Last Generated</p>
                            <p className="text-sm text-gray-900">{formatDate(historyReport.lastGenerated, true)}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                      {historyReport.nextDue && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="text-xs text-blue-600 font-semibold">Next Due</p>
                            <p className="text-sm text-gray-900">{formatDate(historyReport.nextDue, true)}</p>
                          </div>
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs text-gray-600">
                      Historical generation records are available for the last 12 months.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="mt-6 w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Report Modal */}
        <AnimatePresence>
          {showCustomReportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowCustomReportModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Create Custom Report</h2>
                  <button
                    onClick={() => !isProcessing && setShowCustomReportModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customReport.name}
                      onChange={(e) => setCustomReport({ ...customReport, name: e.target.value })}
                      placeholder="e.g., Weekly Risk Analysis"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={customReport.type}
                      onChange={(value) => setCustomReport({ ...customReport, type: value as Report["type"] })}
                      options={[
                        { value: "REGULATORY", label: "Regulatory" },
                        { value: "OPERATIONAL", label: "Operational" },
                        { value: "MANAGEMENT", label: "Management" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customReport.category}
                      onChange={(e) => setCustomReport({ ...customReport, category: e.target.value })}
                      placeholder="e.g., KYC Statistics, Risk Management"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={customReport.frequency}
                      onChange={(value) => setCustomReport({ ...customReport, frequency: value as Report["frequency"] })}
                      options={[
                        { value: "ON_DEMAND", label: "On Demand" },
                        { value: "DAILY", label: "Daily" },
                        { value: "WEEKLY", label: "Weekly" },
                        { value: "MONTHLY", label: "Monthly" },
                        { value: "QUARTERLY", label: "Quarterly" },
                        { value: "ANNUAL", label: "Annual" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customReport.description}
                      onChange={(e) => setCustomReport({ ...customReport, description: e.target.value })}
                      placeholder="Enter report description..."
                      rows={4}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCustomReportModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCustomReport}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Report"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage compliance reports</p>
        </div>
        <button
          onClick={handleCustomReportClick}
          className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm"
        >
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
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Results Counter */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      )}

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
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
                        <button
                          onClick={() => handleDownload(report)}
                          disabled={isProcessing}
                          className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Download
                        </button>
                      )}
                      {report.status === "SCHEDULED" && (
                        <button
                          onClick={() => handleGenerateNowClick(report)}
                          disabled={isProcessing}
                          className="flex-1 px-4 py-2.5 border border-brand-teal text-brand-teal rounded-lg font-medium hover:bg-brand-teal/5 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Generate Now
                        </button>
                      )}
                      <button
                        onClick={() => handleViewHistory(report)}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? "No reports match your current filters."
                : "No reports available at the moment."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCustomReportClick}
            className="p-4 border border-gray-300 rounded-xl hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left text-sm"
          >
            <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-brand-teal" />
            </div>
            <p className="font-medium text-gray-900 mb-1">Schedule Report</p>
            <p className="text-sm text-gray-600">Set up automated report generation</p>
          </button>

          <button
            onClick={() => showAlert("Report Templates feature coming soon!")}
            className="p-4 border border-gray-300 rounded-xl hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left text-sm"
          >
            <div className="w-10 h-10 bg-brand-navy/10 rounded-lg flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-brand-navy" />
            </div>
            <p className="font-medium text-gray-900 mb-1">Report Templates</p>
            <p className="text-sm text-gray-600">Manage and customize templates</p>
          </button>

          <button
            onClick={() => {
              if (reports.filter(r => r.status === "READY").length === 0) {
                showAlert("No ready reports available for export");
                return;
              }
              showAlert("Bulk export feature coming soon!");
            }}
            className="p-4 border border-gray-300 rounded-xl hover:border-brand-teal hover:bg-brand-teal/5 transition-colors text-left text-sm"
          >
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
