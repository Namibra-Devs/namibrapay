import type { Role } from "./constants";

export type Merchant = {
  id: string;
  name: string;
  registrationNumber: string;
  status: "active" | "suspended" | "pending" | "deactivated";
  onboardingDate: string;
  totalVolume: number;
  subMerchantCount: number;
  complianceStatus: "verified" | "pending" | "flagged" | "rejected";
  email: string;
  industry: string;
};

export type Transaction = {
  id: string;
  merchantName: string;
  amount: number;
  status: "successful" | "failed" | "pending" | "processing";
  provider: string;
  type: "collection" | "payout";
  customerRef: string;
  createdAt: string;
};

export type Alert = {
  id: string;
  type: "balance_threshold" | "provider_outage" | "compliance_hold" | "payout_failed" | "security";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  createdAt: string;
  isRead: boolean;
};

export type Provider = {
  id: string;
  name: string;
  shortCode: string;
  status: "operational" | "degraded" | "down";
  lastSuccessful: string;
  avgLatencyMs: number;
  settlementBalance: number;
  balanceThreshold: number;
  balanceStatus: "healthy" | "warning" | "critical";
  uptime: number;
};

export const mockProviders: Provider[] = [
  {
    id: "umb001",
    name: "Universal Merchant Bank (UMB)",
    shortCode: "UMB",
    status: "operational",
    lastSuccessful: new Date().toISOString(),
    avgLatencyMs: 285,
    settlementBalance: 4_500_000,
    balanceThreshold: 1_000_000,
    balanceStatus: "healthy",
    uptime: 99.7,
  },
];

export const mockMerchants: Merchant[] = [
  {
    id: "m1",
    name: "Kwame Organics Ltd",
    registrationNumber: "CS004152023",
    status: "active",
    onboardingDate: "2024-03-15",
    totalVolume: 4_820_000,
    subMerchantCount: 12,
    complianceStatus: "verified",
    email: "ops@kwameorganics.com",
    industry: "Retail",
  },
  {
    id: "m2",
    name: "Accra Tech Hub",
    registrationNumber: "CS006782024",
    status: "active",
    onboardingDate: "2024-07-22",
    totalVolume: 1_240_000,
    subMerchantCount: 3,
    complianceStatus: "verified",
    email: "finance@accratechhub.com",
    industry: "Technology",
  },
  {
    id: "m3",
    name: "SumaFoods Ghana",
    registrationNumber: "CS001112022",
    status: "suspended",
    onboardingDate: "2022-11-05",
    totalVolume: 890_000,
    subMerchantCount: 0,
    complianceStatus: "flagged",
    email: "ceo@sumafoods.gh",
    industry: "Food & Beverage",
  },
  {
    id: "m4",
    name: "Nnipa Health Services",
    registrationNumber: "CS009032023",
    status: "pending",
    onboardingDate: "2025-01-10",
    totalVolume: 0,
    subMerchantCount: 0,
    complianceStatus: "pending",
    email: "admin@nnipa.health",
    industry: "Healthcare",
  },
  {
    id: "m5",
    name: "GreenBuild Solutions",
    registrationNumber: "CS003302021",
    status: "active",
    onboardingDate: "2021-09-01",
    totalVolume: 9_340_000,
    subMerchantCount: 28,
    complianceStatus: "verified",
    email: "payments@greenbuild.gh",
    industry: "Construction",
  },
  {
    id: "m6",
    name: "Takoradi Logistics",
    registrationNumber: "CS007412024",
    status: "deactivated",
    onboardingDate: "2024-02-18",
    totalVolume: 210_000,
    subMerchantCount: 1,
    complianceStatus: "rejected",
    email: "info@takolog.com",
    industry: "Logistics",
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "a1",
    type: "balance_threshold",
    title: "Settlement Balance Warning",
    description: "UMB settlement balance approaching threshold. Consider prefunding.",
    severity: "high",
    createdAt: "2026-09-03T11:30:00Z",
    isRead: false,
  },
  {
    id: "a2",
    type: "compliance_hold",
    title: "SumaFoods Ghana — Compliance Hold",
    description: "Account suspended pending AML investigation. KYC Officer assigned.",
    severity: "high",
    createdAt: "2026-09-02T12:30:00Z",
    isRead: true,
  },
  {
    id: "a3",
    type: "payout_failed",
    title: "Payout Batch #PB-2024-0891 Failed",
    description: "3 of 47 payouts failed. Finance review required.",
    severity: "medium",
    createdAt: "2026-09-03T09:30:00Z",
    isRead: false,
  },
  {
    id: "a4",
    type: "security",
    title: "Unusual Login Activity Detected",
    description: "Multiple failed login attempts from IP 41.189.xxx.xxx.",
    severity: "medium",
    createdAt: "2026-09-03T06:30:00Z",
    isRead: true,
  },
];

export const mockChartData = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    successful: Math.floor(Math.random() * 8000 + 4000),
    failed: Math.floor(Math.random() * 400 + 100),
    volume: Math.floor(Math.random() * 3000000 + 1000000),
  };
});

export const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
  id: `TXN-${String(i + 1).padStart(6, "0")}`,
  merchantName: mockMerchants[i % mockMerchants.length]!.name,
  amount: Math.floor(Math.random() * 5000 + 50),
  status: (["successful", "successful", "successful", "failed", "pending"][
    Math.floor(Math.random() * 5)
  ] ?? "successful") as Transaction["status"],
  provider: "UMB",
  type: Math.random() > 0.3 ? "collection" : "payout",
  customerRef: `REF-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  createdAt: `2026-09-0${2 + Math.floor(Math.random() * 2)}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
}));

export const currentUserRole: Role = "super_admin";
