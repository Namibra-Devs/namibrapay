'use client';

import { useState } from "react";
import {
  ScrollText, Search, Filter, Calendar, User, Shield, AlertTriangle,
  CheckCircle, Clock, ChevronDown, ChevronUp, Download, RefreshCw,
  Eye, Lock, Settings, Activity, XCircle, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/constants";
import { usePermission } from "@/hooks/use-role";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/Toast";
import { FormField } from "@/components/ui/form-field";
import DatePicker from "@/components/ui/date-picker";
import CustomSelect from "@/components/ui/select";
import {
  mockAuditEvents,
  getEventTypeColor,
  getSeverityColor,
  getCategoryColor,
  filterAuditEvents,
  type AuditEvent,
  type AuditEventType,
  type AuditCategory,
  type AuditSeverity,
} from "@/lib/audit-mock-data";

// ── Main Component ──────────────────────────────────────────────────────────
export default function AuditLogPage() {
  const canView = usePermission("audit.view");
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<AuditEventType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | "all">("all");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <ScrollText className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Audit Log is available to all Platform Dashboard (Tier 1) roles.</p>
      </div>
    );
  }

  // Apply filters
  const filteredEvents = filterAuditEvents(mockAuditEvents, {
    eventType: selectedEventType !== "all" ? selectedEventType : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    severity: selectedSeverity !== "all" ? selectedSeverity : undefined,
    searchQuery: searchQuery || undefined,
  });

  // Stats
  const criticalCount = filteredEvents.filter(e => e.severity === "critical").length;
  const securityCount = filteredEvents.filter(e => e.eventType === "security_event").length;
  const todayCount = filteredEvents.filter(e => {
    const today = new Date();
    return e.timestamp.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Audit Log
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete audit trail · All actions tracked · Actor accountability
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-medium">
              <Activity className="size-3" />
              {todayCount} today
            </span>
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                <AlertTriangle className="size-3" />
                {criticalCount} critical
              </span>
            )}
            {securityCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium">
                <Shield className="size-3" />
                {securityCount} security
              </span>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by action, resource, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn("flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all",
              showFilters ? "bg-brand-navy text-white border-brand-navy" : "bg-card border-border hover:bg-muted/50")}
          >
            <Filter className="size-4" />
            Filters
            {(selectedEventType !== "all" || selectedCategory !== "all" || selectedSeverity !== "all") && (
              <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">
                {[selectedEventType !== "all", selectedCategory !== "all", selectedSeverity !== "all"].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Export */}
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
          >
            <Download className="size-4" /> Export
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-muted/30 border border-border rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Event Type</label>
                <CustomSelect
                  value={selectedEventType}
                  onChange={(v) => setSelectedEventType(v as AuditEventType | "all")}
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "security_event", label: "Security Event" },
                    { value: "user_action", label: "User Action" },
                    { value: "system_event", label: "System Event" },
                    { value: "approval_action", label: "Approval Action" },
                    { value: "config_change", label: "Config Change" },
                    { value: "data_access", label: "Data Access" },
                  ]}
                  placeholder="Select event type..."
                  triggerClassName="rounded-xl"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Category</label>
                <CustomSelect
                  value={selectedCategory}
                  onChange={(v) => setSelectedCategory(v as AuditCategory | "all")}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "authentication", label: "Authentication" },
                    { value: "user_management", label: "User Management" },
                    { value: "transaction", label: "Transaction" },
                    { value: "compliance", label: "Compliance" },
                    { value: "provider", label: "Provider" },
                    { value: "settlement", label: "Settlement" },
                    { value: "support", label: "Support" },
                    { value: "system", label: "System" },
                  ]}
                  placeholder="Select category..."
                  triggerClassName="rounded-xl"
                />
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Severity</label>
                <CustomSelect
                  value={selectedSeverity}
                  onChange={(v) => setSelectedSeverity(v as AuditSeverity | "all")}
                  options={[
                    { value: "all", label: "All Severities" },
                    { value: "critical", label: "Critical" },
                    { value: "warning", label: "Warning" },
                    { value: "info", label: "Info" },
                  ]}
                  placeholder="Select severity..."
                  triggerClassName="rounded-xl"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedEventType !== "all" || selectedCategory !== "all" || selectedSeverity !== "all") && (
              <button
                onClick={() => {
                  setSelectedEventType("all");
                  setSelectedCategory("all");
                  setSelectedSeverity("all");
                }}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> of{" "}
            <span className="font-semibold text-foreground">{mockAuditEvents.length}</span> events
          </p>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
        </div>

        {/* Audit Events List */}
        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const isExpanded = expandedEvent === event.id;
            const eventTypeColor = getEventTypeColor(event.eventType);
            const severityColor = getSeverityColor(event.severity);
            const categoryColor = getCategoryColor(event.category);

            return (
              <div
                key={event.id}
                className={cn("bg-card border rounded-2xl overflow-hidden transition-all",
                  event.severity === "critical" ? "border-red-200 shadow-sm" : "border-border",
                  isExpanded && "ring-2 ring-brand-navy/20")}
              >
                {/* Event Summary */}
                <button
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  className="w-full p-5 text-left hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${categoryColor}18` }}>
                      {event.eventType === "security_event" ? <Shield className="size-5" style={{ color: categoryColor }} /> :
                       event.eventType === "approval_action" ? <CheckCircle className="size-5" style={{ color: categoryColor }} /> :
                       event.eventType === "config_change" ? <Settings className="size-5" style={{ color: categoryColor }} /> :
                       event.eventType === "data_access" ? <Eye className="size-5" style={{ color: categoryColor }} /> :
                       event.eventType === "system_event" ? <Activity className="size-5" style={{ color: categoryColor }} /> :
                       <User className="size-5" style={{ color: categoryColor }} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase", severityColor)}>
                          {event.severity === "critical" ? <AlertTriangle className="size-2.5" /> :
                           event.severity === "warning" ? <AlertTriangle className="size-2.5" /> :
                           <Info className="size-2.5" />}
                          {event.severity}
                        </span>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium", eventTypeColor)}>
                          {event.eventType.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full font-mono">
                          {event.category.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {event.id}
                        </span>
                      </div>

                      <p className="font-semibold text-sm mb-1">{event.action.replace(/_/g, " ")}</p>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <User className="size-3" />
                          {event.actor.name} ({event.actor.role})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {formatDate(event.timestamp)}
                        </span>
                        <span>·</span>
                        <span className="font-mono">{event.actor.ipAddress}</span>
                        {event.resourceId && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{event.resourceId}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border/50 bg-muted/10">
                    <div className="grid grid-cols-2 gap-6 mt-5">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Event Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Resource</span>
                              <span className="font-medium font-mono">{event.resource}</span>
                            </div>
                            {event.resourceId && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Resource ID</span>
                                <span className="font-medium font-mono">{event.resourceId}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Tier</span>
                              <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium capitalize">{event.tier}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Timestamp</span>
                              <span className="font-medium font-mono text-xs">
                                {event.timestamp.toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actor Information */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Actor Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">User ID</span>
                              <span className="font-medium font-mono">{event.actor.userId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Name</span>
                              <span className="font-medium">{event.actor.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Role</span>
                              <span className="font-medium">{event.actor.role}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">IP Address</span>
                              <span className="font-medium font-mono">{event.actor.ipAddress}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Before State */}
                        {event.beforeState && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Before State</h4>
                            <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                              <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                                {JSON.stringify(event.beforeState, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* After State */}
                        {event.afterState && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">After State</h4>
                            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                              <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                                {JSON.stringify(event.afterState, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        {event.metadata && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Metadata</h4>
                            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                              <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ScrollText className="size-12 text-muted-foreground/30 mb-3" />
            <p className="text-lg font-semibold text-muted-foreground">No audit events found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* ── Export Modal ── */}
      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportFormat("csv");
          setExportDateFrom("");
          setExportDateTo("");
        }}
        title="Export Audit Logs"
        description="Download audit logs in CSV or PDF format"
        size="md"
      >
        <div className="space-y-4">
          {/* Export Format */}
          <FormField
            label="Export Format"
            required
            description="Choose file format"
          >
            <CustomSelect
              value={exportFormat}
              onChange={(v) => setExportFormat(v as "csv" | "pdf")}
              options={[
                { value: "csv", label: "CSV (Spreadsheet)" },
                { value: "pdf", label: "PDF (Document)" },
              ]}
              placeholder="Select format..."
            />
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

          {/* Info Note */}
          {exportDateFrom && exportDateTo && (
            <div className="bg-brand-navy/5 border border-brand-navy/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="size-5 text-brand-navy shrink-0 mt-0.5" />
              <div className="text-sm text-brand-navy">
                <p className="font-medium mb-1">Export Preview</p>
                <p className="text-xs opacity-80">
                  Audit logs from {new Date(exportDateFrom).toLocaleDateString()} to {new Date(exportDateTo).toLocaleDateString()}
                  <br />
                  Format: {exportFormat.toUpperCase()} • Filters: {selectedEventType !== "all" ? "Event Type, " : ""}{selectedCategory !== "all" ? "Category, " : ""}{selectedSeverity !== "all" ? "Severity" : "None"}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setShowExportModal(false);
                setExportFormat("csv");
                setExportDateFrom("");
                setExportDateTo("");
              }}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!exportDateFrom || !exportDateTo}
              onClick={() => {
                showToast(
                  "success",
                  "Export Started",
                  `Audit logs (${exportFormat.toUpperCase()}) are being generated. Download will start shortly.`
                );
                setShowExportModal(false);
                setExportFormat("csv");
                setExportDateFrom("");
                setExportDateTo("");
              }}
              className="flex-1 px-4 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
