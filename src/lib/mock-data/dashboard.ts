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
