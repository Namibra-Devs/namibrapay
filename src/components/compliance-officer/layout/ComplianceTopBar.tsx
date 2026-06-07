"use client";

import { Menu } from "lucide-react";
import ComplianceSearchBar from "./ComplianceSearchBar";
import ComplianceUserMenu from "./ComplianceUserMenu";
import NotificationsDropdown from "../NotificationsDropdown";

interface ComplianceTopBarProps {
  onMenuClick: () => void;
}

export default function ComplianceTopBar({ onMenuClick }: ComplianceTopBarProps) {
  // Mock user data
  const user = {
    name: "Jane Mensah",
    role: "Compliance Officer",
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/65 backdrop-blur-md border-b border-gray-200/70 flex items-center justify-between px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <ComplianceSearchBar />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Menu */}
        <ComplianceUserMenu user={user} />
      </div>
    </header>
  );
}
