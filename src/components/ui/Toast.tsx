'use client';

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, type, title, description };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// Individual Toast Item
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = {
    success: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900", icon: CheckCircle, iconColor: "text-emerald-600" },
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-900", icon: XCircle, iconColor: "text-red-600" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", icon: AlertTriangle, iconColor: "text-amber-600" },
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", icon: Info, iconColor: "text-blue-600" },
  };

  const style = config[toast.type];
  const Icon = style.icon;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right",
      style.bg, style.border
    )}>
      <Icon className={cn("size-5 shrink-0 mt-0.5", style.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", style.text)}>{toast.title}</p>
        {toast.description && (
          <p className={cn("text-sm mt-0.5", style.text)}>{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn("shrink-0 p-1 hover:bg-black/5 rounded transition-colors", style.text)}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
