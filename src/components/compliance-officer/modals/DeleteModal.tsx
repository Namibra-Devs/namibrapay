/**
 * Delete Modal Component
 * 
 * Reusable delete/destructive action confirmation modal.
 * Shows a warning message and requires user confirmation.
 * 
 * Usage:
 * ```tsx
 * <DeleteModal
 *   title="Delete Risk Rule"
 *   message="Are you sure you want to delete this risk rule? This action cannot be undone."
 *   itemName={ruleName}
 *   isVisible={showDelete}
 *   isProcessing={isDeleting}
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDelete(false)}
 * />
 * ```
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface DeleteModalProps {
  title: string;
  message: string | ReactNode;
  itemName?: string;
  deleteText?: string;
  cancelText?: string;
  isVisible: boolean;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  title,
  message,
  itemName,
  deleteText = "Delete",
  cancelText = "Cancel",
  isVisible,
  isProcessing = false,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
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

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <div className="text-sm text-red-900">
                {typeof message === "string" ? (
                  <p>
                    {message}
                    {itemName && (
                      <>
                        {" "}
                        <strong>{itemName}</strong>
                      </>
                    )}
                  </p>
                ) : (
                  message
                )}
              </div>
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
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {deleteText}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
