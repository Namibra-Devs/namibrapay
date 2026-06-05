"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/compliance/DashboardLayout";
import Card from "@/components/compliance/shared/Card";
import Badge from "@/components/compliance/shared/Badge";
import SearchBar from "@/components/compliance/shared/SearchBar";
import Pagination from "@/components/compliance/shared/Pagination";
import StatCard from "@/components/compliance/shared/StatCard";
import Select from "@/components/ui/Select";
import { Case, CaseStatus } from "@/types/compliance";
import { formatDate } from "@/lib/compliance-utils";

// Mock cases data
const mockCases: Case[] = [
  {
    id: "CASE-2024-001",
    type: "SANCTIONS_HIT",
    priority: "CRITICAL",
    status: "INVESTIGATING",
    linkedEntities: ["APP-2024-003", "MERCH-002"],
    assignedInvestigator: "Jane Mensah",
    openedAt: "2024-02-20T09:00:00Z",
    openedBy: "System",
    evidence: [],
    notes: [],
    tasks: [
      {
        id: "TASK-001",
        description: "Review sanctions match details",
        assignedTo: "Jane Mensah",
        dueDate: "2024-02-21T17:00:00Z",
        completed: true,
        completedAt: "2024-02-20T14:30:00Z",
      },
      {
        id: "TASK-002",
        description: "Interview applicant",
        assignedTo: "Jane Mensah",
        dueDate: "2024-02-22T17:00:00Z",
        completed: false,
      },
    ],
  },
  {
    id: "CASE-2024-002",
    type: "SUSPICIOUS_ACTIVITY",
    priority: "HIGH",
    status: "OPEN",
    linkedEntities: ["MERCH-005"],
    assignedInvestigator: "Kwame Asante",
    openedAt: "2024-02-19T11:30:00Z",
    openedBy: "Jane Mensah",
    evidence: [],
    notes: [],
    tasks: [],
  },
  {
    id: "CASE-2024-003",
    type: "DOCUMENT_FRAUD",
    priority: "HIGH",
    status: "PENDING_REVIEW",
    linkedEntities: ["APP-2024-007"],
    assignedInvestigator: "Jane Mensah",
    openedAt: "2024-02-18T15:20:00Z",
    openedBy: "Kwame Asante",
    evidence: [],
    notes: [],
    tasks: [],
  },
  {
    id: "CASE-2024-004",
    type: "COMPLAINT",
    priority: "MEDIUM",
    status: "CLOSED",
    linkedEntities: ["MERCH-003"],
    assignedInvestigator: "Kwame Asante",
    openedAt: "2024-02-15T10:00:00Z",
    openedBy: "System",
    closedAt: "2024-02-19T16:45:00Z",
    outcome: "Complaint resolved - customer service issue addressed",
    evidence: [],
    notes: [],
    tasks: [],
  },
  {
    id: "CASE-2024-005",
    type: "SUSPICIOUS_ACTIVITY",
    priority: "CRITICAL",
    status: "REPORTED",
    linkedEntities: ["MERCH-001", "MERCH-008"],
    assignedInvestigator: "Jane Mensah",
    openedAt: "2024-02-10T08:30:00Z",
    openedBy: "Jane Mensah",
    closedAt: "2024-02-17T14:20:00Z",
    outcome: "Suspicious Transaction Report filed with FIU",
    evidence: [],
    notes: [],
    tasks: [],
    strDraft: "STR filed - Case #STR-2024-005",
  },
];

export default function CasesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter cases
  const filteredCases = mockCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.linkedEntities.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || caseItem.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || caseItem.priority === priorityFilter;
    const matchesType = typeFilter === "ALL" || caseItem.type === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const displayedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const openCount = mockCases.filter((c) => c.status === "OPEN" || c.status === "INVESTIGATING").length;
  const pendingReviewCount = mockCases.filter((c) => c.status === "PENDING_REVIEW").length;
  const criticalCount = mockCases.filter((c) => c.priority === "CRITICAL").length;
  const closedCount = mockCases.filter((c) => c.status === "CLOSED" || c.status === "REPORTED").length;

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "OPEN":
        return "info";
      case "INVESTIGATING":
        return "warning";
      case "PENDING_REVIEW":
        return "warning";
      case "CLOSED":
        return "success";
      case "REPORTED":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
          <p className="text-gray-600 mt-1">Investigate and manage compliance cases</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors flex items-center gap-2 shadow-sm text-sm">
            <Plus className="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Open Cases"
          value={openCount}
          icon={Briefcase}
          color="teal"
        />
        <StatCard
          title="Pending Review"
          value={pendingReviewCount}
          icon={Clock}
          color="peach"
        />
        <StatCard
          title="Critical Priority"
          value={criticalCount}
          icon={AlertTriangle}
          color="pink"
        />
        <StatCard
          title="Closed Cases"
          value={closedCount}
          icon={CheckCircle2}
          color="mint"
        />
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            placeholder="Search by case ID or linked entities..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          <div className="flex flex-wrap gap-3">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full md:w-44"
              options={[
                { value: "ALL", label: "All Status" },
                { value: "OPEN", label: "Open" },
                { value: "INVESTIGATING", label: "Investigating" },
                { value: "PENDING_REVIEW", label: "Pending Review" },
                { value: "CLOSED", label: "Closed" },
                { value: "REPORTED", label: "Reported" },
              ]}
            />
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              className="w-full md:w-44"
              options={[
                { value: "ALL", label: "All Priorities" },
                { value: "CRITICAL", label: "Critical" },
                { value: "HIGH", label: "High" },
                { value: "MEDIUM", label: "Medium" },
                { value: "LOW", label: "Low" },
              ]}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              className="w-full md:w-44"
              options={[
                { value: "ALL", label: "All Types" },
                { value: "SANCTIONS_HIT", label: "Sanctions Hit" },
                { value: "SUSPICIOUS_ACTIVITY", label: "Suspicious Activity" },
                { value: "COMPLAINT", label: "Complaint" },
                { value: "DOCUMENT_FRAUD", label: "Document Fraud" },
                { value: "OTHER", label: "Other" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Cases Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Linked Entities
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Investigator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Opened
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedCases.map((caseItem, index) => (
                <motion.tr
                  key={caseItem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/compliance/cases/${caseItem.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link href={`/compliance/cases/${caseItem.id}`}>
                      <p className="font-medium text-sm text-gray-900 hover:text-brand-teal transition-colors">
                        {caseItem.id}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {caseItem.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        caseItem.priority
                      )}`}
                    >
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(caseItem.status)} size="sm">
                      {caseItem.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {caseItem.linkedEntities.map((entity, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-brand-teal/10 text-brand-teal font-medium"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{caseItem.assignedInvestigator}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600">{formatDate(caseItem.openedAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/compliance/cases/${caseItem.id}`}
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
