"use client";

import { useState, useMemo } from "react";
import { Search, ClipboardList } from "lucide-react";
import { mockAuditLogs } from "@/lib/mock-data/audit-logs";
import type { AuditLog } from "@/lib/mock-data/audit-logs";
import AuditLogFilters, {
  DEFAULT_AUDIT_FILTERS,
  type AuditFilterState,
} from "@/components/audit-logs/AuditLogFilters";
import AuditLogList from "@/components/audit-logs/AuditLogList";
import AuditLogDetail from "@/components/audit-logs/AuditLogDetail";

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditFilterState>(DEFAULT_AUDIT_FILTERS);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(mockAuditLogs[0] ?? null);

  const filtered = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      if (filters.user && log.user !== filters.user) return false;
      if (filters.action && log.action !== filters.action) return false;
      if (filters.startDate) {
        if (new Date(log.createdAt) < new Date(filters.startDate)) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(log.createdAt) > end) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !log.action.toLowerCase().includes(q) &&
          !log.user.toLowerCase().includes(q) &&
          !log.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [filters, search]);

  const hasFilters =
    !!filters.user ||
    !!filters.action ||
    !!filters.startDate ||
    !!filters.endDate ||
    !!search.trim();

  function handleSelect(log: AuditLog) {
    setSelectedLog(log);
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            A full record of all actions taken by team members in your workspace.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 shrink-0">
          <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 h-9 px-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/10">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, user or email…"
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        <AuditLogFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {/* Log list */}
        <div className="lg:col-span-3 bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Activity</span>
            {hasFilters && (
              <span className="ml-auto text-xs text-gray-400">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <AuditLogList
            logs={filtered}
            selectedId={selectedLog?.id ?? null}
            onSelect={handleSelect}
            hasFilters={hasFilters}
          />
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] overflow-hidden sticky top-20">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">About this activity</span>
          </div>
          <AuditLogDetail log={selectedLog} />
        </div>
      </div>
    </div>
  );
}
