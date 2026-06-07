"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  BarChart3,
  Mail,
  FileCheck,
  Settings,
  LogOut,
  X,
  ScrollText,
  Activity,
  GitPullRequest,
} from "lucide-react";
import { cn } from "@/lib/compliance-utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/compliance/dashboard" },
  { icon: FileText, label: "Applications", href: "/compliance/applications" },
  { icon: GitPullRequest, label: "Approvals", href: "/compliance/approvals" },
  { icon: Users, label: "Merchants", href: "/compliance/merchants" },
  { icon: Shield, label: "Screening", href: "/compliance/screening" },
  { icon: AlertTriangle, label: "Cases", href: "/compliance/cases" },
  { icon: Activity, label: "Monitoring", href: "/compliance/monitoring" },
  { icon: Mail, label: "Communications", href: "/compliance/communications" },
  { icon: FileCheck, label: "Documents", href: "/compliance/documents" },
  { icon: BarChart3, label: "Reports", href: "/compliance/reports" },
  { icon: ScrollText, label: "Audit Trail", href: "/compliance/audit" },
  { icon: Settings, label: "Settings", href: "/compliance/settings" },
];

interface ComplianceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplianceSidebar({ isOpen, onClose }: ComplianceSidebarProps) {
  const pathname = usePathname();

  // Mock user data
  const user = {
    name: "Jane Mensah",
    role: "Compliance Officer",
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-b from-brand-navy via-brand-navy to-[#1a2d6e] transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Image
                src="/favicon.png"
                alt="NamibraPay"
                width={40}
                height={40}
                className="rounded-lg"
                style={{ height: "auto", width: "auto" }}
              />
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-tight">NamibraPay</p>
              <p className="text-brand-teal/80 text-xs font-medium tracking-wide">Compliance Hub</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-3 py-6 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-[0.18em] mb-3">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "text-brand-teal bg-brand-teal/10"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {/* Active indicator - on left edge */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-brand-teal" />
                )}
                {/* Active indicator - on right edge */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-brand-teal" />
                )}
                
                <div className={cn(
                  "flex items-center justify-center w-5 h-5",
                  isActive ? "text-brand-teal" : "text-white/60 group-hover:text-white"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "font-medium text-sm",
                  isActive ? "font-semibold" : ""
                )}>
                  {item.label}
                </span>
                
                {/* Hover glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="mb-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-brand-teal to-brand-mint rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-white/50 truncate">{user.role}</p>
              </div>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 group">
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
