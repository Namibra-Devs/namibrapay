"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  FileDown,
  X,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import SearchBar from "@/components/compliance/shared/SearchBar";
import Pagination from "@/components/compliance/shared/Pagination";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import { Case, CaseStatus } from "@/types/compliance";
import { formatDate } from "@/lib/compliance-utils";

// Mock cases data
const mockCases: Case[] = [
  {
    id: "CASE-2024-001",
    type: "SANCTIONS_HIT",
    priority: "CRITICAL",
    status: "INVESTIGATING",
    linkedEntities: ["APP-2024-003", "MERCH-002"],
    assignedInvestigator: "Jane Mensah",
    openedAt: "2024-02-20T09:00:00Z",
    openedBy: "System",
    evidence: [],
    notes: [],
    tasks: [
      {
        id: "TASK-001",
        description: "Review sanctions match details",
        assignedTo: "Jane Mensah",
        dueDate: "2024-02-21T17:00:00Z",
        completed: true,
        completedAt: "2024-02-20T14:30:00Z",
      },
      {
        id: "TASK-002",
        description: "Interview applicant",
        assignedTo: "Jane Mensah",
        dueDate: "2024-02-22T17:00:00Z",
        completed: false,
      },
    ],
  },
  {
    id: "CASE-2024-002",
    type: "SUSPICIOUS_ACTIVITY",
    priority: "HIGH",
    status: "OPEN",
    linkedEntities: ["MERCH-005"],
    assignedInvestigator: "Kwame Asante",
    openedAt: "2024-02-19T11:30:00Z",
    openedBy: "Jane Mensah",
    evidence: [],
    notes: [],
    tasks: [],
  },
  {
    id: "CASE-2024-003",
    type: "DOCUMENT_FRAUD",
    priority: "HIGH",
    status: "PENDING_REVIEW",
    linkedEntities: ["APP-2024-007"],
    assignedInvestigator: "Jane Mensah",
    openedAt: "2024-02-18T15:20:00Z",
    openedBy: "Kwame Asante",
    evidence: [],
    notes: [],
    tasks: [],
  },
  {
    id: "CASE-2024-004",
    type: "COMPLAINT",
    priority: "MEDIUM",
    status: "CLOSED",
    linkedEntities: ["MERCH-003"],
    assignedInvestigator: "Kwame Asante",
    openedAt: "2024-02-15T10:00:00Z",
    openedBy: "System",
    closedAt: "2024-02-19T16:45:00Z",
    outcome: "Complaint resolved - customer service issue addressed",
    evidence: [],
    notes: [],
    tasks: [],
  },
  {
    id: "CASE-2024-005",
    type: "SUSPICIOUS_ACTIVITY",
    priority: "CRITICAL",
    status: "REPORTED",
    linkedEntities: ["MERCH-001", "MERCH-008"],
    assignedInvestigator: "Jane Mensah",
    openedAt: "2024-02-10T08:30:00Z",
    openedBy: "Jane Mensah",
    closedAt: "2024-02-17T14:20:00Z",
    outcome: "Suspicious Transaction Report filed with FIU",
    evidence: [],
    notes: [],
    tasks: [],
    strDraft: "STR filed - Case #STR-2024-005",
  },
];

export default function CasesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    type: "SUSPICIOUS_ACTIVITY",
    priority: "MEDIUM",
    linkedEntity: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const itemsPerPage = 10;

  // Filter cases with useMemo for performance
  const filteredCases = useMemo(() => {
    return mockCases.filter((caseItem) => {
      const matchesSearch =
        caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.linkedEntities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "ALL" || caseItem.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || caseItem.priority === priorityFilter;
      const matchesType = typeFilter === "ALL" || caseItem.type === typeFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [searchQuery, statusFilter, priorityFilter, typeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, typeFilter]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const displayedCases = useMemo(() => {
    return filteredCases.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredCases, currentPage, itemsPerPage]);

  // Calculate stats
  const openCount = mockCases.filter((c) => c.status === "OPEN" || c.status === "INVESTIGATING").length;
  const pendingReviewCount = mockCases.filter((c) => c.status === "PENDING_REVIEW").length;
  const criticalCount = mockCases.filter((c) => c.priority === "CRITICAL").length;
  const closedCount = mockCases.filter((c) => c.status === "CLOSED" || c.status === "REPORTED").length;

  // Handle export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const headers = ["Case ID", "Type", "Priority", "Status", "Investigator", "Opened", "Linked Entities"];
      const rows = filteredCases.map((caseItem) => [
        caseItem.id,
        caseItem.type.replace(/_/g, " "),
        caseItem.priority,
        caseItem.status.replace(/_/g, " "),
        caseItem.assignedInvestigator || "Unassigned",
        new Date(caseItem.openedAt).toLocaleDateString(),
        caseItem.linkedEntities.join("; "),
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cases-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      setAlertMessage("Export failed. Please try again.");
      setShowAlertModal(true);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle new case creation
  const handleNewCase = () => {
    setShowNewCaseModal(true);
  };

  // Handle create case submission
  const handleCreateCase = async () => {
    if (!newCaseData.linkedEntity.trim() || !newCaseData.description.trim()) {
      setAlertMessage("Please fill in all required fields");
      setShowAlertModal(true);
      return;
    }

    setIsCreatingCase(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would create a new case via API
      console.log("Creating new case:", newCaseData);

      setShowNewCaseModal(false);
      setNewCaseData({
        type: "SUSPICIOUS_ACTIVITY",
        priority: "MEDIUM",
        linkedEntity: "",
        description: "",
      });

      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);

      // Would normally navigate to the new case detail page
      // router.push(`/compliance/cases/${newCaseId}`);
    } catch (error) {
      console.error("Failed to create case:", error);
      setAlertMessage("Failed to create case. Please try again.");
      setShowAlertModal(true);
    } finally {
      setIsCreatingCase(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setTypeFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || typeFilter !== "ALL";

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "OPEN":
        return "info";
      case "INVESTIGATING":
        return "warning";
      case "PENDING_REVIEW":
        return "warning";
      case "CLOSED":
        return "success";
      case "REPORTED":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                    <AlertTriangle className="w-4 h-4 text-red-600" />
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

        {/* New Case Modal */}
        <AnimatePresence>
          {showNewCaseModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isCreatingCase && setShowNewCaseModal(false)}
              style={{ margin: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-600">Create New Case</h2>
                  <button
                    onClick={() => !isCreatingCase && setShowNewCaseModal(false)}
                    disabled={isCreatingCase}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Case Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={newCaseData.type}
                      onChange={(value) => setNewCaseData({ ...newCaseData, type: value })}
                      options={[
                        { value: "SANCTIONS_HIT", label: "Sanctions Hit" },
                        { value: "SUSPICIOUS_ACTIVITY", label: "Suspicious Activity" },
                        { value: "DOCUMENT_FRAUD", label: "Document Fraud" },
                        { value: "COMPLAINT", label: "Complaint" },
                        { value: "OTHER", label: "Other" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={newCaseData.priority}
                      onChange={(value) => setNewCaseData({ ...newCaseData, priority: value })}
                      options={[
                        { value: "LOW", label: "Low" },
                        { value: "MEDIUM", label: "Medium" },
                        { value: "HIGH", label: "High" },
                        { value: "CRITICAL", label: "Critical" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Linked Entity ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCaseData.linkedEntity}
                      onChange={(e) =>
                        setNewCaseData({ ...newCaseData, linkedEntity: e.target.value })
                      }
                      placeholder="e.g., APP-2024-001, MERCH-001"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newCaseData.description}
                      onChange={(e) =>
                        setNewCaseData({ ...newCaseData, description: e.target.value })
                      }
                      placeholder="Describe the issue or reason for opening this case..."
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowNewCaseModal(false)}
                    disabled={isCreatingCase}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCase}
                    disabled={isCreatingCase}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreatingCase ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Create Case
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
            <p className="text-gray-600 mt-1">
              {filteredCases.length} case(s) {hasActiveFilters && "matching filters"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting || filteredCases.length === 0}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            <button
              onClick={handleNewCase}
              className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm"
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Open Cases"
          value={openCount}
          icon={Briefcase}
          color="teal"
        />
        <StatCard
          title="Pending Review"
          value={pendingReviewCount}
          icon={Clock}
          color="peach"
        />
        <StatCard
          title="Critical Priority"
          value={criticalCount}
          icon={AlertTriangle}
          color="pink"
        />
        <StatCard
          title="Closed Cases"
          value={closedCount}
          icon={CheckCircle2}
          color="mint"
        />
      </div>

      {/* Filters & Search */}
      <Card>
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

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchBar
                placeholder="Search by case ID or linked entities..."
                onSearch={setSearchQuery}
                className="flex-1"
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
            <div className="flex flex-wrap gap-3">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full md:w-44"
                options={[
                  { value: "ALL", label: "All Status" },
                  { value: "OPEN", label: "Open" },
                  { value: "INVESTIGATING", label: "Investigating" },
                  { value: "PENDING_REVIEW", label: "Pending Review" },
                  { value: "CLOSED", label: "Closed" },
                  { value: "REPORTED", label: "Reported" },
                ]}
              />
              <Select
                value={priorityFilter}
                onChange={setPriorityFilter}
                className="w-full md:w-44"
                options={[
                  { value: "ALL", label: "All Priorities" },
                  { value: "CRITICAL", label: "Critical" },
                  { value: "HIGH", label: "High" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "LOW", label: "Low" },
                ]}
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                className="w-full md:w-44"
                options={[
                  { value: "ALL", label: "All Types" },
                  { value: "SANCTIONS_HIT", label: "Sanctions Hit" },
                  { value: "SUSPICIOUS_ACTIVITY", label: "Suspicious Activity" },
                  { value: "COMPLAINT", label: "Complaint" },
                  { value: "DOCUMENT_FRAUD", label: "Document Fraud" },
                  { value: "OTHER", label: "Other" },
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Cases Table */}
      <Card padding="none">
        {/* Results count bar */}
        {filteredCases.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {displayedCases.length} of {filteredCases.length} case(s)
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Linked Entities
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Investigator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Opened
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedCases.map((caseItem, index) => (
                <motion.tr
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => router.push(`/compliance/cases/${caseItem.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link href={`/compliance/cases/${caseItem.id}`}>
                      <p className="font-medium text-sm text-gray-900 hover:text-brand-teal transition-colors">
                        {caseItem.id}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {caseItem.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        caseItem.priority
                      )}`}
                    >
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(caseItem.status)} size="sm">
                      {caseItem.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {caseItem.linkedEntities.map((entity, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-brand-teal/10 text-brand-teal font-medium"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{caseItem.assignedInvestigator}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600">{formatDate(caseItem.openedAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/compliance/cases/${caseItem.id}`}
                      className="inline-flex items-center gap-1 text-brand-teal hover:text-brand-teal/80 font-medium text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No cases found
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria"
                : "No cases available at the moment"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </div>
    </DashboardLayout>
  );
}
