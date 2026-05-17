export type OrderStatus = "pending" | "delivered" | "cancelled" | "refunded";

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  deliveryAddress?: string;
  createdAt: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    reference: "NP-20260510-001",
    customerName: "Kwame Mensah",
    customerEmail: "kwame@email.com",
    productId: "prod_1",
    productName: "LPG 12.5kg Cylinder",
    quantity: 2,
    amount: 700,
    currency: "GHS",
    status: "delivered",
    deliveryAddress: "12 Accra Central, Greater Accra",
    createdAt: "2026-05-10T14:22:00Z",
  },
  {
    id: "ord_002",
    reference: "NP-20260509-002",
    customerName: "Abena Asante",
    customerEmail: "abena@email.com",
    productId: "prod_2",
    productName: "LPG 6kg Cylinder",
    quantity: 3,
    amount: 540,
    currency: "GHS",
    status: "delivered",
    deliveryAddress: "45 East Legon, Accra",
    createdAt: "2026-05-09T10:05:00Z",
  },
  {
    id: "ord_003",
    reference: "NP-20260514-003",
    customerName: "John Doe",
    customerEmail: "john@email.com",
    productId: "prod_1",
    productName: "LPG 12.5kg Cylinder",
    quantity: 1,
    amount: 350,
    currency: "GHS",
    status: "pending",
    deliveryAddress: "8 Tema Community 5, Tema",
    createdAt: "2026-05-14T16:40:00Z",
  },
  {
    id: "ord_004",
    reference: "NP-20260511-004",
    customerName: "Mary Ofori",
    customerEmail: "mary@email.com",
    productId: "prod_3",
    productName: "Gas Regulator",
    quantity: 1,
    amount: 45,
    currency: "GHS",
    status: "delivered",
    createdAt: "2026-05-11T09:00:00Z",
  },
  {
    id: "ord_005",
    reference: "NP-20260508-005",
    customerName: "Kofi Boateng",
    customerEmail: "kofi@email.com",
    productId: "prod_4",
    productName: "Safety Hose (1.5m)",
    quantity: 2,
    amount: 60,
    currency: "GHS",
    status: "cancelled",
    createdAt: "2026-05-08T11:30:00Z",
  },
  {
    id: "ord_006",
    reference: "NP-20260507-006",
    customerName: "Ama Owusu",
    customerEmail: "ama@email.com",
    productId: "prod_2",
    productName: "LPG 6kg Cylinder",
    quantity: 2,
    amount: 360,
    currency: "GHS",
    status: "refunded",
    deliveryAddress: "22 Osu, Accra",
    createdAt: "2026-05-07T13:15:00Z",
  },
  {
    id: "ord_007",
    reference: "NP-20260515-007",
    customerName: "Yaw Darko",
    customerEmail: "yaw@email.com",
    productId: "prod_1",
    productName: "LPG 12.5kg Cylinder",
    quantity: 1,
    amount: 350,
    currency: "GHS",
    status: "pending",
    deliveryAddress: "5 Spintex Road, Accra",
    createdAt: "2026-05-15T08:00:00Z",
  },
  {
    id: "ord_008",
    reference: "NP-20260506-008",
    customerName: "Efua Mensah",
    customerEmail: "efua@email.com",
    productId: "prod_3",
    productName: "Gas Regulator",
    quantity: 2,
    amount: 90,
    currency: "GHS",
    status: "delivered",
    createdAt: "2026-05-06T15:45:00Z",
  },
];

export const ORDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];
