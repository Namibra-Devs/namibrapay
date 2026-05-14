export type PayoutStatus = "pending" | "processing" | "paid" | "failed";

export interface Payout {
  id: string;
  reference: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  createdAt: string;
  paidAt?: string;
}

export const mockPayouts: Payout[] = [
  {
    id: "1",
    reference: "PYT_a1b2c3d4e5",
    bankName: "GCB Bank",
    accountNumber: "****4521",
    accountName: "The Good Deeds Ltd",
    amount: 8500.0,
    currency: "GHS",
    status: "paid",
    createdAt: "2026-05-10T08:00:00Z",
    paidAt: "2026-05-11T10:30:00Z",
  },
  {
    id: "2",
    reference: "PYT_f6g7h8i9j0",
    bankName: "Ecobank Ghana",
    accountNumber: "****8832",
    accountName: "The Good Deeds Ltd",
    amount: 12300.0,
    currency: "GHS",
    status: "paid",
    createdAt: "2026-05-04T09:00:00Z",
    paidAt: "2026-05-05T11:00:00Z",
  },
  {
    id: "3",
    reference: "PYT_k1l2m3n4o5",
    bankName: "Absa Bank Ghana",
    accountNumber: "****2267",
    accountName: "The Good Deeds Ltd",
    amount: 5750.5,
    currency: "GHS",
    status: "processing",
    createdAt: "2026-05-13T07:30:00Z",
  },
  {
    id: "4",
    reference: "PYT_p6q7r8s9t0",
    bankName: "GCB Bank",
    accountNumber: "****4521",
    accountName: "The Good Deeds Ltd",
    amount: 3200.0,
    currency: "GHS",
    status: "pending",
    createdAt: "2026-05-14T06:00:00Z",
  },
  {
    id: "5",
    reference: "PYT_u1v2w3x4y5",
    bankName: "Stanbic Bank",
    accountNumber: "****9901",
    accountName: "The Good Deeds Ltd",
    amount: 980.0,
    currency: "GHS",
    status: "failed",
    createdAt: "2026-04-28T14:00:00Z",
  },
  {
    id: "6",
    reference: "PYT_z6a7b8c9d0",
    bankName: "Ecobank Ghana",
    accountNumber: "****8832",
    accountName: "The Good Deeds Ltd",
    amount: 6400.0,
    currency: "GHS",
    status: "paid",
    createdAt: "2026-04-20T10:00:00Z",
    paidAt: "2026-04-21T12:00:00Z",
  },
];
