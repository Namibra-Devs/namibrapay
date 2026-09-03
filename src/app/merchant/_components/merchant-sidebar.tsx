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
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { MERCHANT_ROLE_LABELS } from "@/lib/merchant-constants";
import { useState } from "react";

const navItems = [
  { to: "/merchant", label: "Overview", icon: LayoutDashboard, permission: "dashboard.view" },
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
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-40",
        "bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-17" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border shrink-0", collapsed && "justify-center px-2")}>
        <div className="size-8 flex items-center justify-center shrink-0">
          <Image
            src="/favicon.png"
            alt="NamibraPay"
            width={40}
            height={40}
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
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, permission }) => {
          if (permission && !can(permission)) return null;
          const isActive = to === "/merchant"
            ? pathname === "/merchant" || pathname === "/merchant/"
            : pathname.startsWith(to);
          return (
            <Link
              key={to}
              href={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 space-y-1 shrink-0">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Alerts" : undefined}
        >
          <Bell className="size-4 shrink-0" />
          {!collapsed && <span>Notifications</span>}
        </button>

        <div className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-lg", collapsed && "justify-center")}>
          <div className="size-7 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center shrink-0">
            <UserCircle className="size-3.5 text-[#64c6c3]" />
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

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs",
            "text-sidebar-foreground/30 hover:text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors"
          )}
        >
          {collapsed ? <ChevronRight className="size-3.5" /> : <><ChevronLeft className="size-3.5" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
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
            className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
              isActive ? "text-sidebar-primary" : "text-sidebar-foreground/40")}>
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
