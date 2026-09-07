'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  ShieldCheck,
  Headphones,
  Cpu,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole, usePermission, ROLE_PERMISSIONS } from "@/hooks/use-role";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { useState } from "react";
import { mockAlerts } from "@/lib/mock-data";

const navItems = [
  { to: "/platform", label: "Overview", icon: LayoutDashboard, permission: null },
  { to: "/platform/merchants", label: "Merchants", icon: Building2, permission: "merchants.view" },
  { to: "/platform/treasury", label: "Treasury", icon: DollarSign, permission: "treasury.view" },
  { to: "/platform/compliance", label: "Compliance", icon: ShieldCheck, permission: "compliance.view" },
  { to: "/platform/support", label: "Support", icon: Headphones, permission: "support.view" },
  { to: "/platform/providers", label: "Providers", icon: Cpu, permission: "providers.view" },
  { to: "/platform/audit", label: "Audit Log", icon: ScrollText, permission: "audit.view" },
  { to: "/platform/settings", label: "Settings", icon: Settings, permission: "settings.view" },
];

export default function PlatformSidebar() {
  const { role } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const unreadAlerts = mockAlerts.filter((a) => !a.isRead).length;

  // Filter nav items based on role permissions
  const visibleNavItems = navItems.filter(
    (item) => !item.permission || ROLE_PERMISSIONS[role]?.includes(item.permission)
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen top-0 transition-all duration-300 ease-in-out z-40 relative",
        "bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Vertical center line */}
      <div className="absolute left-1/2 top-14 bottom-0 w-px bg-sidebar-border/50 -translate-x-1/2 pointer-events-none" />
      
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-2 h-14 border-b border-sidebar-border shrink-0", collapsed && "justify-center px-2")}>
        <div className="size-8 flex items-center justify-center shrink-0">
          <Image
            src="/logo-md.png"
            alt="NamibraPay"
            width={30}
            height={30}
            unoptimized
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sidebar-foreground font-semibold text-sm leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              NamibraPay
            </p>
            <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 relative z-10">
        {visibleNavItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === "/platform"
            ? pathname === "/platform" || pathname === "/platform/"
            : pathname.startsWith(to);
          return (
            <Link
              key={to}
              href={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {/* Active indicator dot at the end */}
              {!collapsed && isActive && (
                <span className="ml-auto size-1.5 h-0.5 w-10 rounded-full bg-brand-teal shrink-0" />
              )}
              {collapsed && isActive && (
                <span className="absolute right-1 size-1 rounded-full bg-brand-teal" />
              )}
              {!collapsed && label === "Overview" && unreadAlerts > 0 && (
                <span className="ml-auto bg-brand-pink/30 text-[#c0392b] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-brand-pink/50">
                  {unreadAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 space-y-1 shrink-0 bg-sidebar relative z-10">
        {/* Alerts */}
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Alerts" : undefined}
        >
          <div className="relative shrink-0">
            <Bell className="size-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-brand-pink" />
            )}
          </div>
          {!collapsed && <span>Alerts</span>}
          {!collapsed && unreadAlerts > 0 && (
            <span className="ml-auto text-[10px] font-bold bg-brand-pink/20 text-[#c0392b] px-1.5 py-0.5 rounded-full border border-brand-pink/50">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* User */}
        <div className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 rounded-lg",
          collapsed && "justify-center"
        )}>
          <div className="size-7 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center shrink-0">
            <User className="size-3.5 text-brand-teal" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs font-medium truncate">Ama Serwaa</p>
              <p className="text-sidebar-foreground/40 text-[10px] truncate">{ROLE_LABELS[role]}</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors" title="Sign out">
              <LogOut className="size-3.5" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs",
            "text-sidebar-foreground/30 hover:text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors"
          )}
        >
          {collapsed ? <ChevronRight className="size-3.5" /> : (
            <>
              <ChevronLeft className="size-3.5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// Mobile bottom nav
export function PlatformBottomNav() {
  const pathname = usePathname();
  const mobileItems = navItems.slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex">
      {mobileItems.map(({ to, label, icon: Icon }) => {
        const isActive = to === "/platform"
          ? pathname === "/platform"
          : pathname.startsWith(to);
        return (
          <Link
            key={to}
            href={to}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors relative",
              isActive ? "text-sidebar-foreground" : "text-sidebar-foreground/40"
            )}
          >
            {/* Active indicator dot for mobile */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 size-1 rounded-full bg-brand-teal" />
            )}
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
