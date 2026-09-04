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
  bankShare: number;
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
  type: "reconciliation" | "fee_ledger" | "payout" | "volume" | "settlement_balance";
};

export const mockPrefundRequests: PrefundRequest[] = [
  {
    id: "pf1",
    provider: "Universal Merchant Bank",
    providerCode: "UMB",
    amount: 1_000_000,
    status: "pending",
    requestedBy: "Ama Serwaa",
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    notes: "Settlement balance approaching threshold. Prefund requested to maintain adequate float.",
  },
  {
    id: "pf2",
    provider: "Universal Merchant Bank",
    providerCode: "UMB",
    amount: 750_000,
    status: "approved",
    requestedBy: "Kofi Mensah",
    requestedAt: new Date(Date.now() - 7200000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 5400000).toISOString(),
    notes: "Top-up to maintain 20% buffer above threshold.",
  },
  {
    id: "pf3",
    provider: "Universal Merchant Bank",
    providerCode: "UMB",
    amount: 1_500_000,
    status: "completed",
    requestedBy: "Ama Serwaa",
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 165600000).toISOString(),
  },
];

export const mockReconciliationEntries: ReconciliationEntry[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  const hasDisc = i === 2 || i === 5;
  // Use deterministic values based on index
  const exp = 800_000 + (i * 234567) % 2_000_000;
  const act = hasDisc ? exp - (5_000 + (i * 12345) % 50_000) : exp;
  const expP = 400_000 + (i * 123456) % 1_200_000;
  const actP = hasDisc ? expP - (2_000 + (i * 6789) % 30_000) : expP;
  const expF = Math.floor(exp * 0.015);
  const actF = Math.floor(act * 0.015);
  return {
    id: `rec-${i}`,
    date: date.toISOString().split("T")[0] ?? "",
    provider: "UMB",
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
        : "Bank reporting mismatch — escalated to UMB back office"
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
    provider: "UMB",
  },
  {
    id: "pb2",
    batchRef: "PB-2026-0896",
    merchantName: "Kwame Organics Ltd",
    totalAmount: 389_200,
    payoutCount: 18,
    status: "pending_approval",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    provider: "UMB",
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
    provider: "UMB",
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
    provider: "UMB",
  },
  {
    id: "pb5",
    batchRef: "PB-2026-0891",
    merchantName: "SumaFoods Ghana",
    totalAmount: 540_000,
    payoutCount: 47,
    status: "failed",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    provider: "UMB",
    failedCount: 3,
  },
];

export const mockFeeLedger: FeeLedgerEntry[] = Array.from({ length: 20 }, (_, i) => {
  // Use index-based deterministic values instead of Math.random()
  const txAmt = 200 + (i * 487) % 10000; // Deterministic pseudo-random
  const rate = 0.015; // Fixed 1.5% rate
  const fee = Math.floor(txAmt * rate);
  const bankShare = Math.floor(fee * (1.0 / 1.5)); // 1% to bank (66.67% of fee)
  const platformShare = fee - bankShare; // 0.5% to platform (33.33% of fee)
  
  return {
    id: `fl-${i}`,
    date: new Date(Date.now() - i * 3_600_000).toISOString(),
    merchantName: mockMerchants[i % mockMerchants.length]!.name,
    channel: "UMB",
    transactionType: (i % 3 === 0 ? "payout" : "collection") as FeeLedgerEntry["transactionType"],
    transactionAmount: txAmt,
    feeRate: "1.5%",
    feeAmount: fee,
    bankShare: bankShare,
    platformShare: platformShare,
    ref: `REF-${i.toString(36).padStart(8, '0').toUpperCase()}`,
  };
});

export const mockFinancialReports: FinancialReport[] = [
  {
    id: "r1",
    name: "Daily Reconciliation",
    description: "UMB reconciliation for all transactions",
    period: "Sep 01, 2026",
    generatedAt: new Date(Date.now() - 3600000).toISOString(),
    size: "248 KB",
    type: "reconciliation",
  },
  {
    id: "r2",
    name: "Fee Ledger Export",
    description: "All fee entries with bank / platform split",
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
    description: "Transaction volume by merchant",
    period: "Q2 2026",
    generatedAt: new Date(Date.now() - 604800000).toISOString(),
    size: "3.1 MB",
    type: "volume",
  },
  {
    id: "r5",
    name: "Settlement Balance History",
    description: "Daily UMB settlement balance snapshots",
    period: "Aug 2026",
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    size: "112 KB",
    type: "settlement_balance",
  },
];
