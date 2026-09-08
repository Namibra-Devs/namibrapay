'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Headphones, Clock, CheckCircle, XCircle, AlertTriangle, Search, Filter,
  MessageSquare, User, Building2, Calendar, Hash, Phone, Mail, ExternalLink,
  FileText, Download, Eye, X, Send, ArrowRight, Ban, TrendingUp, Activity,
  Shield, AlertCircle, DollarSign, ChevronDown, ChevronUp, RefreshCw, CreditCard,
  MapPin, Smartphone, Info,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import CustomSelect from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDate, formatGHS } from "@/lib/constants";
import { usePermission } from "@/hooks/use-role";
import {
  mockSupportTickets,
  mockTicketMessages,
  mockDisputes,
  mockRefundRequests,
  mockSlaMetrics,
  mockSecurityIncidents,
  getTicketCategoryLabel,
  getTicketCategoryColor,
} from "@/lib/support-mock-data";
import type { SupportTicket, Dispute, RefundRequest } from "@/lib/support-mock-data";

// ── Tabs ────────────────────────────────────────────────────────────────────
type Tab = "tickets" | "transactions" | "disputes" | "sla" | "incidents";

const TABS: { id: Tab; label: string }[] = [
  { id: "tickets", label: "Ticket Queue" },
  { id: "transactions", label: "Transaction Search" },
  { id: "disputes", label: "Disputes & Refunds" },
  { id: "sla", label: "SLA Tracker" },
  { id: "incidents", label: "Incident Log" },
];

// ── Status configs ──────────────────────────────────────────────────────────
const ticketStatusConfig: Record<SupportTicket["status"], { label: string; color: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-blue-50 text-blue-700 border-blue-200", icon: RefreshCw },
  waiting_merchant: { label: "Waiting Merchant", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Clock },
  resolved: { label: "Resolved", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const priorityConfig: Record<SupportTicket["priority"], { label: string; color: string }> = {
  low: { label: "Low", color: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", color: "bg-blue-50 text-blue-700 border-blue-200" },
  high: { label: "High", color: "bg-orange-50 text-orange-700 border-orange-200" },
  urgent: { label: "Urgent", color: "bg-red-50 text-red-700 border-red-200" },
};

const disputeStatusConfig: Record<Dispute["status"], { label: string; color: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  investigating: { label: "Investigating", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Search },
  resolved: { label: "Resolved", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  declined: { label: "Declined", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

const refundStatusConfig: Record<RefundRequest["status"], { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-50 text-purple-700 border-purple-200", icon: RefreshCw },
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function SupportPage() {
  const canView = usePermission("support.view");

  const [tab, setTab] = useState<Tab>("tickets");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Transaction detail modal
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  
  // Dispute initiation
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeTransactionRef, setDisputeTransactionRef] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeNotes, setDisputeNotes] = useState("");
  
  // Refund request
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTransactionRef, setRefundTransactionRef] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");
  
  // Transaction search filters
  const [txnSearchMerchant, setTxnSearchMerchant] = useState("all");
  const [txnSearchStatus, setTxnSearchStatus] = useState("all");
  
  const { showToast } = useToast();

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Headphones className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Support Tools is available to Support Lead and Super Admin roles only.</p>
      </div>
    );
  }

  const openTickets = mockSupportTickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const urgentTickets = mockSupportTickets.filter(t => t.priority === "urgent").length;
  const breachedSla = mockSupportTickets.filter(t => t.slaBreached).length;

  const ticketMessages = selectedTicket ? (mockTicketMessages[selectedTicket.id] || []) : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Support Tools
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ticket management · Transaction search · Disputes · SLA tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            {openTickets > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-medium">
                <Activity className="size-3" />
                {openTickets} active
              </span>
            )}
            {urgentTickets > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                <AlertTriangle className="size-3" />
                {urgentTickets} urgent
              </span>
            )}
            {breachedSla > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-xs font-medium">
                <Clock className="size-3" />
                {breachedSla} SLA breach
              </span>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                tab === t.id ? "bg-card shadow-sm border border-border text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}>
              {t.label}
              {t.id === "tickets" && openTickets > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500 text-white rounded-full text-[9px] font-bold">{openTickets}</span>
              )}
              {t.id === "disputes" && mockDisputes.filter(d => d.status === "open" || d.status === "investigating").length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[9px] font-bold">
                  {mockDisputes.filter(d => d.status === "open" || d.status === "investigating").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* ── TICKET QUEUE TAB ── */}
        {tab === "tickets" && (
          <>
            {/* Ticket List */}
            <div className={cn("flex flex-col transition-all duration-300 border-r border-border", selectedTicket ? "w-105 shrink-0" : "flex-1")}>
              <div className="px-6 py-4 border-b border-border bg-card/30">
                <div className="flex items-center gap-2 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-foreground text-background border-foreground">
                    All ({mockSupportTickets.length})
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    Open ({mockSupportTickets.filter(t => t.status === "open").length})
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    Urgent ({urgentTickets})
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    SLA Breach ({breachedSla})
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {mockSupportTickets.map((ticket) => {
                  const statusCfg = ticketStatusConfig[ticket.status];
                  const priorityCfg = priorityConfig[ticket.priority];
                  const StatusIcon = statusCfg.icon;
                  const isSelected = selectedTicket?.id === ticket.id;
                  const isUrgent = ticket.priority === "urgent" || ticket.priority === "high";

                  return (
                    <motion.button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(isSelected ? null : ticket)}
                      className={cn("w-full text-left px-6 py-4 hover:bg-muted/30 transition-colors",
                        isSelected && "bg-brand-mint/5 border-r-2 border-r-brand-mint",
                        isUrgent && !isSelected && "bg-red-50/30",
                        ticket.slaBreached && !isSelected && "bg-orange-50/30")}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                            isUrgent ? "bg-red-100" : "bg-brand-mint/20 border border-brand-mint/20")}>
                            <Headphones className={cn("size-4", isUrgent ? "text-red-600" : "text-[#1a7a5e]")} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-mono text-muted-foreground">{ticket.ticketNumber}</span>
                              <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", priorityCfg.color)}>
                                {priorityCfg.label}
                              </span>
                              {ticket.slaBreached && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-orange-50 text-orange-700 border-orange-200">
                                  <Clock className="size-2.5" /> SLA
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-sm truncate">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground truncate">{ticket.merchantName}</p>
                          </div>
                        </div>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0", statusCfg.color)}>
                          <StatusIcon className="size-2.5" />{statusCfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {ticket.responseCount} replies
                        </span>
                        {ticket.transactionRef && (
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Hash className="size-3" />
                            {ticket.transactionRef}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Ticket Detail Panel */}
            <AnimatePresence>
              {selectedTicket && (
                <motion.div
                  className="flex-1 flex flex-col overflow-hidden"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Detail header */}
                  <div className="px-6 py-4 border-b border-border bg-card/50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">{selectedTicket.ticketNumber}</span>
                          <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", 
                            getTicketCategoryColor(selectedTicket.category))}>
                            {getTicketCategoryLabel(selectedTicket.category)}
                          </span>
                          {selectedTicket.slaBreached && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-orange-50 text-orange-700 border-orange-200">
                              <Clock className="size-2.5" /> SLA Breached
                            </span>
                          )}
                        </div>
                        <h2 className="font-bold text-base leading-tight mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                          {selectedTicket.subject}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3" />
                            {selectedTicket.merchantName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(selectedTicket.createdAt)}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedTicket(null)} className="p-2 rounded-xl hover:bg-muted/50 transition-all">
                        <X className="size-4" />
                      </button>
                    </div>

                    {/* Status and Priority */}
                    <div className="flex items-center gap-2">
                      {(() => { const cfg = ticketStatusConfig[selectedTicket.status]; const I = cfg.icon; return (
                        <span className={cn("inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium", cfg.color)}>
                          <I className="size-3" />{cfg.label}
                        </span>
                      ); })()}
                      {(() => { const cfg = priorityConfig[selectedTicket.priority]; return (
                        <span className={cn("inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium", cfg.color)}>
                          {cfg.label} Priority
                        </span>
                      ); })()}
                    </div>
                  </div>

                  {/* Messages Thread */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Requester Info */}
                    <div className="bg-card border border-border rounded-2xl p-5">
                      <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                        Requester Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{selectedTicket.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="size-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{selectedTicket.requesterEmail}</span>
                        </div>
                        {selectedTicket.assignedTo && (
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            <User className="size-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Assigned to <span className="font-medium text-foreground">{selectedTicket.assignedTo}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Thread */}
                    <div className="space-y-3">
                      {ticketMessages.map((msg) => (
                        <div key={msg.id} className={cn("flex gap-3",
                          msg.authorType === "support" && "flex-row-reverse")}>
                          <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0",
                            msg.authorType === "support" ? "bg-brand-mint/20" : "bg-muted")}>
                            {msg.authorType === "support" ? (
                              <Headphones className="size-4 text-[#1a7a5e]" />
                            ) : (
                              <User className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className={cn("flex-1 min-w-0",
                            msg.authorType === "support" && "flex flex-col items-end")}>
                            <div className={cn("inline-block max-w-[85%] rounded-2xl p-4 border",
                              msg.authorType === "support" 
                                ? "bg-brand-mint/10 border-brand-mint/30"
                                : "bg-card border-border")}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold">{msg.author}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(msg.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Box */}
                    {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
                      <div className="bg-card border border-border rounded-2xl p-4">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your response..."
                          rows={4}
                          className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-mint/60 transition-all resize-none mb-3"
                        />
                        <div className="flex items-center justify-between">
                          <button className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <FileText className="size-3.5" /> Attach file
                          </button>
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 transition-all">
                              Close Ticket
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a7a5e] hover:bg-[#15614a] text-white text-xs font-medium transition-all">
                              <Send className="size-3.5" /> Send Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ── TRANSACTION SEARCH TAB ── */}
        {tab === "transactions" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Search Bar */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Cross-Merchant Transaction Search
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input
                  placeholder="Transaction reference..."
                  className="px-4 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-mint/60 transition-all"
                />
                <input
                  placeholder="Payer phone number..."
                  className="px-4 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-mint/60 transition-all"
                />
                <input
                  placeholder="Amount (GHS)..."
                  type="number"
                  className="px-4 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-brand-mint/60 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <CustomSelect
                    options={[
                      { value: "all", label: "All Merchants" },
                      { value: "kwame", label: "Kwame Organics Ltd" },
                      { value: "accra", label: "Accra Tech Hub" },
                      { value: "suma", label: "SumaFoods Ghana" },
                    ]}
                    value={txnSearchMerchant}
                    onChange={setTxnSearchMerchant}
                    placeholder="Select merchant..."
                    triggerClassName="rounded-xl"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <CustomSelect
                    options={[
                      { value: "all", label: "All Statuses" },
                      { value: "successful", label: "Successful" },
                      { value: "failed", label: "Failed" },
                      { value: "pending", label: "Pending" },
                    ]}
                    value={txnSearchStatus}
                    onChange={setTxnSearchStatus}
                    placeholder="Select status..."
                    triggerClassName="rounded-xl"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1a7a5e] hover:bg-[#15614a] text-white rounded-xl text-sm font-medium transition-all shrink-0">
                  <Search className="size-4" /> Search
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Tier 1 Access: Provider Information Visible</p>
                  <p className="text-sm text-blue-700">
                    As a Support Lead, you can see provider names, provider transaction IDs, and routing information. This data is hidden from merchants.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Search Results */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Recent Transactions (Sample)
              </h3>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Reference", "Merchant", "Amount", "Provider", "Status", "Date", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ref: "txn_940284", merchant: "Kwame Organics", amount: 125.50, provider: "MTN", providerId: "MTN-940284-2024", status: "failed", failReason: "Insufficient balance", date: new Date(Date.now() - 3600000), payer: "0244123456", payerName: "Kwame Mensah" },
                      { ref: "txn_920451", merchant: "SumaFoods Ghana", amount: 450.00, provider: "VOD", providerId: "VOD-920451-2024", status: "success", date: new Date(Date.now() - 7200000), payer: "0502345678", payerName: "Ama Asante" },
                      { ref: "txn_912345", merchant: "Accra Tech Hub", amount: 75.00, provider: "AT", providerId: "AT-912345-2024", status: "success", date: new Date(Date.now() - 14400000), payer: "0277654321", payerName: "Kofi Boateng" },
                    ].map((txn) => (
                      <tr 
                        key={txn.ref} 
                        className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedTransaction(txn)}
                      >
                        <td className="pl-5 pr-4 py-3.5 font-mono text-xs">{txn.ref}</td>
                        <td className="px-4 py-3.5">{txn.merchant}</td>
                        <td className="px-4 py-3.5 font-semibold">{formatGHS(txn.amount)}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 bg-muted rounded font-mono text-xs">{txn.provider}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium",
                            txn.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200")}>
                            {txn.status === "success" ? <CheckCircle className="size-2.5" /> : <XCircle className="size-2.5" />}
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {txn.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3.5">
                          <button 
                            className="p-1.5 hover:bg-muted rounded-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(txn);
                            }}
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── DISPUTES & REFUNDS TAB ── */}
        {tab === "disputes" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Open Disputes", value: String(mockDisputes.filter(d => d.status === "open" || d.status === "investigating").length), color: "#f59e0b", icon: AlertTriangle },
                { label: "Pending Refunds", value: String(mockRefundRequests.filter(r => r.status === "pending").length), color: "#3b82f6", icon: Clock },
                { label: "Completed This Month", value: String(mockRefundRequests.filter(r => r.status === "completed").length), color: "#10b981", icon: CheckCircle },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                    <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                      <Icon className="size-4" style={{ color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Disputes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                  Active Disputes ({mockDisputes.filter(d => d.status !== "resolved" && d.status !== "declined").length})
                </h2>
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-lavender hover:bg-[#a8a7dc] text-[#1a1a3e] rounded-xl text-sm font-medium transition-all"
                >
                  <AlertTriangle className="size-4" /> Initiate Dispute
                </button>
              </div>
              <div className="space-y-3">
                {mockDisputes.map((dispute) => {
                  const cfg = disputeStatusConfig[dispute.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={dispute.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono text-muted-foreground">{dispute.disputeNumber}</span>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", cfg.color)}>
                              <Icon className="size-2.5" />{cfg.label}
                            </span>
                            {dispute.escalatedToProvider && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-orange-50 text-orange-700 border-orange-200">
                                Escalated to Provider
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-sm mb-1">{dispute.merchantName}</p>
                          <p className="text-sm text-muted-foreground mb-2">{dispute.reason}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Hash className="size-3" />
                              {dispute.transactionRef}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="size-3" />
                              {formatGHS(dispute.amount)}
                            </span>
                            {dispute.customerName && (
                              <span className="flex items-center gap-1">
                                <User className="size-3" />
                                {dispute.customerName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-[#1a7a5e]" style={{ fontFamily: "var(--font-heading)" }}>{formatGHS(dispute.amount)}</p>
                          {dispute.status === "open" && (
                            <button className="mt-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all">
                              Investigate
                            </button>
                          )}
                        </div>
                      </div>
                      {dispute.resolution && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-xs font-semibold text-emerald-900 mb-1">Resolution</p>
                          <p className="text-xs text-emerald-700">{dispute.resolution}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Refund Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                  Refund Requests ({mockRefundRequests.length})
                </h2>
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-[#52b4b1] text-white rounded-xl text-sm font-medium transition-all"
                >
                  <DollarSign className="size-4" /> Request Refund
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Refund #", "Merchant", "Amount", "Reason", "Status", "Requested", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockRefundRequests.map((refund) => {
                      const cfg = refundStatusConfig[refund.status];
                      const Icon = cfg.icon;
                      return (
                        <tr key={refund.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="pl-5 pr-4 py-3.5 font-mono text-xs">{refund.refundNumber}</td>
                          <td className="px-4 py-3.5">{refund.merchantName}</td>
                          <td className="px-4 py-3.5 font-semibold">{formatGHS(refund.amount)}</td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-xs truncate">{refund.reason}</td>
                          <td className="px-4 py-3.5">
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", cfg.color)}>
                              <Icon className="size-2.5" />{cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {new Date(refund.requestedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                          </td>
                          <td className="px-4 py-3.5">
                            {refund.status === "pending" && (
                              <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all">
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SLA TRACKER TAB ── */}
        {tab === "sla" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Overview Cards */}
            <div className="grid grid-cols-4 gap-4">
              {mockSlaMetrics.map((sla) => {
                const totalIssues = sla.openIssues.critical + sla.openIssues.major + sla.openIssues.minor;
                const isCritical = sla.openIssues.critical > 0 || sla.complianceRate < 80;
                return (
                  <div key={sla.providerId} className={cn("bg-card border rounded-2xl p-5",
                    isCritical ? "border-red-200 shadow-sm" : "border-border")}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold font-mono text-muted-foreground">{sla.providerName.split(" ")[0]}</span>
                      <span className={cn("text-xs font-semibold",
                        sla.complianceRate >= 95 ? "text-emerald-600" : sla.complianceRate >= 85 ? "text-amber-600" : "text-red-600")}>
                        {sla.complianceRate.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>{totalIssues}</p>
                    <p className="text-xs text-muted-foreground">open issues</p>
                    {sla.breachedCount > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-red-600 font-medium">{sla.breachedCount} SLA breaches</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Enhanced SLA Breakdown by Severity (PD-044) ── */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    SLA Performance by Severity
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Detailed tracking of response and resolution times vs contractual SLA targets
                  </p>
                </div>
                <Activity className="size-8 text-brand-teal" />
              </div>

              {/* Severity Breakdown */}
              <div className="space-y-6">
                {(() => {
                  const severityBreakdown = [
                    {
                      severity: "Critical",
                      icon: AlertCircle,
                      color: "red",
                      slaResponseTarget: 1,
                      slaResolutionTarget: 4,
                      tickets: [
                        { id: "T-1047", merchant: "PayFast Ghana", issue: "Payment gateway timeout", elapsedResponse: 0.5, elapsedResolution: 2.8 },
                        { id: "T-1051", merchant: "QuickPay Solutions", issue: "Failed disbursements", elapsedResponse: 1.2, elapsedResolution: 3.5 },
                      ],
                    },
                    {
                      severity: "High",
                      icon: AlertTriangle,
                      color: "orange",
                      slaResponseTarget: 2,
                      slaResolutionTarget: 8,
                      tickets: [
                        { id: "T-1045", merchant: "EduPay Platform", issue: "Delayed notifications", elapsedResponse: 1.8, elapsedResolution: 6.2 },
                        { id: "T-1048", merchant: "MediCare Payments", issue: "Reconciliation mismatch", elapsedResponse: 2.5, elapsedResolution: 9.1 },
                        { id: "T-1050", merchant: "TransPort Express", issue: "Webhook failures", elapsedResponse: 1.3, elapsedResolution: 5.8 },
                      ],
                    },
                    {
                      severity: "Medium",
                      icon: Info,
                      color: "blue",
                      slaResponseTarget: 4,
                      slaResolutionTarget: 24,
                      tickets: [
                        { id: "T-1042", merchant: "AgriTech Hub", issue: "Dashboard loading slow", elapsedResponse: 3.2, elapsedResolution: 18.5 },
                        { id: "T-1046", merchant: "UtilityBill Pro", issue: "Report export error", elapsedResponse: 5.1, elapsedResolution: 26.3 },
                      ],
                    },
                  ];

                  return severityBreakdown.map((item) => {
                    const Icon = item.icon;
                    const activeTickets = item.tickets.length;
                    const breachedResponse = item.tickets.filter(t => t.elapsedResponse > item.slaResponseTarget).length;
                    const breachedResolution = item.tickets.filter(t => t.elapsedResolution > item.slaResolutionTarget).length;

                    return (
                      <div key={item.severity} className="border border-border rounded-xl p-5 space-y-4">
                        {/* Severity Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "size-10 rounded-xl flex items-center justify-center",
                              item.color === "red" ? "bg-red-50" :
                              item.color === "orange" ? "bg-orange-50" : "bg-blue-50"
                            )}>
                              <Icon className={cn(
                                "size-5",
                                item.color === "red" ? "text-red-600" :
                                item.color === "orange" ? "text-orange-600" : "text-blue-600"
                              )} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold">{item.severity} Priority</h3>
                              <p className="text-xs text-muted-foreground">
                                SLA: {item.slaResponseTarget}h response / {item.slaResolutionTarget}h resolution
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                              {activeTickets}
                            </p>
                            <p className="text-xs text-muted-foreground">active tickets</p>
                          </div>
                        </div>

                        {/* Ticket Breakdown */}
                        {activeTickets > 0 && (
                          <div className="space-y-3">
                            {item.tickets.map((ticket) => {
                              const responseBreached = ticket.elapsedResponse > item.slaResponseTarget;
                              const resolutionBreached = ticket.elapsedResolution > item.slaResolutionTarget;
                              const responsePercent = Math.min((ticket.elapsedResponse / item.slaResponseTarget) * 100, 100);
                              const resolutionPercent = Math.min((ticket.elapsedResolution / item.slaResolutionTarget) * 100, 100);

                              return (
                                <div key={ticket.id} className={cn(
                                  "bg-muted/30 rounded-lg p-4 border",
                                  (responseBreached || resolutionBreached) ? "border-red-200 bg-red-50/30" : "border-border"
                                )}>
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono font-semibold text-muted-foreground">{ticket.id}</span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs font-medium">{ticket.merchant}</span>
                                      </div>
                                      <p className="text-sm">{ticket.issue}</p>
                                    </div>
                                    {(responseBreached || resolutionBreached) && (
                                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium border border-red-200">
                                        <XCircle className="size-3" /> SLA BREACHED
                                      </span>
                                    )}
                                  </div>

                                  {/* Progress Bars */}
                                  <div className="space-y-2">
                                    {/* Response Time */}
                                    <div>
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Response Time</span>
                                        <span className={cn("font-semibold", responseBreached && "text-red-600")}>
                                          {ticket.elapsedResponse.toFixed(1)}h / {item.slaResponseTarget}h
                                        </span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className={cn("h-full rounded-full transition-all",
                                            responseBreached ? "bg-red-500" :
                                            responsePercent > 80 ? "bg-amber-500" : "bg-emerald-500"
                                          )}
                                          style={{ width: `${responsePercent}%` }}
                                        />
                                      </div>
                                    </div>

                                    {/* Resolution Time */}
                                    <div>
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Resolution Time</span>
                                        <span className={cn("font-semibold", resolutionBreached && "text-red-600")}>
                                          {ticket.elapsedResolution.toFixed(1)}h / {item.slaResolutionTarget}h
                                        </span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className={cn("h-full rounded-full transition-all",
                                            resolutionBreached ? "bg-red-500" :
                                            resolutionPercent > 80 ? "bg-amber-500" : "bg-emerald-500"
                                          )}
                                          style={{ width: `${resolutionPercent}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Summary */}
                        {(breachedResponse > 0 || breachedResolution > 0) && (
                          <div className="pt-3 border-t border-border flex items-center gap-2 text-xs">
                            <XCircle className="size-4 text-red-600" />
                            <span className="text-red-600 font-medium">
                              {breachedResponse} response breach{breachedResponse !== 1 ? 'es' : ''}, {breachedResolution} resolution breach{breachedResolution !== 1 ? 'es' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Detailed SLA Table */}
            <div>
              <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Provider SLA Performance
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Provider", "Critical", "Major", "Minor", "Avg Response", "Avg Resolution", "Target", "Breached", "Compliance"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockSlaMetrics.map((sla) => {
                      const responseBreached = sla.avgResponseTime > sla.slaTarget.responseTime;
                      const resolutionBreached = sla.avgResolutionTime > sla.slaTarget.resolutionTime;
                      return (
                        <tr key={sla.providerId} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="pl-5 pr-4 py-3.5 font-medium">{sla.providerName}</td>
                          <td className="px-4 py-3.5">
                            {sla.openIssues.critical > 0 ? (
                              <span className="inline-flex items-center justify-center size-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                {sla.openIssues.critical}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            {sla.openIssues.major > 0 ? (
                              <span className="inline-flex items-center justify-center size-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                                {sla.openIssues.major}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            {sla.openIssues.minor > 0 ? (
                              <span className="inline-flex items-center justify-center size-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                {sla.openIssues.minor}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn("text-sm font-medium", responseBreached && "text-red-600")}>
                              {sla.avgResponseTime.toFixed(1)}h
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn("text-sm font-medium", resolutionBreached && "text-red-600")}>
                              {sla.avgResolutionTime.toFixed(1)}h
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {sla.slaTarget.responseTime}h / {sla.slaTarget.resolutionTime}h
                          </td>
                          <td className="px-4 py-3.5">
                            {sla.breachedCount > 0 ? (
                              <span className="text-sm font-bold text-red-600">{sla.breachedCount}</span>
                            ) : (
                              <span className="text-emerald-600">✓</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all",
                                    sla.complianceRate >= 95 ? "bg-emerald-500" : sla.complianceRate >= 85 ? "bg-amber-500" : "bg-red-500")}
                                  style={{ width: `${sla.complianceRate}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold w-10 text-right">{sla.complianceRate.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── INCIDENT LOG TAB ── */}
        {tab === "incidents" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Info Banner */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">Security Incident Reporting — 24-Hour Requirement</p>
                  <p className="text-sm text-red-700">
                    Per contractual obligation, all security incidents must be reported to affected providers within 24 hours of detection.
                  </p>
                </div>
              </div>
            </div>

            {/* Incident Cards */}
            <div className="space-y-4">
              {mockSecurityIncidents.map((incident) => {
                const severityConfig = {
                  critical: { color: "bg-red-100", textColor: "text-red-700", borderColor: "border-red-200" },
                  high: { color: "bg-orange-100", textColor: "text-orange-700", borderColor: "border-orange-200" },
                  medium: { color: "bg-amber-100", textColor: "text-amber-700", borderColor: "border-amber-200" },
                  low: { color: "bg-blue-100", textColor: "text-blue-700", borderColor: "border-blue-200" },
                }[incident.severity];

                const statusConfig = {
                  detected: { label: "Detected", color: "bg-amber-50 text-amber-700 border-amber-200" },
                  investigating: { label: "Investigating", color: "bg-blue-50 text-blue-700 border-blue-200" },
                  contained: { label: "Contained", color: "bg-purple-50 text-purple-700 border-purple-200" },
                  resolved: { label: "Resolved", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                }[incident.status];

                return (
                  <div key={incident.id} className={cn("bg-card border rounded-2xl p-6",
                    incident.severity === "critical" ? "border-red-200 shadow-sm" : "border-border")}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", severityConfig.color)}>
                          <Shield className={cn("size-5", severityConfig.textColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono text-muted-foreground">{incident.incidentNumber}</span>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase", severityConfig.borderColor, severityConfig.textColor, "bg-opacity-50")}>
                              {incident.severity}
                            </span>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusConfig.color)}>
                              {statusConfig.label}
                            </span>
                            {incident.reportedToProvider && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="size-2.5" /> Reported to Provider
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-base mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                            {incident.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              Detected {new Date(incident.detectedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="size-3" />
                              {incident.assignedTo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Impact Assessment */}
                    <div className="bg-muted/30 border border-border rounded-xl p-4 mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Impact Assessment</p>
                      <p className="text-sm">{incident.impactAssessment}</p>
                    </div>

                    {/* Mitigation Steps */}
                    {incident.mitigationSteps && incident.mitigationSteps.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mitigation Steps</p>
                        <ul className="space-y-1">
                          {incident.mitigationSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resolution */}
                    {incident.resolutionNotes && (
                      <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-xs font-semibold text-emerald-900 mb-1">Resolution Notes</p>
                        <p className="text-sm text-emerald-700">{incident.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal (PD-041) */}
      <Modal
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
        description={selectedTransaction ? `Reference: ${selectedTransaction.ref}` : ""}
        size="lg"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={cn("rounded-xl p-4 flex items-start gap-3",
              selectedTransaction.status === "success" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200")}>
              {selectedTransaction.status === "success" ? (
                <CheckCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={cn("text-sm font-semibold mb-1", 
                  selectedTransaction.status === "success" ? "text-emerald-900" : "text-red-900")}>
                  {selectedTransaction.status === "success" ? "Transaction Successful" : "Transaction Failed"}
                </p>
                {selectedTransaction.failReason && (
                  <p className="text-sm text-red-700">Reason: {selectedTransaction.failReason}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatGHS(selectedTransaction.amount)}
                </p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Transaction Ref</p>
                <p className="text-sm font-mono">{selectedTransaction.ref}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Merchant</p>
                <p className="text-sm font-semibold">{selectedTransaction.merchant}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Provider</p>
                <p className="text-sm">
                  <span className="px-2 py-0.5 bg-muted rounded font-mono text-xs">{selectedTransaction.provider}</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Provider Transaction ID</p>
                <p className="font-mono text-xs">{selectedTransaction.providerId}</p>
              </div>
            </div>

            {/* Payer Details */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Payer Information</p>
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">{selectedTransaction.payerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{selectedTransaction.payer}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Transaction Timeline</p>
              <div className="space-y-3">
                {[
                  { time: "10:45:12 AM", event: "Payment initiated by customer", icon: User },
                  { time: "10:45:15 AM", event: "Request sent to provider", icon: ArrowRight },
                  { time: "10:45:18 AM", event: selectedTransaction.status === "success" ? "Payment confirmed by provider" : "Payment declined by provider", icon: selectedTransaction.status === "success" ? CheckCircle : XCircle },
                  { time: "10:45:19 AM", event: "Webhook sent to merchant", icon: Send },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0",
                      idx === 2 && selectedTransaction.status === "failed" ? "bg-red-50" : "bg-emerald-50")}>
                      <step.icon className={cn("size-4",
                        idx === 2 && selectedTransaction.status === "failed" ? "text-red-600" : "text-emerald-600")} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm font-medium">{step.event}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDisputeTransactionRef(selectedTransaction.ref);
                  setSelectedTransaction(null);
                  setShowDisputeModal(true);
                }}
                className="flex-1 px-4 py-2.5 bg-brand-lavender hover:bg-[#a8a7dc] text-[#1a1a3e] rounded-xl text-sm font-medium transition-all"
              >
                Initiate Dispute
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Initiate Dispute Modal (PD-043) */}
      <Modal
        isOpen={showDisputeModal}
        onClose={() => {
          setShowDisputeModal(false);
          setDisputeTransactionRef("");
          setDisputeReason("");
          setDisputeNotes("");
        }}
        title="Initiate Dispute"
        description="Create a new dispute case and route to Finance team"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Dispute Workflow</p>
              <p className="text-sm text-blue-700">
                This dispute will be routed to the Finance team for investigation. Provider escalation requires Finance Manager approval.
              </p>
            </div>
          </div>

          {/* Transaction Reference */}
          <FormField
            label="Transaction Reference"
            required
            description="The transaction being disputed"
          >
            <Input
              type="text"
              value={disputeTransactionRef}
              onChange={(e) => setDisputeTransactionRef(e.target.value)}
              placeholder="txn_XXXXXX"
            />
          </FormField>

          {/* Dispute Reason */}
          <FormField
            label="Dispute Reason"
            required
            description="Category of the dispute"
          >
            <CustomSelect
              value={disputeReason}
              onChange={setDisputeReason}
              options={[
                { value: "payment_not_received", label: "Payment not received by merchant" },
                { value: "duplicate_charge", label: "Duplicate charge" },
                { value: "unauthorized", label: "Unauthorized transaction" },
                { value: "wrong_amount", label: "Wrong amount charged" },
                { value: "provider_error", label: "Provider system error" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select reason..."
            />
          </FormField>

          {/* Investigation Notes */}
          <FormField
            label="Investigation Notes"
            required
            description="Details to help Finance team investigate"
          >
            <Textarea
              rows={4}
              value={disputeNotes}
              onChange={(e) => setDisputeNotes(e.target.value)}
              placeholder="Describe the issue, what the merchant reported, any supporting evidence..."
            />
          </FormField>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              The merchant will be notified that a dispute has been initiated. Finance team will investigate within 48 hours.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowDisputeModal(false);
                setDisputeTransactionRef("");
                setDisputeReason("");
                setDisputeNotes("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!disputeTransactionRef.trim() || !disputeReason || !disputeNotes.trim()}
              onClick={() => {
                showToast("success", "Dispute Initiated", `Case created and routed to Finance team for investigation`);
                setShowDisputeModal(false);
                setDisputeTransactionRef("");
                setDisputeReason("");
                setDisputeNotes("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-lavender hover:bg-[#a8a7dc] text-[#1a1a3e] rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Dispute
            </button>
          </div>
        </div>
      </Modal>

      {/* Request Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setRefundTransactionRef("");
          setRefundAmount("");
          setRefundReason("");
          setRefundNotes("");
        }}
        title="Request Refund"
        description="Create refund request requiring approval workflow"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Approval Required</p>
              <p className="text-sm text-blue-700">
                Refunds require Finance Manager approval. Approved refunds are processed within 3-5 business days.
              </p>
            </div>
          </div>

          {/* Transaction Reference */}
          <FormField
            label="Transaction Reference"
            required
            description="Original successful transaction to refund"
          >
            <Input
              type="text"
              value={refundTransactionRef}
              onChange={(e) => setRefundTransactionRef(e.target.value)}
              placeholder="txn_XXXXXX"
            />
          </FormField>

          {/* Refund Amount */}
          <FormField
            label="Refund Amount (GHS)"
            required
            description="Full or partial refund amount"
          >
            <Input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="0.00"
            />
          </FormField>

          {/* Refund Reason */}
          <FormField
            label="Refund Reason"
            required
            description="Category of the refund"
          >
            <CustomSelect
              value={refundReason}
              onChange={setRefundReason}
              options={[
                { value: "customer_request", label: "Customer request" },
                { value: "service_issue", label: "Service/product issue" },
                { value: "duplicate_payment", label: "Duplicate payment" },
                { value: "merchant_error", label: "Merchant error" },
                { value: "goodwill", label: "Goodwill refund" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select reason..."
            />
          </FormField>

          {/* Additional Notes */}
          <FormField
            label="Additional Notes"
            required
            description="Justification for the refund request"
          >
            <Textarea
              rows={4}
              value={refundNotes}
              onChange={(e) => setRefundNotes(e.target.value)}
              placeholder="Explain why this refund is warranted, any communications with customer..."
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowRefundModal(false);
                setRefundTransactionRef("");
                setRefundAmount("");
                setRefundReason("");
                setRefundNotes("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!refundTransactionRef.trim() || !refundAmount || !refundReason || !refundNotes.trim()}
              onClick={() => {
                showToast("info", "Refund Request Submitted", `Request for ${formatGHS(parseFloat(refundAmount))} sent to Finance Manager for approval`);
                setShowRefundModal(false);
                setRefundTransactionRef("");
                setRefundAmount("");
                setRefundReason("");
                setRefundNotes("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-teal hover:bg-[#52b4b1] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
