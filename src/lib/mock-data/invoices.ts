export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";
export type InvoiceType = "professional" | "simple";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  note?: string;
  lineItems?: InvoiceLineItem[];
  dueDate?: string;
  createdAt: string;
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv_001",
    reference: "INV-20260510-001",
    customerName: "Kwame Mensah",
    customerEmail: "kwame@email.com",
    type: "professional",
    status: "paid",
    amount: 1200,
    currency: "GHS",
    lineItems: [
      { description: "LPG 12.5kg Cylinder x2", quantity: 2, unitPrice: 350 },
      { description: "Gas Regulator", quantity: 1, unitPrice: 45 },
      { description: "Installation fee", quantity: 1, unitPrice: 455 },
    ],
    dueDate: "2026-05-17",
    createdAt: "2026-05-10T14:22:00Z",
  },
  {
    id: "inv_002",
    reference: "INV-20260509-002",
    customerName: "Abena Asante",
    customerEmail: "abena@email.com",
    type: "simple",
    status: "pending",
    amount: 540,
    currency: "GHS",
    note: "LPG refill for May — 3 cylinders",
    dueDate: "2026-05-19",
    createdAt: "2026-05-09T10:05:00Z",
  },
  {
    id: "inv_003",
    reference: "INV-20260514-003",
    customerName: "John Doe",
    customerEmail: "john@email.com",
    type: "simple",
    status: "overdue",
    amount: 350,
    currency: "GHS",
    note: "Single LPG 12.5kg cylinder",
    dueDate: "2026-05-14",
    createdAt: "2026-05-07T16:40:00Z",
  },
  {
    id: "inv_004",
    reference: "INV-20260511-004",
    customerName: "Mary Ofori",
    customerEmail: "mary@email.com",
    type: "professional",
    status: "draft",
    amount: 890,
    currency: "GHS",
    lineItems: [
      { description: "LPG 6kg Cylinder x3", quantity: 3, unitPrice: 180 },
      { description: "Safety Hose (1.5m) x2", quantity: 2, unitPrice: 30 },
      { description: "Delivery fee", quantity: 1, unitPrice: 50 },
    ],
    dueDate: "2026-05-25",
    createdAt: "2026-05-11T09:00:00Z",
  },
  {
    id: "inv_005",
    reference: "INV-20260508-005",
    customerName: "Kofi Boateng",
    customerEmail: "kofi@email.com",
    type: "simple",
    status: "paid",
    amount: 60,
    currency: "GHS",
    note: "Safety hose replacement",
    dueDate: "2026-05-10",
    createdAt: "2026-05-08T11:30:00Z",
  },
  {
    id: "inv_006",
    reference: "INV-20260507-006",
    customerName: "Ama Owusu",
    customerEmail: "ama@email.com",
    type: "professional",
    status: "pending",
    amount: 2400,
    currency: "GHS",
    lineItems: [
      { description: "LPG 12.5kg Cylinder x4", quantity: 4, unitPrice: 350 },
      { description: "Gas Regulator x2", quantity: 2, unitPrice: 45 },
      { description: "Commercial delivery", quantity: 1, unitPrice: 310 },
    ],
    dueDate: "2026-05-21",
    createdAt: "2026-05-07T13:15:00Z",
  },
];

export const INVOICE_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export const INVOICE_TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "professional", label: "Professional" },
  { value: "simple", label: "Simple" },
];

export const MOCK_CUSTOMERS = [
  { email: "kwame@email.com", name: "Kwame Mensah" },
  { email: "abena@email.com", name: "Abena Asante" },
  { email: "john@email.com", name: "John Doe" },
  { email: "mary@email.com", name: "Mary Ofori" },
  { email: "kofi@email.com", name: "Kofi Boateng" },
  { email: "ama@email.com", name: "Ama Owusu" },
  { email: "yaw@email.com", name: "Yaw Darko" },
  { email: "efua@email.com", name: "Efua Mensah" },
];
