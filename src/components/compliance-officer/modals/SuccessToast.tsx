/**
 * Success Toast Component
 * 
 * Reusable success notification toast that appears at the top-right of the screen.
 * Auto-dismisses after 3 seconds by default.
 * 
 * Usage:
 * ```tsx
 * <SuccessToast
 *   message="Document verified successfully!"
 *   isVisible={showToast}
 *   onClose={() => setShowToast(false)}
 * />
 * ```
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Auto-dismiss duration in ms (default: 3000)
}

export default function SuccessToast({
  message,
  isVisible,
  onClose,
  duration = 3000,
}: SuccessToastProps) {
  // Auto-dismiss after duration
  if (isVisible && duration > 0) {
    setTimeout(onClose, duration);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-4 right-4 z-60 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:bg-green-700 rounded p-1 transition-colors shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
