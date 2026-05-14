export const mockRevenueData = [
  { date: "Apr 15", revenue: 0 },
  { date: "Apr 16", revenue: 0 },
  { date: "Apr 17", revenue: 1200 },
  { date: "Apr 18", revenue: 850 },
  { date: "Apr 19", revenue: 2100 },
  { date: "Apr 20", revenue: 0 },
  { date: "Apr 21", revenue: 0 },
  { date: "Apr 22", revenue: 3400 },
  { date: "Apr 23", revenue: 1750 },
  { date: "Apr 24", revenue: 2900 },
  { date: "Apr 25", revenue: 4100 },
  { date: "Apr 26", revenue: 0 },
  { date: "Apr 27", revenue: 0 },
  { date: "Apr 28", revenue: 2200 },
  { date: "Apr 29", revenue: 1650 },
  { date: "Apr 30", revenue: 3800 },
  { date: "May 01", revenue: 5200 },
  { date: "May 02", revenue: 4700 },
  { date: "May 03", revenue: 0 },
  { date: "May 04", revenue: 0 },
  { date: "May 05", revenue: 6100 },
  { date: "May 06", revenue: 3900 },
  { date: "May 07", revenue: 4400 },
  { date: "May 08", revenue: 7200 },
  { date: "May 09", revenue: 5500 },
  { date: "May 10", revenue: 0 },
  { date: "May 11", revenue: 0 },
  { date: "May 12", revenue: 8100 },
  { date: "May 13", revenue: 6300 },
  { date: "May 14", revenue: 12550 },
];

export const mockSuccessRateData = {
  rate: 82,
  successCount: 410,
  failedCount: 90,
};

export const mockPaymentIssuesData = [
  { reason: "Insufficient funds", count: 38, fill: "#f87171" },
  { reason: "Card declined", count: 22, fill: "#fb923c" },
  { reason: "Expired card", count: 14, fill: "#facc15" },
  { reason: "Network timeout", count: 11, fill: "#a78bfa" },
  { reason: "Other", count: 5, fill: "#94a3b8" },
];

export const mockBalance = {
  amount: 4820.5,
  currency: "GHS",
  available: 4820.5,
};

export const mockUser = {
  name: "Tyler Bright",
  firstName: "Tyler",
  email: "bright@namibra.io",
  initials: "TB",
  role: "Super Admin",
  business: "The Good Deeds",
  businessId: "1825719",
};

export type ColorKey = "teal" | "blue" | "violet" | "amber";
export type TrendKey = "up" | "down" | "neutral";

export interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: TrendKey;
  subtext: string;
  colorKey: ColorKey;
}

export const mockDashboardStats: StatItem[] = [
  {
    label: "Total Volume",
    value: "GHS 12,550.50",
    change: "+12.5%",
    trend: "up",
    subtext: "vs last month",
    colorKey: "teal",
  },
  {
    label: "Transactions",
    value: "5",
    change: "+2",
    trend: "up",
    subtext: "this month",
    colorKey: "blue",
  },
  {
    label: "Customers",
    value: "3",
    change: "+1 new",
    trend: "up",
    subtext: "this month",
    colorKey: "violet",
  },
  {
    label: "Pending Payouts",
    value: "GHS 750.50",
    change: "1 payout",
    trend: "neutral",
    subtext: "awaiting settlement",
    colorKey: "amber",
  },
];
