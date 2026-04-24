"use client";

import { Toaster } from "@/components/ui/Toast";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
