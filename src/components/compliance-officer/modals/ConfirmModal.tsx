/**
 * Confirm Modal Component
 * 
 * Reusable confirmation modal for actions that require user confirmation.
 * Supports different variants (success, danger, warning) and loading states.
 * 
 * Usage:
 * ```tsx
 * <ConfirmModal
 *   title="Verify Document"
 *   message="Are you sure you want to verify this document?"
 *   confirmText="Verify Document"
 *   confirmVariant="success"
 *   isVisible={showConfirm}
 *   isProcessing={isProcessing}
 *   onConfirm={handleConfirm}
 *   onCancel={() => setShowConfirm(false)}
 * />
 * ```
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface ConfirmModalProps {
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "success" | "danger" | "warning" | "primary";
  isVisible: boolean;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
}

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  isVisible,
  isProcessing = false,
  onConfirm,
  onCancel,
  icon,
}: ConfirmModalProps) {
  const variantStyles = {
    success: {
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    danger: {
      bgColor: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      icon: <XCircle className="w-4 h-4" />,
    },
    warning: {
      bgColor: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    primary: {
      bgColor: "bg-brand-teal",
      hoverColor: "hover:bg-brand-teal/90",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  };

  const styles = variantStyles[confirmVariant];
  const displayIcon = icon || styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
          onClick={() => !isProcessing && onCancel()}
          style={{ margin: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">
                {title}
              </h2>
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              {typeof message === "string" ? (
                <p className="text-sm text-gray-700">{message}</p>
              ) : (
                message
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2.5 ${styles.bgColor} text-white rounded-lg font-medium ${styles.hoverColor} transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  displayIcon
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
