"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import SearchBar from "@/components/compliance/shared/SearchBar";
import Pagination from "@/components/compliance/shared/Pagination";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import { ScreeningResult, ScreeningDisposition } from "@/types/compliance";
import { formatDate } from "@/lib/compliance-utils";

// Mock screening data
const mockScreenings: ScreeningResult[] = [
  {
    id: "SCR-2024-001",
    subjectId: "APP-2024-003",
    subjectName: "John Mensah",
    listType: "SANCTIONS",
    matchScore: 85,
    matchedAttributes: ["Name", "Date of Birth", "Nationality"],
    screenedAt: "2024-02-20T10:30:00Z",
    disposition: "PENDING",
  },
  {
    id: "SCR-2024-002",
    subjectId: "MERCH-001",
    subjectName: "Global Remittance Services",
    listType: "PEP",
    matchScore: 92,
    matchedAttributes: ["Name", "Country"],
    screenedAt: "2024-02-19T14:20:00Z",
    disposition: "ESCALATED",
  },
  {
    id: "SCR-2024-003",
    subjectId: "APP-2024-005",
    subjectName: "Ama Asante",
    listType: "ADVERSE_MEDIA",
    matchScore: 78,
    matchedAttributes: ["Name"],
    screenedAt: "2024-02-19T09:15:00Z",
    disposition: "PENDING",
  },
  {
    id: "SCR-2024-004",
    subjectId: "APP-2024-002",
    subjectName: "Tech Solutions Ltd",
    listType: "SANCTIONS",
    matchScore: 65,
    matchedAttributes: ["Name"],
    screenedAt: "2024-02-18T16:45:00Z",
    disposition: "FALSE_POSITIVE",
    dispositionBy: "Jane Mensah",
    dispositionAt: "2024-02-18T17:00:00Z",
    dispositionJustification: "Different entity - verified business registration and location",
  },
  {
    id: "SCR-2024-005",
    subjectId: "MERCH-004",
    subjectName: "Kwame Nkrumah",
    listType: "PEP",
    matchScore: 95,
    matchedAttributes: ["Name", "Date of Birth", "Position"],
    screenedAt: "2024-02-18T11:30:00Z",
    disposition: "TRUE_POSITIVE",
    dispositionBy: "Kwame Asante",
    dispositionAt: "2024-02-18T14:20:00Z",
    dispositionJustification: "Confirmed match - current government official, enhanced due diligence applied",
  },
];

export default function ScreeningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listTypeFilter, setListTypeFilter] = useState<string>("ALL");
  const [dispositionFilter, setDispositionFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningResult | null>(null);
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const itemsPerPage = 10;

  // Filter screenings
  const filteredScreenings = mockScreenings.filter((screening) => {
    const matchesSearch =
      screening.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screening.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesListType = listTypeFilter === "ALL" || screening.listType === listTypeFilter;
    const matchesDisposition =
      dispositionFilter === "ALL" || screening.disposition === dispositionFilter;
    return matchesSearch && matchesListType && matchesDisposition;
  });

  const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
  const displayedScreenings = filteredScreenings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const pendingCount = mockScreenings.filter((s) => s.disposition === "PENDING").length;
  const escalatedCount = mockScreenings.filter((s) => s.disposition === "ESCALATED").length;
  const truePositiveCount = mockScreenings.filter((s) => s.disposition === "TRUE_POSITIVE").length;
  const falsePositiveCount = mockScreenings.filter((s) => s.disposition === "FALSE_POSITIVE").length;

  const getDispositionColor = (disposition: ScreeningDisposition) => {
    switch (disposition) {
      case "PENDING":
        return "warning";
      case "TRUE_POSITIVE":
        return "error";
      case "FALSE_POSITIVE":
        return "success";
      case "ESCALATED":
        return "error";
      default:
        return "neutral";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Screening Management</h1>
          <p className="text-gray-600 mt-1">Monitor and resolve sanctions & PEP screening hits</p>
        </div>
        <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Review"
          value={pendingCount}
          icon={Clock}
          color="peach"
        />
        <StatCard
          title="Escalated"
          value={escalatedCount}
          icon={AlertTriangle}
          color="pink"
        />
        <StatCard
          title="True Positives"
          value={truePositiveCount}
          icon={XCircle}
          color="pink"
        />
        <StatCard
          title="False Positives"
          value={falsePositiveCount}
          icon={CheckCircle2}
          color="teal"
        />
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            placeholder="Search by name or ID..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          <div className="flex gap-3">
            <Select
              value={listTypeFilter}
              onChange={setListTypeFilter}
              className="w-full md:w-44"
              options={[
                { value: "ALL", label: "All Lists" },
                { value: "SANCTIONS", label: "Sanctions" },
                { value: "PEP", label: "PEP" },
                { value: "ADVERSE_MEDIA", label: "Adverse Media" },
              ]}
            />
            <Select
              value={dispositionFilter}
              onChange={setDispositionFilter}
              className="w-full md:w-44"
              options={[
                { value: "ALL", label: "All Dispositions" },
                { value: "PENDING", label: "Pending" },
                { value: "TRUE_POSITIVE", label: "True Positive" },
                { value: "FALSE_POSITIVE", label: "False Positive" },
                { value: "ESCALATED", label: "Escalated" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Screening Results Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  List Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Matched Attributes
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Screened At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Disposition
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedScreenings.map((screening, index) => (
                <motion.tr
                  key={screening.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedScreening(screening);
                    setShowDispositionModal(true);
                  }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{screening.subjectName}</p>
                      <p className="text-sm text-gray-500">{screening.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-navy/10 text-brand-navy border border-brand-navy/20">
                      {screening.listType.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getMatchScoreColor(
                        screening.matchScore
                      )}`}
                    >
                      {screening.matchScore}%
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {screening.matchedAttributes.map((attr, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs text-gray-600">
                      {formatDate(screening.screenedAt, true)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={getDispositionColor(screening.disposition)} size="sm">
                      {screening.disposition.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setSelectedScreening(screening);
                        setShowDispositionModal(true);
                      }}
                      className="inline-flex items-center gap-1 text-brand-teal hover:text-brand-teal/80 font-medium text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Disposition Modal */}
      {showDispositionModal && selectedScreening && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Screening Details</h2>
                  <p className="text-gray-600 mt-1">{selectedScreening.id}</p>
                </div>
                <button
                  onClick={() => setShowDispositionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Subject Name</label>
                <p className="text-gray-900 mt-1 text-lg font-semibold">
                  {selectedScreening.subjectName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">List Type</label>
                  <p className="text-gray-900 mt-1">
                    {selectedScreening.listType.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Match Score</label>
                  <p className="text-gray-900 mt-1 font-bold">{selectedScreening.matchScore}%</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Matched Attributes</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedScreening.matchedAttributes.map((attr, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-teal/10 text-brand-teal text-xs font-medium"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Screened At</label>
                <p className="text-gray-900 mt-1">
                  {formatDate(selectedScreening.screenedAt, true)}
                </p>
              </div>

              {selectedScreening.disposition !== "PENDING" && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <label className="text-sm font-medium text-gray-600 mr-2">Disposition</label>
                    <Badge variant={getDispositionColor(selectedScreening.disposition)} size="sm">
                      {selectedScreening.disposition.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {selectedScreening.dispositionJustification && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Justification</label>
                      <p className="text-gray-900 mt-1">
                        {selectedScreening.dispositionJustification}
                      </p>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Reviewed by {selectedScreening.dispositionBy} on{" "}
                    {selectedScreening.dispositionAt &&
                      formatDate(selectedScreening.dispositionAt, true)}
                  </div>
                </>
              )}

              {selectedScreening.disposition === "PENDING" && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="text-sm font-medium text-gray-600 block mb-3">
                    Set Disposition
                  </label>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add justification notes..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
                    />
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
                        False Positive
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                        True Positive
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm">
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
