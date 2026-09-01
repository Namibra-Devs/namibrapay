import type { MerchantRole } from "@/lib/merchant-constants";

export type MerchantTransaction = {
  id: string;
  reference: string;
  createdAt: string;
  type: "collection" | "payout";
  amount: number;
  fee: number;
  net: number;
  status: "success" | "failed" | "pending" | "reversed" | "processing";
  payerIdentifier: string;
  subMerchantName?: string;
  failureReason?: string;
};

export type Settlement = {
  id: string;
  periodLabel: string;
  collected: number;
  fees: number;
  netSettled: number;
  paidOut: number;
  pendingPayout: number;
};

export type PayoutRecord = {
  id: string;
  date: string;
  amount: number;
  destinationBank: string;
  destinationAccount: string;
  status: "pending" | "processing" | "completed" | "failed";
  txnCount: number;
};

export type SubMerchant = {
  id: string;
  name: string;
  contactEmail: string;
  status: "pending" | "active" | "suspended" | "deactivated";
  onboardingDate: string;
  volume: number;
  txnCount: number;
  feeRate: number;
};

export type ApiKey = {
  id: string;
  label: string;
  environment: "sandbox" | "live";
  publicKey: string;
  secretKeyMasked: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
};

export type WebhookLog = {
  id: string;
  event: string;
  timestamp: string;
  url: string;
  httpStatus: number;
  responseSnippet: string;
  retryCount: number;
  success: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: MerchantRole;
  inviteStatus: "accepted" | "pending";
  lastLogin: string | null;
  twoFaEnabled: boolean;
};

// Seeded random function for consistent data generation
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getStatus(index: number): MerchantTransaction["status"] {
  const statuses: MerchantTransaction["status"][] = ["success", "success", "success", "failed", "pending", "processing"];
  return statuses[index % statuses.length] ?? "success";
}

// Generate transactions with consistent data
const BASE_TIME = 1704067200000; // Fixed timestamp: Jan 1, 2024
export const mockMerchantTransactions: MerchantTransaction[] = Array.from({ length: 50 }, (_, i) => {
  const amount = Math.floor(seededRandom(i * 7) * 3000 + 20);
  const fee = Math.round(amount * 0.015 * 100) / 100;
  const status = getStatus(i);
  const hasSubMerchant = seededRandom(i * 11) > 0.6;
  const subMerchantIndex = Math.floor(seededRandom(i * 13) * 3);
  
  return {
    id: `mtx-${i}`,
    reference: `NP-MTJ${i.toString(36).toUpperCase().padStart(5, '0')}-${String(i).padStart(3, "0")}`,
    createdAt: new Date(BASE_TIME - Math.floor(seededRandom(i * 3) * 604800000)).toISOString(),
    type: seededRandom(i * 5) > 0.25 ? "collection" : "payout",
    amount,
    fee,
    net: amount - fee,
    status,
    payerIdentifier: `+233 ${Math.floor(seededRandom(i * 17) * 900000000 + 100000000)}`,
    subMerchantName: hasSubMerchant ? ["Kumasi Branch", "Takoradi Outlet", "Tamale Hub"][subMerchantIndex] : undefined,
    failureReason: status === "failed" ? "Insufficient funds in wallet" : undefined,
  };
});

export const mockSettlements: Settlement[] = [
  { id: "s1", periodLabel: "Today", collected: 124_800, fees: 1872, netSettled: 122_928, paidOut: 0, pendingPayout: 122_928 },
  { id: "s2", periodLabel: "This Week", collected: 842_000, fees: 12_630, netSettled: 829_370, paidOut: 700_000, pendingPayout: 129_370 },
  { id: "s3", periodLabel: "This Month", collected: 3_240_000, fees: 48_600, netSettled: 3_191_400, paidOut: 2_900_000, pendingPayout: 291_400 },
];

export const mockPayouts: PayoutRecord[] = [
  { id: "po1", date: new Date(BASE_TIME - 86400000).toISOString(), amount: 700_000, destinationBank: "GCB Bank", destinationAccount: "****4821", status: "completed", txnCount: 342 },
  { id: "po2", date: new Date(BASE_TIME - 172800000).toISOString(), amount: 540_000, destinationBank: "GCB Bank", destinationAccount: "****4821", status: "completed", txnCount: 271 },
  { id: "po3", date: new Date(BASE_TIME - 3600000).toISOString(), amount: 122_928, destinationBank: "GCB Bank", destinationAccount: "****4821", status: "pending", txnCount: 89 },
  { id: "po4", date: new Date(BASE_TIME - 432000000).toISOString(), amount: 380_000, destinationBank: "GCB Bank", destinationAccount: "****4821", status: "failed", txnCount: 190 },
];

export const mockSubMerchants: SubMerchant[] = [
  { id: "sm1", name: "Kumasi Branch", contactEmail: "kumasi@kwameorganics.com", status: "active", onboardingDate: "2024-05-10", volume: 820_000, txnCount: 412, feeRate: 2.0 },
  { id: "sm2", name: "Takoradi Outlet", contactEmail: "takoradi@kwameorganics.com", status: "active", onboardingDate: "2024-07-15", volume: 430_000, txnCount: 218, feeRate: 2.0 },
  { id: "sm3", name: "Tamale Hub", contactEmail: "tamale@kwameorganics.com", status: "pending", onboardingDate: "2025-01-20", volume: 0, txnCount: 0, feeRate: 1.8 },
  { id: "sm4", name: "Sunyani Store", contactEmail: "sunyani@kwameorganics.com", status: "suspended", onboardingDate: "2024-03-01", volume: 90_000, txnCount: 45, feeRate: 2.0 },
];

export const mockApiKeys: ApiKey[] = [
  { id: "k1", label: "Production Key", environment: "live", publicKey: "npk_live_xKf93mPqR7vN2hT8", secretKeyMasked: "npsk_live_••••••••••••••••••••••4j9X", createdAt: new Date(BASE_TIME - 7776000000).toISOString(), lastUsed: new Date(BASE_TIME - 120000).toISOString(), status: "active" },
  { id: "k2", label: "Sandbox Testing", environment: "sandbox", publicKey: "npk_test_aB4cD5eF6gH7iJ8k", secretKeyMasked: "npsk_test_••••••••••••••••••••••2mLq", createdAt: new Date(BASE_TIME - 15552000000).toISOString(), lastUsed: new Date(BASE_TIME - 3600000).toISOString(), status: "active" },
  { id: "k3", label: "Old Integration", environment: "live", publicKey: "npk_live_zY9xW8vU7tS6rQ5p", secretKeyMasked: "npsk_live_••••••••••••••••••••••7nKp", createdAt: new Date(BASE_TIME - 31104000000).toISOString(), lastUsed: new Date(BASE_TIME - 86400000 * 14).toISOString(), status: "revoked" },
];

export const mockWebhookLogs: WebhookLog[] = [
  { id: "wh1", event: "collection.success", timestamp: new Date(BASE_TIME - 120000).toISOString(), url: "https://api.kwameorganics.com/webhooks/namibrapay", httpStatus: 200, responseSnippet: '{"received":true}', retryCount: 0, success: true },
  { id: "wh2", event: "collection.failed", timestamp: new Date(BASE_TIME - 300000).toISOString(), url: "https://api.kwameorganics.com/webhooks/namibrapay", httpStatus: 200, responseSnippet: '{"received":true}', retryCount: 0, success: true },
  { id: "wh3", event: "payout.completed", timestamp: new Date(BASE_TIME - 86400000).toISOString(), url: "https://api.kwameorganics.com/webhooks/namibrapay", httpStatus: 502, responseSnippet: "<html>Bad Gateway</html>", retryCount: 3, success: false },
  { id: "wh4", event: "collection.success", timestamp: new Date(BASE_TIME - 7200000).toISOString(), url: "https://api.kwameorganics.com/webhooks/namibrapay", httpStatus: 200, responseSnippet: '{"received":true}', retryCount: 0, success: true },
];

export const mockTeamMembers: TeamMember[] = [
  { id: "tm1", name: "Kwame Asante", email: "kwame@kwameorganics.com", role: "owner", inviteStatus: "accepted", lastLogin: new Date(BASE_TIME - 3600000).toISOString(), twoFaEnabled: true },
  { id: "tm2", name: "Abena Mensah", email: "abena@kwameorganics.com", role: "admin", inviteStatus: "accepted", lastLogin: new Date(BASE_TIME - 86400000).toISOString(), twoFaEnabled: true },
  { id: "tm3", name: "Kofi Boateng", email: "kofi@kwameorganics.com", role: "developer", inviteStatus: "accepted", lastLogin: new Date(BASE_TIME - 7200000).toISOString(), twoFaEnabled: false },
  { id: "tm4", name: "Ama Darko", email: "ama@kwameorganics.com", role: "finance", inviteStatus: "accepted", lastLogin: new Date(BASE_TIME - 172800000).toISOString(), twoFaEnabled: true },
  { id: "tm5", name: "Yaw Owusu", email: "yaw@kwameorganics.com", role: "support", inviteStatus: "pending", lastLogin: null, twoFaEnabled: false },
];

export const mockMerchantChartData = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(BASE_TIME);
  date.setDate(date.getDate() - (6 - i));
  return {
    date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    collections: Math.floor(seededRandom(i * 19) * 600000 + 200000),
    payouts: Math.floor(seededRandom(i * 23) * 300000 + 100000),
    txnCount: Math.floor(seededRandom(i * 29) * 500 + 100),
  };
});
