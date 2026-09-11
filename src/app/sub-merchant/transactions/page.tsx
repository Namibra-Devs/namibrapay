'use client';

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Calendar,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { smTransactions, type SmTransaction, type SmTxStatus, type SmTxType } from "@/lib/sub-merchant-mock-data";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";
import { Modal } from "@/components/ui/modal";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import DatePicker from "@/components/ui/date-picker";

const statusIcons = {
  success: <CheckCircle2 className="size-3.5 text-emerald-500" />,
  failed: <XCircle className="size-3.5 text-destructive" />,
  pending: <Clock className="size-3.5 text-amber-500" />,
  processing: <RefreshCw className="size-3.5 text-blue-500" />,
};

const statusBadge = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
};

const typeBadge = {
  collection: "bg-[#a3ffe2]/20 text-[#1a7a5e] border-[#a3ffe2]/40",
  payout: "bg-[#bcbbee]/20 text-[#5c3d9e] border-[#bcbbee]/40",
};

export default function SubMerchantTransactionsPage() {
  const { can } = useSubMerchantRole();
  const { showToast } = useToast();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SmTxStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<SmTxType | "all">("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [detailTxn, setDetailTxn] = useState<SmTransaction | null>(null);
  const [disputeTxn, setDisputeTxn] = useState<SmTransaction | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  // Filtered & paginated data - SM-010
  const filteredTxns = useMemo(() => {
    return smTransactions.filter((txn) => {
      // Search filter
      const matchSearch = 
        searchQuery === "" ||
        txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchStatus = statusFilter === "all" || txn.status === statusFilter;

      // Type filter
      const matchType = typeFilter === "all" || txn.type === typeFilter;

      // Amount range filter
      const min = minAmount === "" ? 0 : parseFloat(minAmount);
      const max = maxAmount === "" ? Infinity : parseFloat(maxAmount);
      const matchAmount = txn.grossAmount >= min && txn.grossAmount <= max;

      return matchSearch && matchStatus && matchType && matchAmount;
    });
  }, [searchQuery, statusFilter, typeFilter, minAmount, maxAmount]);

  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage);
  const paginatedTxns = filteredTxns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle export - SM-013
  const handleExport = () => {
    if (!can("transactions.export")) {
      showToast("error", "Access Denied", "You don't have permission to export transactions.");
      return;
    }

    if (!exportStartDate || !exportEndDate) {
      showToast("warning", "Missing Dates", "Please select start and end dates.");
      return;
    }

    const start = new Date(exportStartDate);
    const end = new Date(exportEndDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 90) {
      showToast("warning", "Date Range Too Large", "Please select a range of 90 days or less.");
      return;
    }

    showToast("success", "Export Started", `Exporting ${filteredTxns.length} transactions as ${exportFormat.toUpperCase()}.`);
    setShowExport(false);
    setExportStartDate("");
    setExportEndDate("");
  };

  // Handle dispute - SM-012
  const handleRaiseDispute = () => {
    if (!disputeReason.trim()) {
      showToast("warning", "Missing Reason", "Please provide a reason for the dispute.");
      return;
    }

    showToast("success", "Dispute Raised", `Dispute for ${disputeTxn?.reference} has been submitted. Support will review within 24 hours.`);
    setDisputeTxn(null);
    setDisputeReason("");
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {filteredTxns.length} transaction{filteredTxns.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {can("transactions.export") && (
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-[#1a7a5e] text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-[#1a7a5e]/90 transition-colors w-full sm:w-auto"
          >
            <Download className="size-3.5 sm:size-4" />
            Export
          </button>
        )}
      </div>

      {/* Filters - SM-010 */}
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <FormField label="Search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Reference, phone, or customer name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </FormField>
          </div>

          {/* Status */}
          <FormField label="Status">
            <Select
              options={[
                { value: "all", label: "All Status" },
                { value: "success", label: "Success" },
                { value: "failed", label: "Failed" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as SmTxStatus | "all")}
              placeholder="Select status"
            />
          </FormField>

          {/* Type */}
          <FormField label="Type">
            <Select
              options={[
                { value: "all", label: "All Types" },
                { value: "collection", label: "Collection" },
                { value: "payout", label: "Payout" },
              ]}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as SmTxType | "all")}
              placeholder="Select type"
            />
          </FormField>

          {/* Amount Range */}
          <FormField label="Amount Range">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </FormField>
        </div>

        {/* Active filters notice */}
        {(searchQuery || statusFilter !== "all" || typeFilter !== "all" || minAmount || maxAmount) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
            <Info className="size-3.5" />
            <span>
              Filters active: {[
                searchQuery && "search",
                statusFilter !== "all" && statusFilter,
                typeFilter !== "all" && typeFilter,
                (minAmount || maxAmount) && "amount range",
              ].filter(Boolean).join(", ")}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
                setMinAmount("");
                setMaxAmount("");
              }}
              className="ml-auto text-[#1a7a5e] hover:underline font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table - SM-010 */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Reference", "Date/Time", "Type", "Amount", "Fee", "Net", "Status", "Customer", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTxns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTxns.map((txn, i) => (
                  <tr
                    key={txn.id}
                    className={cn(
                      "border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                      i % 2 === 0 ? "" : "bg-muted/10"
                    )}
                  >
                    <td className="pl-5 pr-4 py-3 font-mono text-xs">{txn.reference}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-block px-2 py-1 rounded-full border text-[11px] font-medium",
                        typeBadge[txn.type]
                      )}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold">{formatGHS(txn.grossAmount)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatGHS(txn.fee)}</td>
                    <td className="px-4 py-3 text-xs font-medium">{formatGHS(txn.net)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "flex items-center gap-1.5 w-fit px-2 py-1 rounded-full border text-[11px] font-medium",
                        statusBadge[txn.status]
                      )}>
                        {statusIcons[txn.status]}
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{txn.customerName}</td>
                    <td className="pl-4 pr-5 py-3">
                      <button
                        onClick={() => setDetailTxn(txn)}
                        className="text-xs text-[#1a7a5e] hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTxns.length)} of {filteredTxns.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs font-medium px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal - SM-011 */}
      {detailTxn && (
        <Modal
          isOpen={!!detailTxn}
          onClose={() => setDetailTxn(null)}
          title="Transaction Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Status banner */}
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border",
              detailTxn.status === "success" && "bg-emerald-50 border-emerald-200",
              detailTxn.status === "failed" && "bg-red-50 border-red-200",
              detailTxn.status === "pending" && "bg-amber-50 border-amber-200",
              detailTxn.status === "processing" && "bg-blue-50 border-blue-200"
            )}>
              {statusIcons[detailTxn.status]}
              <span className="text-sm font-medium capitalize">{detailTxn.status}</span>
            </div>

            {/* Transaction info grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reference</p>
                <p className="text-sm font-mono font-semibold">{detailTxn.reference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                <p className="text-sm">{formatDate(detailTxn.date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <span className={cn(
                  "inline-block px-2 py-1 rounded-full border text-[11px] font-medium",
                  typeBadge[detailTxn.type]
                )}>
                  {detailTxn.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Customer</p>
                <p className="text-sm font-medium">{detailTxn.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                <p className="text-sm font-mono">{detailTxn.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{detailTxn.description}</p>
              </div>
            </div>

            {/* Amount breakdown */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gross Amount</span>
                <span className="font-semibold">{formatGHS(detailTxn.grossAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction Fee</span>
                <span className="text-muted-foreground">- {formatGHS(detailTxn.fee)}</span>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium">Net Amount</span>
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatGHS(detailTxn.net)}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Timeline</p>
              <div className="space-y-3">
                {[
                  { label: "Transaction initiated", time: formatDate(detailTxn.date) },
                  { label: detailTxn.status === "success" ? "Payment processed" : detailTxn.status === "failed" ? "Payment failed" : "Processing payment", time: formatDate(detailTxn.date) },
                  ...(detailTxn.status === "success" ? [{ label: "Funds settled", time: formatDate(detailTxn.date) }] : []),
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="size-2 rounded-full bg-[#1a7a5e] mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failure reason */}
            {detailTxn.status === "failed" && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle className="size-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Transaction Failed</p>
                  <p className="text-xs text-red-600 mt-1">Insufficient funds in customer wallet</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              {detailTxn.status === "failed" && (
                <button
                  onClick={() => {
                    if (!can("transactions.dispute")) {
                      showToast("info", "Action Restricted", "Only Admins can raise disputes. Contact your admin for assistance.");
                      return;
                    }
                    setDisputeTxn(detailTxn);
                    setDetailTxn(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Raise Dispute
                </button>
              )}
              <button
                onClick={() => setDetailTxn(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Raise Dispute Modal - SM-012 */}
      {disputeTxn && (
        <Modal
          isOpen={!!disputeTxn}
          onClose={() => {
            setDisputeTxn(null);
            setDisputeReason("");
          }}
          title="Raise Dispute"
          size="md"
        >
          <div className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-2 sm:gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
              <Info className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Dispute Review Process</p>
                <p className="text-xs text-amber-600 mt-1">
                  Our support team will review your dispute within 24 hours. You'll receive updates via email.
                </p>
              </div>
            </div>

            {/* Transaction reference */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Transaction Reference</p>
              <p className="text-sm font-mono font-semibold">{disputeTxn.reference}</p>
            </div>

            {/* Dispute reason */}
            <FormField label="Reason for Dispute" required>
              <Textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Please describe the issue with this transaction..."
                rows={4}
              />
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={handleRaiseDispute}
                className="flex-1 px-4 py-2.5 bg-[#1a7a5e] text-white rounded-xl text-sm font-medium hover:bg-[#1a7a5e]/90 transition-colors"
              >
                Submit Dispute
              </button>
              <button
                onClick={() => {
                  setDisputeTxn(null);
                  setDisputeReason("");
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Export Modal - SM-013 */}
      {showExport && (
        <Modal
          isOpen={showExport}
          onClose={() => {
            setShowExport(false);
            setExportStartDate("");
            setExportEndDate("");
          }}
          title="Export Transactions"
          size="md"
        >
          <div className="space-y-6">
            {/* Format selection */}
            <FormField label="Export Format">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "csv", label: "CSV", icon: FileDown },
                  { value: "pdf", label: "PDF", icon: FileDown },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value as "csv" | "pdf")}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                      exportFormat === format.value
                        ? "border-[#1a7a5e] bg-brand-mint/10"
                        : "border-border hover:border-ring/40"
                    )}
                  >
                    <format.icon className="size-5" />
                    <span className="font-medium text-sm">{format.label}</span>
                  </button>
                ))}
              </div>
            </FormField>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Date" required>
                <DatePicker
                  value={exportStartDate}
                  onChange={setExportStartDate}
                  placeholder="Select start date"
                  max={exportEndDate || undefined}
                />
              </FormField>
              <FormField label="End Date" required>
                <DatePicker
                  value={exportEndDate}
                  onChange={setExportEndDate}
                  placeholder="Select end date"
                  min={exportStartDate || undefined}
                />
              </FormField>
            </div>

            {/* Active filters notice */}
            {(searchQuery || statusFilter !== "all" || typeFilter !== "all" || minAmount || maxAmount) && (
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <Info className="size-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Active Filters</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Export will include only transactions matching your current filters: {[
                      searchQuery && "search",
                      statusFilter !== "all" && statusFilter,
                      typeFilter !== "all" && typeFilter,
                      (minAmount || maxAmount) && "amount range",
                    ].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Warning for large ranges */}
            {exportStartDate && exportEndDate && (() => {
              const start = new Date(exportStartDate);
              const end = new Date(exportEndDate);
              const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
              return diffDays > 90 ? (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-600">
                    Date range exceeds 90 days. Please select a shorter range for optimal performance.
                  </p>
                </div>
              ) : null;
            })()}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2.5 bg-[#1a7a5e] text-white rounded-xl text-sm font-medium hover:bg-[#1a7a5e]/90 transition-colors"
              >
                Export {exportFormat.toUpperCase()}
              </button>
              <button
                onClick={() => {
                  setShowExport(false);
                  setExportStartDate("");
                  setExportEndDate("");
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
