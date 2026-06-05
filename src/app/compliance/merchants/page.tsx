"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import SearchBar from "@/components/compliance/shared/SearchBar";
import Pagination from "@/components/compliance/shared/Pagination";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import { EntityStatus, RiskBand } from "@/types/compliance";
import { getStatusBadgeColor, getRiskBadgeColor, formatDate, formatCurrency } from "@/lib/compliance-utils";

interface Merchant {
  id: string;
  legalName: string;
  tradingName: string;
  status: EntityStatus;
  riskBand: RiskBand;
  industry: string;
  onboardedAt: string;
  lastActivity: string;
  monthlyVolume: number;
  transactionCount: number;
  assignedOfficer: string;
}

// Mock data
const mockMerchants: Merchant[] = [
  {
    id: "MERCH-001",
    legalName: "Accra Retail Solutions Ltd",
    tradingName: "ShopNow Ghana",
    status: "ACTIVE",
    riskBand: "LOW",
    industry: "Retail",
    onboardedAt: "2024-01-15T10:00:00Z",
    lastActivity: "2024-02-20T14:30:00Z",
    monthlyVolume: 125000,
    transactionCount: 453,
    assignedOfficer: "Jane Mensah",
  },
  {
    id: "MERCH-002",
    legalName: "TechHub Innovations Ghana",
    tradingName: "TechHub GH",
    status: "ACTIVE",
    riskBand: "MEDIUM",
    industry: "Technology",
    onboardedAt: "2024-02-01T09:00:00Z",
    lastActivity: "2024-02-21T16:45:00Z",
    monthlyVolume: 450000,
    transactionCount: 892,
    assignedOfficer: "Kwame Asante",
  },
  {
    id: "MERCH-003",
    legalName: "Global Remittance Services",
    tradingName: "QuickSend",
    status: "UNDER_REVIEW",
    riskBand: "HIGH",
    industry: "Financial Services",
    onboardedAt: "2024-02-10T11:30:00Z",
    lastActivity: "2024-02-19T10:20:00Z",
    monthlyVolume: 850000,
    transactionCount: 234,
    assignedOfficer: "Jane Mensah",
  },
  {
    id: "MERCH-004",
    legalName: "Premium Hospitality Group",
    tradingName: "Premium Hotels",
    status: "ACTIVE",
    riskBand: "LOW",
    industry: "Hospitality",
    onboardedAt: "2023-11-20T08:00:00Z",
    lastActivity: "2024-02-20T18:00:00Z",
    monthlyVolume: 320000,
    transactionCount: 678,
    assignedOfficer: "Kwame Asante",
  },
  {
    id: "MERCH-005",
    legalName: "Pharma Distribution Ltd",
    tradingName: "HealthPlus Pharmacy",
    status: "SUSPENDED",
    riskBand: "HIGH",
    industry: "Healthcare",
    onboardedAt: "2023-12-05T10:30:00Z",
    lastActivity: "2024-02-15T12:00:00Z",
    monthlyVolume: 0,
    transactionCount: 0,
    assignedOfficer: "Jane Mensah",
  },
];

export default function MerchantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter merchants
  const filteredMerchants = mockMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.tradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || merchant.status === statusFilter;
    const matchesRisk = riskFilter === "ALL" || merchant.riskBand === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);
  const displayedMerchants = filteredMerchants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const activeCount = mockMerchants.filter((m) => m.status === "ACTIVE").length;
  const underReviewCount = mockMerchants.filter((m) => m.status === "UNDER_REVIEW").length;
  const highRiskCount = mockMerchants.filter((m) => m.riskBand === "HIGH").length;
  const totalVolume = mockMerchants.reduce((sum, m) => sum + m.monthlyVolume, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchants Directory</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all merchants</p>
        </div>
        <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            placeholder="Search by name or ID..."
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
      </Card>

      {/* Merchants Table */}
      <Card padding="none">
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
            <tbody className="divide-y divide-gray-200">
              {displayedMerchants.map((merchant, index) => (
                <motion.tr
                  key={merchant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
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
