"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Download,
  Eye,
  AlertCircle,
  TrendingUp,
  Activity,
  Loader2,
  FileDown,
  X,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/compliance-officer/DashboardLayout";
import Card from "@/components/compliance-officer/shared/Card";
import SearchBar from "@/components/compliance-officer/shared/SearchBar";
import Pagination from "@/components/compliance-officer/shared/Pagination";
import StatCard from "@/components/compliance-officer/shared/StatCard";
import Select from "@/components/ui/Select";
import { EntityStatus, RiskBand } from "@/types/compliance";
import { getStatusBadgeColor, getRiskBadgeColor, formatDate, formatCurrency } from "@/lib/compliance-utils";
import { MOCK_MERCHANTS, type Merchant } from "@/lib/compliance-hub-mock-data";
import { toast } from "@/components/ui/Toast";

export default function MerchantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  // Filter merchants with useMemo for performance
  const filteredMerchants = useMemo(() => {
    return MOCK_MERCHANTS.filter((merchant) => {
      const matchesSearch =
        merchant.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        merchant.tradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        merchant.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || merchant.status === statusFilter;
      const matchesRisk = riskFilter === "ALL" || merchant.riskBand === riskFilter;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [searchQuery, statusFilter, riskFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, riskFilter]);

  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);
  const displayedMerchants = useMemo(() => {
    return filteredMerchants.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredMerchants, currentPage, itemsPerPage]);

  // Calculate stats
  const activeCount = MOCK_MERCHANTS.filter((m) => m.status === "ACTIVE").length;
  const underReviewCount = MOCK_MERCHANTS.filter((m) => m.status === "UNDER_REVIEW").length;
  const highRiskCount = MOCK_MERCHANTS.filter((m) => m.riskBand === "HIGH").length;
  const totalVolume = MOCK_MERCHANTS.reduce((sum, m) => sum + m.monthlyVolume, 0);

  // Handle export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const headers = ["ID", "Trading Name", "Legal Name", "Status", "Risk", "Industry", "Monthly Volume", "Officer"];
      const rows = filteredMerchants.map((merchant) => [
        merchant.id,
        merchant.tradingName,
        merchant.legalName,
        merchant.status.replace(/_/g, " "),
        merchant.riskBand,
        merchant.industry,
        formatCurrency(merchant.monthlyVolume),
        merchant.assignedOfficer,
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merchants-export-${new Date().toISOString().split("T")[0]}.csv`;
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

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setRiskFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "ALL" || riskFilter !== "ALL";

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Merchants Directory</h1>
            <p className="text-gray-600 mt-1">
              {filteredMerchants.length} merchant(s) {hasActiveFilters && "matching filters"}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredMerchants.length === 0}
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
          title="Active Merchants"
          value={activeCount}
          icon={Building2}
          color="teal"
        />
        <StatCard
          title="Under Review"
          value={underReviewCount}
          icon={AlertCircle}
          color="peach"
        />
        <StatCard
          title="High Risk"
          value={highRiskCount}
          icon={Activity}
          color="pink"
        />
        <StatCard
          title="Total Monthly Volume"
          value={formatCurrency(totalVolume)}
          icon={TrendingUp}
          color="navy"
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
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full md:w-44"
                options={[
                  { value: "ALL", label: "All Status" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "UNDER_REVIEW", label: "Under Review" },
                  { value: "SUSPENDED", label: "Suspended" },
                  { value: "BLACKLISTED", label: "Blacklisted" },
                ]}
              />
              <Select
                value={riskFilter}
                onChange={setRiskFilter}
                className="w-full md:w-44"
                options={[
                  { value: "ALL", label: "All Risk Levels" },
                  { value: "LOW", label: "Low Risk" },
                  { value: "MEDIUM", label: "Medium Risk" },
                  { value: "HIGH", label: "High Risk" },
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Merchants Table */}
      <Card padding="none">
        {/* Results count bar */}
        {filteredMerchants.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {displayedMerchants.length} of {filteredMerchants.length} merchant(s)
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monthly Volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Officer
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedMerchants.map((merchant, index) => (
                <motion.tr
                  key={merchant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => router.push(`/compliance/merchants/${merchant.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-2">
                    <Link href={`/compliance/merchants/${merchant.id}`}>
                      <div>
                        <p className="font-medium text-gray-900">{merchant.tradingName}</p>
                        <p className="text-sm text-gray-500">{merchant.id}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        merchant.status
                      )}`}
                    >
                      {merchant.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(
                        merchant.riskBand
                      )}`}
                    >
                      {merchant.riskBand}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-sm text-gray-900">{merchant.industry}</span>
                  </td>
                  <td className="px-6 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(merchant.monthlyVolume)}
                      </p>
                      <p className="text-xs text-gray-500">{merchant.transactionCount} txns</p>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-xs text-gray-600">
                      {formatDate(merchant.lastActivity)}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <span className="text-sm text-gray-900">{merchant.assignedOfficer}</span>
                  </td>
                  <td className="px-6 py-2 text-right">
                    <Link
                      href={`/compliance/merchants/${merchant.id}`}
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
        {filteredMerchants.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No merchants found
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria"
                : "No merchants available at the moment"}
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
    </div>
    </DashboardLayout>
  );
}
