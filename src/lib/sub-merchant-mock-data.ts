export type SmTxStatus = "success" | "failed" | "pending" | "processing";
export type SmTxType = "collection" | "payout";

export type SmTransaction = {
  id: string;
  reference: string;
  date: string;
  type: SmTxType;
  grossAmount: number;
  fee: number;
  net: number;
  status: SmTxStatus;
  phone: string;
  customerName: string;
  description: string;
};

export type SmTeamMember = {
  id: string;
  name: string;
  email: string;
  role: "sub_admin" | "sub_viewer";
  lastLogin: string | null;
  inviteStatus: "accepted" | "pending";
};

function d(daysAgo: number, hour = 10, min = 1): string {
  const dt = new Date(2026, 8, 1, hour, min);
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString();
}

function ref(i: number): string {
  return `NP-SM1${String(i).padStart(4, "0")}`;
}

const PHONES = [
  "+233 20 111 2222", "+233 24 333 4444", "+233 55 666 7777",
  "+233 26 888 9999", "+233 57 000 1111", "+233 23 222 3333",
];
const NAMES = ["Esi Boateng", "Kwaku Mensah", "Akua Darko", "Kofi Asante", "Abena Owusu", "Yaw Amoah"];

const STATUSES: SmTxStatus[] = ["success", "success", "success", "failed", "pending", "processing"];

export const smTransactions: SmTransaction[] = Array.from({ length: 50 }, (_, i) => {
  // Deterministic amount generation using index (no Math.random)
  const gross = Math.round((500 + ((i * 347) % 3000)) * 100) / 100;
  const fee = Math.round(gross * 0.015 * 100) / 100;
  const net = Math.round((gross - fee) * 100) / 100;
  const type: SmTxType = i % 7 === 0 ? "payout" : "collection";
  return {
    id: `sm-tx-${i}`,
    reference: ref(i),
    date: d(Math.floor(i / 6), 8 + (i % 8), (i * 7) % 60),
    type,
    grossAmount: gross,
    fee,
    net,
    status: STATUSES[i % STATUSES.length],
    phone: PHONES[i % PHONES.length],
    customerName: NAMES[i % NAMES.length],
    description: type === "payout" ? "Payout disbursement" : "Mobile money collection",
  };
});

// 7-day chart data (deterministic - no Math.random)
const today = new Date(2026, 8, 1);
export const smChartData = Array.from({ length: 7 }, (_, i) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - (6 - i));
  // Deterministic values using index (simulating wave pattern)
  const collections = Math.round(20000 + ((i * 8347) % 60000));
  return {
    date: dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    collections,
  };
});

// Settlements payout history
export const smPayouts = [
  { id: "sp1", date: d(1, 9, 0), amount: 48_200, fee: 723, net: 47_477, status: "completed" },
  { id: "sp2", date: d(2, 9, 0), amount: 62_500, fee: 937.5, net: 61_562.5, status: "completed" },
  { id: "sp3", date: d(4, 9, 0), amount: 31_800, fee: 477, net: 31_323, status: "completed" },
  { id: "sp4", date: d(7, 9, 0), amount: 55_100, fee: 826.5, net: 54_273.5, status: "completed" },
];

// Team
export const smTeamMembers: SmTeamMember[] = [
  { id: "smt1", name: "Kofi Twumasi", email: "kofi@koficraft.com", role: "sub_admin", lastLogin: d(0, 9, 1), inviteStatus: "accepted" },
  { id: "smt2", name: "Adwoa Sarpong", email: "adwoa@koficraft.com", role: "sub_viewer", lastLogin: d(1, 14, 22), inviteStatus: "accepted" },
  { id: "smt3", name: "Ernest Mensah", email: "ernest@koficraft.com", role: "sub_viewer", lastLogin: null, inviteStatus: "pending" },
];
