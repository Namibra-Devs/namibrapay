/**
 * Merchants Page Mock Data
 * 
 * This file contains mock data for merchant directory and merchant profiles.
 */

import type { EntityStatus, RiskBand } from "@/types/compliance";

export interface Merchant {
  id: string;
  legalName: string;
  tradingName: string;
  status: EntityStatus;
  riskBand: RiskBand;
  industry: string;
  onboardedAt: string;
  lastActivity: string;
  monthlyVolume: number;
  transactionCount: number;
  assignedOfficer: string;
}

export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: "MERCH-001",
    legalName: "Accra Retail Solutions Ltd",
    tradingName: "ShopNow Ghana",
    status: "ACTIVE",
    riskBand: "LOW",
    industry: "Retail",
    onboardedAt: "2024-01-15T10:00:00Z",
    lastActivity: "2024-02-20T14:30:00Z",
    monthlyVolume: 125000,
    transactionCount: 453,
    assignedOfficer: "Jane Mensah",
  },
  {
    id: "MERCH-002",
    legalName: "TechHub Innovations Ghana",
    tradingName: "TechHub GH",
    status: "ACTIVE",
    riskBand: "MEDIUM",
    industry: "Technology",
    onboardedAt: "2024-02-01T09:00:00Z",
    lastActivity: "2024-02-21T16:45:00Z",
    monthlyVolume: 450000,
    transactionCount: 892,
    assignedOfficer: "Kwame Asante",
  },
  {
    id: "MERCH-003",
    legalName: "Global Remittance Services",
    tradingName: "QuickSend",
    status: "UNDER_REVIEW",
    riskBand: "HIGH",
    industry: "Financial Services",
    onboardedAt: "2024-02-10T11:30:00Z",
    lastActivity: "2024-02-19T10:20:00Z",
    monthlyVolume: 850000,
    transactionCount: 234,
    assignedOfficer: "Jane Mensah",
  },
  {
    id: "MERCH-004",
    legalName: "Premium Hospitality Group",
    tradingName: "Premium Hotels",
    status: "ACTIVE",
    riskBand: "LOW",
    industry: "Hospitality",
    onboardedAt: "2023-11-20T08:00:00Z",
    lastActivity: "2024-02-20T18:00:00Z",
    monthlyVolume: 320000,
    transactionCount: 678,
    assignedOfficer: "Kwame Asante",
  },
  {
    id: "MERCH-005",
    legalName: "Pharma Distribution Ltd",
    tradingName: "HealthPlus Pharmacy",
    status: "SUSPENDED",
    riskBand: "HIGH",
    industry: "Healthcare",
    onboardedAt: "2023-12-05T10:30:00Z",
    lastActivity: "2024-02-15T12:00:00Z",
    monthlyVolume: 0,
    transactionCount: 0,
    assignedOfficer: "Jane Mensah",
  },
];

// Mock merchant detail data
export const getMerchantData = (id: string) => ({
  id,
  legalName: "Accra Retail Solutions Ltd",
  tradingName: "ShopNow Ghana",
  status: "ACTIVE" as EntityStatus,
  riskBand: "LOW" as RiskBand,
  riskScore: 25,
  industry: "Retail",
  businessType: "Private Limited Company",
  registrationNumber: "CS-2023-45678",
  dateOfIncorporation: "2023-01-15T00:00:00Z",
  onboardedAt: "2024-01-15T10:00:00Z",
  lastActivity: "2024-02-20T14:30:00Z",
  assignedOfficer: "Jane Mensah",
  contact: {
    email: "info@shopnowgh.com",
    phone: "+233 24 123 4567",
    website: "https://shopnowgh.com",
    registeredAddress: "Plot 45, Liberation Road, Accra, Ghana",
    operatingAddress: "Shop 12, Accra Mall, Tetteh Quarshie, Accra",
  },
  transactionSummary: {
    totalVolume: 453,
    totalValue: 125000,
    averageValue: 276,
    channelBreakdown: {
      "Mobile Money": 280000,
      "Bank Transfer": 95000,
      "Card": 50000,
    },
    period: "Last 30 days",
    flaggedCount: 2,
  },
  documents: [
    {
      id: "DOC-001",
      type: "BUSINESS_REG",
      entityId: id,
      status: "VERIFIED" as const,
      uploadedBy: "System",
      uploadedAt: "2024-01-15T10:00:00Z",
      expiryDate: "2025-01-15T00:00:00Z",
      verifiedBy: "Jane Mensah",
      verifiedAt: "2024-01-15T11:30:00Z",
      fileUrl: "#",
      fileName: "business-registration.pdf",
      fileSize: 245000,
    },
    {
      id: "DOC-002",
      type: "TAX_CERT",
      entityId: id,
      status: "VERIFIED" as const,
      uploadedBy: "System",
      uploadedAt: "2024-01-15T10:05:00Z",
      expiryDate: "2024-12-31T00:00:00Z",
      verifiedBy: "Jane Mensah",
      verifiedAt: "2024-01-15T11:35:00Z",
      fileUrl: "#",
      fileName: "tax-certificate.pdf",
      fileSize: 189000,
    },
    {
      id: "DOC-003",
      type: "BANK_STATEMENT",
      entityId: id,
      status: "VERIFIED" as const,
      uploadedBy: "System",
      uploadedAt: "2024-01-15T10:10:00Z",
      verifiedBy: "Jane Mensah",
      verifiedAt: "2024-01-15T11:40:00Z",
      fileUrl: "#",
      fileName: "bank-statement-december.pdf",
      fileSize: 512000,
    },
  ],
  screeningResults: [
    {
      id: "SCR-001",
      subjectId: id,
      subjectName: "Accra Retail Solutions Ltd",
      listType: "SANCTIONS" as const,
      matchScore: 0,
      matchedAttributes: [],
      screenedAt: "2024-01-15T10:30:00Z",
      disposition: "FALSE_POSITIVE" as const,
      dispositionBy: "Jane Mensah",
      dispositionAt: "2024-01-15T11:00:00Z",
    },
    {
      id: "SCR-002",
      subjectId: id,
      subjectName: "Accra Retail Solutions Ltd",
      listType: "PEP" as const,
      matchScore: 0,
      matchedAttributes: [],
      screenedAt: "2024-01-15T10:30:00Z",
      disposition: "FALSE_POSITIVE" as const,
      dispositionBy: "Jane Mensah",
      dispositionAt: "2024-01-15T11:00:00Z",
    },
  ],
  beneficialOwners: [
    {
      id: "BO-001",
      name: "Kofi Mensah",
      dateOfBirth: "1985-03-20",
      nationality: "Ghanaian",
      ownershipPercent: 60,
      role: "DIRECTOR" as const,
      screeningStatus: "CLEAR" as const,
    },
    {
      id: "BO-002",
      name: "Ama Asante",
      dateOfBirth: "1990-07-15",
      nationality: "Ghanaian",
      ownershipPercent: 40,
      role: "SHAREHOLDER" as const,
      screeningStatus: "CLEAR" as const,
    },
  ],
  cases: [],
});
