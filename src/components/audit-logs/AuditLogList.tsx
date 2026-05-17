import type React from "react";
import {
  ShieldCheck,
  Banknote,
  Users,
  UserCog,
  Settings2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditLog, AuditCategory } from "@/lib/mock-data/audit-logs";

const CATEGORY_CONFIG: Record<
  AuditCategory,
  { icon: React.ElementType; bg: string; text: string; badge: string }
> = {
  auth:      { icon: ShieldCheck,  bg: "bg-blue-50",    text: "text-blue-600",   badge: "bg-blue-100 text-blue-700"    },
  financial: { icon: Banknote,     bg: "bg-emerald-50", text: "text-emerald-600",badge: "bg-emerald-100 text-emerald-700" },
  customer:  { icon: Users,        bg: "bg-teal-50",    text: "text-teal-600",   badge: "bg-teal-100 text-teal-700"    },
  team:      { icon: UserCog,      bg: "bg-purple-50",  text: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
  settings:  { icon: Settings2,    bg: "bg-gray-100",   text: "text-gray-600",   badge: "bg-gray-100 text-gray-600"    },
  content:   { icon: FileText,     bg: "bg-amber-50",   text: "text-amber-600",  badge: "bg-amber-100 text-amber-700"  },
  dispute:   { icon: AlertCircle,  bg: "bg-red-50",     text: "text-red-600",    badge: "bg-red-100 text-red-700"      },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AuditLogListProps {
  logs: AuditLog[];
  selectedId: string | null;
  onSelect: (log: AuditLog) => void;
  hasFilters: boolean;
}

export default function AuditLogList({
  logs,
  selectedId,
  onSelect,
  hasFilters,
}: AuditLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          {hasFilters ? "No logs match your filters" : "No activity logged yet"}
        </p>
        <p className="text-xs text-gray-400 max-w-xs">
          {hasFilters
            ? "Try adjusting your filters or date range."
            : "Actions by you and your team members will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50">
      {logs.map((log) => {
        const cfg = CATEGORY_CONFIG[log.category];
        const Icon = cfg.icon;
        const isSelected = log.id === selectedId;

        return (
          <button
            type="button"
            key={log.id}
            onClick={() => onSelect(log)}
            className={cn(
              "w-full flex items-start gap-3.5 px-5 py-4 text-left transition-colors group",
              isSelected ? "bg-brand-teal/5" : "hover:bg-gray-50/70"
            )}
          >
            {/* Category icon */}
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                cfg.bg
              )}
            >
              <Icon className={cn("w-4 h-4", cfg.text)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-sm font-medium leading-snug",
                    isSelected ? "text-brand-teal" : "text-gray-800 group-hover:text-gray-900"
                  )}
                >
                  {log.action}
                </p>
                <span className="text-[11px] text-gray-400 shrink-0 mt-0.5">
                  {timeAgo(log.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {/* User avatar mini */}
                <div className="w-4 h-4 rounded-full bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0">
                  <span className="text-[7px] font-bold text-white leading-none">
                    {initials(log.user)}
                  </span>
                </div>
                <span className="text-xs text-gray-500 truncate">{log.user}</span>
                <span className="text-gray-300">·</span>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    cfg.badge
                  )}
                >
                  {log.category}
                </span>
              </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div className="w-0.5 h-full bg-brand-teal absolute left-0 top-0 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
