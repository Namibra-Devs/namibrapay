"use client";

import { RoleProvider } from "@/hooks/use-role";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </RoleProvider>
    </ErrorBoundary>
  );
}
