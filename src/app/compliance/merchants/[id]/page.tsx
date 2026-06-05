"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  AlertTriangle,
  Activity,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import {
  EntityStatus,
  RiskBand,
  Document,
  ScreeningResult,
  Case,
  TransactionSummary,
} from "@/types/compliance";
import {
  getStatusBadgeColor,
  getRiskBadgeColor,
  formatDate,
  formatCurrency,
  getInitials,
} from "@/lib/compliance-utils";

// Mock merchant data
const getMerchantData = (id: string) => ({
  id,
  legalName: "Accra Retail Solutions Ltd",
  tradingName: "ShopNow Ghana",
  status: "ACTIVE" as EntityStatus,
  riskBand: "LOW" as RiskBand,
  riskScore: 25,
  industry: "Retail",
  businessType: "Private Limited Company",
  registrationNumber: "CS-2023-45678",
  dateOfIncorporation: "2023-01-15T00:00:00Z",
  onboardedAt: "2024-01-15T10:00:00Z",
  lastActivity: "2024-02-20T14:30:00Z",
  assignedOfficer: "Jane Mensah",
  contact: {
    email: "info@shopnowgh.com",
    phone: "+233 24 123 4567",
    website: "https://shopnowgh.com",
    registeredAddress: "Plot 45, Liberation Road, Accra, Ghana",
    operatingAddress: "Shop 12, Accra Mall, Tetteh Quarshie, Accra",
  },
  transactionSummary: {
    totalVolume: 453,
    totalValue: 125000,
    averageValue: 276,
    channelBreakdown: {
      "Mobile Money": 280000,
      "Bank Transfer": 95000,
      "Card": 50000,
    },
    period: "Last 30 days",
    flaggedCount: 2,
  } as TransactionSummary,
  documents: [
    {
      id: "DOC-001",
      type: "BUSINESS_REG",
      entityId: id,
      status: "VERIFIED",
      uploadedBy: "System",
      uploadedAt: "2024-01-15T10:00:00Z",
      expiryDate: "2025-01-15T00:00:00Z",
      verifiedBy: "Jane Mensah",
      verifiedAt: "2024-01-15T11:30:00Z",
      fileUrl: "#",
      fileName: "business-registration.pdf",
      fileSize: 245000,
    },
    {
      id: "DOC-002",
      type: "TAX_CERT",
      entityId: id,
      status: "VERIFIED",
      uploadedBy: "System",
      uploadedAt: "2024-01-15T10:05:00Z",
      expiryDate: "2024-12-31T00:00:00Z",
      verifiedBy: "Jane Mensah",
      verifiedAt: "2024-01-15T11:35:00Z",
      fileUrl: "#",
      fileName: "tax-certificate.pdf",
      fileSize: 189000,
    },
    {
      id: "DOC-003",
      type: "BANK_STATEMENT",
      entityId: id,
      status: "VERIFIED",
      uploadedBy: "System",
      uploadedAt: "2024-01-15T10:10:00Z",
      verifiedBy: "Jane Mensah",
      verifiedAt: "2024-01-15T11:40:00Z",
      fileUrl: "#",
      fileName: "bank-statement-december.pdf",
      fileSize: 512000,
    },
  ] as Document[],
  screeningResults: [
    {
      id: "SCR-001",
      subjectId: id,
      subjectName: "Accra Retail Solutions Ltd",
      listType: "SANCTIONS",
      matchScore: 0,
      matchedAttributes: [],
      screenedAt: "2024-01-15T10:30:00Z",
      disposition: "FALSE_POSITIVE",
      dispositionBy: "Jane Mensah",
      dispositionAt: "2024-01-15T11:00:00Z",
    },
    {
      id: "SCR-002",
      subjectId: id,
      subjectName: "Accra Retail Solutions Ltd",
      listType: "PEP",
      matchScore: 0,
      matchedAttributes: [],
      screenedAt: "2024-01-15T10:30:00Z",
      disposition: "FALSE_POSITIVE",
      dispositionBy: "Jane Mensah",
      dispositionAt: "2024-01-15T11:00:00Z",
    },
  ] as ScreeningResult[],
  beneficialOwners: [
    {
      id: "BO-001",
      name: "Kofi Mensah",
      dateOfBirth: "1985-03-20",
      nationality: "Ghanaian",
      ownershipPercent: 60,
      role: "DIRECTOR" as const,
      screeningStatus: "CLEAR" as const,
    },
    {
      id: "BO-002",
      name: "Ama Asante",
      dateOfBirth: "1990-07-15",
      nationality: "Ghanaian",
      ownershipPercent: 40,
      role: "SHAREHOLDER" as const,
      screeningStatus: "CLEAR" as const,
    },
  ],
  cases: [] as Case[],
});

export default function MerchantDetailPage() {
  const params = useParams();
  const merchantId = params.id as string;
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "transactions" | "screening" | "audit"
  >("overview");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<EntityStatus>("ACTIVE");
  const [statusNote, setStatusNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [merchant, setMerchant] = useState(getMerchantData(merchantId));

  // Show success toast
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!statusNote.trim()) {
      alert("Please provide a reason for status change");
      return;
    }

    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setMerchant({ ...merchant, status: newStatus });
      showSuccess(`Merchant status updated to ${newStatus}`);
      setShowStatusModal(false);
      setStatusNote("");
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Handle risk update
  const handleRiskUpdate = () => {
    // In real app, this would open a risk assessment modal
    showSuccess("Risk assessment form opened (simulated)");
  };

  // Handle document upload
  const handleDocumentUpload = () => {
    showSuccess("Document upload initiated (simulated)");
  };

  // Handle suspend action
  const handleSuspend = () => {
    setNewStatus("SUSPENDED");
    setShowStatusModal(true);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "transactions", label: "Transactions", icon: Activity },
    { id: "screening", label: "Screening", icon: AlertTriangle },
    { id: "audit", label: "Audit Trail", icon: Clock },
  ];

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
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-medium">{successMessage}</span>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
      <Link
        href="/compliance/merchants"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Merchants
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-brand-teal/10 flex items-center justify-center">
            <span className="text-xl font-bold text-brand-teal">
              {getInitials(merchant.tradingName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{merchant.tradingName}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                  merchant.status
                )}`}
              >
                {merchant.status}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(
                  merchant.riskBand
                )}`}
              >
                {merchant.riskBand} RISK
              </span>
            </div>
            <p className="text-gray-600 text-sm md:text-base">{merchant.legalName}</p>
            <p className="text-sm text-gray-500 mt-1">{merchant.id}</p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleSuspend}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Suspend
          </button>
          <button
            onClick={handleRiskUpdate}
            className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
          >
            Update Risk
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Volume"
          value={formatCurrency(merchant.transactionSummary.totalValue)}
          icon={DollarSign}
          color="teal"
        />
        <StatCard
          title="Total Transactions"
          value={merchant.transactionSummary.totalVolume}
          icon={Activity}
          color="navy"
        />
        <StatCard
          title="Risk Score"
          value={merchant.riskScore}
          icon={AlertTriangle}
          color="mint"
        />
        <StatCard
          title="Flagged Transactions"
          value={merchant.transactionSummary.flaggedCount}
          icon={AlertTriangle}
          color="peach"
        />
      </div>

      {/* Tabs */}
      <Card padding="none">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-brand-teal border-b-2 border-brand-teal"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Registration Number</label>
                    <p className="text-gray-900 mt-1">{merchant.registrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business Type</label>
                    <p className="text-gray-900 mt-1">{merchant.businessType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Industry</label>
                    <p className="text-gray-900 mt-1">{merchant.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Incorporation</label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(merchant.dateOfIncorporation)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Onboarded</label>
                    <p className="text-gray-900 mt-1">{formatDate(merchant.onboardedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Activity</label>
                    <p className="text-gray-900 mt-1">{formatDate(merchant.lastActivity)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{merchant.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{merchant.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={merchant.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:underline"
                    >
                      {merchant.contact.website}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Registered Address</p>
                      <p className="text-gray-900">{merchant.contact.registeredAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Operating Address</p>
                      <p className="text-gray-900">{merchant.contact.operatingAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Beneficial Owners</h3>
                <div className="space-y-3">
                  {merchant.beneficialOwners.map((owner) => (
                    <div
                      key={owner.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{owner.name}</p>
                        <p className="text-sm text-gray-600">
                          {owner.role} • {owner.ownershipPercent}% Ownership
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        {owner.screeningStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <button
                  onClick={handleDocumentUpload}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
                >
                  Upload Document
                </button>
              </div>
              {merchant.documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200/70 rounded-xl hover:border-brand-teal/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-brand-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {doc.type.replace(/_/g, " ")} • Uploaded {formatDate(doc.uploadedAt)}
                      </p>
                      {doc.expiryDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {formatDate(doc.expiryDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">
                      {doc.status}
                    </Badge>
                    <button
                      onClick={() => showSuccess(`Viewing ${doc.fileName}`)}
                      className="text-brand-teal hover:text-brand-teal/80 font-medium text-sm transition-colors"
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(merchant.transactionSummary.totalValue)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {merchant.transactionSummary.totalVolume}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Average Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(merchant.transactionSummary.averageValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(merchant.transactionSummary.channelBreakdown).map(
                    ([channel, value]) => (
                      <div key={channel} className="flex items-center justify-between">
                        <span className="text-gray-700">{channel}</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "screening" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Results</h3>
              {merchant.screeningResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200/70 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{result.listType} Screening</p>
                    <p className="text-sm text-gray-600">
                      Screened on {formatDate(result.screenedAt, true)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">
                      {result.disposition.replace(/_/g, " ")}
                    </Badge>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
              <div className="space-y-3">
                {[
                  {
                    action: "Status Updated",
                    description: "Status changed to ACTIVE",
                    user: "Jane Mensah",
                    timestamp: "2024-02-20T14:30:00Z",
                  },
                  {
                    action: "Risk Assessment",
                    description: "Risk band updated to LOW",
                    user: "Jane Mensah",
                    timestamp: "2024-02-15T10:00:00Z",
                  },
                  {
                    action: "Document Verified",
                    description: "Tax Certificate verified",
                    user: "Jane Mensah",
                    timestamp: "2024-01-15T11:35:00Z",
                  },
                  {
                    action: "Merchant Onboarded",
                    description: "Merchant successfully onboarded",
                    user: "System",
                    timestamp: "2024-01-15T10:00:00Z",
                  },
                ].map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-brand-teal rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{event.action}</p>
                        <span className="text-xs text-gray-500">
                          {formatDate(event.timestamp, true)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">By {event.user}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Update Merchant Status</h2>
                    <p className="text-gray-600 mt-1">Change status to {newStatus}</p>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <Select
                    value={newStatus}
                    onChange={(value) => setNewStatus(value as EntityStatus)}
                    options={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "SUSPENDED", label: "Suspended" },
                      { value: "UNDER_REVIEW", label: "Under Review" },
                      { value: "BLACKLISTED", label: "Blacklisted" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Change *
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Provide a reason for this status change..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    disabled={processing}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={processing || !statusNote.trim()}
                    className="flex-1 px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </DashboardLayout>
  );
}
