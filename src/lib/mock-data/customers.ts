export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  currency: string;
  transactions: number;
  createdAt: string;
  status: "active" | "inactive";
}

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Kwame Asante",
    email: "kwame.asante@example.com",
    phone: "+233 24 123 4567",
    totalSpent: 4700.0,
    currency: "GHS",
    transactions: 3,
    createdAt: "2026-04-12T10:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Ama Owusu",
    email: "ama.owusu@example.com",
    phone: "+233 50 987 6543",
    totalSpent: 3200.0,
    currency: "GHS",
    transactions: 1,
    createdAt: "2026-04-20T08:30:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Kofi Acheampong",
    email: "kofi.acheampong@example.com",
    phone: "+233 27 456 7890",
    totalSpent: 5000.0,
    currency: "GHS",
    transactions: 1,
    createdAt: "2026-05-01T14:00:00Z",
    status: "active",
  },
];
