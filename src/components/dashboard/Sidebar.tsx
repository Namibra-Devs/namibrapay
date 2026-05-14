"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  ArrowLeftRight,
  Users,
  RotateCcw,
  Banknote,
  AlertTriangle,
  GitBranch,
  Layers2,
  Monitor,
  UserCheck,
  Layers,
  RefreshCw,
  Globe,
  Package,
  Store,
  ShoppingCart,
  Receipt,
  Key,
  Zap,
  Terminal,
  ClipboardList,
  Settings,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

const topNav: NavItem[] = [
  { label: "Compliance", href: "/compliance", icon: ShieldCheck },
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
];

const navGroups: NavGroup[] = [
  {
    section: "PAYMENTS",
    items: [
      { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Refunds", href: "/refunds", icon: RotateCcw },
      { label: "Payouts", href: "/payouts", icon: Banknote },
      { label: "Disputes", href: "/disputes", icon: AlertTriangle },
      {
        label: "Transaction Splits",
        href: "/transaction-splits",
        icon: GitBranch,
      },
      { label: "Subaccounts", href: "/subaccounts", icon: Layers2 },
      { label: "Terminals", href: "/terminals", icon: Monitor },
    ],
  },
  {
    section: "RECURRING",
    items: [
      { label: "Subscribers", href: "/subscribers", icon: UserCheck },
      { label: "Plans", href: "/plans", icon: Layers },
      { label: "Subscriptions", href: "/subscriptions", icon: RefreshCw },
    ],
  },
  {
    section: "COMMERCE",
    items: [
      { label: "Payment Pages", href: "/payment-pages", icon: Globe },
      { label: "Products", href: "/products", icon: Package },
      { label: "Storefronts", href: "/storefronts", icon: Store },
      { label: "Orders", href: "/orders", icon: ShoppingCart },
      { label: "Invoices", href: "/invoices", icon: Receipt },
    ],
  },
  {
    section: "DEVELOPER",
    items: [
      { label: "API Keys", href: "/api-keys", icon: Key },
      { label: "Webhooks", href: "/webhooks", icon: Zap },
      { label: "API Logs", href: "/api-logs", icon: Terminal },
    ],
  },
];

const bottomNav: NavItem[] = [
  { label: "Audit Logs", href: "/audit-logs", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname.replace(/\/$/, "") === item.href.replace(/\/$/, "");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-brand-teal/10 text-brand-teal font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0",
          isActive ? "text-brand-teal" : "text-gray-400",
        )}
      />
      <span className="truncate">{item.label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
      )}
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white/92 backdrop-blur-xl border-r border-gray-100/50 shadow-[0_0_40px_-10px_rgba(15,23,42,0.12)] transition-transform duration-300 ease-in-out",
          "lg:relative lg:z-auto lg:translate-x-0 lg:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo + brand */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100/50 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/favicon.png"
              alt="NamibraPay"
              width={40}
              height={30}
              className="rounded-lg"
              style={{ height: "auto" }}
            />
          </Link>
          {/* <Link href="/dashboard" className="hidden md:flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="NamibraPay"
              width={130}
              height={30}
              className="rounded-lg"
              style={{ height: "auto" }}
            />
          </Link> */}
          <button
            title="close"
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace selector */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0 shadow-[0_6px_16px_-10px_rgba(15,23,42,0.15)]">
          <button className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-brand-teal to-brand-navy flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate leading-none">
                  Test Workspace
                </p>
                <p className="text-[10px] text-amber-500 font-medium mt-0.5">
                  Test Mode
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {topNav.map((item) => (
            <NavLink key={item.href} item={item} onClick={onClose} />
          ))}

          <div className="pt-2 space-y-4">
            {navGroups.map((group) => (
              <div key={group.section}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[3.35] text-gray-400">
                  {group.section}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink key={item.href} item={item} onClick={onClose} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom navigation */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-0.5 shrink-0 shadow-[0_-6px_16px_-10px_rgba(15,23,42,0.15)]">
          {bottomNav.map((item) => (
            <NavLink key={item.href} item={item} onClick={onClose} />
          ))}
        </div>
      </aside>
    </>
  );
}
