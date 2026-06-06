/**
 * Alert Modal Component
 * 
 * Reusable alert/warning modal for displaying messages to users.
 * 
 * Usage:
 * ```tsx
 * <AlertModal
 *   title="Error"
 *   message="Please provide a reason for rejection"
 *   isVisible={showAlert}
 *   onClose={() => setShowAlert(false)}
 * />
 * ```
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface AlertModalProps {
  title?: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  variant?: "warning" | "error" | "info";
}

export default function AlertModal({
  title = "Alert",
  message,
  isVisible,
  onClose,
  variant = "warning",
}: AlertModalProps) {
  const variantStyles = {
    warning: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-600",
    },
    error: {
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      iconColor: "text-red-600",
    },
    info: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
          onClick={onClose}
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
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${styles.bgColor} rounded-full flex items-center justify-center`}>
                <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-6">{message}</p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal/90 transition-colors text-sm"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
