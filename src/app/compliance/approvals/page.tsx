"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  User,
  X,
  Loader2,
  Shield,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/compliance-officer/DashboardLayout";
import Link from "next/link";
import Select from "@/components/ui/Select";
import Pagination from "@/components/compliance-officer/shared/Pagination";
import StatCard from "@/components/compliance-officer/shared/StatCard";
import { cn, formatDate, calculateSLARemaining } from "@/lib/compliance-utils";
import { useRBAC } from "@/contexts/RBACContext";

// Pending approval type
interface PendingApproval {
  id: string;
  applicationId: string;
  applicantName: string;
  action: "APPROVE" | "REJECT";
  initiatedBy: string;
  initiatedAt: string;
  riskScore: number;
  riskBand: "LOW" | "MEDIUM" | "HIGH";
  amount: number;
  reason: string;
  slaDeadline: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

// Mock pending approvals
const mockApprovals: PendingApproval[] = [
  {
    id: "APV-2024-001",
    applicationId: "APP-2024-045",
    applicantName: "Global Tech Ventures Ltd",
    action: "APPROVE",
    initiatedBy: "Peter Owusu (CO)",
    initiatedAt: "2026-06-05T09:00:00Z",
    riskScore: 78,
    riskBand: "HIGH",
    amount: 1500000,
    reason: "All documents verified, business model validated, high transaction volume justified",
    slaDeadline: "2026-06-06T09:00:00Z",
    status: "PENDING",
  },
  {
    id: "APV-2024-002",
    applicationId: "APP-2024-052",
    applicantName: "Premium Import/Export Co",
    action: "APPROVE",
    initiatedBy: "Mary Adu (CO)",
    initiatedAt: "2026-06-04T14:30:00Z",
    riskScore: 85,
    riskBand: "HIGH",
    amount: 3200000,
    reason: "High-value merchant, enhanced due diligence completed, legitimate cross-border trade",
    slaDeadline: "2026-06-05T14:30:00Z",
    status: "PENDING",
  },
  {
    id: "APV-2024-003",
    applicationId: "APP-2024-048",
    applicantName: "Remittance Express Ghana",
    action: "REJECT",
    initiatedBy: "John Mensah (CO)",
    initiatedAt: "2026-06-04T11:00:00Z",
    riskScore: 92,
    riskBand: "HIGH",
    amount: 5000000,
    reason: "Multiple red flags: inconsistent business documentation, beneficial owner screening hit, suspected structuring pattern",
    slaDeadline: "2026-06-05T11:00:00Z",
    status: "PENDING",
  },
];

export default function ApprovalsQueuePage() {
  const { user, hasPermission } = useRBAC();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvals, setApprovals] = useState<PendingApproval[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [authNote, setAuthNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const itemsPerPage = 10;

  // Calculate stats
  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;
  const approvedCount = approvals.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = approvals.filter((a) => a.status === "REJECTED").length;
  const urgentCount = approvals.filter((a) => {
    const sla = calculateSLARemaining(a.slaDeadline);
    return a.status === "PENDING" && (sla.isUrgent || sla.isBreached);
  }).length;

  // Show success
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Filter approvals
  const filteredApprovals = useMemo(() => {
    return approvals.filter((approval) => {
      const matchesSearch =
        approval.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        approval.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAction = actionFilter === "ALL" || approval.action === actionFilter;
      const matchesStatus = statusFilter === "ALL" || approval.status === statusFilter;

      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [approvals, searchQuery, actionFilter, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const displayedApprovals = useMemo(() => {
    return filteredApprovals.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredApprovals, currentPage]);

  // Handle authorization
  const handleAuthorize = async (decision: "APPROVED" | "REJECTED") => {
    if (!authNote.trim()) {
      alert("Please provide authorization notes");
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setApprovals(approvals.map((a) =>
      a.id === selectedApproval?.id ? { ...a, status: decision } : a
    ));
    
    showSuccess(`Authorization ${decision.toLowerCase()} - Application ${selectedApproval?.applicationId} ${decision === "APPROVED" ? "approved" : "rejected"}`);
    setShowDetailModal(false);
    setAuthNote("");
    setProcessing(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("ALL");
    setStatusFilter("PENDING");
  };

  const hasActiveFilters = searchQuery || actionFilter !== "ALL" || statusFilter !== "PENDING";

  // Get risk badge color
  const getRiskColor = (band: string) => {
    switch (band) {
      case "HIGH": return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
              <button onClick={() => setShowSuccessToast(false)} className="ml-2 hover:bg-green-700 rounded p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-navy">Maker-Checker Approvals</h1>
          <p className="text-gray-500 mt-1">
            High-risk applications requiring senior authorization
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">
              Four-Eyes Principle: Applications with risk score &gt; 70 require secondary approval
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Pending Authorization" value={pendingCount} icon={Clock} color="peach" />
          <StatCard title="Urgent (SLA)" value={urgentCount} icon={AlertTriangle} color="pink" />
          <StatCard title="Authorized Today" value={approvedCount} icon={CheckCircle} color="teal" />
          <StatCard title="Rejected Today" value={rejectedCount} icon={XCircle} color="lavender" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] border border-gray-200/70 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-brand-teal hover:text-brand-teal/80 font-medium transition-colors flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, applicant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <Select options={[{ value: "ALL", label: "All Actions" }, { value: "APPROVE", label: "Approve" }, { value: "REJECT", label: "Reject" }]} value={actionFilter} onChange={setActionFilter} placeholder="All Actions" />
              </div>
              <div>
                <Select options={[{ value: "ALL", label: "All Status" }, { value: "PENDING", label: "Pending" }, { value: "APPROVED", label: "Authorized" }, { value: "REJECTED", label: "Rejected" }]} value={statusFilter} onChange={setStatusFilter} placeholder="Status" />
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)]">
          {filteredApprovals.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">Showing {displayedApprovals.length} of {filteredApprovals.length} approval(s)</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Application</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Risk</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Initiated By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">SLA</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedApprovals.map((approval, index) => {
                  const sla = calculateSLARemaining(approval.slaDeadline);
                  return (
                    <motion.tr key={approval.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <Link href={`/compliance/applications/${approval.applicationId}`} className="block">
                          <p className="font-medium text-brand-navy hover:text-brand-teal transition-colors">{approval.applicantName}</p>
                          <p className="text-xs text-gray-500">{approval.applicationId}</p>
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${approval.action === "APPROVE" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                          {approval.action}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(approval.riskBand)}`}>
                          {approval.riskBand} ({approval.riskScore})
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{approval.initiatedBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className={cn("flex items-center gap-1.5 text-sm", sla.isBreached && "text-red-600 font-medium", sla.isUrgent && "text-orange-600 font-medium", !sla.isBreached && !sla.isUrgent && "text-gray-600")}>
                          <Clock className="w-4 h-4" />
                          <span>{sla.isBreached ? "Overdue" : `${sla.remaining} ${sla.unit}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${approval.status === "PENDING" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : approval.status === "APPROVED" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
                          {approval.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        {approval.status === "PENDING" && (
                          <button onClick={() => { setSelectedApproval(approval); setShowDetailModal(true); setAuthNote(""); }} className="text-brand-teal hover:text-brand-teal/80 text-sm font-medium">
                            <Eye className="w-4 h-4 inline mr-1" />Review
                          </button>
                        )}
                        {approval.status !== "PENDING" && <span className="text-xs text-gray-400">Completed</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredApprovals.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending approvals</h3>
              <p className="text-gray-500">All high-risk applications have been authorized</p>
            </div>
          )}

          {totalPages > 1 && <div className="px-6 py-4 border-t"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>}
        </div>

        {/* Authorization Modal */}
        <AnimatePresence>
          {showDetailModal && selectedApproval && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Maker-Checker Authorization</h2>
                      <p className="text-gray-600 mt-1">{selectedApproval.id}</p>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">High-Risk Application Requires Your Authorization</p>
                      <p className="text-xs text-amber-700 mt-1">This application has a risk score of {selectedApproval.riskScore}, requiring secondary approval from a Senior Officer or MLRO.</p>
                    </div>
                  </div>

                  {/* Permission Check */}
                  {!hasPermission("APPROVE_MAKER_CHECKER") && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Insufficient Authorization Rights</p>
                        <p className="text-xs text-red-700 mt-1">Your role ({user.role}) does not have maker-checker authorization privileges. Only Senior Officers and MLROs can authorize high-risk applications.</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Applicant</label>
                    <p className="text-gray-900 mt-1 text-lg font-semibold">{selectedApproval.applicantName}</p>
                    <Link href={`/compliance/applications/${selectedApproval.applicationId}`} className="text-sm text-brand-teal hover:underline mt-1 inline-block">{selectedApproval.applicationId} →</Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Requested Action</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${selectedApproval.action === "APPROVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {selectedApproval.action}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Risk Assessment</label>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${getRiskColor(selectedApproval.riskBand)}`}>
                          {selectedApproval.riskBand} ({selectedApproval.riskScore}/100)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Expected Monthly Volume</label>
                    <p className="text-gray-900 mt-1 font-bold text-lg">GHS {selectedApproval.amount.toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Initiated By</label>
                    <p className="text-gray-900 mt-1">{selectedApproval.initiatedBy}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(selectedApproval.initiatedAt, true)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Justification</label>
                    <p className="text-gray-700 mt-1 text-sm p-3 bg-gray-50 rounded-lg">{selectedApproval.reason}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Authorization Notes *</label>
                    <textarea value={authNote} onChange={(e) => setAuthNote(e.target.value)} rows={3} placeholder="Provide your authorization notes..." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button onClick={() => handleAuthorize("APPROVED")} disabled={processing || !authNote.trim() || !hasPermission("APPROVE_MAKER_CHECKER")} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {processing ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : <><CheckCircle className="w-4 h-4" />Authorize Approval</>}
                    </button>
                    <button onClick={() => handleAuthorize("REJECTED")} disabled={processing || !authNote.trim() || !hasPermission("APPROVE_MAKER_CHECKER")} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {processing ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : <><XCircle className="w-4 h-4" />Reject Authorization</>}
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
