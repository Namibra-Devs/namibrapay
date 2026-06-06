"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Download,
  Eye,
  Search,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  FileDown,
  MoreVertical,
  Upload,
} from "lucide-react";
import DashboardLayout from "@/components/compliance-officer/DashboardLayout";
import Card from "@/components/compliance-officer/shared/Card";
import Badge from "@/components/compliance-officer/shared/Badge";
import SearchBar from "@/components/compliance-officer/shared/SearchBar";
import Pagination from "@/components/compliance-officer/shared/Pagination";
import StatCard from "@/components/compliance-officer/shared/StatCard";
import Select from "@/components/ui/Select";
import { Document, DocumentStatus } from "@/types/compliance";
import { formatDate, DOCUMENT_TYPES } from "@/lib/compliance-utils";
import { MOCK_DOCUMENTS } from "@/lib/compliance-hub-mock-data";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State management
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingDocument, setVerifyingDocument] = useState<Document | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingDocument, setRejectingDocument] = useState<Document | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showRequestReuploadModal, setShowRequestReuploadModal] = useState(false);
  const [reuploadingDocument, setReuploadingDocument] = useState<Document | null>(null);
  const [reuploadReason, setReuploadReason] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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

  // Filter documents with useMemo
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.entityId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
      const matchesType = typeFilter === "ALL" || doc.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, searchQuery, statusFilter, typeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const displayedDocuments = useMemo(() => {
    return filteredDocuments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredDocuments, currentPage, itemsPerPage]);

  // Calculate stats
  const pendingCount = documents.filter((d) => d.status === "PENDING").length;
  const verifiedCount = documents.filter((d) => d.status === "VERIFIED").length;
  const expiredCount = documents.filter((d) => d.status === "EXPIRED").length;
  const expiringCount = documents.filter((d) => {
    if (!d.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

  // Handle view document
  const handleViewDocument = (doc: Document) => {
    setViewingDocument(doc);
    setShowViewModal(true);
  };

  // Handle verify document
  const handleVerifyClick = (doc: Document) => {
    setVerifyingDocument(doc);
    setShowVerifyModal(true);
  };

  const handleVerifyConfirm = async () => {
    if (!verifyingDocument) return;

    setShowVerifyModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDocuments(
        documents.map((doc) =>
          doc.id === verifyingDocument.id
            ? {
                ...doc,
                status: "VERIFIED" as DocumentStatus,
                verifiedBy: "Current User",
                verifiedAt: new Date().toISOString(),
              }
            : doc
        )
      );

      showToast("Document verified successfully!");
      setVerifyingDocument(null);
    } catch (error) {
      console.error("Failed to verify document:", error);
      showAlert("Failed to verify document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject document
  const handleRejectClick = (doc: Document) => {
    setRejectingDocument(doc);
    setRejectionNotes("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingDocument) return;

    if (!rejectionNotes.trim()) {
      showAlert("Please provide a reason for rejection");
      return;
    }

    setShowRejectModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDocuments(
        documents.map((doc) =>
          doc.id === rejectingDocument.id
            ? {
                ...doc,
                status: "REJECTED" as DocumentStatus,
                verifiedBy: "Current User",
                verifiedAt: new Date().toISOString(),
                verificationNotes: rejectionNotes,
              }
            : doc
        )
      );

      showToast("Document rejected successfully!");
      setRejectingDocument(null);
      setRejectionNotes("");
    } catch (error) {
      console.error("Failed to reject document:", error);
      showAlert("Failed to reject document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle download document
  const handleDownload = async (doc: Document) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulated download
      showToast(`Downloading ${doc.fileName}...`);

      // In a real app, this would trigger actual file download
      // const link = document.createElement('a');
      // link.href = doc.fileUrl;
      // link.download = doc.fileName;
      // link.click();
    } catch (error) {
      console.error("Failed to download document:", error);
      showAlert("Failed to download document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle request re-upload
  const handleRequestReuploadClick = (doc: Document) => {
    setReuploadingDocument(doc);
    setReuploadReason("");
    setShowRequestReuploadModal(true);
  };

  const handleRequestReuploadConfirm = async () => {
    if (!reuploadingDocument) return;

    if (!reuploadReason.trim()) {
      showAlert("Please provide a reason for requesting re-upload");
      return;
    }

    setShowRequestReuploadModal(false);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, this would:
      // 1. Notify applicant via email/SMS
      // 2. Update document status to PENDING_REUPLOAD
      // 3. Log in audit trail

      showToast(`Re-upload request sent for ${reuploadingDocument.fileName}`);
      setReuploadingDocument(null);
      setReuploadReason("");
    } catch (error) {
      console.error("Failed to request re-upload:", error);
      showAlert("Failed to send re-upload request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle export report
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const headers = [
        "Document ID",
        "File Name",
        "Type",
        "Entity ID",
        "Status",
        "Uploaded",
        "Expiry Date",
        "Verified By",
      ];
      const rows = filteredDocuments.map((doc) => [
        doc.id,
        doc.fileName,
        DOCUMENT_TYPES[doc.type as keyof typeof DOCUMENT_TYPES] || doc.type,
        doc.entityId,
        doc.status,
        new Date(doc.uploadedAt).toLocaleDateString(),
        doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "N/A",
        doc.verifiedBy || "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `documents-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast("Report exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      showAlert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL";

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "VERIFIED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      case "EXPIRED":
        return "error";
      default:
        return "neutral";
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
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

        {/* View Document Modal */}
        <AnimatePresence>
          {showViewModal && viewingDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => setShowViewModal(false)}
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
                      <FileText className="w-5 h-5 text-brand-teal" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Document Details</h2>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Document ID</p>
                      <p className="text-sm font-medium text-gray-900">{viewingDocument.id}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                      <Badge variant={getStatusColor(viewingDocument.status)} size="sm">
                        {viewingDocument.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">File Name</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDocument.fileName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {DOCUMENT_TYPES[viewingDocument.type as keyof typeof DOCUMENT_TYPES] || viewingDocument.type}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Entity ID</p>
                      <p className="text-sm font-medium text-brand-teal">{viewingDocument.entityId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Uploaded</p>
                      <p className="text-sm text-gray-900">{formatDate(viewingDocument.uploadedAt, true)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Expiry Date</p>
                      <p className="text-sm text-gray-900">
                        {viewingDocument.expiryDate ? formatDate(viewingDocument.expiryDate) : "N/A"}
                      </p>
                    </div>
                  </div>

                  {viewingDocument.verifiedBy && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Verified By</p>
                        <p className="text-sm text-gray-900">{viewingDocument.verifiedBy}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Verified At</p>
                        <p className="text-sm text-gray-900">
                          {viewingDocument.verifiedAt ? formatDate(viewingDocument.verifiedAt, true) : "N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  {viewingDocument.verificationNotes && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800 uppercase font-semibold mb-1">Verification Notes</p>
                      <p className="text-sm text-yellow-900">{viewingDocument.verificationNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  {viewingDocument.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          setShowViewModal(false);
                          handleVerifyClick(viewingDocument);
                        }}
                        className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Verify
                      </button>
                      <button
                        onClick={() => {
                          setShowViewModal(false);
                          handleRejectClick(viewingDocument);
                        }}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {(viewingDocument.status === "REJECTED" || viewingDocument.status === "EXPIRED") && (
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleRequestReuploadClick(viewingDocument);
                      }}
                      className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Request Re-upload
                    </button>
                  )}
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verify Document Modal */}
        <AnimatePresence>
          {showVerifyModal && verifyingDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowVerifyModal(false)}
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
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Verify Document</h2>
                  <button
                    onClick={() => !isProcessing && setShowVerifyModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <p className="text-sm text-green-900">
                    Are you sure you want to verify <strong>{verifyingDocument.fileName}</strong>? This will mark the document as verified and approved.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowVerifyModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Verify Document
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reject Document Modal */}
        <AnimatePresence>
          {showRejectModal && rejectingDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowRejectModal(false)}
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
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Reject Document</h2>
                  <button
                    onClick={() => !isProcessing && setShowRejectModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-4">
                    Please provide a reason for rejecting <strong>{rejectingDocument.fileName}</strong>:
                  </p>
                  <textarea
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="E.g., Document is illegible, information is incomplete, dates are not recent..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    autoFocus
                  />
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-xs text-red-800">
                    The applicant will be notified and asked to resubmit the document.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject Document
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Request Re-upload Modal */}
        <AnimatePresence>
          {showRequestReuploadModal && reuploadingDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
              onClick={() => !isProcessing && setShowRequestReuploadModal(false)}
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
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Request Re-upload</h2>
                  <button
                    onClick={() => !isProcessing && setShowRequestReuploadModal(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-4">
                    Request the applicant to re-upload <strong>{reuploadingDocument.fileName}</strong>. They will be notified via email/SMS.
                  </p>
                  <textarea
                    value={reuploadReason}
                    onChange={(e) => setReuploadReason(e.target.value)}
                    placeholder="E.g., Document is expired, please submit an updated version..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    autoFocus
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-xs text-blue-800">
                    The applicant will receive a notification with your message and instructions to upload a new document.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRequestReuploadModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestReuploadConfirm}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Send Request
                      </>
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
            <h1 className="text-2xl font-heading font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all compliance documents</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredDocuments.length === 0}
            className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Report
              </>
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Verification"
            value={pendingCount}
            icon={Clock}
            color="peach"
          />
          <StatCard
            title="Verified Documents"
            value={verifiedCount}
            icon={CheckCircle2}
            color="teal"
          />
          <StatCard
            title="Expiring Soon"
            value={expiringCount}
            icon={AlertTriangle}
            color="lavender"
          />
          <StatCard
            title="Expired"
            value={expiredCount}
            icon={AlertTriangle}
            color="pink"
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
                  placeholder="Search by filename, ID, or entity..."
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
              <div className="flex gap-3">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-full md:w-44"
                  options={[
                    { value: "ALL", label: "All Status" },
                    { value: "PENDING", label: "Pending" },
                    { value: "VERIFIED", label: "Verified" },
                    { value: "REJECTED", label: "Rejected" },
                    { value: "EXPIRED", label: "Expired" },
                  ]}
                />
                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  className="w-full md:w-66"
                  options={[
                    { value: "ALL", label: "All Types" },
                    ...Object.entries(DOCUMENT_TYPES).map(([key, label]) => ({
                      value: key,
                      label: label,
                    })),
                  ]}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Documents Table */}
        <Card padding="none">
          {/* Results count bar */}
          {filteredDocuments.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {displayedDocuments.length} of {filteredDocuments.length} document(s)
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          )}

          {filteredDocuments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedDocuments.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-brand-teal" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.fileName}</p>
                          <p className="text-xs text-gray-500">{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {DOCUMENT_TYPES[doc.type as keyof typeof DOCUMENT_TYPES] || doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-brand-teal hover:text-brand-teal/80 cursor-pointer">
                        {doc.entityId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(doc.status)} size="sm">
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600">{formatDate(doc.uploadedAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.expiryDate ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">
                            {formatDate(doc.expiryDate)}
                          </span>
                          {isExpiringSoon(doc.expiryDate) && (
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                          )}
                          {doc.status === "EXPIRED" && (
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === doc.id ? null : doc.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {openDropdownId === doc.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                              onMouseLeave={() => setOpenDropdownId(null)}
                            >
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleViewDocument(doc);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleDownload(doc);
                                }}
                                disabled={isProcessing}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                              
                              {doc.status === "PENDING" && (
                                <>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() => {
                                      setOpenDropdownId(null);
                                      handleVerifyClick(doc);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 transition-colors"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Verify
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenDropdownId(null);
                                      handleRejectClick(doc);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                              
                              {(doc.status === "REJECTED" || doc.status === "EXPIRED") && (
                                <>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() => {
                                      setOpenDropdownId(null);
                                      handleRequestReuploadClick(doc);
                                    }}
                                    disabled={isProcessing}
                                    className="w-full px-4 py-2 text-left text-sm text-orange-700 hover:bg-orange-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Upload className="w-4 h-4" />
                                    Request Re-upload
                                  </button>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

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
        </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria"
                  : "No documents available at the moment"}
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
