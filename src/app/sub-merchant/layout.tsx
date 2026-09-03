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
        <header className="h-14 shrink-0 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-[#a3ffe2] animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">
              Sub-Merchant Dashboard · <span className="text-foreground">{SUB_MERCHANT_ROLE_LABELS[role]}</span>
            </span>
            <span className="ml-2 text-[10px] bg-[#a3ffe2]/20 text-[#1a7a5e] border border-[#a3ffe2]/40 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ShieldOff className="size-2.5" />
              Provider-blind
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-2 py-1 font-medium">
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