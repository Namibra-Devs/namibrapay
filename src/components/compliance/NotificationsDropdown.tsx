"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, AlertCircle, FileText, Shield, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/compliance-utils";

interface Notification {
  id: string;
  type: "alert" | "application" | "screening" | "sla" | "case";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    type: "sla",
    title: "SLA Breach Warning",
    message: "Application APP-2024-003 is approaching SLA deadline (2 hours remaining)",
    timestamp: "2026-06-04T08:30:00Z",
    read: false,
    link: "/compliance/applications/APP-2024-003",
  },
  {
    id: "NOTIF-002",
    type: "screening",
    title: "Screening Hit Detected",
    message: "Sanctions screening found a potential match for Kwame Mensah",
    timestamp: "2026-06-04T07:15:00Z",
    read: false,
    link: "/compliance/screening",
  },
  {
    id: "NOTIF-003",
    type: "application",
    title: "New Application Submitted",
    message: "APP-2024-015 from Bright Future Schools requires review",
    timestamp: "2026-06-04T06:45:00Z",
    read: false,
    link: "/compliance/applications/APP-2024-015",
  },
  {
    id: "NOTIF-004",
    type: "case",
    title: "Case Escalated",
    message: "CASE-123 has been escalated to MLRO for approval",
    timestamp: "2026-06-03T16:20:00Z",
    read: true,
    link: "/compliance/cases/CASE-123",
  },
  {
    id: "NOTIF-005",
    type: "alert",
    title: "Document Expiring Soon",
    message: "Business registration certificate for Global Traders expires in 7 days",
    timestamp: "2026-06-03T10:00:00Z",
    read: true,
    link: "/compliance/merchants/MERCHANT-001",
  },
];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "application":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "screening":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "sla":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "case":
        return <AlertCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative p-2 text-gray-600 hover:text-brand-navy transition-all rounded-xl hover:bg-gray-100",
          open && "bg-gray-100 text-brand-navy"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop to close on outside click */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute -right-24 md:right-0 mt-2 w-86 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden z-50"
            >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-brand-navy">
                  Notifications
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "All caught up!"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                        }
                      }}
                      className={cn(
                        "px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer relative group",
                        !notification.read && "bg-blue-50/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="mt-0.5">{getIcon(notification.type)}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                !notification.read
                                  ? "text-brand-navy"
                                  : "text-gray-900"
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-brand-teal rounded-full shrink-0 mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDate(notification.timestamp, true)}
                          </p>
                        </div>

                        {/* Clear button */}
                        <button
                          onClick={(e) => clearNotification(notification.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button className="w-full text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
