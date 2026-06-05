"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Eye,
  UserCheck,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/compliance-utils";
import Link from "next/link";

interface ApplicationActionsMenuProps {
  applicationId: string;
  status: string;
  onAction?: (action: string) => void;
}

export default function ApplicationActionsMenu({
  applicationId,
  status,
  onAction,
}: ApplicationActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const actions = [
    {
      label: "View Details",
      icon: Eye,
      href: `/compliance/applications/${applicationId}`,
      color: "text-gray-700",
    },
    {
      label: "Assign to Me",
      icon: UserCheck,
      action: "assign",
      color: "text-blue-600",
      show: status === "SUBMITTED",
    },
    {
      label: "Send Message",
      icon: Mail,
      action: "message",
      color: "text-purple-600",
    },
    {
      label: "Request Info",
      icon: Clock,
      action: "request_info",
      color: "text-orange-600",
      show: status === "UNDER_REVIEW",
    },
    {
      label: "Approve",
      icon: CheckCircle,
      action: "approve",
      color: "text-green-600",
      show: status === "UNDER_REVIEW",
    },
    {
      label: "Reject",
      icon: XCircle,
      action: "reject",
      color: "text-red-600",
      show: status === "UNDER_REVIEW",
    },
    {
      label: "Escalate",
      icon: AlertTriangle,
      action: "escalate",
      color: "text-orange-600",
      show: status !== "ESCALATED",
    },
  ];

  const filteredActions = actions.filter((action) => action.show !== false);

  const handleAction = (action: string) => {
    setOpen(false);
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200/70 py-1 z-50"
          >
            {filteredActions.map((item) => {
              const Icon = item.icon;

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                      item.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => item.action && handleAction(item.action)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left",
                    item.color
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
