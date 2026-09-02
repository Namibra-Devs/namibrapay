'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck, ShieldAlert, Clock, CheckCircle, XCircle, AlertTriangle,
  FileText, Download, Eye, X, ChevronRight, User, Mail, Phone, Building2,
  Calendar, Hash, Check, Ban, MessageSquare, Upload, ExternalLink, DollarSign,
  Lock, Unlock,
} from "lucide-react";
import { Modal, useToast, FormField, Textarea, ConfirmDialog } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatDate, formatGHS } from "@/lib/constants";
import { usePermission } from "@/hooks/use-role";
import {
  mockKycApplications,
  mockAmlFlags,
  mockRiskScores,
  mockRetentionDocuments,
  getDocumentTypeLabel,
  formatFileSize,
} from "@/lib/compliance-mock-data";
import type { KycApplication, KycDocument } from "@/lib/compliance-mock-data";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// ── Tabs ────────────────────────────────────────────────────────────────────
type Tab = "kyc_queue" | "aml_monitoring" | "retention" | "reports";

const TABS: { id: Tab; label: string }[] = [
  { id: "kyc_queue", label: "KYC Queue" },
  { id: "aml_monitoring", label: "AML Monitoring" },
  { id: "retention", label: "Document Retention" },
  { id: "reports", label: "Reports" },
];

// ── Status configs ──────────────────────────────────────────────────────────
const applicationStatusConfig: Record<KycApplication["status"], { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  info_requested: { label: "Info Requested", color: "bg-blue-50 text-blue-700 border-blue-200", icon: MessageSquare },
  approved: { label: "Approved", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

const docStatusConfig: Record<KycDocument["status"], { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

// ── Document Viewer Modal ───────────────────────────────────────────────────
function DocumentViewerModal({ doc, onClose }: { doc: KycDocument; onClose: () => void }) {
  const isPdf = doc.fileName.endsWith('.pdf');
  const isImage = doc.fileName.match(/\.(jpg|jpeg|png)$/i);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#bcbbee]/20 flex items-center justify-center">
              <FileText className="size-4 text-[#5c3d9e]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{getDocumentTypeLabel(doc.type)}</h3>
              <p className="text-xs text-muted-foreground font-mono">{doc.fileName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-xl transition-all">
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPdf ? (
            <div className="bg-muted/30 rounded-xl p-12 text-center space-y-4">
              <FileText className="size-16 text-muted-foreground/40 mx-auto" />
              <div>
                <p className="text-sm font-medium text-foreground">PDF Document Preview</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Full PDF viewer would render here in production
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium mx-auto transition-all">
                <Download className="size-4" /> Download PDF
              </button>
            </div>
          ) : isImage ? (
            <div className="bg-muted/30 rounded-xl p-12 text-center space-y-4">
              <div className="w-full max-w-2xl mx-auto bg-white rounded-xl border-2 border-dashed border-border p-8">
                <FileText className="size-24 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Image preview: {doc.fileName}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#263b8e] hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium mx-auto transition-all">
                <Download className="size-4" /> Download Image
              </button>
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-12 text-center">
              <p className="text-sm text-muted-foreground">Document type not supported for preview</p>
            </div>
          )}
        </div>

        {/* Footer with document info */}
        <div className="px-6 py-4 border-t border-border bg-muted/20">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground mb-0.5">Uploaded</p>
              <p className="font-medium">{formatDate(doc.uploadedAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Status</p>
              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium", docStatusConfig[doc.status].color)}>
                {(() => { const Icon = docStatusConfig[doc.status].icon; return <Icon className="size-2.5" />; })()}
                {docStatusConfig[doc.status].label}
              </span>
            </div>
            {doc.reviewedBy && (
              <div>
                <p className="text-muted-foreground mb-0.5">Reviewed by</p>
                <p className="font-medium">{doc.reviewedBy}</p>
              </div>
            )}
          </div>
          {doc.rejectionReason && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">{doc.rejectionReason}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function CompliancePage() {
  const canView = usePermission("compliance.view");
  const canApprove = usePermission("compliance.approve");

  const [tab, setTab] = useState<Tab>("kyc_queue");
  const [selectedApp, setSelectedApp] = useState<KycApplication | null>(null);
  const [viewingDoc, setViewingDoc] = useState<KycDocument | null>(null);
  const [approvalModal, setApprovalModal] = useState<{ app: KycApplication; action: "approve" | "reject" | "request_info" } | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [showComplianceHoldModal, setShowComplianceHoldModal] = useState<KycApplication | null>(null);
  const [holdReason, setHoldReason] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMerchantId, setExportMerchantId] = useState("");
  const { showToast } = useToast();

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <ShieldCheck className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Compliance & KYC is available to Compliance and Super Admin roles only.</p>
      </div>
    );
  }

  const pendingCount = mockKycApplications.filter(a => a.status === "pending").length;
  const infoRequestedCount = mockKycApplications.filter(a => a.status === "info_requested").length;
  const openAmlFlags = mockAmlFlags.filter(f => f.status === "open" || f.status === "investigating").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Compliance & KYC
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Application review · KYC documents · AML monitoring · Regulatory compliance
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium">
                <Clock className="size-3" />
                {pendingCount} pending review
              </span>
            )}
            {openAmlFlags > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                <AlertTriangle className="size-3" />
                {openAmlFlags} AML flag{openAmlFlags > 1 ? "s" : ""}
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
              {t.id === "kyc_queue" && (pendingCount + infoRequestedCount) > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[9px] font-bold">{pendingCount + infoRequestedCount}</span>
              )}
              {t.id === "aml_monitoring" && openAmlFlags > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-bold">{openAmlFlags}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* ── KYC QUEUE TAB ── */}
        {tab === "kyc_queue" && (
          <>
            {/* Application List */}
            <div className={cn("flex flex-col transition-all duration-300 border-r border-border", selectedApp ? "w-[420px] shrink-0" : "flex-1")}>
              <div className="px-6 py-4 border-b border-border bg-card/30">
                <div className="flex items-center gap-2 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-foreground text-background border-foreground">
                    All ({mockKycApplications.length})
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    Pending ({pendingCount})
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    Info Requested ({infoRequestedCount})
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {mockKycApplications.map((app) => {
                  const cfg = applicationStatusConfig[app.status];
                  const Icon = cfg.icon;
                  const isSelected = selectedApp?.id === app.id;
                  const isPending = app.status === "pending" || app.status === "info_requested";

                  return (
                    <motion.button
                      key={app.id}
                      onClick={() => setSelectedApp(isSelected ? null : app)}
                      className={cn("w-full text-left px-6 py-4 hover:bg-muted/30 transition-colors",
                        isSelected && "bg-[#bcbbee]/5 border-r-2 border-r-[#bcbbee]",
                        isPending && !isSelected && "bg-amber-50/30")}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="size-9 rounded-xl bg-[#bcbbee]/20 border border-[#bcbbee]/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 className="size-4 text-[#5c3d9e]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{app.merchantName}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">{app.registrationNumber}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.industry}</p>
                          </div>
                        </div>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0", cfg.color)}>
                          <Icon className="size-2.5" />{cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(app.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="size-3" />
                          {app.documents.length} doc{app.documents.length > 1 ? "s" : ""}
                        </span>
                        {app.applicationType === "sub_merchant" && (
                          <span className="px-1.5 py-0.5 bg-[#a3ffe2]/30 text-[#1a7a5e] rounded text-[10px] font-medium">Sub-merchant</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Application Detail Panel */}
            <AnimatePresence>
              {selectedApp && (
                <motion.div
                  className="flex-1 flex flex-col overflow-hidden"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Detail header */}
                  <div className="px-6 py-4 border-b border-border bg-card/50 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-[#bcbbee]/20 flex items-center justify-center shrink-0">
                        <Building2 className="size-5 text-[#5c3d9e]" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                          {selectedApp.merchantName}
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono">{selectedApp.registrationNumber}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {(() => { const cfg = applicationStatusConfig[selectedApp.status]; const I = cfg.icon; return (
                            <span className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium", cfg.color)}>
                              <I className="size-2.5" />{cfg.label}
                            </span>
                          ); })()}
                          {selectedApp.applicationType === "sub_merchant" && (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium bg-[#a3ffe2]/20 text-[#1a7a5e] border-[#a3ffe2]/50">
                              Sub-merchant
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="p-2 rounded-xl hover:bg-muted/50 transition-all">
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Detail content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Applicant Info */}
                    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                        <User className="size-4 text-[#5c3d9e]" />
                        Applicant Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: Mail, label: "Email", value: selectedApp.contactEmail },
                          { icon: Phone, label: "Phone", value: selectedApp.contactPhone },
                          { icon: Building2, label: "Industry", value: selectedApp.industry },
                          { icon: Calendar, label: "Submitted", value: new Date(selectedApp.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-2">
                            <Icon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                              <p className="text-sm font-medium">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedApp.assignedTo && (
                        <div className="pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">
                            Assigned to <span className="font-medium text-foreground">{selectedApp.assignedTo}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                        <FileText className="size-4 text-[#5c3d9e]" />
                        KYC Documents ({selectedApp.documents.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedApp.documents.map((doc) => {
                          const cfg = docStatusConfig[doc.status];
                          const Icon = cfg.icon;
                          return (
                            <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="size-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                  <FileText className="size-3.5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{getDocumentTypeLabel(doc.type)}</p>
                                  <p className="text-xs text-muted-foreground font-mono truncate">{doc.fileName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", cfg.color)}>
                                  <Icon className="size-2.5" />{cfg.label}
                                </span>
                                <button onClick={() => setViewingDoc(doc)}
                                  className="p-1.5 hover:bg-muted rounded-lg transition-all">
                                  <Eye className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Info Request Message */}
                    {selectedApp.infoRequestMessage && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="size-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Additional Information Requested</p>
                            <p className="text-sm text-blue-700">{selectedApp.infoRequestMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Review Notes */}
                    {selectedApp.reviewNotes && (
                      <div className="bg-muted/30 border border-border rounded-2xl p-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Internal Notes</p>
                        <p className="text-sm">{selectedApp.reviewNotes}</p>
                      </div>
                    )}

                    {/* Provider Approvals */}
                    {selectedApp.providerApprovals && (
                      <div className="bg-card border border-border rounded-2xl p-5">
                        <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                          Provider Compliance Status
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedApp.providerApprovals).map(([provider, approved]) => (
                            <div key={provider} className={cn("flex items-center justify-between p-2 rounded-lg border",
                              approved ? "bg-emerald-50 border-emerald-200" : "bg-muted border-border")}>
                              <span className="text-xs font-medium uppercase">{provider}</span>
                              {approved ? (
                                <CheckCircle className="size-3.5 text-emerald-600" />
                              ) : (
                                <Clock className="size-3.5 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {canApprove && (selectedApp.status === "pending" || selectedApp.status === "info_requested") && (
                      <div className="bg-card border border-border rounded-2xl p-5">
                        <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                          Review Actions
                        </h3>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <button
                            onClick={() => setApprovalModal({ app: selectedApp, action: "reject" })}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-destructive/30 text-destructive text-xs font-medium hover:bg-red-50 transition-all">
                            <XCircle className="size-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => setApprovalModal({ app: selectedApp, action: "request_info" })}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-blue-200 text-blue-700 bg-blue-50 text-xs font-medium hover:bg-blue-100 transition-all">
                            <MessageSquare className="size-3.5" /> Request Info
                          </button>
                          <button
                            onClick={() => setApprovalModal({ app: selectedApp, action: "approve" })}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all">
                            <CheckCircle className="size-3.5" /> Approve
                          </button>
                        </div>
                        <button
                          onClick={() => setShowComplianceHoldModal(selectedApp)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-all">
                          <Lock className="size-3.5" /> Place Compliance Hold
                        </button>
                      </div>
                    )}

                    {/* Approval Info */}
                    {selectedApp.approvedBy && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-emerald-900 mb-1">Application Approved</p>
                            <p className="text-sm text-emerald-700">
                              Approved by <span className="font-medium">{selectedApp.approvedBy}</span>
                              {selectedApp.approvedAt && ` on ${formatDate(selectedApp.approvedAt)}`}
                            </p>
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

        {/* ── AML MONITORING TAB ── */}
        {tab === "aml_monitoring" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Risk Overview Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Open Flags", value: String(mockAmlFlags.filter(f => f.status === "open").length), color: "#ef4444", icon: AlertTriangle },
                { label: "Investigating", value: String(mockAmlFlags.filter(f => f.status === "investigating").length), color: "#f59e0b", icon: Clock },
                { label: "High Risk Merchants", value: String(mockRiskScores.filter(r => r.level === "high").length), color: "#dc2626", icon: ShieldAlert },
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

            {/* AML Flags List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                  AML Flags ({mockAmlFlags.length})
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-foreground text-background border-foreground">
                    All
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    Open
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border transition-all bg-card border-border hover:bg-muted/50">
                    Critical
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {mockAmlFlags.map((flag) => {
                  const severityConfig = {
                    critical: { color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
                    high: { color: "bg-orange-50 text-orange-700 border-orange-200", icon: AlertTriangle },
                    medium: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle },
                    low: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: AlertTriangle },
                  }[flag.severity];

                  const statusConfig = {
                    open: { label: "Open", color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
                    investigating: { label: "Investigating", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
                    escalated: { label: "Escalated", color: "bg-orange-50 text-orange-700 border-orange-200", icon: ShieldAlert },
                    closed: { label: "Closed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
                    false_positive: { label: "False Positive", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
                  }[flag.status];

                  const Icon = statusConfig.icon;

                  return (
                    <div key={flag.id} className={cn("bg-card border rounded-2xl p-5", 
                      flag.severity === "critical" ? "border-red-200/60 shadow-sm" : "border-border")}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0",
                            flag.severity === "critical" ? "bg-red-100" : flag.severity === "high" ? "bg-orange-100" : "bg-amber-100")}>
                            <AlertTriangle className={cn("size-4",
                              flag.severity === "critical" ? "text-red-600" : flag.severity === "high" ? "text-orange-600" : "text-amber-600")} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-sm">{flag.merchantName}</p>
                              <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase shrink-0", severityConfig.color)}>
                                {flag.severity}
                              </span>
                              <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", statusConfig.color)}>
                                <Icon className="size-2.5" />{statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {flag.flagType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} · Flagged {new Date(flag.flaggedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-sm">{flag.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                        {flag.metadata.transactionCount && (
                          <span className="flex items-center gap-1">
                            <Hash className="size-3" />
                            {flag.metadata.transactionCount} txns
                          </span>
                        )}
                        {flag.metadata.totalAmount && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="size-3" />
                            {formatGHS(flag.metadata.totalAmount)}
                          </span>
                        )}
                        {flag.metadata.timeWindow && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {flag.metadata.timeWindow}
                          </span>
                        )}
                        {flag.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {flag.assignedTo}
                          </span>
                        )}
                      </div>

                      {/* Resolution */}
                      {flag.resolution && flag.status === "closed" && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-xs font-semibold text-emerald-900 mb-1">Resolution</p>
                          <p className="text-xs text-emerald-700">{flag.resolution}</p>
                          {flag.closedAt && (
                            <p className="text-xs text-emerald-600 mt-1">Closed {formatDate(flag.closedAt)}</p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {canApprove && (flag.status === "open" || flag.status === "investigating") && (
                        <div className="flex items-center gap-2 mt-3">
                          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 transition-all">
                            <Eye className="size-3.5" /> View Details
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#263b8e] hover:bg-[#1e2f72] text-white text-xs font-medium transition-all">
                            <MessageSquare className="size-3.5" /> Escalate
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Scores */}
            <div>
              <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Merchant Risk Scores
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Merchant", "Risk Score", "Level", "Velocity", "Ticket Size", "Industry", "Last Updated"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockRiskScores.map((risk) => {
                      const levelConfig = {
                        high: { color: "bg-red-50 text-red-700 border-red-200", barColor: "#dc2626" },
                        medium: { color: "bg-amber-50 text-amber-700 border-amber-200", barColor: "#f59e0b" },
                        low: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", barColor: "#10b981" },
                      }[risk.level];

                      return (
                        <tr key={risk.merchantId} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="pl-5 pr-4 py-3.5">
                            <p className="text-sm font-medium">{risk.merchantName}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${risk.score}%`, backgroundColor: levelConfig.barColor }} />
                              </div>
                              <span className="text-sm font-bold" style={{ color: levelConfig.barColor }}>{risk.score}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase", levelConfig.color)}>
                              {risk.level}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm">{risk.factors.transactionVelocity}</td>
                          <td className="px-4 py-3.5 text-sm">{risk.factors.averageTicketSize}</td>
                          <td className="px-4 py-3.5 text-sm">{risk.factors.industryRisk}</td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {new Date(risk.lastUpdated).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
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

        {/* ── DOCUMENT RETENTION TAB ── */}
        {tab === "retention" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Documents", value: String(mockRetentionDocuments.length), color: "#64c6c3", icon: FileText },
                { label: "Expiring Soon (<1yr)", value: String(mockRetentionDocuments.filter(d => d.daysUntilExpiry < 365).length), color: "#f59e0b", icon: Clock },
                { label: "Total Storage", value: `${(mockRetentionDocuments.reduce((sum, d) => sum + d.fileSize, 0) / (1024 * 1024)).toFixed(1)} MB`, color: "#263b8e", icon: Download },
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

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">6-Year Document Retention Policy</p>
                  <p className="text-sm text-blue-700">
                    All KYC documents are retained for 6 years from onboarding date as per Bank of Ghana Payment Systems Act 2019 and AML/CFT regulations. Documents are automatically archived after expiry.
                  </p>
                </div>
              </div>
            </div>

            {/* Document List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                  Retention Tracker ({mockRetentionDocuments.length} documents)
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-xs font-medium hover:bg-muted/50 transition-all">
                  <Download className="size-3.5" /> Export Report
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Merchant", "Document Type", "Retention Start", "Expiry Date", "Days Until Expiry", "File Size", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider first:pl-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockRetentionDocuments.map((doc) => {
                      const isExpiringSoon = doc.daysUntilExpiry < 365;
                      const isExpired = doc.daysUntilExpiry < 0;

                      return (
                        <tr key={doc.id} className={cn("border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
                          isExpiringSoon && !isExpired && "bg-amber-50/30")}>
                          <td className="pl-5 pr-4 py-3.5">
                            <p className="text-sm font-medium">{doc.merchantName}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <FileText className="size-3.5 text-muted-foreground" />
                              <span className="text-sm">{getDocumentTypeLabel(doc.documentType)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm">
                            {new Date(doc.retentionStart).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium">
                            {new Date(doc.retentionExpiry).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn("text-sm font-medium",
                              isExpired ? "text-muted-foreground" : isExpiringSoon ? "text-amber-600" : "text-foreground")}>
                              {isExpired ? "Expired" : `${doc.daysUntilExpiry} days`}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-muted-foreground font-mono">
                            {formatFileSize(doc.fileSize)}
                          </td>
                          <td className="px-4 py-3.5">
                            <button className="p-1.5 hover:bg-muted rounded-lg transition-all">
                              <Eye className="size-3.5 text-muted-foreground" />
                            </button>
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

        {/* ── REPORTS TAB ── */}
        {tab === "reports" && (
          <div className="p-6 space-y-6">
            {/* Export KYC Package */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    Export KYC Documentation Package
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generate complete KYC documentation package for a specific merchant (2-business-day contractual obligation)
                  </p>
                </div>
                <Download className="size-8 text-[#bcbbee]" />
              </div>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#bcbbee] hover:bg-[#a8a7dc] text-[#1a1a3e] rounded-xl text-sm font-medium transition-all"
              >
                <Download className="size-4" /> Export Package
              </button>
            </div>

            {/* Other Reports */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "AML Monitoring Report", desc: "Monthly AML/CFT activity summary", icon: ShieldAlert, color: "#ef4444" },
                { title: "KYC Status Export", desc: "Current compliance status for all merchants", icon: FileText, color: "#bcbbee" },
                { title: "Document Retention", desc: "6-year retention schedule report", icon: Calendar, color: "#64c6c3" },
                { title: "Regulatory Filing", desc: "Bank of Ghana compliance report", icon: Building2, color: "#263b8e" },
              ].map((report) => (
                <div key={report.title} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
                  <div className="size-10 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${report.color}18` }}>
                    <report.icon className="size-5" style={{ color: report.color }} />
                  </div>
                  <p className="text-sm font-semibold mb-1">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {viewingDoc && <DocumentViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}
      </AnimatePresence>

      {/* Approval Action Modal */}
      <AnimatePresence>
        {approvalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setApprovalModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="px-6 py-5 border-b border-border">
                <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  {approvalModal.action === "approve" && "Approve Application"}
                  {approvalModal.action === "reject" && "Reject Application"}
                  {approvalModal.action === "request_info" && "Request Additional Information"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {approvalModal.app.merchantName}
                </p>
              </div>
              <div className="px-6 py-5 space-y-4">
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={
                    approvalModal.action === "approve" ? "Optional approval notes..."
                    : approvalModal.action === "reject" ? "Rejection reason (required)..."
                    : "Specify what additional information is needed..."
                  }
                  rows={4}
                  className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-[#bcbbee]/60 transition-all resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setApprovalModal(null); setActionNote(""); }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle approval action
                      const actionText = approvalModal.action === "approve" ? "Approved" : 
                                        approvalModal.action === "reject" ? "Rejected" : "Info Requested";
                      const toastType = approvalModal.action === "approve" ? "success" : 
                                       approvalModal.action === "reject" ? "error" : "info";
                      
                      showToast(toastType, `Application ${actionText}`, `${approvalModal.app.merchantName} has been ${actionText.toLowerCase()}`);
                      setApprovalModal(null);
                      setActionNote("");
                    }}
                    className={cn("flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      approvalModal.action === "approve" ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : approvalModal.action === "reject" ? "bg-destructive hover:opacity-90 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white")}>
                    {approvalModal.action === "approve" && "Approve"}
                    {approvalModal.action === "reject" && "Reject"}
                    {approvalModal.action === "request_info" && "Send Request"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compliance Hold Modal */}
      <Modal
        isOpen={showComplianceHoldModal !== null}
        onClose={() => {
          setShowComplianceHoldModal(null);
          setHoldReason("");
        }}
        title="Place Compliance Hold"
        description={showComplianceHoldModal ? `Suspend ${showComplianceHoldModal.merchantName}` : ""}
        size="md"
      >
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <Lock className="size-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">Critical Action</p>
              <p className="text-sm text-red-700">
                This will immediately suspend all transaction processing for this merchant. Only Super Admin can override a compliance hold.
              </p>
            </div>
          </div>

          {/* Reason Field */}
          <FormField
            label="Hold Reason"
            required
            description="Document the compliance concern requiring this hold"
          >
            <Textarea
              rows={4}
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              placeholder="e.g., Suspected fraudulent activity, pending AML investigation, missing critical KYC documentation..."
            />
          </FormField>

          {/* Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              The merchant will be notified immediately. All API keys will be temporarily disabled. You'll need to coordinate with the merchant to resolve the compliance issue.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowComplianceHoldModal(null);
                setHoldReason("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!holdReason.trim()}
              onClick={() => {
                showToast("warning", "Compliance Hold Placed", `${showComplianceHoldModal?.merchantName} has been suspended`);
                setShowComplianceHoldModal(null);
                setHoldReason("");
              }}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Hold
            </button>
          </div>
        </div>
      </Modal>

      {/* Export KYC Package Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportMerchantId("");
        }}
        title="Export KYC Documentation Package"
        description="Generate complete KYC package for regulatory compliance"
        size="md"
      >
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FileText className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Contractual Obligation</p>
              <p className="text-sm text-blue-700">
                KYC documentation must be produced within 2 business days of request. This package includes all verified documents and approval history.
              </p>
            </div>
          </div>

          {/* Merchant Selection */}
          <FormField
            label="Merchant ID or Name"
            required
            description="Enter the merchant identifier to export documentation for"
          >
            <Input
              type="text"
              value={exportMerchantId}
              onChange={(e) => setExportMerchantId(e.target.value)}
              placeholder="MER-2024-0001 or Merchant Name"
            />
          </FormField>

          {/* Package Contents */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Package Includes</p>
            <div className="space-y-2">
              {[
                "Business registration certificate",
                "Director identification documents",
                "Proof of address",
                "Bank account verification",
                "Approval history and notes",
                "Provider-specific compliance status",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowExportModal(false);
                setExportMerchantId("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!exportMerchantId.trim()}
              onClick={() => {
                showToast("success", "Export Started", "KYC package will be generated and emailed to you within 2 business days");
                setShowExportModal(false);
                setExportMerchantId("");
              }}
              className="flex-1 px-4 py-2.5 bg-[#bcbbee] hover:bg-[#a8a7dc] text-[#1a1a3e] rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Export
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
