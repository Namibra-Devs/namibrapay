"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Clock,
  AlertCircle,
  Loader2,
  FileDown,
  X,
  CheckCircle,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Link from "next/link";
import Select from "@/components/ui/Select";
import ApplicationActionsMenu from "@/components/compliance/ApplicationActionsMenu";
import Pagination from "@/components/compliance/shared/Pagination";
import {
  cn,
  calculateSLARemaining,
  formatStatus,
  getRiskBadgeColor,
  getStatusBadgeColor,
} from "@/lib/compliance-utils";
import type { Application } from "@/types/compliance";

// Mock data
const mockApplications: Application[] = [
  {
    id: "APP-2024-001",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 65,
    riskBand: "MEDIUM",
    assignedOfficer: "Jane Mensah",
    submittedAt: "2026-06-02T14:30:00Z",
    slaDeadline: "2026-06-04T14:30:00Z",
    screeningStatus: "PENDING",
    applicant: {
      legalName: "Kwame Tech Solutions Ltd",
      phone: "+233244123456",
      email: "info@kwametech.com",
      registrationNumber: "CS-123456",
      industry: "E-commerce",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-101",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 65,
    riskBand: "MEDIUM",
    assignedOfficer: "Jane Mensah",
    submittedAt: "2026-06-02T14:30:00Z",
    slaDeadline: "2026-06-04T14:30:00Z",
    screeningStatus: "PENDING",
    applicant: {
      legalName: "Kwame Tech Solutions Ltd",
      phone: "+233244123456",
      email: "info@kwametech.com",
      registrationNumber: "CS-123456",
      industry: "E-commerce",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-201",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 65,
    riskBand: "MEDIUM",
    assignedOfficer: "Jane Mensah",
    submittedAt: "2026-06-02T14:30:00Z",
    slaDeadline: "2026-06-04T14:30:00Z",
    screeningStatus: "PENDING",
    applicant: {
      legalName: "Kwame Tech Solutions Ltd",
      phone: "+233244123456",
      email: "info@kwametech.com",
      registrationNumber: "CS-123456",
      industry: "E-commerce",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-002",
    type: "INDIVIDUAL",
    status: "PENDING_INFO",
    riskScore: 25,
    riskBand: "LOW",
    assignedOfficer: "John Mensah",
    submittedAt: "2026-06-01T09:15:00Z",
    slaDeadline: "2026-06-05T09:15:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      fullName: "Sarah Osei",
      phone: "+233244987654",
      email: "sarah.osei@gmail.com",
      occupation: "Freelance Designer",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-003",
    type: "BUSINESS",
    status: "ESCALATED",
    riskScore: 85,
    riskBand: "HIGH",
    assignedOfficer: "Jane Mensah",
    submittedAt: "2026-05-30T11:45:00Z",
    slaDeadline: "2026-06-03T11:45:00Z",
    screeningStatus: "HIT",
    applicant: {
      legalName: "Global Traders Ltd",
      phone: "+233201234567",
      email: "contact@globaltraders.gh",
      registrationNumber: "CS-789012",
      industry: "Import/Export",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-004",
    type: "INDIVIDUAL",
    status: "SUBMITTED",
    riskScore: 45,
    riskBand: "MEDIUM",
    submittedAt: "2026-06-03T16:20:00Z",
    slaDeadline: "2026-06-05T16:20:00Z",
    screeningStatus: "PENDING",
    applicant: {
      fullName: "Kwaku Mensah",
      phone: "+233244555666",
      email: "kwaku.m@yahoo.com",
      occupation: "Business Owner",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-005",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 35,
    riskBand: "LOW",
    assignedOfficer: "Peter Owusu",
    submittedAt: "2026-06-02T10:00:00Z",
    slaDeadline: "2026-06-04T10:00:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      legalName: "Bright Future Schools",
      phone: "+233302123456",
      email: "admin@brightfuture.edu.gh",
      registrationNumber: "CS-345678",
      industry: "Education",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-00232",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 35,
    riskBand: "LOW",
    assignedOfficer: "Peter Owusu",
    submittedAt: "2026-06-02T10:00:00Z",
    slaDeadline: "2026-06-04T10:00:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      legalName: "Bright Future Schools",
      phone: "+233302123456",
      email: "admin@brightfuture.edu.gh",
      registrationNumber: "CS-345678",
      industry: "Education",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-0092",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 35,
    riskBand: "LOW",
    assignedOfficer: "Peter Owusu",
    submittedAt: "2026-06-02T10:00:00Z",
    slaDeadline: "2026-06-04T10:00:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      legalName: "Bright Future Schools",
      phone: "+233302123456",
      email: "admin@brightfuture.edu.gh",
      registrationNumber: "CS-345678",
      industry: "Education",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-0062",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 35,
    riskBand: "LOW",
    assignedOfficer: "Peter Owusu",
    submittedAt: "2026-06-02T10:00:00Z",
    slaDeadline: "2026-06-04T10:00:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      legalName: "Bright Future Schools",
      phone: "+233302123456",
      email: "admin@brightfuture.edu.gh",
      registrationNumber: "CS-345678",
      industry: "Education",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-0022",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 35,
    riskBand: "LOW",
    assignedOfficer: "Peter Owusu",
    submittedAt: "2026-06-02T10:00:00Z",
    slaDeadline: "2026-06-04T10:00:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      legalName: "Bright Future Schools",
      phone: "+233302123456",
      email: "admin@brightfuture.edu.gh",
      registrationNumber: "CS-345678",
      industry: "Education",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
  {
    id: "APP-2024-0042",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskScore: 35,
    riskBand: "LOW",
    assignedOfficer: "Peter Owusu",
    submittedAt: "2026-06-02T10:00:00Z",
    slaDeadline: "2026-06-04T10:00:00Z",
    screeningStatus: "CLEAR",
    applicant: {
      legalName: "Bright Future Schools",
      phone: "+233302123456",
      email: "admin@brightfuture.edu.gh",
      registrationNumber: "CS-345678",
      industry: "Education",
    },
    documents: [],
    screeningResults: [],
    notes: [],
    auditTrail: [],
  },
];

export default function ApplicationsQueue() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showActionToast, setShowActionToast] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const itemsPerPage = 10;

  // Show action toast
  const showActionSuccess = (message: string) => {
    setActionMessage(message);
    setShowActionToast(true);
    setTimeout(() => setShowActionToast(false), 3000);
  };

  // Handle actions from the menu
  const handleApplicationAction = (action: string, applicationId: string) => {
    const messages: Record<string, string> = {
      assign: `Application ${applicationId} assigned to you`,
      message: `Opening message composer for ${applicationId}`,
      request_info: `Information request sent for ${applicationId}`,
      approve: `Application ${applicationId} approved successfully`,
      reject: `Application ${applicationId} rejected`,
      escalate: `Application ${applicationId} escalated to senior officer`,
    };
    
    showActionSuccess(messages[action] || "Action completed successfully");
  };

  // Filter applications with useMemo for performance
  const filteredApplications = useMemo(() => {
    return mockApplications.filter((app) => {
      const matchesSearch =
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.applicant.fullName || app.applicant.legalName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || app.status === selectedStatus;
      const matchesRisk = selectedRisk === "ALL" || app.riskBand === selectedRisk;
      const matchesType = selectedType === "ALL" || app.type === selectedType;

      return matchesSearch && matchesStatus && matchesRisk && matchesType;
    });
  }, [searchQuery, selectedStatus, selectedRisk, selectedType]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedRisk, selectedType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const displayedApplications = useMemo(() => {
    return filteredApplications.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredApplications, currentPage, itemsPerPage]);

  // Handle export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Create CSV content
      const headers = ["ID", "Name", "Type", "Status", "Risk", "Assigned", "Submitted"];
      const rows = filteredApplications.map((app) => [
        app.id,
        app.applicant.fullName || app.applicant.legalName || "N/A",
        app.type,
        formatStatus(app.status),
        app.riskBand,
        app.assignedOfficer || "Unassigned",
        new Date(app.submittedAt).toLocaleDateString(),
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");
      
      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedRisk("ALL");
    setSelectedType("ALL");
  };

  const hasActiveFilters =
    searchQuery || selectedStatus !== "ALL" || selectedRisk !== "ALL" || selectedType !== "ALL";

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
              <FileDown className="w-5 h-5" />
              <span className="font-medium">Export completed successfully!</span>
              <button
                onClick={() => setShowExportSuccess(false)}
                className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Success Toast */}
        <AnimatePresence>
          {showActionToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-brand-teal text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{actionMessage}</span>
              <button
                onClick={() => setShowActionToast(false)}
                className="ml-2 hover:bg-brand-teal/80 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">
              Applications Queue
            </h1>
            <p className="text-gray-500 mt-1">
              {filteredApplications.length} application(s) {hasActiveFilters && "matching filters"}
              {!hasActiveFilters && "requiring review"}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredApplications.length === 0}
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

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] border border-gray-200/70 p-6">
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
                    placeholder="Search by ID, name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
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

              {/* Status Filter */}
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "SUBMITTED", label: "Submitted" },
                    { value: "UNDER_REVIEW", label: "Under Review" },
                    { value: "PENDING_INFO", label: "Pending Info" },
                    { value: "ESCALATED", label: "Escalated" },
                  ]}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="All Status"
                />
              </div>

              {/* Risk Filter */}
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Risk Levels" },
                    { value: "LOW", label: "Low Risk" },
                    { value: "MEDIUM", label: "Medium Risk" },
                    { value: "HIGH", label: "High Risk" },
                  ]}
                  value={selectedRisk}
                  onChange={setSelectedRisk}
                  placeholder="All Risk Levels"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)]">
          {/* Results count bar */}
          {filteredApplications.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {displayedApplications.length} of {filteredApplications.length} application(s)
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Screening
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedApplications.map((app, index) => {
                  const sla = calculateSLARemaining(app.slaDeadline);
                  const applicantName =
                    app.applicant.fullName || app.applicant.legalName || "N/A";

                  return (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => router.push(`/compliance/applications/${app.id}`)}
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-2">
                        <Link
                          href={`/compliance/applications/${app.id}`}
                          className="block"
                        >
                          <div>
                            <p className="font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                              {applicantName}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {app.id}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {app.type}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            getStatusBadgeColor(app.status)
                          )}
                        >
                          {formatStatus(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            getRiskBadgeColor(app.riskBand)
                          )}
                        >
                          {app.riskBand}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <span className="text-sm text-gray-700">
                          {app.assignedOfficer || (
                            <span className="text-gray-400 italic">
                              Unassigned
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <div
                          className={cn(
                            "flex items-center gap-1.5 text-sm",
                            sla.isBreached && "text-red-600 font-medium",
                            sla.isUrgent && "text-orange-600 font-medium",
                            !sla.isBreached &&
                              !sla.isUrgent &&
                              "text-gray-600"
                          )}
                        >
                          {sla.isBreached ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          <span>
                            {sla.isBreached
                              ? "Overdue"
                              : `${sla.remaining} ${sla.unit}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            app.screeningStatus === "CLEAR" &&
                              "bg-green-100 text-green-700",
                            app.screeningStatus === "PENDING" &&
                              "bg-yellow-100 text-yellow-700",
                            app.screeningStatus === "HIT" &&
                              "bg-red-100 text-red-700"
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              app.screeningStatus === "CLEAR" && "bg-green-600",
                              app.screeningStatus === "PENDING" &&
                                "bg-yellow-600",
                              app.screeningStatus === "HIT" && "bg-red-600"
                            )}
                          ></span>
                          {app.screeningStatus}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <ApplicationActionsMenu
                          applicationId={app.id}
                          status={app.status}
                          onAction={handleApplicationAction}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria"
                  : "No applications available at the moment"}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
