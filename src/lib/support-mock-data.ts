// ── Support Management Mock Data ────────────────────────────────────────────

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting_merchant" | "resolved" | "closed";
export type TicketCategory = "transaction_failed" | "refund_request" | "account_access" | "api_issue" | "settlement_query" | "other";

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  merchantId: string;
  merchantName: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  requesterName: string;
  requesterEmail: string;
  description: string;
  transactionRef?: string;
  lastResponse?: string;
  responseCount: number;
  slaDeadline: string;
  slaBreached: boolean;
};

export type TicketMessage = {
  id: string;
  ticketId: string;
  author: string;
  authorType: "support" | "merchant";
  message: string;
  timestamp: string;
  attachments?: string[];
};

export type Dispute = {
  id: string;
  disputeNumber: string;
  merchantId: string;
  merchantName: string;
  transactionId: string;
  transactionRef: string;
  amount: number;
  reason: string;
  status: "open" | "investigating" | "resolved" | "declined";
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  customerName?: string;
  customerPhone?: string;
  evidence?: string[];
  resolution?: string;
  refundIssued: boolean;
  escalatedToProvider: boolean;
};

export type RefundRequest = {
  id: string;
  refundNumber: string;
  merchantId: string;
  merchantName: string;
  transactionId: string;
  transactionRef: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "processing" | "completed" | "rejected";
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
  rejectionReason?: string;
  notes?: string;
};

export type SlaMetric = {
  providerId: string;
  providerName: string;
  openIssues: {
    critical: number;
    major: number;
    minor: number;
  };
  avgResponseTime: number; // hours
  avgResolutionTime: number; // hours
  slaTarget: {
    responseTime: number; // hours
    resolutionTime: number; // hours
  };
  breachedCount: number;
  complianceRate: number; // percentage
  lastIncident?: string;
};

export type SecurityIncident = {
  id: string;
  incidentNumber: string;
  type: "unauthorized_access" | "data_breach" | "fraud_attempt" | "api_abuse" | "system_compromise" | "other";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedMerchants?: string[];
  affectedProviders?: string[];
  detectedAt: string;
  reportedAt?: string;
  reportedToProvider: boolean;
  status: "detected" | "investigating" | "contained" | "resolved";
  assignedTo: string;
  impactAssessment: string;
  mitigationSteps?: string[];
  resolutionNotes?: string;
};

// ── Mock Data ───────────────────────────────────────────────────────────────

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "tkt1",
    ticketNumber: "SUP-2026-001234",
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    subject: "MTN MoMo transactions failing with timeout error",
    category: "transaction_failed",
    priority: "high",
    status: "in_progress",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    assignedTo: "Support Lead",
    requesterName: "Kwame Asante",
    requesterEmail: "ops@kwameorganics.com",
    description: "Since 2pm today, all MTN MoMo collection requests are timing out after 30 seconds. Telecel and AirtelTigo are working fine. Affecting approximately 20 transactions so far. Customers are calling to complain.",
    transactionRef: "txn_940284",
    lastResponse: "Escalated to MTN back-office team. Response expected within 2 hours per SLA.",
    responseCount: 3,
    slaDeadline: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    slaBreached: false,
  },
  {
    id: "tkt2",
    ticketNumber: "SUP-2026-001231",
    merchantId: "m2",
    merchantName: "Accra Tech Hub",
    subject: "Unable to generate new API key",
    category: "api_issue",
    priority: "medium",
    status: "waiting_merchant",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    assignedTo: "Support Lead",
    requesterName: "Abena Mensah",
    requesterEmail: "finance@accratechhub.com",
    description: "We're trying to rotate our API keys but the 'Generate New Key' button is not responding. We've tried on Chrome and Firefox. No error message appears.",
    lastResponse: "Requested screenshots and browser console logs. Waiting for merchant response.",
    responseCount: 2,
    slaDeadline: new Date(Date.now() - 7200000).toISOString(),
    slaBreached: true,
  },
  {
    id: "tkt3",
    ticketNumber: "SUP-2026-001229",
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    subject: "Refund request for duplicate charge",
    category: "refund_request",
    priority: "urgent",
    status: "open",
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    assignedTo: "Support Lead",
    requesterName: "CEO",
    requesterEmail: "ceo@sumafoods.gh",
    description: "Customer was charged twice for the same order (GHS 450 each). Order #SF2401. Transaction references: txn_920451 and txn_920452. Both went through successfully within 3 seconds of each other. Customer is threatening legal action.",
    transactionRef: "txn_920451",
    responseCount: 0,
    slaDeadline: new Date(Date.now() + 3600000).toISOString(),
    slaBreached: false,
  },
  {
    id: "tkt4",
    ticketNumber: "SUP-2026-001228",
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    subject: "Settlement delay — funds not received",
    category: "settlement_query",
    priority: "high",
    status: "in_progress",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    assignedTo: "Support Lead",
    requesterName: "Finance Manager",
    requesterEmail: "payments@greenbuild.gh",
    description: "We were expecting settlement of GHS 125,000 on Monday but it has not arrived in our bank account. Dashboard shows status as 'Completed' since Sunday evening. Our bank confirms no incoming transfer.",
    lastResponse: "Checked with Finance team. Settlement was processed. Requested merchant's bank statement for verification.",
    responseCount: 4,
    slaDeadline: new Date(Date.now() - 43200000).toISOString(),
    slaBreached: true,
  },
  {
    id: "tkt5",
    ticketNumber: "SUP-2026-001220",
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    subject: "How to set up webhook notifications?",
    category: "other",
    priority: "low",
    status: "resolved",
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
    assignedTo: "Support Lead",
    requesterName: "Developer",
    requesterEmail: "dev@kwameorganics.com",
    description: "We want to receive real-time notifications when transactions complete. Documentation mentions webhooks but we need help configuring them for our staging environment first.",
    lastResponse: "Shared webhook setup guide and test endpoint. Merchant confirmed working.",
    responseCount: 3,
    slaDeadline: new Date(Date.now() - 518400000).toISOString(),
    slaBreached: false,
  },
  {
    id: "tkt6",
    ticketNumber: "SUP-2026-001233",
    merchantId: "m4",
    merchantName: "Nnipa Health Services",
    subject: "Account suspended — need urgent reactivation",
    category: "account_access",
    priority: "urgent",
    status: "open",
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    requesterName: "Admin",
    requesterEmail: "admin@nnipa.health",
    description: "Our account was suspended this morning without warning. We have urgent patient payments to process. No email notification received. Please reactivate immediately.",
    responseCount: 0,
    slaDeadline: new Date(Date.now() + 3600000).toISOString(),
    slaBreached: false,
  },
];

export const mockTicketMessages: Record<string, TicketMessage[]> = {
  tkt1: [
    {
      id: "msg1",
      ticketId: "tkt1",
      author: "Kwame Asante",
      authorType: "merchant",
      message: "Since 2pm today, all MTN MoMo collection requests are timing out after 30 seconds. Telecel and AirtelTigo are working fine. Affecting approximately 20 transactions so far. Customers are calling to complain.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "msg2",
      ticketId: "tkt1",
      author: "Support Lead",
      authorType: "support",
      message: "Thanks for reporting this. I can see the timeout pattern in our logs. Let me check the MTN provider status and escalate if needed.",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
    },
    {
      id: "msg3",
      ticketId: "tkt1",
      author: "Support Lead",
      authorType: "support",
      message: "Confirmed this is affecting multiple merchants. Escalated to MTN back-office team under SLA Case #MTN-20260902-04. Response expected within 2 hours per SLA. Will update you as soon as we hear back.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  tkt2: [
    {
      id: "msg4",
      ticketId: "tkt2",
      author: "Abena Mensah",
      authorType: "merchant",
      message: "We're trying to rotate our API keys but the 'Generate New Key' button is not responding. We've tried on Chrome and Firefox. No error message appears.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "msg5",
      ticketId: "tkt2",
      author: "Support Lead",
      authorType: "support",
      message: "Thanks for reaching out. Could you please share a screenshot of the API page and open your browser console (F12) to check if there are any error messages? This will help us diagnose the issue.",
      timestamp: new Date(Date.now() - 64800000).toISOString(),
    },
  ],
};

export const mockDisputes: Dispute[] = [
  {
    id: "dsp1",
    disputeNumber: "DSP-2026-00421",
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    transactionId: "txn_920451",
    transactionRef: "SF-ORD-2401-001",
    amount: 450.0,
    reason: "Duplicate charge — customer charged twice for single order within 3 seconds",
    status: "investigating",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    assignedTo: "Support Lead",
    customerName: "Akosua Mensah",
    customerPhone: "+233 24 555 9876",
    evidence: ["order_screenshot.jpg", "bank_statement.pdf"],
    refundIssued: false,
    escalatedToProvider: false,
  },
  {
    id: "dsp2",
    disputeNumber: "DSP-2026-00418",
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    transactionId: "txn_901234",
    transactionRef: "KWO-2401-0892",
    amount: 120.5,
    reason: "Transaction failed but customer was debited",
    status: "resolved",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    resolvedAt: new Date(Date.now() - 172800000).toISOString(),
    assignedTo: "Support Lead",
    customerName: "Kofi Amponsah",
    customerPhone: "+233 20 444 1234",
    resolution: "Confirmed with MTN that debit was reversed automatically within 24 hours. Customer confirmed funds received.",
    refundIssued: false,
    escalatedToProvider: true,
  },
  {
    id: "dsp3",
    disputeNumber: "DSP-2026-00420",
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    transactionId: "txn_934567",
    transactionRef: "GBS-INV-45012",
    amount: 2400.0,
    reason: "Services not delivered but payment collected",
    status: "open",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    assignedTo: "Support Lead",
    customerName: "Yaw Boateng",
    customerPhone: "+233 30 789 5432",
    evidence: ["contract.pdf", "email_thread.pdf"],
    refundIssued: false,
    escalatedToProvider: false,
  },
];

export const mockRefundRequests: RefundRequest[] = [
  {
    id: "ref1",
    refundNumber: "REF-2026-00892",
    merchantId: "m3",
    merchantName: "SumaFoods Ghana",
    transactionId: "txn_920452",
    transactionRef: "SF-ORD-2401-001-DUP",
    amount: 450.0,
    reason: "Duplicate charge reversal",
    status: "pending",
    requestedBy: "Support Lead",
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    notes: "Linked to dispute DSP-2026-00421. Customer charged twice within 3 seconds.",
  },
  {
    id: "ref2",
    refundNumber: "REF-2026-00889",
    merchantId: "m2",
    merchantName: "Accra Tech Hub",
    transactionId: "txn_912345",
    transactionRef: "ATH-SUB-2401-034",
    amount: 75.0,
    reason: "Service cancellation within refund window",
    status: "approved",
    requestedBy: "Merchant Support Agent",
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    approvedBy: "Finance / Treasury",
    approvedAt: new Date(Date.now() - 43200000).toISOString(),
    notes: "Customer cancelled subscription within 7-day refund policy.",
  },
  {
    id: "ref3",
    refundNumber: "REF-2026-00881",
    merchantId: "m1",
    merchantName: "Kwame Organics Ltd",
    transactionId: "txn_898765",
    transactionRef: "KWO-ORD-8821",
    amount: 340.0,
    reason: "Product quality issue — merchant authorized refund",
    status: "completed",
    requestedBy: "Merchant Admin",
    requestedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    approvedBy: "Finance / Treasury",
    approvedAt: new Date(Date.now() - 345600000).toISOString(),
    completedAt: new Date(Date.now() - 259200000).toISOString(),
    notes: "Merchant requested refund. Product quality issue confirmed.",
  },
  {
    id: "ref4",
    refundNumber: "REF-2026-00885",
    merchantId: "m5",
    merchantName: "GreenBuild Solutions",
    transactionId: "txn_923456",
    transactionRef: "GBS-INV-44890",
    amount: 1200.0,
    reason: "Fraudulent transaction reported",
    status: "rejected",
    requestedBy: "Support Lead",
    requestedAt: new Date(Date.now() - 259200000).toISOString(),
    approvedBy: "Finance / Treasury",
    approvedAt: new Date(Date.now() - 172800000).toISOString(),
    rejectionReason: "Transaction verified as legitimate. Customer confirmed receipt of goods.",
    notes: "Customer initially disputed but later acknowledged transaction was valid.",
  },
];

export const mockSlaMetrics: SlaMetric[] = [
  {
    providerId: "p1",
    providerName: "MTN Mobile Money",
    openIssues: { critical: 1, major: 2, minor: 5 },
    avgResponseTime: 1.8,
    avgResolutionTime: 6.2,
    slaTarget: { responseTime: 2, resolutionTime: 8 },
    breachedCount: 3,
    complianceRate: 94.5,
    lastIncident: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    providerId: "p3",
    providerName: "Telecel Cash",
    openIssues: { critical: 0, major: 1, minor: 2 },
    avgResponseTime: 2.4,
    avgResolutionTime: 9.1,
    slaTarget: { responseTime: 2, resolutionTime: 8 },
    breachedCount: 8,
    complianceRate: 87.2,
    lastIncident: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    providerId: "p4",
    providerName: "AirtelTigo Money",
    openIssues: { critical: 0, major: 0, minor: 1 },
    avgResponseTime: 1.2,
    avgResolutionTime: 4.8,
    slaTarget: { responseTime: 2, resolutionTime: 8 },
    breachedCount: 1,
    complianceRate: 98.3,
    lastIncident: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    providerId: "p1",
    providerName: "Universal Merchant Bank (UMB)",
    openIssues: { critical: 1, major: 2, minor: 3 },
    avgResponseTime: 3.5,
    avgResolutionTime: 12.8,
    slaTarget: { responseTime: 2, resolutionTime: 8 },
    breachedCount: 12,
    complianceRate: 79.5,
    lastIncident: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const mockSecurityIncidents: SecurityIncident[] = [
  {
    id: "inc1",
    incidentNumber: "SEC-2026-0089",
    type: "api_abuse",
    severity: "high",
    title: "Excessive API rate limit violations from Merchant #m11",
    description: "Merchant account m11 (Global Remit Services) generated 45,000 API requests in 10 minutes, exceeding rate limit by 900%. Pattern suggests automated script or bot. No transactions completed.",
    affectedMerchants: ["m11"],
    detectedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    reportedToProvider: false,
    status: "investigating",
    assignedTo: "Platform Engineer",
    impactAssessment: "No financial loss. API temporarily rate-limited. Investigating merchant intent.",
    mitigationSteps: [
      "Temporary rate limit applied to merchant",
      "API keys temporarily suspended",
      "Merchant contacted for explanation",
    ],
  },
  {
    id: "inc2",
    incidentNumber: "SEC-2026-0087",
    type: "fraud_attempt",
    severity: "critical",
    title: "Suspected card testing attack via multiple merchant accounts",
    description: "Pattern detected: 230 small-value transactions (GHS 1-5) across 8 merchant accounts within 2 hours using sequential card numbers. Classic card validation attack.",
    affectedMerchants: ["m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14"],
    affectedProviders: ["p1", "p2"],
    detectedAt: new Date(Date.now() - 86400000).toISOString(),
    reportedAt: new Date(Date.now() - 82800000).toISOString(),
    reportedToProvider: true,
    status: "contained",
    assignedTo: "Compliance Officer",
    impactAssessment: "GHS 890 in test transactions. 8 merchant accounts involved. MTN and Telecel notified within 4 hours.",
    mitigationSteps: [
      "All 8 merchant accounts suspended pending investigation",
      "Transaction velocity rules tightened",
      "MTN and Telecel fraud teams notified",
      "Card BIN ranges flagged for 48-hour monitoring",
    ],
    resolutionNotes: "5 merchant accounts confirmed compromised. Credentials reset and 2FA enforced. 3 accounts found to be intentional fraud — permanently banned.",
  },
  {
    id: "inc3",
    incidentNumber: "SEC-2026-0085",
    type: "unauthorized_access",
    severity: "medium",
    title: "Failed login attempts on Super Admin account",
    description: "17 failed login attempts on Super Admin account from IP address 102.91.34.xx (Accra, Ghana) within 5 minutes. Brute force attack suspected.",
    detectedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    reportedToProvider: false,
    status: "resolved",
    assignedTo: "Platform Engineer",
    impactAssessment: "No breach. Account automatically locked after 5 attempts. 2FA in place prevented access.",
    mitigationSteps: [
      "IP address blocked at firewall level",
      "Super Admin notified and confirmed not their activity",
      "Account lockout working as designed",
    ],
    resolutionNotes: "Security controls effective. No additional action needed. IP remains blocked.",
  },
];

// ── Helper functions ────────────────────────────────────────────────────────

export const getTicketCategoryLabel = (category: TicketCategory): string => {
  const labels: Record<TicketCategory, string> = {
    transaction_failed: "Transaction Failed",
    refund_request: "Refund Request",
    account_access: "Account Access",
    api_issue: "API Issue",
    settlement_query: "Settlement Query",
    other: "Other",
  };
  return labels[category];
};

export const getTicketCategoryColor = (category: TicketCategory): string => {
  const colors: Record<TicketCategory, string> = {
    transaction_failed: "bg-red-50 text-red-700 border-red-200",
    refund_request: "bg-purple-50 text-purple-700 border-purple-200",
    account_access: "bg-orange-50 text-orange-700 border-orange-200",
    api_issue: "bg-blue-50 text-blue-700 border-blue-200",
    settlement_query: "bg-amber-50 text-amber-700 border-amber-200",
    other: "bg-muted text-muted-foreground border-border",
  };
  return colors[category];
};
