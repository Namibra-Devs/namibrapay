export interface Customer {
  id: string;
  code: string;
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
    code: "CUS_0002345554",
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
    code: "CUS_0009876543",
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
    code: "CUS_0004567890",
    name: "Kofi Acheampong",
    email: "kofi.acheampong@example.com",
    phone: "+233 27 456 7890",
    totalSpent: 5000.0,
    currency: "GHS",
    transactions: 1,
    createdAt: "2026-05-01T14:00:00Z",
    status: "active",
  },
  {
    id: "4",
    code: "CUS_0007654321",
    name: "Abena Boateng",
    email: "abena.boateng@example.com",
    phone: "+233 20 234 5678",
    totalSpent: 2100.0,
    currency: "GHS",
    transactions: 1,
    createdAt: "2026-05-08T09:00:00Z",
    status: "inactive",
  },
  {
    id: "5",
    code: "CUS_0001112233",
    name: "Efua Darko",
    email: "efua.darko@example.com",
    phone: "+233 55 112 2334",
    totalSpent: 980.0,
    currency: "GHS",
    transactions: 1,
    createdAt: "2026-05-06T11:30:00Z",
    status: "active",
  },
  {
    id: "6",
    code: "CUS_0003344556",
    name: "Nana Adjei",
    email: "nana.adjei@example.com",
    phone: "+233 26 334 4556",
    totalSpent: 4400.0,
    currency: "GHS",
    transactions: 1,
    createdAt: "2026-05-05T08:15:00Z",
    status: "active",
  },
];
