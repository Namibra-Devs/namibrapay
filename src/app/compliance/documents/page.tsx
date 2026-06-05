"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Download,
  Eye,
  Search,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import SearchBar from "@/components/compliance/shared/SearchBar";
import Pagination from "@/components/compliance/shared/Pagination";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import { Document, DocumentStatus } from "@/types/compliance";
import { formatDate, DOCUMENT_TYPES } from "@/lib/compliance-utils";

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    type: "NATIONAL_ID",
    entityId: "APP-2024-001",
    status: "VERIFIED",
    uploadedBy: "System",
    uploadedAt: "2024-02-20T10:00:00Z",
    expiryDate: "2027-06-15T00:00:00Z",
    verifiedBy: "Jane Mensah",
    verifiedAt: "2024-02-20T11:30:00Z",
    fileUrl: "#",
    fileName: "national-id-front.pdf",
    fileSize: 245000,
  },
  {
    id: "DOC-002",
    type: "BUSINESS_REG",
    entityId: "MERCH-001",
    status: "VERIFIED",
    uploadedBy: "System",
    uploadedAt: "2024-02-19T14:30:00Z",
    expiryDate: "2025-12-31T00:00:00Z",
    verifiedBy: "Kwame Asante",
    verifiedAt: "2024-02-19T16:00:00Z",
    fileUrl: "#",
    fileName: "business-registration.pdf",
    fileSize: 512000,
  },
  {
    id: "DOC-003",
    type: "TAX_CERT",
    entityId: "MERCH-002",
    status: "EXPIRED",
    uploadedBy: "System",
    uploadedAt: "2023-06-15T10:00:00Z",
    expiryDate: "2024-01-31T00:00:00Z",
    verifiedBy: "Jane Mensah",
    verifiedAt: "2023-06-15T11:00:00Z",
    fileUrl: "#",
    fileName: "tax-certificate-2023.pdf",
    fileSize: 189000,
  },
  {
    id: "DOC-004",
    type: "PASSPORT",
    entityId: "APP-2024-003",
    status: "PENDING",
    uploadedBy: "System",
    uploadedAt: "2024-02-21T09:15:00Z",
    fileUrl: "#",
    fileName: "passport-scan.pdf",
    fileSize: 378000,
  },
  {
    id: "DOC-005",
    type: "BANK_STATEMENT",
    entityId: "APP-2024-005",
    status: "REJECTED",
    uploadedBy: "System",
    uploadedAt: "2024-02-20T15:20:00Z",
    verifiedBy: "Kwame Asante",
    verifiedAt: "2024-02-20T16:30:00Z",
    verificationNotes: "Document is illegible and dates are not recent enough",
    fileUrl: "#",
    fileName: "bank-statement-jan.pdf",
    fileSize: 456000,
  },
  {
    id: "DOC-006",
    type: "PROOF_OF_ADDRESS",
    entityId: "APP-2024-002",
    status: "VERIFIED",
    uploadedBy: "System",
    uploadedAt: "2024-02-18T10:00:00Z",
    verifiedBy: "Jane Mensah",
    verifiedAt: "2024-02-18T12:00:00Z",
    fileUrl: "#",
    fileName: "utility-bill.pdf",
    fileSize: 234000,
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter documents
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
    const matchesType = typeFilter === "ALL" || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const displayedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const pendingCount = mockDocuments.filter((d) => d.status === "PENDING").length;
  const verifiedCount = mockDocuments.filter((d) => d.status === "VERIFIED").length;
  const expiredCount = mockDocuments.filter((d) => d.status === "EXPIRED").length;
  const expiringCount = mockDocuments.filter((d) => {
    if (!d.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all compliance documents</p>
          </div>
          <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar
              placeholder="Search by filename, ID, or entity..."
              onSearch={setSearchQuery}
              className="flex-1"
            />
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
        </Card>

        {/* Documents Table */}
        <Card padding="none">
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
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-brand-teal hover:text-brand-teal/80 font-medium text-sm flex items-center gap-1 transition-colors">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
