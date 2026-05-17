export type PageType = "one-time" | "subscription" | "product";
export type PageStatus = "active" | "inactive";

export interface PaymentPage {
  id: string;
  name: string;
  description?: string;
  type: PageType;
  status: PageStatus;
  slug: string;
  amount?: number;
  currency: string;
  visits: number;
  revenue: number;
  createdAt: string;
}

export const MOCK_PAYMENT_PAGES: PaymentPage[] = [
  {
    id: "pg_1",
    name: "LPG Cylinder Refill",
    description: "Pay for your LPG cylinder refill online",
    type: "one-time",
    status: "active",
    slug: "lpg-cylinder",
    amount: 120,
    currency: "GHS",
    visits: 48,
    revenue: 4320,
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "pg_2",
    name: "Monthly Delivery Plan",
    description: "Subscribe to monthly LPG home delivery",
    type: "subscription",
    status: "active",
    slug: "monthly-delivery",
    amount: 250,
    currency: "GHS",
    visits: 23,
    revenue: 2500,
    createdAt: "2026-04-15T08:00:00Z",
  },
  {
    id: "pg_3",
    name: "LPG Accessories Store",
    description: "Browse and buy LPG accessories",
    type: "product",
    status: "inactive",
    slug: "lpg-store",
    currency: "GHS",
    visits: 12,
    revenue: 0,
    createdAt: "2026-03-20T14:00:00Z",
  },
];
