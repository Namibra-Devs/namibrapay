'use client';

import { ReactNode } from "react";
import MerchantSidebar, { MerchantBottomNav } from "./_components/merchant-sidebar";
import MerchantRoleSwitcher from "./_components/merchant-role-switcher";
import { MerchantRoleProvider } from "@/hooks/use-merchant-role";
import { useMerchantRole } from "@/hooks/use-merchant-role";
import { MERCHANT_ROLE_LABELS } from "@/lib/merchant-constants";
import { RefreshCw, ShieldOff } from "lucide-react";

function LayoutInner({ children }: { children: ReactNode }) {
  const { role } = useMerchantRole();
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">
              Merchant Dashboard · <span className="text-foreground">{MERCHANT_ROLE_LABELS[role]}</span>
            </span>
            <span className="ml-2 text-[10px] bg-brand-mint/20 text-[#1a7a5e] border border-brand-mint/40 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ShieldOff className="size-2.5" />
              Provider-blind
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-2 py-1 font-medium">
              <RefreshCw className="size-2.5" />
              Dev Mode
            </div>
            <MerchantRoleSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <MerchantBottomNav />
    </div>
  );
}

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <MerchantRoleProvider>
      <LayoutInner>{children}</LayoutInner>
    </MerchantRoleProvider>
  );
}
