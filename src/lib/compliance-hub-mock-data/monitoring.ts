/**
 * Transaction Monitoring Page Mock Data
 */

export interface TransactionAlert {
  id: string;
  merchantId: string;
  merchantName: string;
  alertType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  amount?: number;
  transactionCount?: number;
  triggeredRule: string;
  detectedAt: string;
  status: "OPEN" | "INVESTIGATING" | "DISMISSED" | "ESCALATED";
  assignedTo?: string;
  vendorSource?: string;
}

export const MOCK_TRANSACTION_ALERTS: TransactionAlert[] = [
  {
    id: "ALERT-2024-001",
    merchantId: "MERCH-789",
    merchantName: "QuickPay Solutions",
    alertType: "THRESHOLD_BREACH",
    severity: "HIGH",
    amount: 250000,
    transactionCount: 45,
    triggeredRule: "Daily volume exceeds 200,000 GHS",
    detectedAt: "2026-06-05T09:30:00Z",
    status: "OPEN",
    vendorSource: "MTN Mobile Money",
  },
  {
    id: "ALERT-2024-002",
    merchantId: "MERCH-445",
    merchantName: "Global Traders Ltd",
    alertType: "VELOCITY_SPIKE",
    severity: "CRITICAL",
    transactionCount: 120,
    triggeredRule: "Transaction velocity 300% above baseline",
    detectedAt: "2026-06-05T08:15:00Z",
    status: "INVESTIGATING",
    assignedTo: "Jane Mensah",
    vendorSource: "Zeepay",
  },
  {
    id: "ALERT-2024-003",
    merchantId: "MERCH-223",
    merchantName: "Tech Innovations Inc",
    alertType: "STRUCTURING_PATTERN",
    severity: "MEDIUM",
    amount: 98500,
    transactionCount: 25,
    triggeredRule: "Multiple just-below-threshold transactions",
    detectedAt: "2026-06-04T16:45:00Z",
    status: "OPEN",
    vendorSource: "Airtel Money",
  },
  {
    id: "ALERT-2024-004",
    merchantId: "MERCH-112",
    merchantName: "ABC Logistics",
    alertType: "INCONSISTENT_ACTIVITY",
    severity: "LOW",
    amount: 45000,
    triggeredRule: "Activity pattern differs from declared business",
    detectedAt: "2026-06-04T14:20:00Z",
    status: "DISMISSED",
    assignedTo: "Peter Owusu",
    vendorSource: "MTN Mobile Money",
  },
  {
    id: "ALERT-2024-005",
    merchantId: "MERCH-667",
    merchantName: "Premium Retail Group",
    alertType: "FLAGGED_COUNTERPARTY",
    severity: "HIGH",
    amount: 75000,
    transactionCount: 8,
    triggeredRule: "Transaction with flagged counterparty",
    detectedAt: "2026-06-04T11:00:00Z",
    status: "ESCALATED",
    assignedTo: "Jane Mensah",
    vendorSource: "Zeepay",
  },
];
