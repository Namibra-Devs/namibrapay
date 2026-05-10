"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data/dashboard";

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("np_access_token");
    router.replace("/signin");
  }

  return (
    <header className="flex items-center justify-between h-16 px-5 bg-white/92 md:bg-white/92 backdrop-blur-xl border-b border-gray-200/40 sticky top-0 z-30 shrink-0">
      {/* Left */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden lg:block" />

      {/* Right controls */}
      <div className="flex items-center gap-1.5">
        {/* Test mode badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600">
            Test Mode
          </span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-teal border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute -right-10 top-full mt-2 w-80 bg-white/92 backdrop-blur-xl rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] z-50 fade-in">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    Notifications
                  </span>
                </div>
                <button className="text-xs font-medium text-brand-teal hover:text-brand-teal/80 transition-colors">
                  Mark all read
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="p-4 rounded-2xl bg-gray-50 mb-3">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  All caught up
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  No new notifications
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors",
              userOpen ? "bg-gray-100" : "hover:bg-gray-50",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {mockUser.initials}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {mockUser.name}
            </span>
            <ChevronDown
              className={cn(
                "hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200",
                userOpen && "rotate-180",
              )}
            />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white/92 backdrop-blur-xl rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] z-50 fade-in">
              {/* User info */}
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">
                      {mockUser.initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {mockUser.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {mockUser.email}
                    </p>
                    <p className="text-xs text-brand-teal font-medium mt-0.5">
                      {mockUser.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <Link
                  href="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Workspace settings
                </Link>
              </div>

              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
