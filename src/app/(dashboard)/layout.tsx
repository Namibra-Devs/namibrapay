/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import ComplianceModal from "@/components/compliance/ComplianceModal";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":         "NamibraPay - Dashboard",
  "/transactions":      "NamibraPay - Transactions",
  "/customers":         "NamibraPay - Customers",
  "/refunds":           "NamibraPay - Refunds",
  "/payouts":           "NamibraPay - Payouts",
  "/disputes":          "NamibraPay - Disputes",
  "/transaction-splits":"NamibraPay - Transaction Splits",
  "/subaccounts":       "NamibraPay - Subaccounts",
  "/terminals":         "NamibraPay - Terminals",
  "/subscribers":       "NamibraPay - Subscribers",
  "/plans":             "NamibraPay - Plans",
  "/subscriptions":     "NamibraPay - Subscriptions",
  "/payment-pages":     "NamibraPay - Payment Pages",
  "/products":          "NamibraPay - Products",
  "/storefronts":       "NamibraPay - Storefronts",
  "/orders":            "NamibraPay - Orders",
  "/invoices":          "NamibraPay - Invoices",
  "/api-keys":          "NamibraPay - API Keys",
  "/webhooks":          "NamibraPay - Webhooks",
  "/api-logs":          "NamibraPay - API Logs",
  "/audit-logs":        "NamibraPay - Audit Logs",
  "/settings":          "NamibraPay - Settings",
  "/compliance":        "NamibraPay - Compliance",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [ready, setReady] = useState(() => process.env.NODE_ENV === "development");
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  useEffect(() => {
    const key = pathname.replace(/\/$/, "");
    document.title = PAGE_TITLES[key] ?? "NamibraPay";
  }, [pathname]);

  // useEffect(() => {
  //   if (ready) return;
  //   const token = localStorage.getItem("np_access_token");
  //   if (!token) {
  //     router.replace("/signin");
  //     return;
  //   }
  //   setReady(true);
  // }, [ready, router]);

  useEffect(() => {
    const seen = localStorage.getItem("np_compliance_seen");
    if (!seen) {
      setShowComplianceModal(true);
      router.replace("/compliance");
    }
  }, [router]);

  function handleComplianceModalClose() {
    localStorage.setItem("np_compliance_seen", "true");
    setShowComplianceModal(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-8xl mx-auto p-4 lg:p-4">{children}</div>
        </main>
      </div>

      {showComplianceModal && (
        <ComplianceModal onClose={handleComplianceModalClose} />
      )}
    </div>
  );
}
