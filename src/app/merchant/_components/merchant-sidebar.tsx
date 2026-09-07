'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  Users,
  Code2,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Building2,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { MERCHANT_ROLE_LABELS } from "@/lib/merchant-constants";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { to: "/merchant", label: "Overview", icon: LayoutDashboard, permission: "dashboard.view" },
  { to: "/merchant/compliance", label: "Compliance", icon: FileCheck, permission: "settings.view" },
  { to: "/merchant/transactions", label: "Transactions", icon: ArrowLeftRight, permission: "transactions.view" },
  { to: "/merchant/settlements", label: "Settlements", icon: Banknote, permission: "settlements.view" },
  { to: "/merchant/sub-merchants", label: "Sub-Merchants", icon: Building2, permission: "submerchants.view" },
  { to: "/merchant/api", label: "API & Webhooks", icon: Code2, permission: "api.view" },
  { to: "/merchant/team", label: "Team", icon: Users, permission: "team.view" },
  { to: "/merchant/merchant-settings", label: "Settings", icon: Settings, permission: "settings.view" },
];

export default function MerchantSidebar() {
  const { role, can } = useMerchantRole();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

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
            <p className="text-sidebar-foreground font-semibold text-sm leading-tight truncate" style={{ fontFamily: "var(--font-heading)" }}>
              Kwame Organics
            </p>
            <p className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">Merchant</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 relative z-10">
        {navItems.map(({ to, label, icon: Icon, permission }) => {
          if (permission && !can(permission)) return null;
          const isActive = to === "/merchant"
            ? pathname === "/merchant" || pathname === "/merchant/"
            : pathname.startsWith(to);
          
          const linkContent = (
            <Link
              href={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
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
        {/* Notifications */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  "justify-center"
                )}
              >
                <Bell className="size-4 shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Notifications
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Bell className="size-4 shrink-0" />
            <span>Notifications</span>
          </button>
        )}

        <div className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-md", collapsed && "justify-center")}>
          <div className="size-7 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center shrink-0">
            <User className="size-3.5 text-brand-teal" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs font-medium truncate">Kwame Asante</p>
              <p className="text-sidebar-foreground/40 text-[10px] truncate">{MERCHANT_ROLE_LABELS[role]}</p>
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
                  "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs",
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
              "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs",
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

export function MerchantBottomNav() {
  const { can } = useMerchantRole();
  const pathname = usePathname();
  const visibleItems = navItems.filter((n) => !n.permission || can(n.permission)).slice(0, 5);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex">
      {visibleItems.map(({ to, label, icon: Icon }) => {
        const isActive = to === "/merchant" ? pathname === "/merchant" : pathname.startsWith(to);
        return (
          <Link key={to} href={to}
            className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors relative",
              isActive ? "text-sidebar-foreground" : "text-sidebar-foreground/40")}>
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
