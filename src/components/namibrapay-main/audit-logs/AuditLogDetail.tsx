import {
  ShieldCheck,
  Banknote,
  Users,
  UserCog,
  Settings2,
  FileText,
  AlertCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditLog, AuditCategory } from "@/lib/mock-data/audit-logs";

const CATEGORY_CONFIG: Record<
  AuditCategory,
  { icon: React.ElementType; bg: string; text: string; label: string }
> = {
  auth:      { icon: ShieldCheck, bg: "bg-blue-50",    text: "text-blue-600",    label: "Authentication" },
  financial: { icon: Banknote,    bg: "bg-emerald-50", text: "text-emerald-600", label: "Financial"      },
  customer:  { icon: Users,       bg: "bg-teal-50",    text: "text-teal-600",    label: "Customer"       },
  team:      { icon: UserCog,     bg: "bg-purple-50",  text: "text-purple-600",  label: "Team"           },
  settings:  { icon: Settings2,   bg: "bg-gray-100",   text: "text-gray-600",    label: "Settings"       },
  content:   { icon: FileText,    bg: "bg-amber-50",   text: "text-amber-600",   label: "Content"        },
  dispute:   { icon: AlertCircle, bg: "bg-red-50",     text: "text-red-600",     label: "Dispute"        },
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AuditLogDetailProps {
  log: AuditLog | null;
}

export default function AuditLogDetail({ log }: AuditLogDetailProps) {
  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64 py-16 px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-400">Select a log to view details</p>
      </div>
    );
  }

  const cfg = CATEGORY_CONFIG[log.category];
  const Icon = cfg.icon;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
          <Icon className={cn("w-4 h-4", cfg.text)} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {cfg.label}
          </p>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{log.action}</p>
        </div>
      </div>

      {/* User card */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0 ring-2 ring-brand-teal/20">
            <span className="text-white text-sm font-bold">{initials(log.user)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{log.user}</p>
            <a
              href={`mailto:${log.email}`}
              className="text-xs text-brand-teal hover:underline truncate block"
            >
              {log.email}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
          <span className="text-[11px] font-semibold text-brand-teal">{log.role}</span>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">IP Address</p>
            <p className="text-sm font-mono text-gray-700 mt-0.5">{log.ipAddress}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Timestamp</p>
            <p className="text-sm text-gray-700 mt-0.5">{formatFullDate(log.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Log ID */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Log ID</p>
        <p className="text-xs font-mono text-gray-500">{log.id}</p>
      </div>
    </div>
  );
}
