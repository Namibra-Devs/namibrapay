export type TransactionStatus = "success" | "pending" | "failed" | "abandoned";
export type TransactionChannel = "card" | "mobile_money" | "bank_transfer" | "ussd";

export interface Transaction {
  id: string;
  reference: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  channel: TransactionChannel;
  date: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    reference: "NMP_7y83j4k2",
    customer: "Kwame Asante",
    email: "kwame.asante@example.com",
    amount: 1500.0,
    currency: "GHS",
    status: "success",
    channel: "card",
    date: "2026-05-05T14:32:00Z",
  },
  {
    id: "2",
    reference: "NMP_9x12m7n5",
    customer: "Ama Owusu",
    email: "ama.owusu@example.com",
    amount: 3200.0,
    currency: "GHS",
    status: "success",
    channel: "mobile_money",
    date: "2026-05-05T11:15:00Z",
  },
  {
    id: "3",
    reference: "NMP_2p45q8r1",
    customer: "Yaw Mensah",
    email: "yaw.mensah@example.com",
    amount: 750.5,
    currency: "GHS",
    status: "pending",
    channel: "mobile_money",
    date: "2026-05-04T09:45:00Z",
  },
  {
    id: "4",
    reference: "NMP_5c78d3e6",
    customer: "Abena Boateng",
    email: "abena.boateng@example.com",
    amount: 2100.0,
    currency: "GHS",
    status: "failed",
    channel: "card",
    date: "2026-05-03T16:20:00Z",
  },
  {
    id: "5",
    reference: "NMP_1f34g9h0",
    customer: "Kofi Acheampong",
    email: "kofi.acheampong@example.com",
    amount: 5000.0,
    currency: "GHS",
    status: "success",
    channel: "bank_transfer",
    date: "2026-05-03T08:00:00Z",
  },
];
