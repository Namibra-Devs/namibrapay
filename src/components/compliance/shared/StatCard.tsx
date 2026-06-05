"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/compliance-utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "teal" | "navy" | "pink" | "mint" | "lavender" | "peach";
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "teal",
  className,
}: StatCardProps) {
  const colorClasses = {
    teal: "bg-brand-teal/10 text-brand-teal",
    navy: "bg-brand-navy/10 text-brand-navy",
    pink: "bg-brand-pink/10 text-brand-pink",
    mint: "bg-brand-mint/10 text-brand-mint",
    lavender: "bg-brand-lavender/10 text-brand-lavender",
    peach: "bg-brand-peach/10 text-brand-peach",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-2xl border border-gray-200/70 p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-7">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
