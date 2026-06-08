"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  Loader2,
  FileDown,
  X,
  Save,
} from "lucide-react";
import DashboardLayout from "@/components/compliance-officer/DashboardLayout";
import Card from "@/components/compliance-officer/shared/Card";
import Badge from "@/components/compliance-officer/shared/Badge";
import SearchBar from "@/components/compliance-officer/shared/SearchBar";
import Pagination from "@/components/compliance-officer/shared/Pagination";
import StatCard from "@/components/compliance-officer/shared/StatCard";
import Select from "@/components/ui/Select";
import { ScreeningResult, ScreeningDisposition } from "@/types/compliance";
import { formatDate } from "@/lib/compliance-utils";
import { MOCK_SCREENINGS } from "@/lib/compliance-hub-mock-data";
import { toast } from "@/components/ui/Toast";

export default function ScreeningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listTypeFilter, setListTypeFilter] = useState<string>("ALL");
  const [dispositionFilter, setDispositionFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningResult | null>(null);
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [screenings, setScreenings] = useState<ScreeningResult[]>(MOCK_SCREENINGS);
  const [dispositionNote, setDispositionNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  // Filter screenings with useMemo for performance
  const filteredScreenings = useMemo(() => {
    return screenings.filter((screening) => {
      const matchesSearch =
        screening.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screening.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesListType = listTypeFilter === "ALL" || screening.listType === listTypeFilter;
      const matchesDisposition =
        dispositionFilter === "ALL" || screening.disposition === dispositionFilter;
      return matchesSearch && matchesListType && matchesDisposition;
    });
  }, [screenings, searchQuery, listTypeFilter, dispositionFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, listTypeFilter, dispositionFilter]);

  const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);
  const displayedScreenings = useMemo(() => {
    return filteredScreenings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredScreenings, currentPage, itemsPerPage]);

  // Calculate stats from current screenings data
  const pendingCount = screenings.filter((s) => s.disposition === "PENDING").length;
  const escalatedCount = screenings.filter((s) => s.disposition === "ESCALATED").length;
  const truePositiveCount = screenings.filter((s) => s.disposition === "TRUE_POSITIVE").length;
  const falsePositiveCount = screenings.filter((s) => s.disposition === "FALSE_POSITIVE").length;

  // Handle export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const headers = ["ID", "Subject", "List Type", "Match Score", "Disposition", "Screened At"];
      const rows = filteredScreenings.map((screening) => [
        screening.id,
        screening.subjectName,
        screening.listType.replace(/_/g, " "),
        `${screening.matchScore}%`,
        screening.disposition.replace(/_/g, " "),
        new Date(screening.screenedAt).toLocaleDateString(),
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `screening-results-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle disposition submission
  const handleDisposition = async (disposition: ScreeningDisposition) => {
    if (!dispositionNote.trim()) {
      alert("Please provide justification notes");
      return;
    }

    setProcessing(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update the screening in the list
      setScreenings(screenings.map((s) =>
        s.id === selectedScreening?.id
          ? {
              ...s,
              disposition,
              dispositionBy: "Current Officer",
              dispositionAt: new Date().toISOString(),
              dispositionJustification: dispositionNote,
            }
          : s
      ));
      
      const dispositionMessages: Record<Exclude<ScreeningDisposition, "PENDING">, string> = {
        FALSE_POSITIVE: `${selectedScreening?.id} marked as False Positive`,
        TRUE_POSITIVE: `${selectedScreening?.id} marked as True Positive`,
        ESCALATED: `${selectedScreening?.id} escalated to senior officer`,
      };
      
      toast.success(dispositionMessages[disposition as Exclude<ScreeningDisposition, "PENDING">] || "Disposition saved successfully");
      setShowDispositionModal(false);
      setDispositionNote("");
      setSelectedScreening(null);
    } catch (error) {
      alert("Failed to save disposition. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setListTypeFilter("ALL");
    setDispositionFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery || listTypeFilter !== "ALL" || dispositionFilter !== "ALL";

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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Screening Management</h1>
            <p className="text-gray-600 mt-1">
              {filteredScreenings.length} screening result(s) {hasActiveFilters && "matching filters"}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredScreenings.length === 0}
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
                  placeholder="Search by name or ID..."
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
          </div>
        </Card>

        {/* Screening Results Table */}
        <Card padding="none">
          {/* Results count bar */}
          {filteredScreenings.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {displayedScreenings.length} of {filteredScreenings.length} screening result(s)
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          )}
          
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
              <tbody className="divide-y divide-gray-100">
                {displayedScreenings.map((screening, index) => (
                  <motion.tr
                    key={screening.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => {
                      setSelectedScreening(screening);
                      setShowDispositionModal(true);
                      setDispositionNote("");
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

          {/* Empty State */}
          {filteredScreenings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No screening results found
              </h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria"
                  : "No screening results available at the moment"}
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
        <AnimatePresence>
          {showDispositionModal && selectedScreening && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
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
                      Set Disposition *
                    </label>
                    <div className="space-y-3">
                      <textarea
                        value={dispositionNote}
                        onChange={(e) => setDispositionNote(e.target.value)}
                        placeholder="Add justification notes... (required)"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors text-sm"
                      />
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleDisposition("FALSE_POSITIVE")}
                          disabled={processing || !dispositionNote.trim()}
                          className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              False Positive
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDisposition("TRUE_POSITIVE")}
                          disabled={processing || !dispositionNote.trim()}
                          className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              True Positive
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDisposition("ESCALATED")}
                          disabled={processing || !dispositionNote.trim()}
                          className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4" />
                              Escalate
                            </>
                          )}
                        </button>
                      </div>
                      {!dispositionNote.trim() && (
                        <p className="text-xs text-gray-500 text-center">
                          Please provide justification notes to set disposition
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
