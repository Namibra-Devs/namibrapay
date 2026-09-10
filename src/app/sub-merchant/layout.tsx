'use client';

import { ReactNode } from "react";
import SubMerchantSidebar, { SubMerchantBottomNav } from "./_components/sub-merchant-sidebar";
import SubMerchantRoleSwitcher from "./_components/sub-merchant-role-switcher";
import { SubMerchantRoleProvider } from "@/hooks/use-sub-merchant-role";
import { useSubMerchantRole } from "@/hooks/use-sub-merchant-role";
import { SUB_MERCHANT_ROLE_LABELS } from "@/lib/sub-merchant-constants";
import { RefreshCw, ShieldOff } from "lucide-react";

function LayoutInner({ children }: { children: ReactNode }) {
  const { role } = useSubMerchantRole();
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SubMerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 z-30">
          {/* Left side - simplified on mobile */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <div className="size-1.5 rounded-full bg-brand-mint animate-pulse shrink-0" />
            <span className="text-xs text-muted-foreground font-medium truncate">
              <span className="hidden sm:inline">Sub-Merchant Dashboard · </span>
              <span className="text-foreground">{SUB_MERCHANT_ROLE_LABELS[role]}</span>
            </span>
            {/* Provider-blind badge - hidden on mobile */}
            <span className="hidden md:flex ml-2 text-[10px] bg-brand-mint/20 text-[#1a7a5e] border border-brand-mint/40 px-2 py-0.5 rounded-full font-medium items-center gap-1 shrink-0">
              <ShieldOff className="size-2.5" />
              Provider-blind
            </span>
          </div>
          
          {/* Right side - role switcher only on mobile, dev badge hidden */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-[10px] bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-2 py-1 font-medium">
              <RefreshCw className="size-2.5" />
              Dev Mode
            </div>
            <SubMerchantRoleSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <SubMerchantBottomNav />
    </div>
  );
}

export default function SubMerchantLayout({ children }: { children: ReactNode }) {
  return (
    <SubMerchantRoleProvider>
      <LayoutInner>{children}</LayoutInner>
    </SubMerchantRoleProvider>
  );
}