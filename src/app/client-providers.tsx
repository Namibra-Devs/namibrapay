"use client";

import { RoleProvider } from "@/hooks/use-role";
import { ToastProvider } from "@/components/ui/toast";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </RoleProvider>
  );
}
