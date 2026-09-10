// ── Compliance & KYC Mock Data ──────────────────────────────────────────────

export type DocumentType = 
  | "business_certificate" 
  | "director_id" 
  | "proof_of_address" 
  | "bank_statement" 
  | "tax_clearance"
  | "shareholders_resolution";

export type KycDocument = {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

export type KycApplication = {
  id: string;
  merchantId: string;
  merchantName: string;
  registrationNumber: string;
  submittedAt: string;
  status: "pending" | "info_requested" | "approved" | "rejected";
  applicationType: "merchant" | "sub_merchant";
  industry: string;
  contactEmail: string;
  contactPhone: string;
  documents: KycDocument[];
  assignedTo?: string;
  reviewNotes?: string;
  infoRequestMessage?: string;
  approvedBy?: string;
  approvedAt?: string;
  providerApprovals?: {
    mtn: boolean;
    telecel: boolean;
    airtel: boolean;
    umb: boolean;
  };
};

export type AmlFlag = {
  id: string;
  merchantId: string;
  merchantName: string;
  transactionId?: string;
  flagType: "velocity" | "amount_threshold" | "dormant_activation" | "geographic_anomaly" | "pattern_match";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  flaggedAt: string;
  status: "open" | "investigating" | "escalated" | "closed" | "false_positive";
  assignedTo?: string;
  resolution?: string;
  closedAt?: string;
  metadata: {
    transactionCount?: number;
    totalAmount?: number;
    timeWindow?: string;
    location?: string;
  };
};

export type RiskScore = {
  merchantId: string;
  merchantName: string;
  score: number; // 0-100
  level: "low" | "medium" | "high";
  lastUpdated: string;
  factors: {
    transactionVelocity: number;
    averageTicketSize: number;
    industryRisk: number;
    kycCompleteness: number;
    disputeRate: number;
  };
};

export type RetentionDocument = {
  id: string;
  merchantId: string;
  merchantName: string;
  documentType: DocumentType;
  fileName: string;
  retentionStart: string;
  retentionExpiry: string; // 6 years from start
  fileSize: number; // in bytes
  storageLocation: string;
  daysUntilExpiry: number;
};

// ── Mock Data ───────────────────────────────────────────────────────────────

export const mockKycApplications: KycApplication[] = [
  {
    id: "kyc1",
    merchantId: "m7",
    merchantName: "Tema Port Logistics Ltd",
    registrationNumber: "CS012342025",
    submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "pending",
    applicationType: "merchant",
    industry: "Logistics",
    contactEmail: "ceo@temaport.com",
    contactPhone: "+233 24 555 0123",
    documents: [
      {
        id: "doc1",
        type: "business_certificate",
        fileName: "tema_port_cert_of_incorporation.pdf",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        status: "pending",
      },
      {
        id: "doc2",
        type: "director_id",
        fileName: "director_ghana_card.jpg",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        status: "pending",
      },
      {
        id: "doc3",
        type: "proof_of_address",
        fileName: "utility_bill_march_2026.pdf",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        status: "pending",
      },
    ],
    assignedTo: "Compliance Officer",
  },
  {
    id: "kyc2",
    merchantId: "m8",
    merchantName: "Nana Yaa Fashion House",
    registrationNumber: "CS008892025",
    submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: "info_requested",
    applicationType: "merchant",
    industry: "Retail",
    contactEmail: "info@nanayaa.gh",
    contactPhone: "+233 20 444 9876",
    documents: [
      {
        id: "doc4",
        type: "business_certificate",
        fileName: "nanayaa_business_registration.pdf",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
        status: "approved",
        reviewedBy: "Compliance Officer",
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "doc5",
        type: "director_id",
        fileName: "director_passport.jpg",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
        status: "rejected",
        reviewedBy: "Compliance Officer",
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
        rejectionReason: "Image quality too low. Please upload a clearer scan.",
      },
      {
        id: "doc6",
        type: "proof_of_address",
        fileName: "ecg_bill_feb_2026.pdf",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
        status: "approved",
        reviewedBy: "Compliance Officer",
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    assignedTo: "Compliance Officer",
    infoRequestMessage: "Director ID image quality is insufficient. Please provide a clearer copy of Ghana Card or Passport.",
  },
  {
    id: "kyc3",
    merchantId: "m4",
    merchantName: "Nnipa Health Services",
    registrationNumber: "CS009032023",
    submittedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: "pending",
    applicationType: "merchant",
    industry: "Healthcare",
    contactEmail: "admin@nnipa.health",
    contactPhone: "+233 30 789 5432",
    documents: [
      {
        id: "doc7",
        type: "business_certificate",
        fileName: "nnipa_health_license.pdf",
        uploadedAt: new Date(Date.now() - 259200000).toISOString(),
        status: "pending",
      },
      {
        id: "doc8",
        type: "director_id",
        fileName: "dr_mensah_id.jpg",
        uploadedAt: new Date(Date.now() - 259200000).toISOString(),
        status: "pending",
      },
      {
        id: "doc9",
        type: "proof_of_address",
        fileName: "clinic_lease_agreement.pdf",
        uploadedAt: new Date(Date.now() - 259200000).toISOString(),
        status: "pending",
      },
      {
        id: "doc10",
        type: "tax_clearance",
        fileName: "gra_tax_clearance_2025.pdf",
        uploadedAt: new Date(Date.now() - 259200000).toISOString(),
        status: "pending",
      },
    ],
    assignedTo: "Compliance Officer",
  },
  {
    id: "kyc4",
    merchantId: "m9",
    merchantName: "Kumasi Agro Ventures",
    registrationNumber: "CS015672024",
    submittedAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    status: "approved",
    applicationType: "merchant",
    industry: "Agriculture",
    contactEmail: "ventures@kumasiagro.com",
    contactPhone: "+233 32 123 4567",
    documents: [
      {
        id: "doc11",
        type: "business_certificate",
        fileName: "kumasi_agro_certificate.pdf",
        uploadedAt: new Date(Date.now() - 604800000).toISOString(),
        status: "approved",
        reviewedBy: "Compliance Officer",
        reviewedAt: new Date(Date.now() - 432000000).toISOString(),
      },
      {
        id: "doc12",
        type: "director_id",
        fileName: "kofi_id_card.jpg",
        uploadedAt: new Date(Date.now() - 604800000).toISOString(),
        status: "approved",
        reviewedBy: "Compliance Officer",
        reviewedAt: new Date(Date.now() - 432000000).toISOString(),
      },
      {
        id: "doc13",
        type: "proof_of_address",
        fileName: "warehouse_utility_bill.pdf",
        uploadedAt: new Date(Date.now() - 604800000).toISOString(),
        status: "approved",
        reviewedBy: "Compliance Officer",
        reviewedAt: new Date(Date.now() - 432000000).toISOString(),
      },
    ],
    approvedBy: "Compliance Officer",
    approvedAt: new Date(Date.now() - 432000000).toISOString(),
    providerApprovals: {
      mtn: true,
      telecel: true,
      airtel: true,
      umb: false,
    },
  },
  {
    id: "kyc5",
    merchantId: "sm1",
    merchantName: "Osu Branch — Kwame Organics",
    registrationNumber: "SUB-KWO-001",
    submittedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    status: "pending",
    applicationType: "sub_merchant",
    industry: "Retail",
    contactEmail: "osu@kwameorganics.com",
    contactPhone: "+233 24 321 7890",
    documents: [
      {
        id: "doc14",
        type: "business_certificate",
        fileName: "osu_branch_registration.pdf",
        uploadedAt: new Date(Date.now() - 43200000).toISOString(),
        status: "pending",
      },
      {
        id: "doc15",
        type: "director_id",
        fileName: "branch_manager_id.jpg",
        uploadedAt: new Date(Date.now() - 43200000).toISOString(),
        status: "pending",
      },
    ],
    assignedTo: "Compliance Officer",
    reviewNotes: "Parent merchant (Kwame Organics) already verified. Fast-track review.",
  },
];

export const mockAmlFlags: AmlFlag[] = [
  {
    id: "aml1",
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    transactionId: "txn_940284",
    flagType: "velocity",
    severity: "critical",
    description: "47 transactions totaling GHS 890,000 in 3 hours — 850% above normal velocity",
    flaggedAt: new Date(Date.now() - 86400000).toISOString(),
    status: "investigating",
    assignedTo: "Compliance Officer",
    metadata: {
      transactionCount: 47,
      totalAmount: 890000,
      timeWindow: "3 hours",
    },
  },
  {
    id: "aml2",
    merchantId: "m10",
    merchantName: "Cape Coast Forex Bureau",
    flagType: "amount_threshold",
    severity: "high",
    description: "Single transaction of GHS 250,000 exceeds daily limit of GHS 100,000",
    flaggedAt: new Date(Date.now() - 172800000).toISOString(),
    status: "escalated",
    assignedTo: "Compliance Officer",
    metadata: {
      transactionCount: 1,
      totalAmount: 250000,
    },
  },
  {
    id: "aml3",
    merchantId: "m11",
    merchantName: "Global Remit Services",
    flagType: "dormant_activation",
    severity: "medium",
    description: "Account dormant for 180 days, sudden activity with 8 transactions in 24 hours",
    flaggedAt: new Date(Date.now() - 259200000).toISOString(),
    status: "investigating",
    assignedTo: "Compliance Officer",
    metadata: {
      transactionCount: 8,
      totalAmount: 42000,
      timeWindow: "24 hours",
    },
  },
  {
    id: "aml4",
    merchantId: "m2",
    merchantName: "Accra Tech Hub",
    transactionId: "txn_823401",
    flagType: "geographic_anomaly",
    severity: "low",
    description: "Payout destination in high-risk jurisdiction (flagged by BoG advisory)",
    flaggedAt: new Date(Date.now() - 43200000).toISOString(),
    status: "open",
    assignedTo: "Compliance Officer",
    metadata: {
      transactionCount: 1,
      totalAmount: 15000,
      location: "Country: BF",
    },
  },
  {
    id: "aml5",
    merchantId: "m12",
    merchantName: "QuickCash Money Transfer",
    flagType: "pattern_match",
    severity: "high",
    description: "Multiple structured transactions just below GHS 10,000 reporting threshold — possible structuring",
    flaggedAt: new Date(Date.now() - 345600000).toISOString(),
    status: "closed",
    assignedTo: "Compliance Officer",
    resolution: "Merchant provided legitimate business documentation. Transactions verified as separate customer payments.",
    closedAt: new Date(Date.now() - 172800000).toISOString(),
    metadata: {
      transactionCount: 12,
      totalAmount: 117000,
      timeWindow: "48 hours",
    },
  },
  {
    id: "aml6",
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    flagType: "velocity",
    severity: "medium",
    description: "Payout velocity 240% above 30-day average — possible account compromise",
    flaggedAt: new Date(Date.now() - 21600000).toISOString(),
    status: "investigating",
    assignedTo: "Compliance Officer",
    metadata: {
      transactionCount: 23,
      totalAmount: 340000,
      timeWindow: "6 hours",
    },
  },
];

export const mockRiskScores: RiskScore[] = [
  {
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    score: 87,
    level: "high",
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    factors: {
      transactionVelocity: 95,
      averageTicketSize: 72,
      industryRisk: 45,
      kycCompleteness: 100,
      disputeRate: 8,
    },
  },
  {
    merchantId: "m10",
    merchantName: "Cape Coast Forex Bureau",
    score: 74,
    level: "high",
    lastUpdated: new Date(Date.now() - 172800000).toISOString(),
    factors: {
      transactionVelocity: 68,
      averageTicketSize: 88,
      industryRisk: 85,
      kycCompleteness: 100,
      disputeRate: 12,
    },
  },
  {
    merchantId: "m11",
    merchantName: "Global Remit Services",
    score: 58,
    level: "medium",
    lastUpdated: new Date(Date.now() - 259200000).toISOString(),
    factors: {
      transactionVelocity: 82,
      averageTicketSize: 45,
      industryRisk: 70,
      kycCompleteness: 85,
      disputeRate: 5,
    },
  },
  {
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    score: 22,
    level: "low",
    lastUpdated: new Date(Date.now() - 43200000).toISOString(),
    factors: {
      transactionVelocity: 35,
      averageTicketSize: 18,
      industryRisk: 15,
      kycCompleteness: 100,
      disputeRate: 2,
    },
  },
  {
    merchantId: "m2",
    merchantName: "Accra Tech Hub",
    score: 31,
    level: "low",
    lastUpdated: new Date(Date.now() - 21600000).toISOString(),
    factors: {
      transactionVelocity: 42,
      averageTicketSize: 28,
      industryRisk: 25,
      kycCompleteness: 100,
      disputeRate: 3,
    },
  },
  {
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    score: 45,
    level: "medium",
    lastUpdated: new Date(Date.now() - 21600000).toISOString(),
    factors: {
      transactionVelocity: 78,
      averageTicketSize: 35,
      industryRisk: 30,
      kycCompleteness: 100,
      disputeRate: 4,
    },
  },
];

export const mockRetentionDocuments: RetentionDocument[] = [
  {
    id: "ret1",
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    documentType: "business_certificate",
    fileName: "kwame_organics_business_cert.pdf",
    retentionStart: "2024-03-15",
    retentionExpiry: "2030-03-15",
    fileSize: 2_450_000,
    storageLocation: "s3://namibrapay-kyc/m1/business_certificate.pdf",
    daysUntilExpiry: 1287,
  },
  {
    id: "ret2",
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    documentType: "director_id",
    fileName: "director_ghana_card.jpg",
    retentionStart: "2024-03-15",
    retentionExpiry: "2030-03-15",
    fileSize: 1_820_000,
    storageLocation: "s3://namibrapay-kyc/m1/director_id.jpg",
    daysUntilExpiry: 1287,
  },
  {
    id: "ret3",
    merchantId: "m2",
    merchantName: "Accra Tech Hub",
    documentType: "business_certificate",
    fileName: "accra_tech_hub_incorporation.pdf",
    retentionStart: "2024-07-22",
    retentionExpiry: "2030-07-22",
    fileSize: 3_100_000,
    storageLocation: "s3://namibrapay-kyc/m2/business_certificate.pdf",
    daysUntilExpiry: 1416,
  },
  {
    id: "ret4",
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    documentType: "business_certificate",
    fileName: "sumafoods_registration.pdf",
    retentionStart: "2022-11-05",
    retentionExpiry: "2028-11-05",
    fileSize: 2_890_000,
    storageLocation: "s3://namibrapay-kyc/m3/business_certificate.pdf",
    daysUntilExpiry: 794,
  },
  {
    id: "ret5",
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    documentType: "director_id",
    fileName: "ceo_passport.jpg",
    retentionStart: "2022-11-05",
    retentionExpiry: "2028-11-05",
    fileSize: 1_950_000,
    storageLocation: "s3://namibrapay-kyc/m3/director_id.jpg",
    daysUntilExpiry: 794,
  },
  {
    id: "ret6",
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    documentType: "business_certificate",
    fileName: "greenbuild_cert.pdf",
    retentionStart: "2021-09-01",
    retentionExpiry: "2027-09-01",
    fileSize: 2_340_000,
    storageLocation: "s3://namibrapay-kyc/m5/business_certificate.pdf",
    daysUntilExpiry: 364,
  },
  {
    id: "ret7",
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    documentType: "proof_of_address",
    fileName: "warehouse_utility_statement.pdf",
    retentionStart: "2021-09-01",
    retentionExpiry: "2027-09-01",
    fileSize: 890_000,
    storageLocation: "s3://namibrapay-kyc/m5/proof_of_address.pdf",
    daysUntilExpiry: 364,
  },
  {
    id: "ret8",
    merchantId: "m6",
    merchantName: "Takoradi Logistics",
    documentType: "business_certificate",
    fileName: "takoradi_log_registration.pdf",
    retentionStart: "2024-02-18",
    retentionExpiry: "2030-02-18",
    fileSize: 2_120_000,
    storageLocation: "s3://namibrapay-kyc/m6/business_certificate.pdf",
    daysUntilExpiry: 1261,
  },
];

// ── Helper functions ────────────────────────────────────────────────────────

export const getDocumentTypeLabel = (type: DocumentType): string => {
  const labels: Record<DocumentType, string> = {
    business_certificate: "Business Certificate",
    director_id: "Director ID",
    proof_of_address: "Proof of Address",
    bank_statement: "Bank Statement",
    tax_clearance: "Tax Clearance",
    shareholders_resolution: "Shareholders Resolution",
  };
  return labels[type];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
