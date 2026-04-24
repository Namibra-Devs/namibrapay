"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "loading" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  /** Auto-dismiss after ms. 0 = stay until manually dismissed. */
  duration: number;
}

// ── Module-level store (singleton, no Provider needed) ───────────

let _toasts: ToastItem[] = [];
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

function _upsert(item: ToastItem) {
  _toasts = _toasts.some((t) => t.id === item.id)
    ? _toasts.map((t) => (t.id === item.id ? item : t))
    : [..._toasts, item];
  _notify();
}

function _remove(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id);
  _notify();
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Public toast() API ───────────────────────────────────────────

type ToastOptions = {
  description?: string;
  duration?: number;
  /** Pass an existing id to replace that toast in-place. */
  id?: string;
};

export const toast = {
  success(title: string, opts: ToastOptions = {}) {
    const id = opts.id ?? uid();
    _upsert({ id, type: "success", title, description: opts.description, duration: opts.duration ?? 4000 });
    return id;
  },
  error(title: string, opts: ToastOptions = {}) {
    const id = opts.id ?? uid();
    _upsert({ id, type: "error", title, description: opts.description, duration: opts.duration ?? 5000 });
    return id;
  },
  loading(title: string, opts: ToastOptions = {}) {
    const id = opts.id ?? uid();
    _upsert({ id, type: "loading", title, description: opts.description, duration: 0 });
    return id;
  },
  info(title: string, opts: ToastOptions = {}) {
    const id = opts.id ?? uid();
    _upsert({ id, type: "info", title, description: opts.description, duration: opts.duration ?? 4000 });
    return id;
  },
  dismiss(id: string) {
    _remove(id);
  },
};

// ── Per-type visual config ───────────────────────────────────────

const CONFIG: Record<
  ToastType,
  { icon: React.ElementType; iconClass: string; iconBg: string; bar: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-brand-teal",
    iconBg: "bg-brand-teal/10",
    bar: "bg-brand-teal",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-500",
    iconBg: "bg-red-50",
    bar: "bg-red-500",
  },
  loading: {
    icon: Loader2,
    iconClass: "text-brand-navy",
    iconBg: "bg-brand-navy/8",
    bar: "bg-brand-navy",
  },
  info: {
    icon: Info,
    iconClass: "text-brand-navy",
    iconBg: "bg-brand-lavender/30",
    bar: "bg-brand-navy",
  },
};

// ── Single toast card ────────────────────────────────────────────

function ToastCard({ item }: { item: ToastItem }) {
  const { icon: Icon, iconClass, iconBg, bar } = CONFIG[item.type];
  const isLoading = item.type === "loading";

  // Auto-dismiss timer — re-runs when duration changes (e.g. loading → success)
  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => _remove(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 72, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 72, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="relative w-85 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
    >
      <div className="flex items-start gap-3.5 px-4 py-4">
        {/* Icon */}
        <div className={cn("shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center", iconBg)}>
          <Icon
            size={16}
            className={cn(iconClass, isLoading && "animate-spin")}
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
          {item.description && (
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{item.description}</p>
          )}
        </div>

        {/* Close — hidden while loading */}
        {!isLoading && (
          <button
            title="close"
            onClick={() => _remove(item.id)}
            className="shrink-0 -mt-0.5 -mr-0.5 p-0.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Depleting progress bar for auto-dismiss toasts */}
      {item.duration > 0 && (
        <motion.div
          className={cn("absolute bottom-0 left-0 h-[2.5px] origin-left", bar)}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: item.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

// ── Toaster container (mount once in root layout) ────────────────

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const sync = () => setToasts([..._toasts]);
    _listeners.add(sync);
    return () => { _listeners.delete(sync); };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-5 right-5 z-9999 flex flex-col gap-2.5 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard item={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
