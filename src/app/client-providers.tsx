"use client";

import { RoleProvider } from "@/hooks/use-role";
import { ToastProvider } from "@/components/ui/Toast";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </RoleProvider>
  );
}
