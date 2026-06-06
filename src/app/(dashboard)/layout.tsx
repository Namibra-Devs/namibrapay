/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/namibrapay-main/layout/Sidebar";
import TopBar from "@/components/namibrapay-main/layout/TopBar";
import ComplianceModal from "@/components/namibrapay-main/compliance/ComplianceModal";
import FeatureAnnouncementModal from "@/components/namibrapay-main/dashboard/FeatureAnnouncementModal";
import type { FeatureAnnouncementModalProps } from "@/components/namibrapay-main/dashboard/FeatureAnnouncementModal";

type FeatureConfig = Omit<FeatureAnnouncementModalProps, "onClose"> & { featureKey: string };

const FEATURE_QUEUE: FeatureConfig[] = [
  {
    featureKey: "np_feature_bank_transfer_v1",
    title: "Introducing Pay with Bank Transfer! 🎉",
    illustrationType: "bank_transfer",
    features: [
      {
        title: "Accept payments of any size",
        description: "Securely receive large payments that exceed mobile money wallet limits.",
      },
      {
        title: "Offer bank-grade security",
        description: "Give customers peace of mind by leveraging Ghana's national banking infrastructure.",
      },
      {
        title: "Reconcile payments in one place",
        description: "See all your payments, from cards, MoMo, and bank transfers, in one unified Dashboard.",
      },
      {
        title: "Give customers more choice",
        description: "Offer an easy, trusted way to pay for those who prefer using their banking app.",
      },
    ],
    ctaLabel: "Enable in your preferences",
    ctaHref: "/settings",
    secondaryCtaLabel: "Learn more",
    secondaryCtaHref: "#",
  },
  {
    featureKey: "np_feature_mobile_money_v1",
    title: "Introducing Mobile Money Transfers",
    illustrationType: "rocket",
    description:
      "Send money directly to any mobile wallet across Ghana and Namibia. Fast, secure, and available 24/7 for all registered businesses.",
    ctaLabel: "Get started",
    ctaHref: "/transfers",
  },
];

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
  const [currentFeature, setCurrentFeature] = useState<FeatureConfig | null>(null);

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

  useEffect(() => {
    const next = FEATURE_QUEUE.find((f) => !localStorage.getItem(f.featureKey));
    if (next) setCurrentFeature(next);
  }, []);

  function handleComplianceModalClose() {
    localStorage.setItem("np_compliance_seen", "true");
    setShowComplianceModal(false);
  }

  function handleFeatureModalClose() {
    if (!currentFeature) return;
    localStorage.setItem(currentFeature.featureKey, "true");
    const next = FEATURE_QUEUE.find((f) => !localStorage.getItem(f.featureKey));
    setCurrentFeature(next ?? null);
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-50">
      {/* Blobs — subtle on light top, richer on dark bottom */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-brand-lavender/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-lg h-64 bg-brand-teal/20 rounded-full blur-3xl" />
      </div>

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

      {currentFeature && !showComplianceModal && (
        <FeatureAnnouncementModal
          key={currentFeature.featureKey}
          {...currentFeature}
          onClose={handleFeatureModalClose}
        />
      )}
    </div>
  );
}