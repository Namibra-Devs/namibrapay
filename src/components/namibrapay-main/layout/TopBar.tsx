"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Search,
  Zap,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data/dashboard";

const PAGE_LABELS: Record<string, string> = {
  "/dashboard":          "Dashboard",
  "/transactions":       "Transactions",
  "/customers":          "Customers",
  "/refunds":            "Refunds",
  "/payouts":            "Payouts",
  "/disputes":           "Disputes",
  "/transaction-splits": "Transaction Splits",
  "/subaccounts":        "Subaccounts",
  "/terminals":          "Terminals",
  "/subscribers":        "Subscribers",
  "/plans":              "Plans",
  "/subscriptions":      "Subscriptions",
  "/payment-pages":      "Payment Pages",
  "/products":           "Products",
  "/storefronts":        "Storefronts",
  "/orders":             "Orders",
  "/invoices":           "Invoices",
  "/api-keys":           "API Keys",
  "/webhooks":           "Webhooks",
  "/api-logs":           "API Logs",
  "/audit-logs":         "Audit Logs",
  "/settings":           "Settings",
  "/compliance":         "Compliance",
};

const dropdownVariants: Variants = {
  hidden:  { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.15, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.1  } },
};

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  const pageLabel = PAGE_LABELS[pathname.replace(/\/$/, "")] ?? "NamibraPay";

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("np_access_token");
    router.replace("/signin");
  }

  return (
    <header className="flex items-center justify-between h-16 px-4 lg:px-4 bg-white border-b border-gray-200/50 sticky top-0 z-30 shrink-0">

      {/* ── Left ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb — desktop only */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100">
            <Building2 className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 leading-none">
              {mockUser.business}
            </span>
          </div>
          <span className="text-gray-300 text-sm">/</span>
          <span className="text-sm font-semibold text-gray-800">{pageLabel}</span>
        </div>

        {/* Search bar */}
        <motion.div
          animate={{ width: searchFocus ? "100%" : "auto" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="hidden sm:flex flex-1 max-w-xs lg:max-w-sm"
        >
          <div
            className={cn(
              "flex items-center gap-2 w-full px-3 rounded-xl border transition-all duration-200 cursor-text",
              searchFocus
                ? "bg-white border-brand-teal ring-2 ring-brand-teal/15 shadow-sm"
                : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white"
            )}
            onClick={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          >
            <Search className={cn("w-3.5 h-3.5 shrink-0 transition-colors", searchFocus ? "text-brand-teal" : "text-gray-400")} />
            <input
              type="text"
              placeholder="Quick search…"
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="flex-1 min-w-0 py-2.5 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
            <AnimatePresence>
              {!searchFocus && (
                <motion.kbd
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.1 }}
                  className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-medium text-gray-400 shrink-0"
                >
                  ⌘K
                </motion.kbd>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1 shrink-0 ml-3">

        {/* Test mode badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          <span className="text-[11px] font-semibold text-amber-600 tracking-wide">Test Mode</span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
            className={cn(
              "relative p-2 rounded-xl transition-colors",
              notifOpen ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-100"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-teal border-2 border-white" />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute -right-10 top-full mt-2 w-80 bg-white/96 backdrop-blur-xl rounded-2xl border border-gray-200/70 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] z-50"
              >
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-bold">1</span>
                  </div>
                  <button className="text-xs font-medium text-brand-teal hover:text-brand-teal/70 transition-colors">
                    Mark all read
                  </button>
                </div>

                {/* Notification item */}
                <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-brand-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">New payment received</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">GHS 1,500.00 from Kwame Asante</p>
                      <p className="text-[10px] text-gray-300 mt-1">2 minutes ago</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-brand-teal shrink-0 mt-2" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-8 px-6">
                  <div className="p-3 rounded-xl bg-gray-50 mb-2">
                    <Bell className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-xs font-medium text-gray-500">All caught up</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors",
              userOpen ? "bg-gray-100" : "hover:bg-gray-50"
            )}
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
              <span className="text-white text-[11px] font-bold leading-none">{mockUser.initials}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
              {mockUser.firstName}
            </span>
            <ChevronDown
              className={cn(
                "hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                userOpen && "rotate-180"
              )}
            />
          </motion.button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-64 bg-white/96 backdrop-blur-xl rounded-2xl border border-gray-200/70 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] z-50"
              >
                {/* User info */}
                <div className="px-4 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0 ring-2 ring-brand-teal/20">
                      <span className="text-white text-sm font-bold">{mockUser.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{mockUser.name}</p>
                      <p className="text-xs text-gray-400 truncate">{mockUser.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                        <span className="text-[10px] text-brand-teal font-semibold">{mockUser.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  {[
                    { href: "/settings", icon: User,     label: "Profile" },
                    { href: "/settings", icon: Settings,  label: "Workspace settings" },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
