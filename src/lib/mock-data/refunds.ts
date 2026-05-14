export type RefundStatus = "pending" | "processing" | "processed" | "failed";

export interface Refund {
  id: string;
  refundId: string;
  bankReference: string;
  transactionReference: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason: string;
  createdAt: string;
}

export const mockRefunds: Refund[] = [
  {
    id: "1",
    refundId: "RFD_1a2b3c4d5e",
    bankReference: "BNK_7y83j4k2",
    transactionReference: "NMP_7y83j4k2",
    customer: "Kwame Asante",
    email: "kwame.asante@example.com",
    amount: 1500.0,
    currency: "GHS",
    status: "processed",
    reason: "Duplicate payment",
    createdAt: "2026-05-13T10:00:00Z",
  },
  {
    id: "2",
    refundId: "RFD_2f3g4h5i6j",
    bankReference: "BNK_9x12m7n5",
    transactionReference: "NMP_9x12m7n5",
    customer: "Ama Owusu",
    email: "ama.owusu@example.com",
    amount: 3200.0,
    currency: "GHS",
    status: "pending",
    reason: "Customer request",
    createdAt: "2026-05-12T14:30:00Z",
  },
  {
    id: "3",
    refundId: "RFD_3k4l5m6n7o",
    bankReference: "BNK_2p45q8r1",
    transactionReference: "NMP_2p45q8r1",
    customer: "Yaw Mensah",
    email: "yaw.mensah@example.com",
    amount: 750.5,
    currency: "GHS",
    status: "processing",
    reason: "Order not received",
    createdAt: "2026-05-11T09:15:00Z",
  },
  {
    id: "4",
    refundId: "RFD_4p5q6r7s8t",
    bankReference: "BNK_5c78d3e6",
    transactionReference: "NMP_5c78d3e6",
    customer: "Abena Boateng",
    email: "abena.boateng@example.com",
    amount: 2100.0,
    currency: "GHS",
    status: "failed",
    reason: "Fraudulent transaction",
    createdAt: "2026-05-10T16:45:00Z",
  },
  {
    id: "5",
    refundId: "RFD_5u6v7w8x9y",
    bankReference: "BNK_4r56s2t9",
    transactionReference: "NMP_4r56s2t9",
    customer: "Efua Darko",
    email: "efua.darko@example.com",
    amount: 980.0,
    currency: "GHS",
    status: "processed",
    reason: "Service not delivered",
    createdAt: "2026-05-08T11:00:00Z",
  },
  {
    id: "6",
    refundId: "RFD_6z7a8b9c0d",
    bankReference: "BNK_8u01v5w3",
    transactionReference: "NMP_8u01v5w3",
    customer: "Nana Adjei",
    email: "nana.adjei@example.com",
    amount: 4400.0,
    currency: "GHS",
    status: "pending",
    reason: "Incorrect amount charged",
    createdAt: "2026-04-30T08:20:00Z",
  },
  {
    id: "7",
    refundId: "RFD_7e8f9g0h1i",
    bankReference: "BNK_6e90f1g4",
    transactionReference: "NMP_6e90f1g4",
    customer: "Kwesi Appiah",
    email: "kwesi.appiah@example.com",
    amount: 12500.0,
    currency: "GHS",
    status: "processing",
    reason: "Bank error",
    createdAt: "2026-04-28T13:00:00Z",
  },
];
