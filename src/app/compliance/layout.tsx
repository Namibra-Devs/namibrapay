"use client";

import { RBACProvider } from "@/contexts/RBACContext";

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RBACProvider>{children}</RBACProvider>;
}
