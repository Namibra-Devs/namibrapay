"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  MessageSquare,
  History,
  Loader2,
  X,
  Save,
  Check,
  Upload,
  Edit,
  Lock,
  Pause,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Link from "next/link";
import Select from "@/components/ui/Select";
import {
  cn,
  formatDate,
  calculateSLARemaining,
  formatStatus,
  getRiskBadgeColor,
  getStatusBadgeColor,
  DOCUMENT_TYPES,
  REJECTION_REASONS,
} from "@/lib/compliance-utils";
import { useRBAC } from "@/contexts/RBACContext";

// Mock data for a single application
const mockApplication = {
  id: "APP-2024-001",
  type: "BUSINESS" as const,
  status: "UNDER_REVIEW" as const,
  riskScore: 65,
  riskBand: "MEDIUM" as const,
  assignedOfficer: "Jane Mensah",
  submittedAt: "2026-06-02T14:30:00Z",
  slaDeadline: "2026-06-04T14:30:00Z",
  screeningStatus: "PENDING" as const,
  applicant: {
    legalName: "Kwame Tech Solutions Ltd",
    tradingName: "KTS Digital",
    businessType: "Limited Liability Company",
    registrationNumber: "CS-123456",
    dateOfIncorporation: "2020-05-15",
    registeredAddress: "123 Independence Ave, Accra, Ghana",
    operatingAddress: "123 Independence Ave, Accra, Ghana",
    industry: "E-commerce Technology",
    website: "https://www.kwametech.com",
    phone: "+233244123456",
    email: "info@kwametech.com",
    tin: "C0012345678",
    expectedMonthlyVolume: 150000,
    intendedChannels: ["Mobile Money", "Bank Transfer", "Card Payments"],
  },
  documents: [
    {
      id: "DOC-001",
      type: "BUSINESS_REG",
      status: "VERIFIED" as "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED",
      uploadedAt: "2026-06-02T14:35:00Z",
      fileName: "business_registration.pdf",
      fileSize: 245678,
    },
    {
      id: "DOC-002",
      type: "TAX_CERT",
      status: "PENDING" as "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED",
      uploadedAt: "2026-06-02T14:36:00Z",
      fileName: "tax_certificate.pdf",
      fileSize: 189234,
    },
    {
      id: "DOC-003",
      type: "DIRECTORS_ID",
      status: "PENDING" as "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED",
      uploadedAt: "2026-06-02T14:38:00Z",
      fileName: "director_id.pdf",
      fileSize: 567890,
    },
  ],
  beneficialOwners: [
    {
      id: "BO-001",
      name: "Kwame Mensah",
      dateOfBirth: "1985-03-20",
      nationality: "Ghanaian",
      ownershipPercent: 60,
      role: "DIRECTOR" as const,
      screeningStatus: "CLEAR" as const,
    },
    {
      id: "BO-002",
      name: "Abena Osei",
      dateOfBirth: "1988-07-12",
      nationality: "Ghanaian",
      ownershipPercent: 40,
      role: "SHAREHOLDER" as const,
      screeningStatus: "PENDING" as const,
    },
  ],
  notes: [
    {
      id: "NOTE-001",
      content: "Initial review completed. Tax certificate needs verification.",
      author: "CO-001",
      authorName: "Jane Mensah",
      createdAt: "2026-06-03T09:15:00Z",
      isInternal: true,
    },
  ],
  auditTrail: [
    {
      id: "AUDIT-001",
      actor: "CO-001",
      actorName: "Jane Mensah",
      action: "Application submitted",
      targetType: "APPLICATION",
      targetId: "APP-2024-001",
      timestamp: "2026-06-02T14:30:00Z",
    },
    {
      id: "AUDIT-002",
      actor: "CO-001",
      actorName: "Jane Mensah",
      action: "Assigned to officer",
      targetType: "APPLICATION",
      targetId: "APP-2024-001",
      timestamp: "2026-06-03T09:00:00Z",
    },
  ],
};

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const { hasPermission, canApprove, requiresMakerChecker } = useRBAC();
  const [activeTab, setActiveTab] = useState("info");
  const [showDecisionPanel, setShowDecisionPanel] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [decisionNote, setDecisionNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(true);
  const [notes, setNotes] = useState(mockApplication.notes);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [documents, setDocuments] = useState(mockApplication.documents);
  const [riskOverride, setRiskOverride] = useState<number | null>(null);
  const [overrideJustification, setOverrideJustification] = useState("");
  const [showRiskOverride, setShowRiskOverride] = useState(false);

  const sla = calculateSLARemaining(mockApplication.slaDeadline);

  const tabs = [
    { id: "info", label: "Information", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "screening", label: "Screening", icon: Shield },
    { id: "risk", label: "Risk Assessment", icon: AlertTriangle },
    { id: "notes", label: `Notes (${notes.length})`, icon: MessageSquare },
    { id: "audit", label: "Audit Trail", icon: History },
  ];

  // Show success toast
  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  }, []);

  // Handle decision submission
  const handleDecision = async () => {
    if (!decisionNote.trim()) return;
    if (selectedAction === "reject" && !rejectionReason) {
      alert("Please select a rejection reason");
      return;
    }

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      
      const actionMessages: Record<string, string> = {
        approve: "Application approved successfully!",
        reject: "Application rejected successfully!",
        request_info: "Information request sent to applicant!",
        escalate: "Application escalated to senior officer!",
      };
      
      showSuccess(actionMessages[selectedAction] || "Action completed!");
      setShowDecisionPanel(false);
      setDecisionNote("");
      setRejectionReason("");
      setSelectedAction("");
    } catch (error) {
      alert("Action failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Add note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const note = {
      id: `NOTE-${Date.now()}`,
      content: newNote,
      author: "CO-001",
      authorName: "Current Officer",
      createdAt: new Date().toISOString(),
      isInternal: isInternalNote,
    };

    setNotes([...notes, note]);
    setNewNote("");
    showSuccess("Note added successfully!");
  };

  // Handle document verification
  const handleDocumentAction = async (docId: string, action: "verify" | "reject") => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId
          ? { ...doc, status: action === "verify" ? "VERIFIED" : "REJECTED" as any }
          : doc
      )
    );
    showSuccess(`Document ${action === "verify" ? "verified" : "rejected"} successfully!`);
  };

  // Download document (simulated)
  const handleDocumentDownload = (doc: any) => {
    showSuccess(`Downloading ${doc.fileName}...`);
    // In real implementation, this would trigger actual file download
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
              className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span className="text-sn font-medium">{successMessage}</span>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/compliance/applications"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-start"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-brand-navy truncate">
              {mockApplication.applicant.legalName}
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">{mockApplication.id}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border",
                getStatusBadgeColor(mockApplication.status)
              )}
            >
              {formatStatus(mockApplication.status)}
            </span>
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border",
                getRiskBadgeColor(mockApplication.riskBand)
              )}
            >
              {mockApplication.riskBand} RISK
            </span>
          </div>
        </div>

        {/* SLA Alert */}
        {sla.isUrgent && !sla.isBreached && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3"
          >
            <Clock className="w-4 h-4 text-orange-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900">
                SLA Deadline Approaching
              </p>
              <p className="text-sm text-orange-700">
                {sla.remaining} {sla.unit} remaining until deadline
              </p>
            </div>
          </motion.div>
        )}

        {sla.isBreached && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">SLA Breached</p>
              <p className="text-sm text-red-700">
                This application is overdue by {sla.remaining} {sla.unit}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200">
              <div className="border-b border-gray-100 px-6">
                <div className="flex gap-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-4 text-sm border-b-2 transition-colors whitespace-nowrap",
                          activeTab === tab.id
                            ? "border-brand-teal text-brand-teal font-medium"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Information Tab */}
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-brand-navy mb-4">
                        Business Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            Legal Name
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {mockApplication.applicant.legalName}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            Trading Name
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {mockApplication.applicant.tradingName}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            Registration Number
                          </label>
                          <p className="mt-1 text-sm text-gray-900 font-mono">
                            {mockApplication.applicant.registrationNumber}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            TIN
                          </label>
                          <p className="mt-1 text-sm text-gray-900 font-mono">
                            {mockApplication.applicant.tin}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            Date of Incorporation
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatDate(mockApplication.applicant.dateOfIncorporation || "")}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            Industry
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {mockApplication.applicant.industry}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-medium text-gray-500 uppercase">
                            Registered Address
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {mockApplication.applicant.registeredAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-lg font-semibold text-brand-navy mb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <label className="text-xs font-medium text-gray-500">
                              Email
                            </label>
                            <p className="text-sm text-gray-900">
                              {mockApplication.applicant.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <label className="text-xs font-medium text-gray-500">
                              Phone
                            </label>
                            <p className="text-sm text-gray-900">
                              {mockApplication.applicant.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-lg font-semibold text-brand-navy mb-4">
                        Beneficial Owners
                      </h3>
                      <div className="space-y-3">
                        {mockApplication.beneficialOwners.map((owner) => (
                          <div
                            key={owner.id}
                            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {owner.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {owner.role} • {owner.ownershipPercent}% ownership
                              </p>
                            </div>
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium",
                                owner.screeningStatus === "CLEAR" &&
                                  "bg-green-100 text-green-700",
                                owner.screeningStatus === "PENDING" &&
                                  "bg-yellow-100 text-yellow-700"
                              )}
                            >
                              {owner.screeningStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-brand-teal/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-brand-teal" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {DOCUMENT_TYPES[doc.type] || doc.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {doc.fileName} • Uploaded {formatDate(doc.uploadedAt, true)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium",
                                doc.status === "VERIFIED" &&
                                  "bg-green-100 text-green-700 border border-green-200",
                                doc.status === "PENDING" &&
                                  "bg-yellow-100 text-yellow-700 border border-yellow-200",
                                doc.status === "REJECTED" &&
                                  "bg-red-100 text-red-700 border border-red-200"
                              )}
                            >
                              {doc.status}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => alert(`Viewing ${doc.fileName}`)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="View document"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDocumentDownload(doc)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Download document"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Document actions */}
                        {doc.status === "PENDING" && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => handleDocumentAction(doc.id, "verify")}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Verify
                            </button>
                            <button
                              onClick={() => handleDocumentAction(doc.id, "reject")}
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {documents.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Documents
                        </h3>
                        <p className="text-gray-500">
                          No documents have been uploaded yet
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Screening Tab */}
                {activeTab === "screening" && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Screening In Progress
                      </h3>
                      <p className="text-gray-500">
                        Sanctions and PEP screening is being processed
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Screening Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Business Entity:</span>
                          <span className="font-medium text-blue-900">{mockApplication.screeningStatus}</span>
                        </div>
                        {mockApplication.beneficialOwners.map((owner) => (
                          <div key={owner.id} className="flex justify-between">
                            <span className="text-blue-700">{owner.name}:</span>
                            <span className="font-medium text-blue-900">{owner.screeningStatus}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Assessment Tab */}
                {activeTab === "risk" && (
                  <div className="space-y-6">
                    {/* Current Risk Score */}
                    <div>
                      <h3 className="text-lg font-semibold text-brand-navy mb-4">
                        Risk Assessment
                      </h3>
                      
                      <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Current Risk Score</p>
                            <p className="text-4xl font-bold text-brand-navy">
                              {riskOverride || mockApplication.riskScore}
                              <span className="text-lg text-gray-500">/100</span>
                            </p>
                          </div>
                          <span
                            className={cn(
                              "px-4 py-2 rounded-xl text-lg font-bold border-2",
                              getRiskBadgeColor(mockApplication.riskBand)
                            )}
                          >
                            {mockApplication.riskBand}
                          </span>
                        </div>
                        
                        {riskOverride && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm text-orange-600 font-medium flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Risk score has been manually overridden
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Original: {mockApplication.riskScore}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Contributing Risk Factors</h4>
                      <div className="space-y-2">
                        {[
                          { factor: "Industry Type", score: 15, weight: "15%" },
                          { factor: "Expected Volume", score: 20, weight: "20%" },
                          { factor: "Geographic Location", score: 10, weight: "10%" },
                          { factor: "Business Age", score: 5, weight: "5%" },
                          { factor: "Beneficial Ownership", score: 15, weight: "15%" },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{item.factor}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">{item.weight}</span>
                              <span className="text-sm font-semibold text-gray-900">{item.score} pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Override Section */}
                    {hasPermission("OVERRIDE_RISK") && (
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setShowRiskOverride(!showRiskOverride)}
                          className="flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {riskOverride ? "Edit Risk Override" : "Override Risk Score"}
                        </button>
                        
                        {showRiskOverride && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Risk Score (0-100)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={riskOverride || mockApplication.riskScore}
                                onChange={(e) => setRiskOverride(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Justification (Required)
                              </label>
                              <textarea
                                value={overrideJustification}
                                onChange={(e) => setOverrideJustification(e.target.value)}
                                rows={3}
                                placeholder="Explain why you are overriding the risk score..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setShowRiskOverride(false);
                                  setRiskOverride(null);
                                  setOverrideJustification("");
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  if (overrideJustification.trim()) {
                                    showSuccess("Risk score override saved");
                                    setShowRiskOverride(false);
                                  } else {
                                    alert("Justification is required");
                                  }
                                }}
                                disabled={!overrideJustification.trim()}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 text-sm font-medium"
                              >
                                Apply Override
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {note.authorName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {note.authorName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(note.createdAt, true)}
                              </p>
                            </div>
                          </div>
                          {note.isInternal && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded border border-blue-200">
                              Internal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{note.content}</p>
                      </motion.div>
                    ))}

                    {notes.length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No notes yet</p>
                      </div>
                    )}
                    
                    {/* Add Note */}
                    <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-lg hover:border-brand-teal/30 transition-colors">
                      <textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternalNote}
                            onChange={(e) => setIsInternalNote(e.target.checked)}
                            className="rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
                          />
                          <span>Internal note (not visible to applicant)</span>
                        </label>
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Audit Trail Tab */}
                {activeTab === "audit" && (
                  <div className="space-y-4">
                    {mockApplication.auditTrail.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4"
                      >
                        <div className="w-2 h-2 bg-brand-teal rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{event.actorName}</span>{" "}
                            {event.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(event.timestamp, true)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Decision Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/70 p-6 sticky top-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">
                Decision Panel
              </h3>

              {/* Maker-Checker Warning */}
              {requiresMakerChecker(mockApplication.riskScore) && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs font-medium text-orange-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Four-Eyes Principle Required
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    This high-risk application requires second officer authorization
                  </p>
                </div>
              )}

              {/* Authority Warning */}
              {!canApprove(mockApplication.riskScore, mockApplication.applicant.expectedMonthlyVolume) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-900 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Insufficient Authority
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    You cannot approve this application. Please escalate to senior officer.
                  </p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {!showDecisionPanel ? (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                  <button
                    onClick={() => {
                      setSelectedAction("approve");
                      setShowDecisionPanel(true);
                    }}
                    disabled={!canApprove(mockApplication.riskScore, mockApplication.applicant.expectedMonthlyVolume)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAction("reject");
                      setShowDecisionPanel(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAction("request_info");
                      setShowDecisionPanel(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-brand-teal text-brand-teal rounded-lg font-medium hover:bg-brand-teal/5 transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Request Info
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAction("escalate");
                      setShowDecisionPanel(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {selectedAction.replace("_", " ")}
                    </p>
                  </div>

                  {selectedAction === "reject" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason *
                      </label>
                      <Select
                        value={rejectionReason}
                        onChange={setRejectionReason}
                        placeholder="Select reason..."
                        options={[
                          { value: "", label: "Select reason..." },
                          ...REJECTION_REASONS.map((reason) => ({
                            value: reason.code,
                            label: reason.label,
                          })),
                        ]}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedAction === "reject" ? "Additional Notes" : "Notes"} *
                    </label>
                    <textarea
                      value={decisionNote}
                      onChange={(e) => setDecisionNote(e.target.value)}
                      rows={4}
                      placeholder="Provide details for this decision..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDecisionPanel(false)}
                      disabled={processing}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDecision}
                      disabled={processing || !decisionNote.trim()}
                      className="flex-1 px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Assigned Officer
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {mockApplication.assignedOfficer}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Submitted
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(mockApplication.submittedAt, true)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Risk Score
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {mockApplication.riskScore}/100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
