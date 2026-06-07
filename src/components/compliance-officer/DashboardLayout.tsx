"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComplianceSidebar from "./layout/ComplianceSidebar";
import ComplianceTopBar from "./layout/ComplianceTopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Blobs — subtle on light top, richer on dark bottom */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-brand-lavender/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-lg h-64 bg-brand-teal/20 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <ComplianceSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <ComplianceTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
