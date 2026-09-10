'use client';

import { ReactNode } from "react";
import PlatformSidebar, { PlatformBottomNav } from "./_components/sidebar";
import RoleSwitcher from "./_components/role-switcher";
import { useRole } from "@/hooks/use-role";
import { ROLE_LABELS } from "@/lib/constants";
import { RefreshCw } from "lucide-react";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  const { role } = useRole();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <PlatformSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 shrink-0 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 z-30">
          {/* Left side - simplified on mobile */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-1.5 rounded-full bg-brand-teal animate-pulse shrink-0" />
            <span className="text-xs text-muted-foreground font-medium truncate">
              <span className="hidden sm:inline">Platform Dashboard · </span>
              <span className="text-foreground">{ROLE_LABELS[role]}</span>
            </span>
          </div>
          
          {/* Right side - role switcher only on mobile, dev badge hidden */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-[10px] bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-2 py-1 font-medium">
              <RefreshCw className="size-2.5" />
              Dev Mode
            </div>
            <RoleSwitcher />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <PlatformBottomNav />
    </div>
  );
}
