"use client";

import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"
    >
      <AlertCircle size={12} className="shrink-0" />
      {message}
    </motion.p>
  );
}
