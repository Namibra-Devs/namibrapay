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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: string | null;
};

const navItems: NavItem[] = [
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
    <TooltipProvider>
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
          
          const linkContent = (
            <Link
              href={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {/* Active indicator dot at the end */}
              {!collapsed && isActive && (
                <span className="ml-auto size-1.5 h-0.5 w-10 rounded-full bg-brand-teal shrink-0" />
              )}
              {collapsed && isActive && (
                <span className="absolute right-1 size-1.5 rounded-full bg-brand-teal" />
              )}
              {!collapsed && label === "Overview" && unreadAlerts > 0 && (
                <span className="ml-auto bg-brand-pink/30 text-[#c0392b] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-brand-pink/50">
                  {unreadAlerts}
                </span>
              )}
            </Link>
          );
          
          return collapsed ? (
            <Tooltip key={to} delayDuration={0}>
              <TooltipTrigger asChild>
                {linkContent}
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div key={to}>{linkContent}</div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 space-y-1 shrink-0 bg-sidebar relative z-10">
        {/* Alerts */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  "justify-center"
                )}
              >
                <div className="relative shrink-0">
                  <Bell className="size-4" />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 size-2 rounded-full bg-brand-pink" />
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Notification
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <div className="relative shrink-0">
              <Bell className="size-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-brand-pink" />
              )}
            </div>
            <span>Alerts</span>
            {unreadAlerts > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-brand-pink/20 text-[#c0392b] px-1.5 py-0.5 rounded-full border border-brand-pink/50">
                {unreadAlerts}
              </span>
            )}
          </button>
        )}

        {/* User */}
        <div className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 rounded-md",
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
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs",
                  "text-sidebar-foreground/30 hover:text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors"
                )}
              >
                <ChevronRight className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Expand
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs",
              "text-sidebar-foreground/30 hover:text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors"
            )}
          >
            <ChevronLeft className="size-3.5" />
            <span>Collapse</span>
          </button>
        )}
      </div>
    </aside>
    </TooltipProvider>
  );
}

// Mobile Navigation Components
export function PlatformBottomNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const [showDrawer, setShowDrawer] = useState(false);
  const unreadAlerts = mockAlerts.filter((a) => !a.isRead).length;

  // Filter nav items based on role permissions
  const visibleNavItems = navItems.filter(
    (item) => !item.permission || ROLE_PERMISSIONS[role]?.includes(item.permission)
  );

  // Bottom nav shows: Overview, Merchants, Treasury, Support, and More
  const bottomNavItems = [
    visibleNavItems[0], // Overview
    visibleNavItems[1], // Merchants
    visibleNavItems[2], // Treasury
    visibleNavItems[4], // Support
  ].filter((item): item is NavItem => item !== undefined);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border safe-bottom">
        <div className="flex items-center">
          {bottomNavItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === "/platform"
              ? pathname === "/platform" || pathname === "/platform/"
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
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 size-1 rounded-full bg-brand-teal" />
                )}
                <div className="relative">
                  <Icon className="size-5" />
                  {label === "Overview" && unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 size-2 rounded-full bg-brand-pink" />
                  )}
                </div>
                <span className="truncate max-w-15">{label}</span>
              </Link>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={() => setShowDrawer(true)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
              showDrawer ? "text-sidebar-foreground" : "text-sidebar-foreground/40"
            )}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
            More
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {showDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-60 animate-in fade-in duration-200"
            onClick={() => setShowDrawer(false)}
          />
          
          {/* Drawer */}
          <div className="md:hidden fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-sidebar border-l border-sidebar-border z-70 animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-8 flex items-center justify-center">
                  <Image
                    src="/logo-md.png"
                    alt="NamibraPay"
                    width={30}
                    height={30}
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sidebar-foreground font-semibold text-sm leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    NamibraPay
                  </p>
                  <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">Platform</p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {visibleNavItems.map(({ to, label, icon: Icon }) => {
                const isActive = to === "/platform"
                  ? pathname === "/platform" || pathname === "/platform/"
                  : pathname.startsWith(to);
                
                return (
                  <Link
                    key={to}
                    href={to}
                    onClick={() => setShowDrawer(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-brand-teal shrink-0" />
                    )}
                    {label === "Overview" && unreadAlerts > 0 && (
                      <span className="bg-brand-pink/30 text-[#c0392b] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-brand-pink/50">
                        {unreadAlerts}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-sidebar-border p-3 space-y-2 shrink-0">
              {/* Alerts Button */}
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <div className="relative shrink-0">
                  <Bell className="size-4" />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 size-2 rounded-full bg-brand-pink" />
                  )}
                </div>
                <span className="flex-1 text-left">Alerts</span>
                {unreadAlerts > 0 && (
                  <span className="text-[10px] font-bold bg-brand-pink/20 text-[#c0392b] px-1.5 py-0.5 rounded-full border border-brand-pink/50">
                    {unreadAlerts}
                  </span>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-sidebar-accent/50">
                <div className="size-8 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center shrink-0">
                  <User className="size-4 text-brand-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sidebar-foreground text-xs font-medium truncate">Ama Serwaa</p>
                  <p className="text-sidebar-foreground/40 text-[10px] truncate">{ROLE_LABELS[role]}</p>
                </div>
                <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors" title="Sign out">
                  <LogOut className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
