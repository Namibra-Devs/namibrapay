"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  ScrollText,
  Activity,
  GitPullRequest,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import NotificationsDropdown from "@/components/compliance-officer/NotificationsDropdown";
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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mock user data
  const user = {
    name: "Jane Mensah",
    role: "Compliance Officer",
    avatar: "/avatars/jane.jpg",
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Blobs — subtle on light top, richer on dark bottom */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-brand-lavender/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-lg h-64 bg-brand-teal/20 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-linear-to-b from-brand-navy via-brand-navy to-[#1a2d6e] transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="relative flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-[0.18em] mb-3">
              Main  Menu
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
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
        <header className="sticky top-0 z-30 h-16 bg-white/65 backdrop-blur-md border-b border-gray-200/70 flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-brand-teal transition-colors" />
              <input
                type="text"
                placeholder="Search applications, merchants..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationsDropdown />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group",
                  userMenuOpen && "bg-gray-100"
                )}
              >
                <div className="w-9 h-9 bg-linear-to-br from-brand-teal to-brand-mint rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-105 transition-all">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform duration-200",
                  userMenuOpen && "rotate-180"
                )} />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    {/* Backdrop - fixed positioned to cover entire viewport */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-100"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ margin: 0 }}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/70 py-2 overflow-hidden z-110"
                    >
                      <div className="px-4 pt-2 pb-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      
                      <div className="">
                        <Link
                          href="/compliance/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <span>Your Profile</span>
                        </Link>
                        <Link
                          href="/compliance/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-gray-600" />
                          </div>
                          <span>Settings</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100">
                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
