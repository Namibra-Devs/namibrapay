// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOG MOCK DATA
// Comprehensive audit trail for all Platform Dashboard (Tier 1) operations
// ═══════════════════════════════════════════════════════════════════════════

export type AuditEventType =
  | "user_action"
  | "system_event"
  | "security_event"
  | "config_change"
  | "approval_action"
  | "data_access";

export type AuditCategory =
  | "authentication"
  | "user_management"
  | "transaction"
  | "compliance"
  | "provider"
  | "settlement"
  | "support"
  | "system";

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  category: AuditCategory;
  severity: AuditSeverity;
  actor: {
    userId: string;
    name: string;
    role: string;
    ipAddress: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  description: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  metadata?: Record<string, any>;
  tier: "platform" | "merchant" | "agent";
}

// ── Sample Audit Events ─────────────────────────────────────────────────────
export const mockAuditEvents: AuditEvent[] = [
  // Security & Authentication
  {
    id: "AUD-2024-001",
    timestamp: new Date("2024-02-01T14:32:15Z"),
    eventType: "security_event",
    category: "authentication",
    severity: "critical",
    actor: {
      userId: "USR-SA-001",
      name: "Kwame Mensah",
      role: "Super Admin",
      ipAddress: "197.251.23.45",
    },
    action: "MFA_ENABLED",
    resource: "user_account",
    resourceId: "USR-MER-045",
    description: "Enabled multi-factor authentication for user account",
    beforeState: { mfaEnabled: false },
    afterState: { mfaEnabled: true, mfaMethod: "authenticator_app" },
    metadata: { triggeredBy: "security_policy_update" },
    tier: "platform",
  },
  {
    id: "AUD-2024-002",
    timestamp: new Date("2024-02-01T14:15:22Z"),
    eventType: "security_event",
    category: "authentication",
    severity: "warning",
    actor: {
      userId: "SYSTEM",
      name: "System",
      role: "Automated Monitor",
      ipAddress: "10.0.0.1",
    },
    action: "FAILED_LOGIN_THRESHOLD",
    resource: "user_account",
    resourceId: "USR-MER-089",
    description: "Account locked after 5 consecutive failed login attempts",
    metadata: {
      failedAttempts: 5,
      lockDuration: "30_minutes",
      lastAttemptIp: "41.204.112.78",
    },
    tier: "platform",
  },

  // User Management
  {
    id: "AUD-2024-003",
    timestamp: new Date("2024-02-01T13:45:10Z"),
    eventType: "user_action",
    category: "user_management",
    severity: "info",
    actor: {
      userId: "USR-SA-001",
      name: "Kwame Mensah",
      role: "Super Admin",
      ipAddress: "197.251.23.45",
    },
    action: "USER_ROLE_CHANGED",
    resource: "user_role",
    resourceId: "USR-PLT-012",
    description: "Changed user role from Compliance Officer to Compliance Manager",
    beforeState: { role: "compliance_officer", permissions: ["compliance.view"] },
    afterState: {
      role: "compliance_manager",
      permissions: ["compliance.view", "compliance.approve"],
    },
    metadata: { reason: "promotion", effectiveDate: "2024-02-01" },
    tier: "platform",
  },
  {
    id: "AUD-2024-004",
    timestamp: new Date("2024-02-01T12:20:33Z"),
    eventType: "user_action",
    category: "user_management",
    severity: "info",
    actor: {
      userId: "USR-SA-001",
      name: "Kwame Mensah",
      role: "Super Admin",
      ipAddress: "197.251.23.45",
    },
    action: "USER_CREATED",
    resource: "user_account",
    resourceId: "USR-SUP-008",
    description: "Created new Support Lead user account",
    afterState: {
      email: "ama.ofori@namibrapay.com",
      role: "support_lead",
      status: "active",
      department: "customer_support",
    },
    metadata: { invitationSent: true, welcomeEmailSent: true },
    tier: "platform",
  },

  // Transaction Operations
  {
    id: "AUD-2024-005",
    timestamp: new Date("2024-02-01T11:55:18Z"),
    eventType: "user_action",
    category: "transaction",
    severity: "critical",
    actor: {
      userId: "USR-FIN-003",
      name: "Yaw Boateng",
      role: "Finance Manager",
      ipAddress: "197.251.23.52",
    },
    action: "TRANSACTION_REVERSED",
    resource: "transaction",
    resourceId: "TXN-2024-789456",
    description: "Manually reversed completed transaction due to fraud investigation",
    beforeState: {
      status: "completed",
      amount: 1250.0,
      merchant: "SwiftRetail Ghana",
    },
    afterState: {
      status: "reversed",
      reversalReason: "fraud_investigation",
      reversalAmount: 1250.0,
    },
    metadata: {
      approvedBy: "USR-SA-001",
      caseId: "FRAUD-2024-0234",
      refundInitiated: true,
    },
    tier: "platform",
  },
  {
    id: "AUD-2024-006",
    timestamp: new Date("2024-02-01T10:30:45Z"),
    eventType: "system_event",
    category: "transaction",
    severity: "warning",
    actor: {
      userId: "SYSTEM",
      name: "Fraud Detection Engine",
      role: "Automated Monitor",
      ipAddress: "10.0.0.5",
    },
    action: "FRAUD_FLAG_RAISED",
    resource: "transaction",
    resourceId: "TXN-2024-789512",
    description: "Transaction flagged by fraud detection: velocity rule triggered",
    metadata: {
      ruleTriggered: "velocity_check_24h",
      riskScore: 87,
      previousTransactions: 15,
      threshold: 10,
      recommendation: "manual_review",
    },
    tier: "platform",
  },

  // Compliance Operations
  {
    id: "AUD-2024-007",
    timestamp: new Date("2024-02-01T09:15:30Z"),
    eventType: "approval_action",
    category: "compliance",
    severity: "info",
    actor: {
      userId: "USR-COM-002",
      name: "Esi Mensah",
      role: "Compliance Manager",
      ipAddress: "197.251.23.48",
    },
    action: "KYC_APPROVED",
    resource: "kyc_application",
    resourceId: "KYC-2024-00145",
    description: "Approved KYC application after document verification",
    beforeState: { status: "pending_review", riskLevel: "medium" },
    afterState: {
      status: "approved",
      approvedBy: "USR-COM-002",
      approvedAt: "2024-02-01T09:15:30Z",
    },
    metadata: {
      documentsVerified: ["national_id", "proof_of_address", "business_registration"],
      verificationMethod: "manual_review",
      notes: "All documents verified successfully",
    },
    tier: "platform",
  },
  {
    id: "AUD-2024-008",
    timestamp: new Date("2024-02-01T08:42:15Z"),
    eventType: "system_event",
    category: "compliance",
    severity: "warning",
    actor: {
      userId: "SYSTEM",
      name: "AML Monitoring System",
      role: "Automated Monitor",
      ipAddress: "10.0.0.3",
    },
    action: "AML_ALERT_GENERATED",
    resource: "merchant_account",
    resourceId: "MER-2024-0089",
    description: "AML alert: Unusual transaction pattern detected",
    metadata: {
      alertType: "structuring",
      transactionCount: 8,
      totalAmount: 9800.0,
      timeWindow: "24_hours",
      threshold: 10000.0,
      riskScore: 72,
      status: "under_investigation",
    },
    tier: "platform",
  },

  // Provider Management
  {
    id: "AUD-2024-009",
    timestamp: new Date("2024-02-01T07:30:22Z"),
    eventType: "approval_action",
    category: "provider",
    severity: "critical",
    actor: {
      userId: "USR-SA-001",
      name: "Kwame Mensah",
      role: "Super Admin",
      ipAddress: "197.251.23.45",
    },
    action: "ROUTING_RULE_APPROVED",
    resource: "routing_rule",
    resourceId: "ROUTE-2024-003",
    description: "Approved new routing rule: MTN Mobile Money failover to Vodafone",
    beforeState: { status: "pending_approval", priority: 2 },
    afterState: {
      status: "active",
      approvedBy: "USR-SA-001",
      approvedAt: "2024-02-01T07:30:22Z",
      activatedAt: "2024-02-01T07:30:22Z",
    },
    metadata: {
      ruleType: "failover",
      targetProvider: "VODAFONE",
      fallbackProvider: "AIRTELTIGO",
      createdBy: "USR-PLT-005",
    },
    tier: "platform",
  },
  {
    id: "AUD-2024-010",
    timestamp: new Date("2024-01-31T23:45:10Z"),
    eventType: "config_change",
    category: "provider",
    severity: "warning",
    actor: {
      userId: "USR-PLT-005",
      name: "Kofi Asante",
      role: "Platform Engineer",
      ipAddress: "197.251.23.50",
    },
    action: "CREDENTIAL_ROTATED",
    resource: "provider_credential",
    resourceId: "CRED-MTN-API-2024",
    description: "Rotated API credentials for MTN Mobile Money provider",
    beforeState: {
      credentialId: "CRED-MTN-API-2023",
      expiresAt: "2024-02-15",
      status: "expiring_soon",
    },
    afterState: {
      credentialId: "CRED-MTN-API-2024",
      expiresAt: "2025-02-01",
      status: "active",
      rotatedAt: "2024-01-31T23:45:10Z",
    },
    metadata: {
      rotationType: "scheduled",
      credentialType: "api_key",
      testsPassed: true,
    },
    tier: "platform",
  },

  // Settlement Operations
  {
    id: "AUD-2024-011",
    timestamp: new Date("2024-01-31T18:00:05Z"),
    eventType: "user_action",
    category: "settlement",
    severity: "critical",
    actor: {
      userId: "USR-FIN-003",
      name: "Yaw Boateng",
      role: "Finance Manager",
      ipAddress: "197.251.23.52",
    },
    action: "SETTLEMENT_APPROVED",
    resource: "settlement_batch",
    resourceId: "SETL-2024-W05",
    description: "Approved weekly settlement batch for processing",
    beforeState: {
      status: "pending_approval",
      totalAmount: 245680.5,
      merchantCount: 127,
    },
    afterState: {
      status: "approved",
      approvedBy: "USR-FIN-003",
      approvedAt: "2024-01-31T18:00:05Z",
      scheduledProcessing: "2024-02-01T02:00:00Z",
    },
    metadata: {
      settlementPeriod: "2024-W05",
      totalTransactions: 3456,
      totalFees: 12284.03,
      netAmount: 233396.47,
    },
    tier: "platform",
  },
  {
    id: "AUD-2024-012",
    timestamp: new Date("2024-01-31T16:20:40Z"),
    eventType: "system_event",
    category: "settlement",
    severity: "warning",
    actor: {
      userId: "SYSTEM",
      name: "Settlement Engine",
      role: "Automated Processor",
      ipAddress: "10.0.0.7",
    },
    action: "SETTLEMENT_FAILED",
    resource: "settlement_transaction",
    resourceId: "SETL-TXN-2024-1234",
    description: "Settlement transaction failed: insufficient bank account balance",
    metadata: {
      merchantId: "MER-2024-0234",
      amount: 15600.0,
      bankAccount: "****5678",
      errorCode: "INSUFFICIENT_BALANCE",
      retryScheduled: true,
      nextRetryAt: "2024-02-01T02:00:00Z",
    },
    tier: "platform",
  },

  // Support Operations
  {
    id: "AUD-2024-013",
    timestamp: new Date("2024-01-31T15:10:25Z"),
    eventType: "user_action",
    category: "support",
    severity: "info",
    actor: {
      userId: "USR-SUP-004",
      name: "Abena Darko",
      role: "Support Agent",
      ipAddress: "197.251.23.55",
    },
    action: "DISPUTE_RESOLVED",
    resource: "dispute",
    resourceId: "DSP-2024-0156",
    description: "Resolved customer dispute in favor of merchant",
    beforeState: {
      status: "investigating",
      amount: 450.0,
      createdAt: "2024-01-25T10:30:00Z",
    },
    afterState: {
      status: "resolved",
      resolution: "merchant_favor",
      resolvedBy: "USR-SUP-004",
      resolvedAt: "2024-01-31T15:10:25Z",
    },
    metadata: {
      disputeReason: "service_not_rendered",
      evidenceProvided: ["delivery_receipt", "customer_signature"],
      refundIssued: false,
      resolutionNotes: "Valid proof of delivery provided by merchant",
    },
    tier: "platform",
  },

  // System Configuration
  {
    id: "AUD-2024-014",
    timestamp: new Date("2024-01-31T14:05:18Z"),
    eventType: "config_change",
    category: "system",
    severity: "critical",
    actor: {
      userId: "USR-SA-001",
      name: "Kwame Mensah",
      role: "Super Admin",
      ipAddress: "197.251.23.45",
    },
    action: "FEE_STRUCTURE_UPDATED",
    resource: "fee_configuration",
    resourceId: "FEE-CONFIG-2024",
    description: "Updated platform fee structure for merchant tier",
    beforeState: {
      collectionFee: 1.5,
      payoutFee: 1.0,
      effectiveDate: "2023-12-01",
    },
    afterState: {
      collectionFee: 1.8,
      payoutFee: 1.2,
      effectiveDate: "2024-02-01",
    },
    metadata: {
      affectedMerchants: 342,
      notificationSent: true,
      noticePeriod: "30_days",
      reason: "operational_cost_adjustment",
    },
    tier: "platform",
  },

  // Data Access Audit
  {
    id: "AUD-2024-015",
    timestamp: new Date("2024-01-31T13:22:45Z"),
    eventType: "data_access",
    category: "compliance",
    severity: "info",
    actor: {
      userId: "USR-COM-002",
      name: "Esi Mensah",
      role: "Compliance Manager",
      ipAddress: "197.251.23.48",
    },
    action: "SENSITIVE_DATA_ACCESSED",
    resource: "customer_pii",
    resourceId: "MER-2024-0145",
    description: "Accessed merchant PII data for compliance investigation",
    metadata: {
      dataFields: ["full_name", "national_id", "phone_number", "address"],
      accessReason: "aml_investigation",
      caseId: "AML-2024-0067",
      accessDuration: "15_minutes",
      documentsViewed: 8,
    },
    tier: "platform",
  },

  // Recent events for variety
  {
    id: "AUD-2024-016",
    timestamp: new Date("2024-01-31T12:50:30Z"),
    eventType: "security_event",
    category: "authentication",
    severity: "info",
    actor: {
      userId: "USR-PLT-005",
      name: "Kofi Asante",
      role: "Platform Engineer",
      ipAddress: "197.251.23.50",
    },
    action: "PASSWORD_CHANGED",
    resource: "user_account",
    resourceId: "USR-PLT-005",
    description: "User changed account password",
    metadata: {
      passwordStrength: "strong",
      lastPasswordChange: "2023-11-15",
      daysSinceLastChange: 77,
    },
    tier: "platform",
  },
  {
    id: "AUD-2024-017",
    timestamp: new Date("2024-01-31T11:35:12Z"),
    eventType: "user_action",
    category: "support",
    severity: "info",
    actor: {
      userId: "USR-SUP-006",
      name: "Kwesi Osei",
      role: "Support Lead",
      ipAddress: "197.251.23.56",
    },
    action: "REFUND_PROCESSED",
    resource: "refund",
    resourceId: "RFD-2024-0089",
    description: "Processed full refund for failed transaction",
    beforeState: { status: "pending", amount: 850.0 },
    afterState: {
      status: "completed",
      processedBy: "USR-SUP-006",
      processedAt: "2024-01-31T11:35:12Z",
    },
    metadata: {
      originalTransaction: "TXN-2024-782341",
      refundReason: "technical_error",
      refundMethod: "original_payment_method",
      customerNotified: true,
    },
    tier: "platform",
  },
  {
    id: "AUD-2024-018",
    timestamp: new Date("2024-01-31T10:15:05Z"),
    eventType: "system_event",
    category: "system",
    severity: "warning",
    actor: {
      userId: "SYSTEM",
      name: "Health Monitor",
      role: "Automated Monitor",
      ipAddress: "10.0.0.10",
    },
    action: "PROVIDER_DEGRADED",
    resource: "payment_provider",
    resourceId: "PROV-VODAFONE",
    description: "Provider experiencing degraded performance",
    metadata: {
      successRate: 87.5,
      normalSuccessRate: 99.2,
      latencyP95: 2450,
      normalLatencyP95: 850,
      affectedTransactions: 23,
      autoFailoverEnabled: true,
      failoverTarget: "AIRTELTIGO",
    },
    tier: "platform",
  },
];

// ── Helper Functions ────────────────────────────────────────────────────────

export function getEventTypeColor(eventType: AuditEventType): string {
  switch (eventType) {
    case "security_event":
      return "bg-red-50 text-red-700 border-red-200";
    case "approval_action":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "config_change":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "system_event":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "data_access":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getSeverityColor(severity: AuditSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700 border-red-300";
    case "warning":
      return "bg-amber-100 text-amber-700 border-amber-300";
    default:
      return "bg-blue-100 text-blue-700 border-blue-300";
  }
}

export function getCategoryColor(category: AuditCategory): string {
  const colors = {
    authentication: "#ef4444",
    user_management: "#8b5cf6",
    transaction: "#64c6c3",
    compliance: "#bcbbee",
    provider: "#64c6c3",
    settlement: "#fedfb8",
    support: "#a3ffe2",
    system: "#263b8e",
  };
  return colors[category];
}

// Filter and search helpers
export function filterAuditEvents(
  events: AuditEvent[],
  filters: {
    eventType?: AuditEventType;
    category?: AuditCategory;
    severity?: AuditSeverity;
    actor?: string;
    dateFrom?: Date;
    dateTo?: Date;
    searchQuery?: string;
  }
): AuditEvent[] {
  return events.filter((event) => {
    if (filters.eventType && event.eventType !== filters.eventType) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.severity && event.severity !== filters.severity) return false;
    if (filters.actor && !event.actor.name.toLowerCase().includes(filters.actor.toLowerCase()))
      return false;
    if (filters.dateFrom && event.timestamp < filters.dateFrom) return false;
    if (filters.dateTo && event.timestamp > filters.dateTo) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        event.action.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.resource.toLowerCase().includes(query) ||
        event.resourceId?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    return true;
  });
}
