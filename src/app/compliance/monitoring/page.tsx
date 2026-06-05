"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  X,
  Loader2,
  FileDown,
  CheckCircle,
  Eye,
  Flag,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Select from "@/components/ui/Select";
import Pagination from "@/components/compliance/shared/Pagination";
import StatCard from "@/components/compliance/shared/StatCard";
import { formatDate } from "@/lib/compliance-utils";

// Alert type
interface TransactionAlert {
  id: string;
  merchantId: string;
  merchantName: string;
  alertType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  amount?: number;
  transactionCount?: number;
  triggeredRule: string;
  detectedAt: string;
  status: "OPEN" | "INVESTIGATING" | "DISMISSED" | "ESCALATED";
  assignedTo?: string;
  vendorSource?: string;
}

// Mock alerts data
const mockAlerts: TransactionAlert[] = [
  {
    id: "ALERT-2024-001",
    merchantId: "MERCH-789",
    merchantName: "QuickPay Solutions",
    alertType: "THRESHOLD_BREACH",
    severity: "HIGH",
    amount: 250000,
    transactionCount: 45,
    triggeredRule: "Daily volume exceeds 200,000 GHS",
    detectedAt: "2026-06-05T09:30:00Z",
    status: "OPEN",
    vendorSource: "MTN Mobile Money",
  },
  {
    id: "ALERT-2024-002",
    merchantId: "MERCH-445",
    merchantName: "Global Traders Ltd",
    alertType: "VELOCITY_SPIKE",
    severity: "CRITICAL",
    transactionCount: 120,
    triggeredRule: "Transaction velocity 300% above baseline",
    detectedAt: "2026-06-05T08:15:00Z",
    status: "INVESTIGATING",
    assignedTo: "Jane Mensah",
    vendorSource: "Zeepay",
  },
  {
    id: "ALERT-2024-003",
    merchantId: "MERCH-223",
    merchantName: "Tech Innovations Inc",
    alertType: "STRUCTURING_PATTERN",
    severity: "MEDIUM",
    amount: 98500,
    transactionCount: 25,
    triggeredRule: "Multiple just-below-threshold transactions",
    detectedAt: "2026-06-04T16:45:00Z",
    status: "OPEN",
    vendorSource: "Airtel Money",
  },
  {
    id: "ALERT-2024-004",
    merchantId: "MERCH-112",
    merchantName: "ABC Logistics",
    alertType: "INCONSISTENT_ACTIVITY",
    severity: "LOW",
    amount: 45000,
    triggeredRule: "Activity pattern differs from declared business",
    detectedAt: "2026-06-04T14:20:00Z",
    status: "DISMISSED",
    assignedTo: "Peter Owusu",
    vendorSource: "MTN Mobile Money",
  },
  {
    id: "ALERT-2024-005",
    merchantId: "MERCH-667",
    merchantName: "Premium Retail Group",
    alertType: "FLAGGED_COUNTERPARTY",
    severity: "HIGH",
    amount: 75000,
    transactionCount: 8,
    triggeredRule: "Transaction with flagged counterparty",
    detectedAt: "2026-06-04T11:00:00Z",
    status: "ESCALATED",
    assignedTo: "Jane Mensah",
    vendorSource: "Zeepay",
  },
];

export default function TransactionMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [alertTypeFilter, setAlertTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<TransactionAlert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionSuccess, setShowActionSuccess] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [alerts, setAlerts] = useState<TransactionAlert[]>(mockAlerts);
  const itemsPerPage = 10;

  // Calculate stats
  const openCount = alerts.filter((a) => a.status === "OPEN").length;
  const investigatingCount = alerts.filter((a) => a.status === "INVESTIGATING").length;
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const highCount = alerts.filter((a) => a.severity === "HIGH").length;

  // Show action toast
  const showSuccess = (message: string) => {
    setActionMessage(message);
    setShowActionSuccess(true);
    setTimeout(() => setShowActionSuccess(false), 3000);
  };

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.merchantId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === "ALL" || alert.severity === severityFilter;
      const matchesStatus = statusFilter === "ALL" || alert.status === statusFilter;
      const matchesAlertType = alertTypeFilter === "ALL" || alert.alertType === alertTypeFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesAlertType;
    });
  }, [alerts, searchQuery, severityFilter, statusFilter, alertTypeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, severityFilter, statusFilter, alertTypeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const displayedAlerts = useMemo(() => {
    return filteredAlerts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredAlerts, currentPage]);

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const headers = ["ID", "Merchant", "Alert Type", "Severity", "Status", "Amount", "Detected At", "Vendor"];
      const rows = filteredAlerts.map((alert) => [
        alert.id,
        alert.merchantName,
        alert.alertType.replace(/_/g, " "),
        alert.severity,
        alert.status,
        alert.amount ? `GHS ${alert.amount.toLocaleString()}` : "N/A",
        new Date(alert.detectedAt).toLocaleString(),
        alert.vendorSource || "N/A",
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transaction-alerts-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle alert actions
  const handleAlertAction = async (action: string, alertId: string) => {
    const actionMessages: Record<string, string> = {
      dismiss: `Alert ${alertId} dismissed`,
      investigate: `Alert ${alertId} moved to investigating`,
      escalate: `Alert ${alertId} escalated to case`,
    };
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update alert status
    setAlerts(alerts.map((a) => {
      if (a.id === alertId) {
        if (action === "dismiss") return { ...a, status: "DISMISSED" as const };
        if (action === "investigate") return { ...a, status: "INVESTIGATING" as const, assignedTo: "Current Officer" };
        if (action === "escalate") return { ...a, status: "ESCALATED" as const };
      }
      return a;
    }));
    
    showSuccess(actionMessages[action] || "Action completed");
    setShowDetailModal(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSeverityFilter("ALL");
    setStatusFilter("ALL");
    setAlertTypeFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery || severityFilter !== "ALL" || statusFilter !== "ALL" || alertTypeFilter !== "ALL";

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-100 text-red-700 border-red-200";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-blue-100 text-blue-700 border-blue-200";
      case "INVESTIGATING": return "bg-purple-100 text-purple-700 border-purple-200";
      case "DISMISSED": return "bg-gray-100 text-gray-700 border-gray-200";
      case "ESCALATED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Toast */}
        <AnimatePresence>
          {showActionSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-brand-teal text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{actionMessage}</span>
              <button
                onClick={() => setShowActionSuccess(false)}
                className="ml-2 hover:bg-brand-teal/80 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Success Toast */}
        <AnimatePresence>
          {showExportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <FileDown className="w-4 h-4" />
              <span className="text-sm font-medium">Export completed successfully!</span>
              <button
                onClick={() => setShowExportSuccess(false)}
                className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with Vendor Warning */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Transaction Monitoring</h1>
            <p className="text-gray-500 mt-1">
              {filteredAlerts.length} alert(s) {hasActiveFilters && "matching filters"}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Vendor-Dependent: Monitoring capabilities depend on vendor data feeds
              </span>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredAlerts.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Open Alerts"
            value={openCount}
            icon={Flag}
            color="teal"
          />
          <StatCard
            title="Investigating"
            value={investigatingCount}
            icon={Activity}
            color="lavender"
          />
          <StatCard
            title="Critical Severity"
            value={criticalCount}
            icon={AlertTriangle}
            color="pink"
          />
          <StatCard
            title="High Severity"
            value={highCount}
            icon={TrendingUp}
            color="peach"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] border border-gray-200/70 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand-teal hover:text-brand-teal/80 font-medium transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, merchant name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Severity Filter */}
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Severities" },
                    { value: "CRITICAL", label: "Critical" },
                    { value: "HIGH", label: "High" },
                    { value: "MEDIUM", label: "Medium" },
                    { value: "LOW", label: "Low" },
                  ]}
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  placeholder="All Severities"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "OPEN", label: "Open" },
                    { value: "INVESTIGATING", label: "Investigating" },
                    { value: "DISMISSED", label: "Dismissed" },
                    { value: "ESCALATED", label: "Escalated" },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All Status"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
          {filteredAlerts.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {displayedAlerts.length} of {filteredAlerts.length} alert(s)
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Merchant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Alert Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Detected</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedAlerts.map((alert, index) => (
                  <motion.tr key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{alert.merchantName}</p>
                      <p className="text-xs text-gray-500">{alert.merchantId}</p>
                    </td>
                    <td className="px-6 py-3"><span className="text-sm">{alert.alertType.replace(/_/g, " ")}</span></td>
                    <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>{alert.severity}</span></td>
                    <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>{alert.status}</span></td>
                    <td className="px-6 py-3"><span className="text-xs text-gray-600">{formatDate(alert.detectedAt, true)}</span></td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { setSelectedAlert(alert); setShowDetailModal(true); }} className="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"><Eye className="w-4 h-4 inline mr-1" />View</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAlerts.length === 0 && (
            <div className="p-12 text-center"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-400" /></div><h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3></div>
          )}

          {totalPages > 1 && (<div className="px-6 py-4 border-t"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>)}
        </div>

        {/* Alert Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedAlert && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">
                        Alert Details
                      </h2>
                      <p className="text-gray-600 mt-1">{selectedAlert.id}</p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Merchant Info */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Merchant</label>
                    <p className="text-gray-900 mt-1 text-lg font-semibold">
                      {selectedAlert.merchantName}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{selectedAlert.merchantId}</p>
                  </div>

                  {/* Alert Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Alert Type</label>
                      <p className="text-gray-900 mt-1">
                        {selectedAlert.alertType.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Severity</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                          {selectedAlert.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Triggered Rule */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Triggered Rule</label>
                    <p className="text-gray-900 mt-1 font-medium">{selectedAlert.triggeredRule}</p>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAlert.amount && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Amount</label>
                        <p className="text-gray-900 mt-1 font-bold text-lg">
                          GHS {selectedAlert.amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedAlert.transactionCount && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Transaction Count</label>
                        <p className="text-gray-900 mt-1 font-bold text-lg">
                          {selectedAlert.transactionCount}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status and Assignment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedAlert.status)}`}>
                          {selectedAlert.status}
                        </span>
                      </div>
                    </div>
                    {selectedAlert.assignedTo && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Assigned To</label>
                        <p className="text-gray-900 mt-1">{selectedAlert.assignedTo}</p>
                      </div>
                    )}
                  </div>

                  {/* Detection Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Detected At</label>
                      <p className="text-gray-900 mt-1">
                        {formatDate(selectedAlert.detectedAt, true)}
                      </p>
                    </div>
                    {selectedAlert.vendorSource && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Vendor Source</label>
                        <p className="text-gray-900 mt-1">{selectedAlert.vendorSource}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {selectedAlert.status === "OPEN" && (
                    <div className="pt-4 border-t border-gray-200">
                      <label className="text-sm font-medium text-gray-600 block mb-3">
                        Take Action
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleAlertAction("investigate", selectedAlert.id)}
                          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <Activity className="w-4 h-4" />
                          Start Investigation
                        </button>
                        <button
                          onClick={() => handleAlertAction("dismiss", selectedAlert.id)}
                          className="flex-1 px-4 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Dismiss (False Positive)
                        </button>
                        <button
                          onClick={() => handleAlertAction("escalate", selectedAlert.id)}
                          className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Escalate to Case
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedAlert.status !== "OPEN" && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>This alert has been {selectedAlert.status.toLowerCase().replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
