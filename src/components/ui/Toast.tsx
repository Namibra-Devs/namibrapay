"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning" | "loading";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, options?: { description?: string; duration?: number; id?: string }) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, type: ToastType, message: string, options?: { description?: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, options?: { description?: string; duration?: number; id?: string }) => {
      const id = options?.id || Math.random().toString(36).substring(7);
      const duration = options?.duration ?? (type === "loading" ? 0 : 5000);
      
      setToasts((prev) => {
        // Remove existing toast with same id if it exists
        const filtered = prev.filter((toast) => toast.id !== id);
        return [...filtered, { id, type, message, description: options?.description, duration }];
      });

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback(
    (id: string, type: ToastType, message: string, options?: { description?: string }) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id
            ? { ...toast, type, message, description: options?.description }
            : toast
        )
      );
    },
    []
  );

  // Initialize global toast API
  React.useEffect(() => {
    initToastAPI(showToast, removeToast, updateToast);
  }, [showToast, removeToast, updateToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, updateToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
    loading: Loader2,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-orange-50 border-orange-200 text-orange-900",
    loading: "bg-blue-50 border-blue-200 text-blue-900",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-orange-600",
    loading: "text-blue-600",
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`${colors[toast.type]} border rounded-xl p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-md`}
    >
      <Icon className={`w-5 h-5 ${iconColors[toast.type]} shrink-0 mt-0.5 ${toast.type === "loading" ? "animate-spin" : ""}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.description && (
          <p className="text-xs mt-1 opacity-80">{toast.description}</p>
        )}
      </div>
      {toast.type !== "loading" && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

export function Toaster() {
  return null; // The ToastProvider handles rendering
}

// Global toast API (for use outside of React components)
let globalShowToast: ToastContextType["showToast"] | null = null;
let globalRemoveToast: ToastContextType["removeToast"] | null = null;
let globalUpdateToast: ToastContextType["updateToast"] | null = null;

// Initialize global functions when ToastProvider mounts
export function initToastAPI(
  showToast: ToastContextType["showToast"],
  removeToast: ToastContextType["removeToast"],
  updateToast: ToastContextType["updateToast"]
) {
  globalShowToast = showToast;
  globalRemoveToast = removeToast;
  globalUpdateToast = updateToast;
}

// Toast API object
export const toast = {
  success: (message: string, options?: { description?: string; duration?: number; id?: string }) => {
    if (!globalShowToast) {
      console.warn("Toast provider not initialized");
      return "";
    }
    return globalShowToast("success", message, options);
  },
  error: (message: string, options?: { description?: string; duration?: number; id?: string }) => {
    if (!globalShowToast) {
      console.warn("Toast provider not initialized");
      return "";
    }
    return globalShowToast("error", message, options);
  },
  info: (message: string, options?: { description?: string; duration?: number; id?: string }) => {
    if (!globalShowToast) {
      console.warn("Toast provider not initialized");
      return "";
    }
    return globalShowToast("info", message, options);
  },
  warning: (message: string, options?: { description?: string; duration?: number; id?: string }) => {
    if (!globalShowToast) {
      console.warn("Toast provider not initialized");
      return "";
    }
    return globalShowToast("warning", message, options);
  },
  loading: (message: string, options?: { description?: string; id?: string }) => {
    if (!globalShowToast) {
      console.warn("Toast provider not initialized");
      return "";
    }
    return globalShowToast("loading", message, { ...options, duration: 0 });
  },
  dismiss: (id: string) => {
    if (!globalRemoveToast) {
      console.warn("Toast provider not initialized");
      return;
    }
    globalRemoveToast(id);
  },
  update: (id: string, type: ToastType, message: string, options?: { description?: string }) => {
    if (!globalUpdateToast) {
      console.warn("Toast provider not initialized");
      return;
    }
    globalUpdateToast(id, type, message, options);
  },
};
