import { mockMerchants } from "./mock-data";

export type PrefundRequest = {
  id: string;
  provider: string;
  providerCode: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
};

export type ReconciliationEntry = {
  id: string;
  date: string;
  provider: string;
  expectedCollections: number;
  actualCollections: number;
  expectedPayouts: number;
  actualPayouts: number;
  expectedFees: number;
  actualFees: number;
  status: "balanced" | "discrepancy" | "pending";
  discrepancyAmount?: number;
  discrepancyCause?: string;
};

export type PayoutBatch = {
  id: string;
  batchRef: string;
  merchantName: string;
  totalAmount: number;
  payoutCount: number;
  status: "pending_approval" | "approved" | "processing" | "completed" | "failed" | "rejected";
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  provider: string;
  failedCount?: number;
};

export type FeeLedgerEntry = {
  id: string;
  date: string;
  merchantName: string;
  channel: string;
  transactionType: "collection" | "payout";
  transactionAmount: number;
  feeRate: string;
  feeAmount: number;
  nspShare: number;
  platformShare: number;
  ref: string;
};

export type FinancialReport = {
  id: string;
  name: string;
  description: string;
  period: string;
  generatedAt: string;
  size: string;
  type: "reconciliation" | "fee_ledger" | "payout" | "volume" | "nsp_balance";
};

export const mockPrefundRequests: PrefundRequest[] = [
  {
    id: "pf1",
    provider: "GhIPSS / GIP",
    providerCode: "GIP",
    amount: 500_000,
    status: "pending",
    requestedBy: "Ama Serwaa",
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    notes: "Balance critically low. GIP is down — urgent prefund required.",
  },
  {
    id: "pf2",
    provider: "Vodafone Cash",
    providerCode: "VOD",
    amount: 300_000,
    status: "approved",
    requestedBy: "Kofi Mensah",
    requestedAt: new Date(Date.now() - 7200000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 5400000).toISOString(),
    notes: "Top-up to maintain 20% buffer above threshold.",
  },
  {
    id: "pf3",
    provider: "MTN Mobile Money",
    providerCode: "MTN",
    amount: 1_000_000,
    status: "completed",
    requestedBy: "Ama Serwaa",
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 165600000).toISOString(),
  },
  {
    id: "pf4",
    provider: "AirtelTigo Money",
    providerCode: "AT",
    amount: 200_000,
    status: "rejected",
    requestedBy: "Kwame Acheampong",
    requestedAt: new Date(Date.now() - 259200000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 252000000).toISOString(),
    notes: "Duplicate request — existing approved request still pending.",
  },
];

export const mockReconciliationEntries: ReconciliationEntry[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  const hasDisc = i === 2 || i === 5;
  const exp = Math.floor(Math.random() * 2_000_000 + 800_000);
  const act = hasDisc ? exp - Math.floor(Math.random() * 50_000 + 5_000) : exp;
  const expP = Math.floor(Math.random() * 1_200_000 + 400_000);
  const actP = hasDisc ? expP - Math.floor(Math.random() * 30_000 + 2_000) : expP;
  const expF = Math.floor(exp * 0.015);
  const actF = Math.floor(act * 0.015);
  return {
    id: `rec-${i}`,
    date: date.toISOString().split("T")[0] ?? "",
    provider: (["MTN", "VOD", "AT", "GIP"] as const)[i % 4] ?? "MTN",
    expectedCollections: exp,
    actualCollections: act,
    expectedPayouts: expP,
    actualPayouts: actP,
    expectedFees: expF,
    actualFees: actF,
    status: (hasDisc ? "discrepancy" : i === 6 ? "pending" : "balanced") as ReconciliationEntry["status"],
    discrepancyAmount: hasDisc ? exp - act : undefined,
    discrepancyCause: hasDisc
      ? i === 2
        ? "Timing difference — T+1 settlement lag"
        : "NSP reporting mismatch — escalated to GIP"
      : undefined,
  };
});

export const mockPayoutBatches: PayoutBatch[] = [
  {
    id: "pb1",
    batchRef: "PB-2026-0897",
    merchantName: "GreenBuild Solutions",
    totalAmount: 1_240_500,
    payoutCount: 47,
    status: "pending_approval",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    provider: "MTN",
  },
  {
    id: "pb2",
    batchRef: "PB-2026-0896",
    merchantName: "Kwame Organics Ltd",
    totalAmount: 389_200,
    payoutCount: 18,
    status: "pending_approval",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    provider: "VOD",
  },
  {
    id: "pb3",
    batchRef: "PB-2026-0895",
    merchantName: "Accra Tech Hub",
    totalAmount: 920_000,
    payoutCount: 33,
    status: "approved",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 5400000).toISOString(),
    provider: "AT",
  },
  {
    id: "pb4",
    batchRef: "PB-2026-0894",
    merchantName: "GreenBuild Solutions",
    totalAmount: 2_100_000,
    payoutCount: 82,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    approvedBy: "Finance Lead",
    approvedAt: new Date(Date.now() - 82800000).toISOString(),
    provider: "MTN",
  },
  {
    id: "pb5",
    batchRef: "PB-2026-0891",
    merchantName: "SumaFoods Ghana",
    totalAmount: 540_000,
    payoutCount: 47,
    status: "failed",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    provider: "GIP",
    failedCount: 3,
  },
];

export const mockFeeLedger: FeeLedgerEntry[] = Array.from({ length: 20 }, (_, i) => {
  const txAmt = Math.floor(Math.random() * 10_000 + 200);
  const rate = ([0.012, 0.013, 0.015] as const)[i % 3] ?? 0.015;
  const fee = Math.floor(txAmt * rate);
  return {
    id: `fl-${i}`,
    date: new Date(Date.now() - i * 3_600_000).toISOString(),
    merchantName: mockMerchants[i % mockMerchants.length]!.name,
    channel: (["MTN MoMo", "Vodafone Cash", "AirtelTigo"] as const)[i % 3] ?? "MTN MoMo",
    transactionType: (i % 3 === 0 ? "payout" : "collection") as FeeLedgerEntry["transactionType"],
    transactionAmount: txAmt,
    feeRate: `${(rate * 100).toFixed(1)}%`,
    feeAmount: fee,
    nspShare: Math.floor(fee * 0.6),
    platformShare: Math.floor(fee * 0.4),
    ref: `REF-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  };
});

export const mockFinancialReports: FinancialReport[] = [
  {
    id: "r1",
    name: "Daily Reconciliation",
    description: "Provider-level reconciliation for all channels",
    period: "Sep 01, 2026",
    generatedAt: new Date(Date.now() - 3600000).toISOString(),
    size: "248 KB",
    type: "reconciliation",
  },
  {
    id: "r2",
    name: "Fee Ledger Export",
    description: "All fee entries with NSP / platform split",
    period: "Aug 2026",
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    size: "1.2 MB",
    type: "fee_ledger",
  },
  {
    id: "r3",
    name: "Payout Batch Summary",
    description: "Approved and completed payout batches",
    period: "Aug 2026",
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    size: "540 KB",
    type: "payout",
  },
  {
    id: "r4",
    name: "Volume Report",
    description: "Transaction volume by merchant and channel",
    period: "Q2 2026",
    generatedAt: new Date(Date.now() - 604800000).toISOString(),
    size: "3.1 MB",
    type: "volume",
  },
  {
    id: "r5",
    name: "NSP Balance History",
    description: "Daily NSP balance snapshots across all providers",
    period: "Aug 2026",
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    size: "112 KB",
    type: "nsp_balance",
  },
];
