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

export interface AccountOption {
  value: string;
  label: string;
}

export interface DateRangeOption {
  value: string;
  label: string;
  days: number | null; // null = all time
}

export const mockAccounts: AccountOption[] = [
  { value: "all", label: "All accounts" },
  { value: "main", label: "The Good Deeds (Main)" },
  { value: "sub_store", label: "NamibraPay Store" },
];

export const dateRangeOptions: DateRangeOption[] = [
  { value: "this_month", label: "This month", days: null },
  { value: "last_7", label: "Last 7 days", days: 7 },
  { value: "last_30", label: "Last 30 days", days: 30 },
  { value: "last_3m", label: "Last 3 months", days: 90 },
  { value: "last_year", label: "Last year", days: 365 },
  { value: "all_time", label: "All time", days: null },
];

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
    date: "2026-05-12T14:32:00Z",
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
    date: "2026-05-11T11:15:00Z",
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
    date: "2026-05-10T09:45:00Z",
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
    date: "2026-05-08T16:20:00Z",
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
    date: "2026-05-07T08:00:00Z",
  },
  {
    id: "6",
    reference: "NMP_4r56s2t9",
    customer: "Efua Darko",
    email: "efua.darko@example.com",
    amount: 980.0,
    currency: "GHS",
    status: "abandoned",
    channel: "card",
    date: "2026-05-06T13:10:00Z",
  },
  {
    id: "7",
    reference: "NMP_8u01v5w3",
    customer: "Nana Adjei",
    email: "nana.adjei@example.com",
    amount: 4400.0,
    currency: "GHS",
    status: "success",
    channel: "mobile_money",
    date: "2026-05-05T10:55:00Z",
  },
  {
    id: "8",
    reference: "NMP_3b67c4d8",
    customer: "Akua Frimpong",
    email: "akua.frimpong@example.com",
    amount: 620.0,
    currency: "GHS",
    status: "failed",
    channel: "ussd",
    date: "2026-05-03T07:30:00Z",
  },
  {
    id: "9",
    reference: "NMP_6e90f1g4",
    customer: "Kwesi Appiah",
    email: "kwesi.appiah@example.com",
    amount: 12500.0,
    currency: "GHS",
    status: "success",
    channel: "bank_transfer",
    date: "2026-04-28T15:00:00Z",
  },
  {
    id: "10",
    reference: "NMP_0h23i6j7",
    customer: "Maame Serwaa",
    email: "maame.serwaa@example.com",
    amount: 1850.0,
    currency: "GHS",
    status: "pending",
    channel: "card",
    date: "2026-04-20T12:45:00Z",
  },
  {
    id: "11",
    reference: "NMP_5k78l9m2",
    customer: "Baffour Opoku",
    email: "baffour.opoku@example.com",
    amount: 3300.0,
    currency: "GHS",
    status: "success",
    channel: "mobile_money",
    date: "2026-04-15T09:20:00Z",
  },
  {
    id: "12",
    reference: "NMP_7n01o3p6",
    customer: "Adwoa Asare",
    email: "adwoa.asare@example.com",
    amount: 550.0,
    currency: "GHS",
    status: "abandoned",
    channel: "card",
    date: "2026-03-30T17:40:00Z",
  },
];
