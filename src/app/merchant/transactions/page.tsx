'use client';

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ArrowUpCircle,
  Eye,
  X,
  Check,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS, formatDate } from "@/lib/constants";
import { mockMerchantTransactions } from "@/lib/merchant-mock-data";
import type { MerchantTransaction } from "@/lib/merchant-mock-data";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import TransactionDetail from "../_components/transaction-details-modal";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import DatePicker from "@/components/ui/date-picker";
import { FormField, Input, Select } from "@/components/ui/form-field";

const PAGE_SIZES = [10, 25, 50] as const;

const statusConfig = {
  success: { icon: <CheckCircle2 className="size-3.5" />, badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { icon: <XCircle className="size-3.5" />, badge: "bg-red-50 text-red-700 border-red-200" },
  pending: { icon: <Clock className="size-3.5" />, badge: "bg-amber-50 text-amber-700 border-amber-200" },
  processing: { icon: <RefreshCw className="size-3.5" />, badge: "bg-blue-50 text-blue-700 border-blue-200" },
  reversed: { icon: <ArrowUpCircle className="size-3.5" />, badge: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function TransactionsPage() {
  const { can } = useMerchantRole();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<MerchantTransaction | null>(null);
  
  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return mockMerchantTransactions.filter((t) => {
      const matchSearch =
        !search ||
        t.reference.toLowerCase().includes(search.toLowerCase()) ||
        t.payerIdentifier.includes(search);
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeFilterCount = [statusFilter !== "all", typeFilter !== "all", search !== ""].filter(Boolean).length;

  return (
    <div className="px-4 sm:pl-6 sm:pr-4 py-4 sm:py-4 space-y-4 pb-20 md:pb-b">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Transactions</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">All collections and payouts for your account.</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by reference or phone..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-card border border-border rounded-xl outline-none focus:border-brand-teal/60 focus:ring-2 focus:ring-brand-teal/10 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn(
            "flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all shrink-0",
            filtersOpen ? "bg-brand-teal/10 border-brand-teal/40 text-[#1a6e6c]" : "bg-card border-border hover:border-ring/50"
          )}
        >
          <Filter className="size-3.5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-brand-teal text-white size-4 rounded-full text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn("size-3.5 transition-transform hidden sm:inline", filtersOpen && "rotate-180")} />
        </button>

        {/* Export */}
        {can("transactions.export") && (
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all shrink-0"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}
      </motion.div>

      {/* Filter Panel */}
      {filtersOpen && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 border border-border rounded-xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
            <div className="flex gap-2 flex-wrap">
              {["all", "success", "failed", "pending", "processing", "reversed"].map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={cn("px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium border transition-all capitalize",
                    statusFilter === s ? "bg-brand-teal/10 border-brand-teal/40 text-[#1a6e6c]" : "bg-card border-border hover:bg-muted/50")}>
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</label>
            <div className="flex gap-2">
              {["all", "collection", "payout"].map((t) => (
                <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                  className={cn("px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium border transition-all capitalize",
                    typeFilter === t ? "bg-brand-teal/10 border-brand-teal/40 text-[#1a6e6c]" : "bg-card border-border hover:bg-muted/50")}>
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-225">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Reference</th>
                <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date / Time</th>
                <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-right px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-right px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Fee</th>
                <th className="text-right px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Net</th>
                <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Payer / Beneficiary</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground text-xs sm:text-sm">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              ) : (
                paginated.map((txn, i) => {
                  const sc = statusConfig[txn.status];
                  return (
                    <tr key={txn.id}
                      className={cn("border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors",
                        i % 2 === 0 ? "" : "bg-muted/10")}
                      onClick={() => setSelectedTxn(txn)}>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 font-mono text-[10px] sm:text-xs text-foreground">{txn.reference}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{formatDate(txn.createdAt)}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <span className={cn("text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-lg font-medium capitalize whitespace-nowrap",
                          txn.type === "collection" ? "bg-brand-teal/10 text-[#1a6e6c]" : "bg-brand-lavender/10 text-[#5c3d9e]")}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right font-semibold text-[10px] sm:text-xs">{formatGHS(txn.amount)}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-xs text-muted-foreground">{formatGHS(txn.fee)}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-xs font-medium">{formatGHS(txn.net)}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <span className={cn("flex items-center gap-1.5 w-fit px-1.5 sm:px-2 py-1 rounded-full border text-[10px] sm:text-[11px] font-medium whitespace-nowrap", sc.badge)}>
                          {sc.icon}
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs text-muted-foreground">{txn.payerIdentifier}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => { e.stopPropagation(); setSelectedTxn(txn); }}>
                          <Eye className="size-3 sm:size-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-border bg-muted/10">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <span>Rows per page:</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-card border border-border rounded-lg px-2 py-1 text-[10px] sm:text-xs text-foreground">
              {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="ml-2">{filtered.length} total</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted/50 transition-colors">
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="text-[10px] sm:text-xs font-medium px-2">Page {page} of {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted/50 transition-colors">
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transaction Detail Drawer */}
      {selectedTxn && (
        <TransactionDetail txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportFormat("csv");
          setExportDateFrom("");
          setExportDateTo("");
        }}
        title="Export Transactions"
        description="Download your transaction history"
        size="md"
      >
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FileText className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Transaction Export</p>
              <p className="text-xs text-blue-700">
                Export includes transaction reference, date/time, type, amount, fee, net, status, and payer/beneficiary information.
              </p>
            </div>
          </div>

          {/* Format Selection */}
          <FormField
            label="Export Format"
            required
            description="Choose file format"
          >
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat("csv")}
                className={cn(
                  "flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all",
                  exportFormat === "csv"
                    ? "border-brand-teal bg-brand-teal/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">CSV</p>
                  <p className="text-xs text-muted-foreground">Spreadsheet format</p>
                </div>
                {exportFormat === "csv" && <Check className="size-4 text-brand-teal ml-auto" />}
              </button>
              <button
                onClick={() => setExportFormat("pdf")}
                className={cn(
                  "flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all",
                  exportFormat === "pdf"
                    ? "border-brand-navy bg-brand-navy/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">PDF</p>
                  <p className="text-xs text-muted-foreground">Print-ready report</p>
                </div>
                {exportFormat === "pdf" && <Check className="size-4 text-brand-navy ml-auto" />}
              </button>
            </div>
          </FormField>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              required
              description="From date"
            >
              <DatePicker
                value={exportDateFrom}
                onChange={setExportDateFrom}
                placeholder="Select start date"
                max={exportDateTo || undefined}
              />
            </FormField>
            <FormField
              label="End Date"
              required
              description="To date"
            >
              <DatePicker
                value={exportDateTo}
                onChange={setExportDateTo}
                placeholder="Select end date"
                min={exportDateFrom || undefined}
              />
            </FormField>
          </div>

          {/* Current Filters Notice */}
          {(statusFilter !== "all" || typeFilter !== "all" || search !== "") && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Active Filters</p>
                <p className="text-sm text-amber-700">
                  Export will include current filters: 
                  {statusFilter !== "all" && ` Status: ${statusFilter}`}
                  {typeFilter !== "all" && ` Type: ${typeFilter}`}
                  {search !== "" && ` Search: "${search}"`}
                </p>
              </div>
            </div>
          )}

          {/* Warning for large exports */}
          {exportDateFrom && exportDateTo && (
            (() => {
              const daysDiff = Math.ceil(
                (new Date(exportDateTo).getTime() - new Date(exportDateFrom).getTime()) / 86400000
              );
              if (daysDiff > 90) {
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      Large date range selected ({daysDiff} days). Export may take several minutes to generate.
                    </p>
                  </div>
                );
              }
              return null;
            })()
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowExportModal(false);
                setExportFormat("csv");
                setExportDateFrom("");
                setExportDateTo("");
              }}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              disabled={!exportDateFrom || !exportDateTo}
              onClick={() => {
                showToast(
                  "success",
                  "Export Started",
                  `Transactions export (${exportFormat.toUpperCase()}) is being generated. Download will start shortly.`
                );
                setShowExportModal(false);
                setExportFormat("csv");
                setExportDateFrom("");
                setExportDateTo("");
              }}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-xs sm:text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 order-1 sm:order-2"
            >
              <Download className="size-4" />
              Generate Export
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
