export type ProductStatus = "active" | "archived";
export type StockType = "unlimited" | "limited";

export interface ProductVariant {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  status: ProductStatus;
  stockType: StockType;
  stock?: number;
  lowStockAlert?: number;
  minOrder?: number;
  maxOrder?: number;
  unitsSold: number;
  revenue: number;
  isPhysical: boolean;
  imageUrl?: string;
  slug: string;
  redirectUrl?: string;
  successMessage?: string;
  notifyEmail?: string;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface ProductOrder {
  id: string;
  productId: string;
  customer: string;
  email: string;
  quantity: number;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  deliveryStatus?: "pending" | "delivered";
  createdAt: string;
}

export interface DiscountCode {
  id: string;
  productId: string;
  code: string;
  type: "fixed" | "percentage" | "free-delivery";
  value?: number;
  usageCount: number;
  createdAt: string;
}

export interface DeliveryFee {
  id: string;
  location: string;
  fee: number;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "LPG 12.5kg Cylinder",
    description: "Standard 12.5kg LPG cylinder, fully filled and ready for delivery.",
    price: 350,
    currency: "GHS",
    status: "active",
    stockType: "limited",
    stock: 84,
    lowStockAlert: 10,
    minOrder: 1,
    maxOrder: 5,
    unitsSold: 142,
    revenue: 49700,
    isPhysical: true,
    slug: "lpg-12-5kg",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "prod_2",
    name: "LPG 6kg Cylinder",
    description: "Compact 6kg LPG cylinder, ideal for small households.",
    price: 180,
    currency: "GHS",
    status: "active",
    stockType: "limited",
    stock: 210,
    lowStockAlert: 20,
    minOrder: 1,
    maxOrder: 10,
    unitsSold: 289,
    revenue: 52020,
    isPhysical: true,
    slug: "lpg-6kg",
    createdAt: "2026-03-12T11:00:00Z",
  },
  {
    id: "prod_3",
    name: "Gas Regulator",
    description: "High-quality adjustable pressure regulator compatible with all cylinder sizes.",
    price: 45,
    currency: "GHS",
    status: "active",
    stockType: "unlimited",
    unitsSold: 67,
    revenue: 3015,
    isPhysical: true,
    slug: "gas-regulator",
    createdAt: "2026-04-01T08:30:00Z",
  },
  {
    id: "prod_4",
    name: "Safety Hose (1.5m)",
    description: "Reinforced safety hose for LPG connections.",
    price: 30,
    currency: "GHS",
    status: "active",
    stockType: "limited",
    stock: 155,
    unitsSold: 98,
    revenue: 2940,
    isPhysical: true,
    slug: "safety-hose",
    createdAt: "2026-04-05T10:00:00Z",
  },
  {
    id: "prod_5",
    name: "LPG Starter Kit",
    description: "Everything you need: 6kg cylinder + regulator + safety hose.",
    price: 240,
    currency: "GHS",
    status: "archived",
    stockType: "limited",
    stock: 0,
    unitsSold: 34,
    revenue: 8160,
    isPhysical: true,
    slug: "lpg-starter-kit",
    createdAt: "2026-02-20T14:00:00Z",
  },
];

export const MOCK_ORDERS: ProductOrder[] = [
  {
    id: "ord_1",
    productId: "prod_1",
    customer: "Kwame Mensah",
    email: "kwame@email.com",
    quantity: 2,
    amount: 700,
    currency: "GHS",
    status: "completed",
    deliveryStatus: "delivered",
    createdAt: "2026-05-10T14:22:00Z",
  },
  {
    id: "ord_2",
    productId: "prod_1",
    customer: "Abena Asante",
    email: "abena@email.com",
    quantity: 1,
    amount: 350,
    currency: "GHS",
    status: "completed",
    deliveryStatus: "delivered",
    createdAt: "2026-05-09T10:05:00Z",
  },
  {
    id: "ord_3",
    productId: "prod_1",
    customer: "John Doe",
    email: "john@email.com",
    quantity: 1,
    amount: 350,
    currency: "GHS",
    status: "pending",
    deliveryStatus: "pending",
    createdAt: "2026-05-14T16:40:00Z",
  },
  {
    id: "ord_4",
    productId: "prod_2",
    customer: "Mary Ofori",
    email: "mary@email.com",
    quantity: 3,
    amount: 540,
    currency: "GHS",
    status: "completed",
    deliveryStatus: "delivered",
    createdAt: "2026-05-11T09:00:00Z",
  },
];

export const MOCK_DISCOUNT_CODES: DiscountCode[] = [
  {
    id: "dc_1",
    productId: "prod_1",
    code: "SAVE20",
    type: "fixed",
    value: 20,
    usageCount: 14,
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "dc_2",
    productId: "prod_1",
    code: "SUMMER10",
    type: "percentage",
    value: 10,
    usageCount: 6,
    createdAt: "2026-05-01T00:00:00Z",
  },
];

export const MOCK_DELIVERY_FEES: DeliveryFee[] = [
  { id: "df_1", location: "Accra Central", fee: 20 },
  { id: "df_2", location: "East Legon", fee: 35 },
  { id: "df_3", location: "Tema", fee: 50 },
];
