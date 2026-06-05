"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  FileDown,
  X,
  Loader2,
  Eye,
  User,
  FileText,
  Shield,
  Settings as SettingsIcon,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Select from "@/components/ui/Select";
import Pagination from "@/components/compliance/shared/Pagination";
import { formatDate } from "@/lib/compliance-utils";

// Audit event type
interface AuditEvent {
  id: string;
  actor: string;
  role: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: string;
  ipAddress: string;
  justification?: string;
}

// Mock audit data
const mockAuditEvents: AuditEvent[] = [
  {
    id: "AUD-2024-001",
    actor: "Jane Mensah",
    role: "Compliance Officer",
    action: "APPROVED_APPLICATION",
    targetType: "APPLICATION",
    targetId: "APP-2024-045",
    beforeValue: "UNDER_REVIEW",
    afterValue: "APPROVED",
    timestamp: "2026-06-05T10:30:00Z",
    ipAddress: "192.168.1.45",
    justification: "All documents verified, screening clear",
  },
  {
    id: "AUD-2024-002",
    actor: "John Mensah",
    role: "Senior Compliance Officer",
    action: "UPDATED_RISK_RULE",
    targetType: "RISK_RULE",
    targetId: "RULE-003",
    beforeValue: '{"weight": 15}',
    afterValue: '{"weight": 20}',
    timestamp: "2026-06-05T09:15:00Z",
    ipAddress: "192.168.1.32",
    justification: "Adjusted weight based on regulatory update",
  },
  {
    id: "AUD-2024-003",
    actor: "Mary Adu",
    role: "Compliance Officer",
    action: "REJECTED_APPLICATION",
    targetType: "APPLICATION",
    targetId: "APP-2024-038",
    beforeValue: "UNDER_REVIEW",
    afterValue: "REJECTED",
    timestamp: "2026-06-05T08:45:00Z",
    ipAddress: "192.168.1.28",
    justification: "Incomplete documentation, multiple discrepancies",
  },
  {
    id: "AUD-2024-004",
    actor: "Peter Owusu",
    role: "Compliance Officer",
    action: "VERIFIED_DOCUMENT",
    targetType: "DOCUMENT",
    targetId: "DOC-2024-122",
    beforeValue: "PENDING",
    afterValue: "VERIFIED",
    timestamp: "2026-06-04T16:20:00Z",
    ipAddress: "192.168.1.19",
  },
  {
    id: "AUD-2024-005",
    actor: "Jane Mensah",
    role: "Compliance Officer",
    action: "CREATED_CASE",
    targetType: "CASE",
    targetId: "CASE-2024-008",
    afterValue: "OPEN",
    timestamp: "2026-06-04T14:55:00Z",
    ipAddress: "192.168.1.45",
    justification: "Suspicious transaction pattern detected",
  },
  {
    id: "AUD-2024-006",
    actor: "Kwame Asante",
    role: "MLRO",
    action: "SIGNED_REPORT",
    targetType: "REPORT",
    targetId: "REP-2024-Q2",
    beforeValue: "DRAFT",
    afterValue: "FINALIZED",
    timestamp: "2026-06-04T11:30:00Z",
    ipAddress: "192.168.1.10",
    justification: "Quarterly compliance report approved",
  },
];

export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [targetTypeFilter, setTargetTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 15;

  // Get unique actors for filter
  const uniqueActors = useMemo(() => {
    return Array.from(new Set(mockAuditEvents.map((e) => e.actor)));
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return mockAuditEvents.filter((event) => {
      const matchesSearch =
        event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.action.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesActor = actorFilter === "ALL" || event.actor === actorFilter;
      const matchesAction = actionFilter === "ALL" || event.action === actionFilter;
      const matchesTargetType = targetTypeFilter === "ALL" || event.targetType === targetTypeFilter;

      return matchesSearch && matchesActor && matchesAction && matchesTargetType;
    });
  }, [searchQuery, actorFilter, actionFilter, targetTypeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actorFilter, actionFilter, targetTypeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const displayedEvents = useMemo(() => {
    return filteredEvents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredEvents, currentPage]);

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const headers = ["ID", "Actor", "Role", "Action", "Target Type", "Target ID", "Timestamp", "IP Address"];
      const rows = filteredEvents.map((event) => [
        event.id,
        event.actor,
        event.role,
        event.action.replace(/_/g, " "),
        event.targetType,
        event.targetId,
        new Date(event.timestamp).toLocaleString(),
        event.ipAddress,
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split("T")[0]}.csv`;
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

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setActorFilter("ALL");
    setActionFilter("ALL");
    setTargetTypeFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery || actorFilter !== "ALL" || actionFilter !== "ALL" || targetTypeFilter !== "ALL";

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes("APPLICATION")) return FileText;
    if (action.includes("USER") || action.includes("OFFICER")) return User;
    if (action.includes("RISK") || action.includes("RULE")) return Shield;
    return SettingsIcon;
  };

  // Get action color
  const getActionColor = (action: string) => {
    if (action.includes("APPROVED") || action.includes("VERIFIED")) return "text-green-600 bg-green-50";
    if (action.includes("REJECTED") || action.includes("DELETED")) return "text-red-600 bg-red-50";
    if (action.includes("CREATED") || action.includes("ADDED")) return "text-blue-600 bg-blue-50";
    if (action.includes("UPDATED") || action.includes("MODIFIED")) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
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
              className="fixed top-4 right-4 z-50 bg-brand-teal text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <FileDown className="w-4 h-4" />
              <span className="text-sm font-medium">Export completed successfully!</span>
              <button
                onClick={() => setShowExportSuccess(false)}
                className="ml-2 hover:bg-brand-teal/80 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Audit Trail</h1>
            <p className="text-gray-500 mt-1">
              {filteredEvents.length} event(s) {hasActiveFilters && "matching filters"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              <Shield className="w-3 h-3 inline mr-1" />
              Read-only • Immutable log
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredEvents.length === 0}
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
                Export Log
              </>
            )}
          </button>
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
                    placeholder="Search by ID, actor, action, target..."
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

              {/* Actor Filter */}
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Actors" },
                    ...uniqueActors.map((actor) => ({ value: actor, label: actor })),
                  ]}
                  value={actorFilter}
                  onChange={setActorFilter}
                  placeholder="All Actors"
                />
              </div>

              {/* Action Filter */}
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Actions" },
                    { value: "APPROVED_APPLICATION", label: "Approved Application" },
                    { value: "REJECTED_APPLICATION", label: "Rejected Application" },
                    { value: "CREATED_CASE", label: "Created Case" },
                    { value: "UPDATED_RISK_RULE", label: "Updated Risk Rule" },
                    { value: "VERIFIED_DOCUMENT", label: "Verified Document" },
                    { value: "SIGNED_REPORT", label: "Signed Report" },
                  ]}
                  value={actionFilter}
                  onChange={setActionFilter}
                  placeholder="All Actions"
                />
              </div>
            </div>

            {/* Target Type Filter - Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select
                  options={[
                    { value: "ALL", label: "All Target Types" },
                    { value: "APPLICATION", label: "Application" },
                    { value: "CASE", label: "Case" },
                    { value: "DOCUMENT", label: "Document" },
                    { value: "RISK_RULE", label: "Risk Rule" },
                    { value: "REPORT", label: "Report" },
                    { value: "USER", label: "User" },
                  ]}
                  value={targetTypeFilter}
                  onChange={setTargetTypeFilter}
                  placeholder="All Target Types"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
          {/* Results count bar */}
          {filteredEvents.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {displayedEvents.length} of {filteredEvents.length} event(s)
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedEvents.map((event, index) => {
                  const Icon = getActionIcon(event.action);
                  
                  return (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-900">
                          {formatDate(event.timestamp, true)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{event.actor}</p>
                          <p className="text-xs text-gray-500">{event.role}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getActionColor(event.action)}`}>
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {event.action.replace(/_/g, " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.targetId}</p>
                          <p className="text-xs text-gray-500">{event.targetType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-gray-600 font-mono">{event.ipAddress}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDetailModal(true);
                          }}
                          className="inline-flex items-center gap-1 text-brand-teal hover:text-brand-teal/80 font-medium text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No audit events found
              </h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria"
                  : "No audit events available"}
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

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedEvent && (
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
                        Audit Event Details
                      </h2>
                      <p className="text-gray-600 mt-1">{selectedEvent.id}</p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Actor</label>
                      <p className="text-gray-900 mt-1 font-semibold">{selectedEvent.actor}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedEvent.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Timestamp</label>
                      <p className="text-gray-900 mt-1">{formatDate(selectedEvent.timestamp, true)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Action</label>
                    <p className="text-gray-900 mt-1 font-semibold">
                      {selectedEvent.action.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Target Type</label>
                      <p className="text-gray-900 mt-1">{selectedEvent.targetType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Target ID</label>
                      <p className="text-gray-900 mt-1 font-mono text-sm">{selectedEvent.targetId}</p>
                    </div>
                  </div>

                  {selectedEvent.beforeValue && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Before Value</label>
                      <pre className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg text-xs font-mono overflow-x-auto">
                        {selectedEvent.beforeValue}
                      </pre>
                    </div>
                  )}

                  {selectedEvent.afterValue && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">After Value</label>
                      <pre className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg text-xs font-mono overflow-x-auto">
                        {selectedEvent.afterValue}
                      </pre>
                    </div>
                  )}

                  {selectedEvent.justification && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Justification</label>
                      <p className="text-gray-900 mt-1">{selectedEvent.justification}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">IP Address</label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">{selectedEvent.ipAddress}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>This audit entry is immutable and tamper-evident</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors text-sm font-medium"
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
