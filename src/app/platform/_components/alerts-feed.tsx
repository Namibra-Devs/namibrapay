'use client';

import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/mock-data";
import { formatDate } from "@/lib/constants";
import { AlertTriangle, Zap, ShieldAlert, XCircle, Lock } from "lucide-react";

const severityStyles = {
  critical: { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-400" },
  high: { bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  medium: { bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  low: { bg: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400" },
};

const typeIcons = {
  provider_outage: Zap,
  nsp_threshold: AlertTriangle,
  compliance_hold: ShieldAlert,
  payout_failed: XCircle,
  security: Lock,
};

type Props = { alerts: Alert[] };

export function AlertsFeed({ alerts }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => {
        const s = severityStyles[alert.severity];
        const Icon = typeIcons[alert.type];
        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 p-3.5 rounded-xl border transition-all",
              s.bg,
              !alert.isRead && "shadow-sm"
            )}
          >
            <div className={cn("size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", s.badge.split(" ").slice(0, 1).join(" "))}>
              <Icon className="size-3.5" style={{ color: "inherit" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold truncate">{alert.title}</p>
                {!alert.isRead && <div className={cn("size-1.5 rounded-full shrink-0 mt-1.5", s.dot)} />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.description}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDate(alert.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}